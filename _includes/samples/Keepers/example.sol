// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

// KeeperCompatible.sol imports the functions from both ./KeeperBase.sol and
// ./interfaces/KeeperCompatibleInterface.sol
import "@chainlink/contracts/src/v0.7/KeeperCompatible.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

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