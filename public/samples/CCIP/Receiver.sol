// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {FinalityCodec} from "@chainlink/contracts-ccip/contracts/libraries/FinalityCodec.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple contract for receiving string data across chains.
contract Receiver is CCIPReceiver {
  event MessageReceived(bytes32 indexed messageId, uint64 indexed sourceChainSelector, address sender, string text);

  bytes32 private s_lastReceivedMessageId;
  string private s_lastReceivedText;

  /// @notice Constructor initializes the contract with the router address.
  /// @param router The address of the router contract.
  constructor(
    address router
  ) CCIPReceiver(router) {}

  /// @notice Handle a received message.
  function _ccipReceive(
    Client.Any2EVMMessage memory any2EvmMessage
  ) internal override {
    s_lastReceivedMessageId = any2EvmMessage.messageId;
    s_lastReceivedText = abi.decode(any2EvmMessage.data, (string));

    emit MessageReceived(
      any2EvmMessage.messageId,
      any2EvmMessage.sourceChainSelector,
      abi.decode(any2EvmMessage.sender, (address)),
      abi.decode(any2EvmMessage.data, (string))
    );
  }

  /// @notice Returns the CCVs and finality config for a given source chain.
  /// @dev Override to advertise receiver finality policy to the OffRamp.
  function getCCVsAndFinalityConfig(
    uint64,
    bytes calldata
  )
    external
    view
    override
    returns (
      address[] memory requiredCCVs,
      address[] memory optionalCCVs,
      uint8 optionalThreshold,
      bytes4 allowedFinalityConfig
    )
  {
    return (new address[](0), new address[](0), 0, FinalityCodec.WAIT_FOR_FINALITY_FLAG);
  }

  /// @notice Fetches the details of the last received message.
  /// @return messageId The ID of the last received message.
  /// @return text The last received text.
  function getLastReceivedMessageDetails() external view returns (bytes32 messageId, string memory text) {
    return (s_lastReceivedMessageId, s_lastReceivedText);
  }
}
