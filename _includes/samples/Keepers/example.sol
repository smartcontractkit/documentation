// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

contract Counter is KeeperCompatibleInterface {

  uint public counter; // counter counts the number of upkeeps performed
  uint public interval; // interval specifies the time between upkeeps
  uint public lastTimeStamp; // lastTimeStamp tracks the last upkeep performed

  constructor(uint updateInterval) {
    interval = updateInterval;
  }

  function checkUpkeep(bytes calldata /*checkData*/) external override returns (bool, bytes memory) {
    bool needsUpkeep = (block.timestamp - lastTimeStamp) > interval;
    return (needsUpkeep, bytes(""));
  }

  function performUpkeep(bytes calldata /*performData*/) external override {
    lastTimeStamp = block.timestamp;
    counter = counter + 1;
  }
}