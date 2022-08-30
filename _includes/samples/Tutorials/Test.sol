// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

interface numberComparison {
    function isSameNum(uint256 a, uint256 b) external view returns (bool);
}

contract Test is numberComparison {
    constructor() {}

    function isSameNum(uint256 a, uint256 b)
        external
        pure
        override
        returns (bool)
    {
        if (a == b) {
            return true;
        } else {
            return false;
        }
    }
}
