// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {ExtraArgsCodec} from "@chainlink/contracts-ccip/contracts/libraries/ExtraArgsCodec.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple contract for sending string data across chains.
contract Sender is OwnerIsCreator {
  error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);

  event MessageSent(
    bytes32 indexed messageId,
    uint64 indexed destinationChainSelector,
    address receiver,
    string text,
    address feeToken,
    uint256 fees
  );

  IRouterClient private s_router;
  LinkTokenInterface private s_linkToken;

  /// @notice Constructor initializes the contract with the router address.
  /// @param _router The address of the router contract.
  /// @param _link The address of the LINK token contract.
  constructor(
    address _router,
    address _link
  ) {
    s_router = IRouterClient(_router);
    s_linkToken = LinkTokenInterface(_link);
  }

  /// @notice Sends data to receiver on the destination chain.
  /// @dev Assumes your contract has sufficient LINK to cover fees.
  /// @param destinationChainSelector The identifier (aka selector) for the destination blockchain.
  /// @param receiver The address of the recipient on the destination blockchain.
  /// @param text The string text to be sent.
  /// @return messageId The ID of the message that was sent.
  function sendMessage(
    uint64 destinationChainSelector,
    address receiver,
    string calldata text
  ) external onlyOwner returns (bytes32 messageId) {
    // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
    Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
      receiver: abi.encode(receiver), // ABI-encoded receiver address
      data: abi.encode(text), // ABI-encoded string
      tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array — no tokens are being sent
      extraArgs: ExtraArgsCodec._getBasicEncodedExtraArgsV3(
        200_000, // Gas limit for the callback on the destination chain
        bytes4(0) // Default finality (wait for full finalization)
      ),
      feeToken: address(s_linkToken) // Pay CCIP fees in LINK
    });

    // Get the fee required to send the message
    uint256 fees = s_router.getFee(destinationChainSelector, evm2AnyMessage);

    if (fees > s_linkToken.balanceOf(address(this))) {
      revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
    }

    // Approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
    s_linkToken.approve(address(s_router), fees);

    // Send the message through the router and store the returned message ID
    messageId = s_router.ccipSend(destinationChainSelector, evm2AnyMessage);

    // Emit an event with message details
    emit MessageSent(messageId, destinationChainSelector, receiver, text, address(s_linkToken), fees);

    // Return the message ID
    return messageId;
  }
}
