// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @dev Example contract which uses the Forwarder
 *
 * @notice important to implement {AutomationCompatibleInterface}
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";

contract CounterwForwarder is AutomationCompatibleInterface, OwnerIsCreator {
    uint256 public counter; // counter counts the number of upkeeps performed
    uint256 public interval; // interval specifies the time between upkeeps
    uint256 public lastTimeStamp; // lastTimeStamp tracks the last upkeep performed
    address public s_forwarderAddress;

    constructor(uint256 updateInterval) {
        interval = updateInterval;
    }

    function checkUpkeep(
        bytes calldata /*checkData*/
    ) external override returns (bool, bytes memory) {
        bool needsUpkeep = (block.timestamp - lastTimeStamp) > interval;
        return (needsUpkeep, bytes(""));
    }

    function performUpkeep(bytes calldata /*performData*/) external override {
        require(
            msg.sender == s_forwarderAddress,
            "This address does not have permission to call performUpkeep"
        );
        lastTimeStamp = block.timestamp;
        counter = counter + 1;
    }

    /// @notice Set the address that `performUpkeep` is called from
    /// @dev Only callable by the owner
    /// @param forwarderAddress the address to set
    function setForwarderAddress(address forwarderAddress) external onlyOwner {
        s_forwarderAddress = forwarderAddress;
    }
}
