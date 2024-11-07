// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {EnumerableMap} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/utils/structs/EnumerableMap.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple receiver contract for receiving usdc tokens then calling a staking contract.
contract Receiver is CCIPReceiver, OwnerIsCreator {
    using SafeERC20 for IERC20;
    using EnumerableMap for EnumerableMap.Bytes32ToUintMap;

    error InvalidUsdcToken(); // Used when the usdc token address is 0
    error InvalidStaker(); // Used when the staker address is 0
    error InvalidSourceChain(); // Used when the source chain is 0
    error InvalidSenderAddress(); // Used when the sender address is 0
    error NoSenderOnSourceChain(uint64 sourceChainSelector); // Used when there is no sender for a given source chain
    error WrongSenderForSourceChain(uint64 sourceChainSelector); // Used when the sender contract is not the correct one
    error OnlySelf(); // Used when a function is called outside of the contract itself
    error WrongReceivedToken(address usdcToken, address receivedToken); // Used if the received token is different than usdc token
    error CallToStakerFailed(); // Used when the call to the stake function of the staker contract is not successful
    error NoReturnDataExpected(); // Used if the call to the stake function of the staker contract returns data. This is not expected
    error MessageNotFailed(bytes32 messageId); // Used if you try to retry a message that has no failed

    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address indexed sender, // The address of the sender from the source chain.
        bytes data, // The data that was received.
        address token, // The token address that was transferred.
        uint256 tokenAmount // The token amount that was transferred.
    );

    event MessageFailed(bytes32 indexed messageId, bytes reason);
    event MessageRecovered(bytes32 indexed messageId);

    // Example error code, could have many different error codes.
    enum ErrorCode {
        // RESOLVED is first so that the default value is resolved.
        RESOLVED,
        // Could have any number of error codes here.
        FAILED
    }

    struct FailedMessage {
        bytes32 messageId;
        ErrorCode errorCode;
    }

    IERC20 private immutable i_usdcToken;
    address private immutable i_staker;

    // Mapping to keep track of the sender contract per source chain.
    mapping(uint64 => address) public s_senders;

    // The message contents of failed messages are stored here.
    mapping(bytes32 => Client.Any2EVMMessage) public s_messageContents;

    // Contains failed messages and their state.
    EnumerableMap.Bytes32ToUintMap internal s_failedMessages;

    modifier validateSourceChain(uint64 _sourceChainSelector) {
        if (_sourceChainSelector == 0) revert InvalidSourceChain();
        _;
    }

    /// @dev Modifier to allow only the contract itself to execute a function.
    /// Throws an exception if called by any account other than the contract itself.
    modifier onlySelf() {
        if (msg.sender != address(this)) revert OnlySelf();
        _;
    }

    /// @notice Constructor initializes the contract with the router address.
    /// @param _router The address of the router contract.
    /// @param _usdcToken The address of the usdc contract.
    /// @param _staker The address of the staker contract.
    constructor(
        address _router,
        address _usdcToken,
        address _staker
    ) CCIPReceiver(_router) {
        if (_usdcToken == address(0)) revert InvalidUsdcToken();
        if (_staker == address(0)) revert InvalidStaker();
        i_usdcToken = IERC20(_usdcToken);
        i_staker = _staker;
        i_usdcToken.safeApprove(_staker, type(uint256).max);
    }

    /// @dev Set the sender contract for a given source chain.
    /// @notice This function can only be called by the owner.
    /// @param _sourceChainSelector The selector of the source chain.
    /// @param _sender The sender contract on the source chain .
    function setSenderForSourceChain(
        uint64 _sourceChainSelector,
        address _sender
    ) external onlyOwner validateSourceChain(_sourceChainSelector) {
        if (_sender == address(0)) revert InvalidSenderAddress();
        s_senders[_sourceChainSelector] = _sender;
    }

    /// @dev Delete the sender contract for a given source chain.
    /// @notice This function can only be called by the owner.
    /// @param _sourceChainSelector The selector of the source chain.
    function deleteSenderForSourceChain(
        uint64 _sourceChainSelector
    ) external onlyOwner validateSourceChain(_sourceChainSelector) {
        if (s_senders[_sourceChainSelector] == address(0))
            revert NoSenderOnSourceChain(_sourceChainSelector);
        delete s_senders[_sourceChainSelector];
    }

    /// @notice The entrypoint for the CCIP router to call. This function should
    /// never revert, all errors should be handled internally in this contract.
    /// @param any2EvmMessage The message to process.
    /// @dev Extremely important to ensure only router calls this.
    function ccipReceive(
        Client.Any2EVMMessage calldata any2EvmMessage
    ) external override onlyRouter {
        // validate the sender contract
        if (
            abi.decode(any2EvmMessage.sender, (address)) !=
            s_senders[any2EvmMessage.sourceChainSelector]
        ) revert WrongSenderForSourceChain(any2EvmMessage.sourceChainSelector);
        /* solhint-disable no-empty-blocks */
        try this.processMessage(any2EvmMessage) {
            // Intentionally empty in this example; no action needed if processMessage succeeds
        } catch (bytes memory err) {
            // Could set different error codes based on the caught error. Each could be
            // handled differently.
            s_failedMessages.set(
                any2EvmMessage.messageId,
                uint256(ErrorCode.FAILED)
            );
            s_messageContents[any2EvmMessage.messageId] = any2EvmMessage;
            // Don't revert so CCIP doesn't revert. Emit event instead.
            // The message can be retried later without having to do manual execution of CCIP.
            emit MessageFailed(any2EvmMessage.messageId, err);
            return;
        }
    }

    /// @notice Serves as the entry point for this contract to process incoming messages.
    /// @param any2EvmMessage Received CCIP message.
    /// @dev Transfers specified token amounts to the owner of this contract. This function
    /// must be external because of the  try/catch for error handling.
    /// It uses the `onlySelf`: can only be called from the contract.
    function processMessage(
        Client.Any2EVMMessage calldata any2EvmMessage
    ) external onlySelf {
        _ccipReceive(any2EvmMessage); // process the message - may revert
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        if (any2EvmMessage.destTokenAmounts[0].token != address(i_usdcToken))
            revert WrongReceivedToken(
                address(i_usdcToken),
                any2EvmMessage.destTokenAmounts[0].token
            );

        (bool success, bytes memory returnData) = i_staker.call(
            any2EvmMessage.data
        ); // low level call to the staker contract using the encoded function selector and arguments
        if (!success) revert CallToStakerFailed();
        if (returnData.length > 0) revert NoReturnDataExpected();
        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
            abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
            any2EvmMessage.data, // received data
            any2EvmMessage.destTokenAmounts[0].token,
            any2EvmMessage.destTokenAmounts[0].amount
        );
    }

    /// @notice Allows the owner to retry a failed message in order to unblock the associated tokens.
    /// @param messageId The unique identifier of the failed message.
    /// @param beneficiary The address to which the tokens will be sent.
    /// @dev This function is only callable by the contract owner. It changes the status of the message
    /// from 'failed' to 'resolved' to prevent reentry and multiple retries of the same message.
    function retryFailedMessage(
        bytes32 messageId,
        address beneficiary
    ) external onlyOwner {
        // Check if the message has failed; if not, revert the transaction.
        if (s_failedMessages.get(messageId) != uint256(ErrorCode.FAILED))
            revert MessageNotFailed(messageId);

        // Set the error code to RESOLVED to disallow reentry and multiple retries of the same failed message.
        s_failedMessages.set(messageId, uint256(ErrorCode.RESOLVED));

        // Retrieve the content of the failed message.
        Client.Any2EVMMessage memory message = s_messageContents[messageId];

        // This example expects one token to have been sent.
        // Transfer the associated tokens to the specified receiver as an escape hatch.
        IERC20(message.destTokenAmounts[0].token).safeTransfer(
            beneficiary,
            message.destTokenAmounts[0].amount
        );

        // Emit an event indicating that the message has been recovered.
        emit MessageRecovered(messageId);
    }

    /// @notice Retrieves a paginated list of failed messages.
    /// @dev This function returns a subset of failed messages defined by `offset` and `limit` parameters. It ensures that the pagination parameters are within the bounds of the available data set.
    /// @param offset The index of the first failed message to return, enabling pagination by skipping a specified number of messages from the start of the dataset.
    /// @param limit The maximum number of failed messages to return, restricting the size of the returned array.
    /// @return failedMessages An array of `FailedMessage` struct, each containing a `messageId` and an `errorCode` (RESOLVED or FAILED), representing the requested subset of failed messages. The length of the returned array is determined by the `limit` and the total number of failed messages.
    function getFailedMessages(
        uint256 offset,
        uint256 limit
    ) external view returns (FailedMessage[] memory) {
        uint256 length = s_failedMessages.length();

        // Calculate the actual number of items to return (can't exceed total length or requested limit)
        uint256 returnLength = (offset + limit > length)
            ? length - offset
            : limit;
        FailedMessage[] memory failedMessages = new FailedMessage[](
            returnLength
        );

        // Adjust loop to respect pagination (start at offset, end at offset + limit or total length)
        for (uint256 i = 0; i < returnLength; i++) {
            (bytes32 messageId, uint256 errorCode) = s_failedMessages.at(
                offset + i
            );
            failedMessages[i] = FailedMessage(messageId, ErrorCode(errorCode));
        }
        return failedMessages;
    }
}
