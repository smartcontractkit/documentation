// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

/**
 * @title MessageDispatcher
 * @notice A contract for sending CCIP messages to multiple chains within the same transaction.
 * @dev This contract provides functionality to either send messages immediately or register them for later dispatch.
 */
contract MessageDispatcher is OwnerIsCreator {
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector);
    error InvalidReceiverAddress();
    error NothingToWithdraw();

    /// @notice Thrown when no messages have been registered for dispatch.
    error NoMessagesRegistered();

    /// @notice Struct to store message details.
    struct Message {
        uint64 chainSelector; // The chain selector for the destination blockchain.
        address receiver; // The address of the recipient on the destination blockchain.
        string text; // The text message to be sent.
    }

    /// @notice Mapping to keep track of allowlisted destination chains.
    mapping(uint64 => bool) public allowlistedDestinationChains;

    /// @notice Array to store registered messages.
    Message[] public registeredMessages;

    /// @notice Event emitted when a message is registered for later dispatch.
    /// @param chainSelector The chain selector of the destination chain.
    /// @param receiver The address of the receiver on the destination chain.
    /// @param text The text message to be sent.
    event MessageRegistered(
        uint64 indexed chainSelector,
        address indexed receiver,
        string text
    );

    /// @notice Event emitted when a message is sent to another chain.
    /// @param messageId The unique ID of the CCIP message.
    /// @param destinationChainSelector The chain selector of the destination chain.
    /// @param receiver The address of the receiver on the destination chain.
    /// @param text The text being sent.
    /// @param feeToken The token address used to pay CCIP fees.
    /// @param fees The fees paid for sending the CCIP message.
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

    /// @notice Constructor initializes the contract with the router and LINK token addresses.
    /// @param _router The address of the Chainlink CCIP router contract.
    /// @param _link The address of the LINK token contract.
    constructor(address _router, address _link) {
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);
    }

    /// @notice Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
        if (!allowlistedDestinationChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    /// @notice Modifier that checks the receiver address is not the zero address.
    /// @param _receiver The receiver address.
    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }

    /// @notice Updates the allowlist status of a destination chain for transactions.
    /// @param _destinationChainSelector The identifier (selector) of the destination chain.
    /// @param allowed Boolean indicating whether the chain is allowed.
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }

    /// @notice Registers a message to be sent to a specific chain.
    /// @param _chainSelector The identifier (selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _text The text to be sent to the destination blockchain.
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

    /// @notice Sends all registered messages to their respective chains.
    /// @dev This function assumes your contract has sufficient LINK.
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

            // Emit event for each message sent
            emit MessageSent(
                messageId,
                message.chainSelector,
                message.receiver,
                messageText,
                address(s_linkToken),
                fees
            );
        }

        // Clear registered messages after dispatching
        delete registeredMessages;
    }

    /// @notice Sends multiple messages to their respective chains in a single transaction.
    /// @dev This function assumes your contract has sufficient LINK.
    /// @param messages An array of `Message` structs containing the chain selector, receiver, and text for each message.
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

            // Emit event for each message sent
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

    /// @notice Internal function to handle sending messages to different chains.
    /// @param _destinationChainSelector The identifier (selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _text The text to be sent to the destination blockchain.
    /// @return messageId The ID of the CCIP message that was sent.
    function _sendMessage(
        uint64 _destinationChainSelector,
        address _receiver,
        string memory _text
    ) private returns (bytes32 messageId, uint256 fees) {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _text,
            address(s_linkToken)
        );

        // Get the fee required to send the CCIP message
        fees = s_router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        // Increase the allowance of the LINK token to the router contract if necessary
        uint256 currentAllowance = s_linkToken.allowance(
            address(this),
            address(s_router)
        );
        if (currentAllowance < fees) {
            s_linkToken.safeApprove(address(s_router), fees - currentAllowance);
        }

        // Send the CCIP message through the router and store the returned CCIP message ID
        messageId = s_router.ccipSend(
            _destinationChainSelector,
            evm2AnyMessage
        );

        return (messageId, fees);
    }

    /// @notice Constructs a CCIP message.
    /// @dev This function creates an EVM2AnyMessage struct with all the necessary information for sending a text.
    /// @param _receiver The address of the receiver.
    /// @param _text The string data to be sent.
    /// @param _feeTokenAddress The address of the token used for fees. Set to `address(0)` for native gas.
    /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
    function _buildCCIPMessage(
        address _receiver,
        string memory _text,
        address _feeTokenAddress
    ) private pure returns (Client.EVM2AnyMessage memory) {
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver), // ABI-encoded receiver address
                data: abi.encode(_text), // ABI-encoded string
                tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array as no tokens are transferred
                extraArgs: Client._argsToBytes(
                    // Additional arguments, setting gas limit
                    Client.EVMExtraArgsV1({gasLimit: 300_000})
                ),
                feeToken: _feeTokenAddress
            });
    }

    /// @notice Fallback function to allow the contract to receive Ether.
    /// @dev This function has no function body, making it a default function for receiving Ether.
    receive() external payable {}

    /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
    /// @dev This function reverts with a `NothingToWithdraw` error if there are no tokens to withdraw.
    /// @param _beneficiary The address to which the tokens will be sent.
    /// @param _token The contract address of the ERC20 token to be withdrawn.
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}
