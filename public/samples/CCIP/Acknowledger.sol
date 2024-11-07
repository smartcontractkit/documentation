// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple acknowledger contract for receiving data and sending acknowledgement of receipt messages across chains.
contract Acknowledger is CCIPReceiver, OwnerIsCreator {
    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
    error InvalidReceiverAddress(); // Used when the receiver address is 0.
    error SourceChainNotAllowlisted(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
    error SenderNotAllowlisted(address sender); // Used when the sender has not been allowlisted by the contract owner.

    string private s_lastReceivedText; // Store the last received text.

    // Mapping to keep track of allowlisted destination chains.
    mapping(uint64 => bool) public allowlistedDestinationChains;

    // Mapping to keep track of allowlisted source chains.
    mapping(uint64 => bool) public allowlistedSourceChains;

    // Mapping to keep track of allowlisted senders.
    mapping(address => bool) public allowlistedSenders;

    // Emitted when an acknowledgment message is successfully sent back to the sender contract.
    // This event signifies that the Acknowledger contract has recognized the receipt of an initial message
    // and has informed the original sender contract by sending an acknowledgment message,
    // including the original message ID.
    event AcknowledgmentSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address indexed receiver, // The address of the receiver on the destination chain.
        bytes32 data, // The data being sent back, containing the message ID of the initial message to acknowledge.
        address feeToken, // The token address used to pay CCIP fees for sending the acknowledgment.
        uint256 fees // The fees paid for sending the acknowledgment message via CCIP.
    );

    IERC20 private s_linkToken;

    /// @notice Constructor initializes the contract with the router address.
    /// @param _router The address of the router contract.
    /// @param _link The address of the link contract.
    constructor(address _router, address _link) CCIPReceiver(_router) {
        s_linkToken = IERC20(_link);
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

    /// @dev Updates the allowlist status of a sender for transactions.
    function allowlistSender(address _sender, bool allowed) external onlyOwner {
        allowlistedSenders[_sender] = allowed;
    }

    /// @notice Sends an acknowledgment message back to the sender contract on the source chain
    /// and pays the fees using LINK tokens.
    /// @dev This function constructs and sends an acknowledgment message using CCIP,
    /// indicating the receipt and processing of an initial message. It emits the `AcknowledgmentSent` event
    /// upon successful sending. This function should be called after processing the received message
    /// to inform the sender contract about the successful message reception.
    /// @param _messageIdToAcknowledge The message ID of the initial message being acknowledged.
    /// @param _messageTrackerAddress The address of the message tracker contract on the source chain.
    /// @param _messageTrackerChainSelector The chain selector of the source chain.
    function _acknowledgePayLINK(
        bytes32 _messageIdToAcknowledge,
        address _messageTrackerAddress,
        uint64 _messageTrackerChainSelector
    ) private {
        if (_messageTrackerAddress == address(0))
            revert InvalidReceiverAddress();

        // Construct the CCIP message for acknowledgment, including the message ID of the initial message.
        Client.EVM2AnyMessage memory acknowledgment = Client.EVM2AnyMessage({
            receiver: abi.encode(_messageTrackerAddress), // ABI-encoded receiver address
            data: abi.encode(_messageIdToAcknowledge), // ABI-encoded message ID to acknowledge
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array aas no tokens are transferred
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit and allowing out-of-order execution.
                // Best Practice: For simplicity, the values are hardcoded. It is advisable to use a more dynamic approach
                // where you set the extra arguments off-chain. This allows adaptation depending on the lanes, messages,
                // and ensures compatibility with future CCIP upgrades. Read more about it here: https://docs.chain.link/ccip/best-practices#using-extraargs
                Client.EVMExtraArgsV2({
                    gasLimit: 200_000,
                    allowOutOfOrderExecution: true // Allows the message to be executed out of order relative to other messages from the same sender.
                })
            ),
            // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
            feeToken: address(s_linkToken)
        });

        // Initialize a router client instance to interact with the cross-chain router.
        IRouterClient router = IRouterClient(this.getRouter());

        // Calculate the fee required to send the CCIP acknowledgment message.
        uint256 fees = router.getFee(
            _messageTrackerChainSelector, // The chain selector for routing the message.
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
            _messageTrackerChainSelector, // The destination chain selector.
            acknowledgment // The CCIP message payload for acknowledgment.
        );

        // Emit an event detailing the acknowledgment message sending, for external tracking and verification.
        emit AcknowledgmentSent(
            messageId, // The ID of the sent acknowledgment message.
            _messageTrackerChainSelector, // The destination chain selector.
            _messageTrackerAddress, // The receiver of the acknowledgment, typically the original sender.
            _messageIdToAcknowledge, // The original message ID that was acknowledged.
            address(s_linkToken), // The fee token used.
            fees // The fees paid for sending the message.
        );
    }

    /// @dev Handles a received CCIP message, processes it, and acknowledges its receipt.
    /// This internal function is called upon the receipt of a new message via CCIP from an allowlisted source chain and sender.
    /// It decodes the message and acknowledges its receipt by calling `_acknowledgePayLINK`.
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
        bytes32 messageIdToAcknowledge = any2EvmMessage.messageId; // The message ID of the received message to acknowledge
        address messageTrackerAddress = abi.decode(
            any2EvmMessage.sender,
            (address)
        ); // ABI-decoding of the message tracker address
        uint64 messageTrackerChainSelector = any2EvmMessage.sourceChainSelector; // The chain selector of the received message
        s_lastReceivedText = abi.decode(any2EvmMessage.data, (string)); // abi-decoding of the sent text

        _acknowledgePayLINK(
            messageIdToAcknowledge,
            messageTrackerAddress,
            messageTrackerChainSelector
        );
    }

    /// @notice Fetches the details of the last received message.
    /// @return text The last received text.
    function getLastReceivedMessage()
        external
        view
        returns (string memory text)
    {
        return (s_lastReceivedText);
    }

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

        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}
