// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {OwnerIsCreator} from "@chainlink/contracts@1.4.0/src/v0.8/shared/access/OwnerIsCreator.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple messenger contract for transferring/receiving tokens and data across chains.
contract ProgrammableTokenTransfersLowGasLimit is CCIPReceiver, OwnerIsCreator {
  using SafeERC20 for IERC20;

  // Custom errors to provide more descriptive revert messages.
  error NotEnoughBalance(uint256 currentBalance, uint256 requiredBalance); // Used to make sure contract has enough
  // token balance
  error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
  error DestinationChainNotAllowed(uint64 destinationChainSelector); // Used when the destination chain has not been
  // allowlisted by the contract owner.
  error SourceChainNotAllowed(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the
  // contract owner.
  error SenderNotAllowed(address sender); // Used when the sender has not been allowlisted by the contract owner.

  // Event emitted when a message is sent to another chain.
  // The chain selector of the destination chain.
  // The address of the receiver on the destination chain.
  // The text being sent.
  // The token address that was transferred.
  // The token amount that was transferred.
  // the token address used to pay CCIP fees.
  // The fees paid for sending the message.
  event MessageSent( // The unique ID of the CCIP message.
    bytes32 indexed messageId,
    uint64 indexed destinationChainSelector,
    address receiver,
    string text,
    address token,
    uint256 tokenAmount,
    address feeToken,
    uint256 fees
  );

  // Event emitted when a message is received from another chain.
  // The chain selector of the source chain.
  // The address of the sender from the source chain.
  // The text that was received.
  // The token address that was transferred.
  // The token amount that was transferred.
  event MessageReceived( // The unique ID of the CCIP message.
    bytes32 indexed messageId,
    uint64 indexed sourceChainSelector,
    address sender,
    string text,
    address token,
    uint256 tokenAmount
  );

  bytes32 private s_lastReceivedMessageId; // Store the last received messageId.
  address private s_lastReceivedTokenAddress; // Store the last received token address.
  uint256 private s_lastReceivedTokenAmount; // Store the last received amount.
  string private s_lastReceivedText; // Store the last received text.

  // Mapping to keep track of allowlisted destination chains.
  mapping(uint64 => bool) public allowlistedDestinationChains;

  // Mapping to keep track of allowlisted source chains.
  mapping(uint64 => bool) public allowlistedSourceChains;

  // Mapping to keep track of allowlisted senders.
  mapping(address => bool) public allowlistedSenders;

  IERC20 private s_linkToken;

  /// @notice Constructor initializes the contract with the router address.
  /// @param _router The address of the router contract.
  /// @param _link The address of the link contract.
  constructor(address _router, address _link) CCIPReceiver(_router) {
    s_linkToken = IERC20(_link);
  }

  /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
  /// @param _destinationChainSelector The selector of the destination chain.
  modifier onlyAllowlistedDestinationChain(
    uint64 _destinationChainSelector
  ) {
    if (!allowlistedDestinationChains[_destinationChainSelector]) {
      revert DestinationChainNotAllowed(_destinationChainSelector);
    }
    _;
  }

  /// @dev Modifier that checks if the chain with the given sourceChainSelector is allowlisted and if the sender is
  /// allowlisted.
  /// @param _sourceChainSelector The selector of the destination chain.
  /// @param _sender The address of the sender.
  modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
    if (!allowlistedSourceChains[_sourceChainSelector]) {
      revert SourceChainNotAllowed(_sourceChainSelector);
    }
    if (!allowlistedSenders[_sender]) revert SenderNotAllowed(_sender);
    _;
  }

  /// @dev Updates the allowlist status of a destination chain for transactions.
  /// @notice This function can only be called by the owner.
  /// @param _destinationChainSelector The selector of the destination chain to be updated.
  /// @param allowed The allowlist status to be set for the destination chain.
  function allowlistDestinationChain(uint64 _destinationChainSelector, bool allowed) external onlyOwner {
    allowlistedDestinationChains[_destinationChainSelector] = allowed;
  }

  /// @dev Updates the allowlist status of a source chain
  /// @notice This function can only be called by the owner.
  /// @param _sourceChainSelector The selector of the source chain to be updated.
  /// @param allowed The allowlist status to be set for the source chain.
  function allowlistSourceChain(uint64 _sourceChainSelector, bool allowed) external onlyOwner {
    allowlistedSourceChains[_sourceChainSelector] = allowed;
  }

  /// @dev Updates the allowlist status of a sender for transactions.
  /// @notice This function can only be called by the owner.
  /// @param _sender The address of the sender to be updated.
  /// @param allowed The allowlist status to be set for the sender.
  function allowlistSender(address _sender, bool allowed) external onlyOwner {
    allowlistedSenders[_sender] = allowed;
  }

  /// @notice Sends data and transfer tokens to receiver on the destination chain.
  /// @notice Pay for fees in LINK.
  /// @notice the gasLimit is set to 20_000 on purpose to force the execution to fail on the destination chain
  /// @dev Assumes your contract has sufficient LINK to pay for CCIP fees.
  /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
  /// @param _receiver The address of the recipient on the destination blockchain.
  /// @param _text The string data to be sent.
  /// @param _token token address.
  /// @param _amount token amount.
  /// @return messageId The ID of the CCIP message that was sent.
  function sendMessagePayLINK(
    uint64 _destinationChainSelector,
    address _receiver,
    string calldata _text,
    address _token,
    uint256 _amount
  ) external onlyOwner onlyAllowlistedDestinationChain(_destinationChainSelector) returns (bytes32 messageId) {
    // Set the token amounts
    Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
    tokenAmounts[0] = Client.EVMTokenAmount({token: _token, amount: _amount});

    // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
    // address(linkToken) means fees are paid in LINK

    Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
      receiver: abi.encode(_receiver), // ABI-encoded receiver address
      data: abi.encode(_text), // ABI-encoded string
      tokenAmounts: tokenAmounts, // The amount and type of token being transferred
      extraArgs: Client._argsToBytes(
        // Additional arguments, setting gas limit and allowing out-of-order execution.
        // Best Practice: For simplicity, the values are hardcoded. It is advisable to use a more dynamic approach
        // where you set the extra arguments off-chain. This allows adaptation depending on the lanes, messages,
        // and ensures compatibility with future CCIP upgrades. Read more about it here:
        // https://docs.chain.link/ccip/concepts/best-practices/evm#using-extraargs
        Client.GenericExtraArgsV2({
          gasLimit: 20_000, // Gas limit for the callback on the destination chain
          allowOutOfOrderExecution: true // Allows the message to be executed out of order relative to other messages
            // from
            // the same sender
        })
      ),
      // Set the feeToken to a LINK token address
      feeToken: address(s_linkToken)
    });

    // Initialize a router client instance to interact with cross-chain router
    IRouterClient router = IRouterClient(this.getRouter());

    // Get the fee required to send the CCIP message
    uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

    uint256 requiredLinkBalance;
    if (_token == address(s_linkToken)) {
      // Required LINK Balance is the sum of fees and amount to transfer, if the token to transfer is LINK
      requiredLinkBalance = fees + _amount;
    } else {
      requiredLinkBalance = fees;
    }

    uint256 linkBalance = s_linkToken.balanceOf(address(this));

    if (requiredLinkBalance > linkBalance) {
      revert NotEnoughBalance(linkBalance, requiredLinkBalance);
    }

    // approve the Router to transfer LINK tokens on contract's behalf. It will spend the requiredLinkBalance
    s_linkToken.approve(address(router), requiredLinkBalance);

    // If sending a token other than LINK, approve it separately
    if (_token != address(s_linkToken)) {
      uint256 tokenBalance = IERC20(_token).balanceOf(address(this));
      if (_amount > tokenBalance) {
        revert NotEnoughBalance(tokenBalance, _amount);
      }
      // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
      IERC20(_token).approve(address(router), _amount);
    }

    // Send the message through the router and store the returned message ID
    messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

    // Emit an event with message details
    emit MessageSent(
      messageId, _destinationChainSelector, _receiver, _text, _token, _amount, address(s_linkToken), fees
    );

    // Return the message ID
    return messageId;
  }

  /**
   * @notice Returns the details of the last CCIP received message.
   * @dev This function retrieves the ID, text, token address, and token amount of the last received CCIP message.
   * @return messageId The ID of the last received CCIP message.
   * @return text The text of the last received CCIP message.
   * @return tokenAddress The address of the token in the last CCIP received message.
   * @return tokenAmount The amount of the token in the last CCIP received message.
   */
  function getLastReceivedMessageDetails()
    public
    view
    returns (bytes32 messageId, string memory text, address tokenAddress, uint256 tokenAmount)
  {
    return (s_lastReceivedMessageId, s_lastReceivedText, s_lastReceivedTokenAddress, s_lastReceivedTokenAmount);
  }

  /// handle a received message
  function _ccipReceive(
    Client.Any2EVMMessage memory any2EvmMessage
  )
    internal
    override
    onlyAllowlisted(any2EvmMessage.sourceChainSelector, abi.decode(any2EvmMessage.sender, (address))) // Make sure
      // source chain and sender are allowlisted
  {
    s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
    s_lastReceivedText = abi.decode(any2EvmMessage.data, (string)); // abi-decoding of the sent text
    // Expect one token to be transferred at once, but you can transfer several tokens.
    s_lastReceivedTokenAddress = any2EvmMessage.destTokenAmounts[0].token;
    s_lastReceivedTokenAmount = any2EvmMessage.destTokenAmounts[0].amount;

    emit MessageReceived(
      any2EvmMessage.messageId,
      any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
      abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
      abi.decode(any2EvmMessage.data, (string)),
      any2EvmMessage.destTokenAmounts[0].token,
      any2EvmMessage.destTokenAmounts[0].amount
    );
  }

  /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
  /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
  /// @param _beneficiary The address to which the tokens will be sent.
  /// @param _token The contract address of the ERC20 token to be withdrawn.
  function withdrawToken(address _beneficiary, address _token) public onlyOwner {
    // Retrieve the balance of this contract
    uint256 amount = IERC20(_token).balanceOf(address(this));

    // Revert if there is nothing to withdraw
    if (amount == 0) revert NothingToWithdraw();

    IERC20(_token).safeTransfer(_beneficiary, amount);
  }
}
