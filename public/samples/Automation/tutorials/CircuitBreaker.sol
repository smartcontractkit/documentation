// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

import {IPerformExecutor} from "./interfaces/IPerformExecutor.sol";

contract CircuitBreaker is AutomationCompatibleInterface {
    /**
     * @dev run off-chain, checks if balance is greater than expected and decides whether to run emergency action on-chain
     * @param checkData address of the Executor contract
     */
    function checkUpkeep(
        bytes calldata checkData
    ) external view override returns (bool, bytes memory) {
        address executorAddress = abi.decode(checkData, (address));
        IPerformExecutor performExecutor = IPerformExecutor(executorAddress);

        if (
            performExecutor.isFeedParamMet() &&
            performExecutor.isEmergencyActionPossible()
        ) {
            return (true, checkData);
        }

        return (false, checkData);
    }

    /**
     * @dev if feed params are not met - executes emergency action
     * @param performData address of the PerformExecutor contract
     */
    function performUpkeep(bytes calldata performData) external override {
        address executorAddress = abi.decode(performData, (address));

        IPerformExecutor performExecutor = IPerformExecutor(executorAddress);

        performExecutor.executeEmergencyAction();
    }
}
