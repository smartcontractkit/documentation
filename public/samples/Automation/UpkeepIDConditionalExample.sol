// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

struct RegistrationParams {
    string name;
    bytes encryptedEmail;
    address upkeepContract;
    uint32 gasLimit;
    address adminAddress;
    uint8 triggerType;
    bytes checkData;
    bytes triggerConfig;
    bytes offchainConfig;
    uint96 amount;
}

/**
 * string name = "test upkeep";
 * bytes encryptedEmail = 0x;
 * address upkeepContract = 0x...;
 * uint32 gasLimit = 500000;
 * address adminAddress = 0x....;
 * uint8 triggerType = 0;
 * bytes checkData = 0x;
 * bytes triggerConfig = 0x;
 * bytes offchainConfig = 0x;
 * uint96 amount = 1000000000000000000;
 */

interface AutomationRegistrarInterface {
    function registerUpkeep(
        RegistrationParams calldata requestParams
    ) external returns (uint256);
}

contract UpkeepIDConditionalExample {
    LinkTokenInterface public immutable i_link;
    AutomationRegistrarInterface public immutable i_registrar;

    constructor(
        LinkTokenInterface link,
        AutomationRegistrarInterface registrar
    ) {
        i_link = link;
        i_registrar = registrar;
    }

    function registerAndPredictID(RegistrationParams memory params) public {
        // LINK must be approved for transfer - this can be done every time or once
        // with an infinite approval
        i_link.approve(address(i_registrar), params.amount);
        uint256 upkeepID = i_registrar.registerUpkeep(params);
        if (upkeepID != 0) {
            // DEV - Use the upkeepID however you see fit
        } else {
            revert("auto-approve disabled");
        }
    }
}
