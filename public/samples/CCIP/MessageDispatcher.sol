// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

/// @title MessageDispatcher
/// @notice Handles sending CCIP messages to multiple chains within a single transaction.
/// @dev Allows messages to be sent immediately or registered for later dispatch.
contract MessageDispatcher is OwnerIsCreator {
    /// @notice Thrown when the contract's balance is insufficient to cover the calculated fees.
    /// @param currentBalance The current LINK token balance of the contract.
    /// @param calculatedFees The required fees for the operation.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);

    /// @notice Thrown when the destination chain is not allowlisted.
    /// @param destinationChainSelector The selector of the destination chain.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector);

    /// @notice Thrown when the receiver address is invalid (zero address).
    error InvalidReceiverAddress();

    /// @notice Thrown when there are no tokens available to withdraw.
    error NothingToWithdraw();

    /// @notice Thrown when no messages have been registered for dispatch.
    error NoMessagesRegistered();

    /// @notice Represents a message to be dispatched to another chain.
    struct Message {
        /// @notice The selector identifying the destination blockchain.
        uint64 chainSelector;
        /// @notice The recipient's address on the destination blockchain.
        address receiver;
        /// @notice The text content of the message.
        string text;
    }

    /// @notice Indicates whether a destination chain is allowlisted.
    /// @dev Mapping from chain selector to its allowlist status.
    mapping(uint64 => bool) public allowlistedDestinationChains;

    /// @notice Stores messages that have been registered for future dispatch.
    Message[] public registeredMessages;

    /// @notice Emitted when a message is registered for later dispatch.
    /// @param chainSelector The selector of the destination chain.
    /// @param receiver The recipient's address on the destination chain.
    /// @param text The text content of the message.
    event MessageRegistered(
        uint64 indexed chainSelector,
        address indexed receiver,
        string text
    );

    /// @notice Emitted when a message is sent to a destination chain.
    /// @param messageId The unique identifier of the CCIP message.
    /// @param destinationChainSelector The selector of the destination chain.
    /// @param receiver The recipient's address on the destination chain.
    /// @param text The text content of the message.
    /// @param feeToken The address of the token used to pay CCIP fees.
    /// @param fees The amount of fees paid for sending the CCIP message.
    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        string text,
        address feeToken,
        uint256 fees
    );

    IRouterClient private s_router;
    IERC20 private s_linkToken;

    /// @notice Initializes the contract with the specified router and LINK token addresses.
    /// @param _router The address of the Chainlink CCIP router contract.
    /// @param _link The address of the LINK token contract.
    constructor(address _router, address _link) {
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);
    }

    /// @notice Ensures that the destination chain is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
        if (!allowlistedDestinationChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    /// @notice Validates that the receiver address is not the zero address.
    /// @param _receiver The address of the receiver.
    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }

    /// @notice Updates the allowlist status of a destination chain.
    /// @param _destinationChainSelector The selector of the destination chain.
    /// @param allowed Indicates whether the chain should be allowlisted (`true`) or removed (`false`).
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }

    /// @notice Registers a message for later dispatch to a specific chain.
    /// @param _chainSelector The selector of the destination blockchain.
    /// @param _receiver The recipient's address on the destination blockchain.
    /// @param _text The text content of the message.
    function registerMessage(
        uint64 _chainSelector,
        address _receiver,
        string calldata _text
    )
        external
        onlyOwner
        onlyAllowlistedDestinationChain(_chainSelector)
        validateReceiver(_receiver)
    {
        registeredMessages.push(
            Message({
                chainSelector: _chainSelector,
                receiver: _receiver,
                text: _text
            })
        );

        emit MessageRegistered(_chainSelector, _receiver, _text);
    }

    /// @notice Dispatches all registered messages to their respective destination chains.
    /// @dev Requires the contract to have sufficient LINK balance to cover fees.
    function dispatchMessages() external onlyOwner {
        uint256 messageCount = registeredMessages.length;
        if (messageCount == 0) {
            revert NoMessagesRegistered();
        }

        for (uint256 i = 0; i < messageCount; i++) {
            Message memory message = registeredMessages[i];

            string memory messageText = message.text;

            (bytes32 messageId, uint256 fees) = _sendMessage(
                message.chainSelector,
                message.receiver,
                messageText
            );

            emit MessageSent(
                messageId,
                message.chainSelector,
                message.receiver,
                messageText,
                address(s_linkToken),
                fees
            );
        }

        // Clear all registered messages after dispatching
        delete registeredMessages;
    }

    /// @notice Sends multiple messages directly to their respective destination chains in a single transaction.
    /// @dev Requires the contract to have sufficient LINK balance to cover all fees.
    /// @param messages An array of `Message` structs containing details for each message to be sent.
    function dispatchMessagesDirect(
        Message[] calldata messages
    ) external onlyOwner {
        uint256 messageCount = messages.length;
        if (messageCount == 0) {
            revert NoMessagesRegistered();
        }

        for (uint256 i = 0; i < messageCount; i++) {
            Message calldata message = messages[i];

            (bytes32 messageId, uint256 fees) = _sendMessage(
                message.chainSelector,
                message.receiver,
                message.text
            );

            emit MessageSent(
                messageId,
                message.chainSelector,
                message.receiver,
                message.text,
                address(s_linkToken),
                fees
            );
        }
    }

    /// @notice Internal function to handle the sending of a single message to a destination chain.
    /// @param _destinationChainSelector The selector of the destination blockchain.
    /// @param _receiver The recipient's address on the destination blockchain.
    /// @param _text The text content of the message.
    /// @return messageId The unique identifier of the sent CCIP message.
    /// @return fees The amount of LINK tokens paid for the message.
    function _sendMessage(
        uint64 _destinationChainSelector,
        address _receiver,
        string memory _text
    ) private returns (bytes32 messageId, uint256 fees) {
        // Construct the CCIP message with necessary details
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _text,
            address(s_linkToken)
        );

        // Retrieve the fee required to send the CCIP message
        fees = s_router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        // Approve the router to spend the necessary LINK tokens if not already approved
        uint256 currentAllowance = s_linkToken.allowance(
            address(this),
            address(s_router)
        );
        if (currentAllowance < fees) {
            s_linkToken.safeApprove(address(s_router), fees - currentAllowance);
        }

        // Send the CCIP message via the router and obtain the message ID
        messageId = s_router.ccipSend(
            _destinationChainSelector,
            evm2AnyMessage
        );

        return (messageId, fees);
    }

    /// @notice Constructs a CCIP message with the specified parameters.
    /// @dev Prepares the `EVM2AnyMessage` struct with the receiver, data, and fee token.
    /// @param _receiver The recipient's address on the destination chain.
    /// @param _text The text content to be sent.
    /// @param _feeTokenAddress The address of the token used to pay fees. Use `address(0)` for native gas.
    /// @return Client.EVM2AnyMessage The constructed CCIP message.
    function _buildCCIPMessage(
        address _receiver,
        string memory _text,
        address _feeTokenAddress
    ) private pure returns (Client.EVM2AnyMessage memory) {
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver),
                data: abi.encode(_text),
                tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array as no tokens are transferred
                extraArgs: Client._argsToBytes(
                    Client.EVMExtraArgsV1({gasLimit: 300_000})
                ),
                feeToken: _feeTokenAddress
            });
    }

    /// @notice Enables the contract to receive Ether.
    /// @dev This is a fallback function with no additional logic.
    receive() external payable {}

    /// @notice Allows the contract owner to withdraw all tokens of a specified ERC20 token.
    /// @dev Reverts with `NothingToWithdraw` if the contract holds no tokens of the specified type.
    /// @param _beneficiary The address to receive the withdrawn tokens.
    /// @param _token The ERC20 token contract address to withdraw.
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}
