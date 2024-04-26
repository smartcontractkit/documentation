// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract Counter {
    /**
     * Public counter variable
     */
    uint public counter;

    constructor() {
        counter = 0;
    }

    function updateCounter(uint updateAmount) external {
        counter += updateAmount;
    }
}
