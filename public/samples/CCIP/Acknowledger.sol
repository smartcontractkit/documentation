// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/token/ERC20/IERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple messenger contract for sending/receiving data across chains and tracking the status of sent messages.
contract Acknowledger is CCIPReceiver, OwnerIsCreator {
    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
    error SourceChainNotAllowlisted(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
    error SenderNotAllowlisted(address sender); // Used when the sender has not been allowlisted by the contract owner.

    bytes32 private s_lastReceivedMessageId; // Store the last received messageId.
    string private s_lastReceivedText; // Store the last received text.

    uint64 internal s_messageTrackerChainSelector; // Store the chain ID of the MessageTracker contract
    address internal s_messageTrackerAddress; // Store the MessageTracker contract address

    // Mapping to keep track of allowlisted destination chains.
    mapping(uint64 => bool) public allowlistedDestinationChains;

    // Mapping to keep track of allowlisted source chains.
    mapping(uint64 => bool) public allowlistedSourceChains;

    // Mapping to keep track of allowlisted senders.
    mapping(address => bool) public allowlistedSenders;

    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        string text // The text that was received.
    );

    // Emitted when an acknowledgment message is successfully sent back to the sender contract.
    // This event signifies that the Acknowledger contract has recognized the receipt of an initial message
    // and has informed the original sender contract by sending an acknowledgment message,
    // including the original message ID, indicating successful message reception and processing.
    event AcknowledgmentSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        bytes32 data, // The data being sent back, usually containing the message ID of the original message to acknowledge its receipt.
        address feeToken, // The token address used to pay CCIP fees for sending the acknowledgment.
        uint256 fees // The fees paid for sending the acknowledgment message via CCIP.
    );

    IERC20 private s_linkToken;

    /// @notice Constructor initializes the contract with the router address.
    /// @param _router The address of the router contract.
    /// @param _link The address of the link contract.
    constructor(
        address _router,
        address _link,
        uint64 _messageTrackerChainSelector,
        address _messageTrackerAddress
    ) CCIPReceiver(_router) {
        s_linkToken = IERC20(_link);
        s_messageTrackerChainSelector = _messageTrackerChainSelector;
        s_messageTrackerAddress = _messageTrackerAddress;
    }

    /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
        if (!allowlistedDestinationChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    /// @dev Modifier that checks if the chain with the given sourceChainSelector is allowlisted and if the sender is allowlisted.
    /// @param _sourceChainSelector The selector of the destination chain.
    /// @param _sender The address of the sender.
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector])
            revert SourceChainNotAllowlisted(_sourceChainSelector);
        if (!allowlistedSenders[_sender]) revert SenderNotAllowlisted(_sender);
        _;
    }

    /// @dev Updates the allowlist status of a destination chain for transactions.
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a source chain for transactions.
    function allowlistSourceChain(
        uint64 _sourceChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedSourceChains[_sourceChainSelector] = allowed;
    }

    /// @notice Sends an acknowledgment message back to the sender contract.
    /// @dev This function constructs and sends an acknowledgment message using CCIP,
    /// indicating the receipt and processing of an initial message. It emits the `AcknowledgmentSent` event
    /// upon successful sending. This function should be called after processing the received message
    /// to inform the sender contract about the successful message reception.
    /// @param _messageIdToAcknowledge The message ID of the initial message being acknowledged.
    function _acknowledgePayLINK(bytes32 _messageIdToAcknowledge) internal {
        // Construct the CCIP message for acknowledgment, including the message ID of the initial message.
        Client.EVM2AnyMessage memory acknowledgment = _buildCCIPMessage(
            s_messageTrackerAddress, // The sender contract that awaits acknowledgment.
            _messageIdToAcknowledge, // The ID of the message to acknowledge.
            address(s_linkToken) // The token used to pay for the CCIP message transmission.
        );

        // Initialize a router client instance to interact with the cross-chain router.
        IRouterClient router = IRouterClient(this.getRouter());

        // Calculate the fee required to send the CCIP acknowledgment message.
        uint256 fees = router.getFee(
            s_messageTrackerChainSelector, // The chain selector for routing the message.
            acknowledgment // The acknowledgment message data.
        );

        // Ensure the contract has sufficient balance to cover the message sending fees.
        if (fees > s_linkToken.balanceOf(address(this))) {
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
        }

        // Approve the router to transfer LINK tokens on behalf of this contract to cover the sending fees.
        s_linkToken.approve(address(router), fees);

        // Send the acknowledgment message via the CCIP router and capture the resulting message ID.
        bytes32 messageId = router.ccipSend(
            s_messageTrackerChainSelector, // The destination chain selector.
            acknowledgment // The CCIP message payload for acknowledgment.
        );

        // Emit an event detailing the acknowledgment message sending, for external tracking and verification.
        emit AcknowledgmentSent(
            messageId, // The ID of the sent acknowledgment message.
            s_messageTrackerChainSelector, // The destination chain selector.
            s_messageTrackerAddress, // The receiver of the acknowledgment, typically the original sender.
            _messageIdToAcknowledge, // The original message ID that was acknowledged.
            address(s_linkToken), // The fee token used.
            fees // The fees paid for sending the message.
        );
    }

    /// @dev Updates the allowlist status of a sender for transactions.
    function allowlistSender(address _sender, bool allowed) external onlyOwner {
        allowlistedSenders[_sender] = allowed;
    }

    /// @dev Handles a received CCIP message, processes it, acknowledges its receipt, and emits a `MessageReceived` event.
    /// This internal function is called upon the receipt of a new message via CCIP from an allowlisted source chain and sender.
    /// It decodes the message, acknowledges its receipt by calling `_acknowledgePayLINK`, and logs the reception with `MessageReceived`.
    /// @param any2EvmMessage The CCIP message received
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    )
        internal
        override
        onlyAllowlisted(
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address))
        ) // Make sure source chain and sender are allowlisted
    {
        s_lastReceivedMessageId = any2EvmMessage.messageId; // Store the ID of the received message
        s_lastReceivedText = abi.decode(any2EvmMessage.data, (string)); // abi-decoding of the sent text

        _acknowledgePayLINK(s_lastReceivedMessageId);

        // Emit an event to log the receipt of the message. This includes the message ID, the source chain selector,
        // the sender's address, and the decoded text.
        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address)),
            s_lastReceivedText // Use the decoded text directly to ensure consistency with stored data.
        );
    }

    /// @notice Construct a CCIP message.
    /// @dev This function will create an EVM2AnyMessage struct with all the necessary information for sending a text.
    /// @param _receiver The address of the receiver.
    /// @param _data The bytes data to be sent.
    /// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
    /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
    function _buildCCIPMessage(
        address _receiver,
        bytes32 _data,
        address _feeTokenAddress
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver), // ABI-encoded receiver address
                data: abi.encode(_data),
                tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array aas no tokens are transferred
                extraArgs: Client._argsToBytes(
                    // Additional arguments, setting gas limit
                    Client.EVMExtraArgsV1({gasLimit: 900_000})
                ),
                // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
                feeToken: _feeTokenAddress
            });
    }

    /// @notice Fetches the details of the last received message.
    /// @return messageId The ID of the last received message.
    /// @return text The last received text.
    function getLastReceivedMessageDetails()
        external
        view
        returns (bytes32 messageId, string memory text)
    {
        return (s_lastReceivedMessageId, s_lastReceivedText);
    }

    function getMessageTrackerChainSelector() external view returns (uint64) {
        return s_messageTrackerChainSelector;
    }

    function setMessageTrackerChainSelector(
        uint64 _messageTrackerChainSelector
    ) external onlyOwner {
        s_messageTrackerChainSelector = _messageTrackerChainSelector;
    }

    function getMessageTrackerAddress() external view returns (address) {
        return s_messageTrackerAddress;
    }

    function setMessageTrackerAddress(
        address _messageTrackerAddress
    ) external onlyOwner {
        s_messageTrackerAddress = _messageTrackerAddress;
    }

    /// @notice Fallback function to allow the contract to receive Ether.
    /// @dev This function has no function body, making it a default function for receiving Ether.
    /// It is automatically called when Ether is sent to the contract without any data.
    receive() external payable {}

    /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
    /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
    /// @param _beneficiary The address to which the tokens will be sent.
    /// @param _token The contract address of the ERC20 token to be withdrawn.
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = IERC20(_token).balanceOf(address(this));

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }
}
