// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IStaker {
    function stake(address beneficiary, uint256 amount) external;

    function redeem() external;
}
