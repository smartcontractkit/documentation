// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract Counter is Ownable {
    /**
     * Public counter variable
     */
    uint public counter;

    // the address of the Automation registry
    address public s_automationRegistryAddress;

    error OnlyAutomationRegistry();

    // Hardcoded for Sepolia:
    // s_automationRegistryAddress = 0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2
    constructor() {
        counter = 0;
        s_automationRegistryAddress = 0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2;
    }

    function updateCounter(
        uint updateAmount
    ) public onlyOwner onlyAutomationRegistry {
        counter += updateAmount;
    }

    modifier onlyAutomationRegistry() {
        if (msg.sender != s_automationRegistryAddress) {
            revert OnlyAutomationRegistry();
        }
        _;
    }
}
