// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ReceiverTemplate} from "./ReceiverTemplate.sol";

contract MyConsumer is ReceiverTemplate {
  uint256 public s_storedValue;

  event ValueUpdated(uint256 newValue);

  // Constructor requires forwarder address
  constructor(
    address _forwarderAddress
  ) ReceiverTemplate(_forwarderAddress) {}

  // Implement your business logic here
  function _processReport(
    bytes calldata report
  ) internal override {
    uint256 newValue = abi.decode(report, (uint256));
    s_storedValue = newValue;
    emit ValueUpdated(newValue);
  }
}
