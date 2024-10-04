// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

interface IStaker {
    function stake(address beneficiary, uint256 amount) external;

    function redeem() external;
}

/// @title - A simple Staker contract for staking usc tokens and redeeming the staker contracts
contract Staker is IStaker, ERC20 {
    using SafeERC20 for ERC20;

    error InvalidUsdcToken(); // Used when the usdc token address is 0
    error InvalidNumberOfDecimals(); // Used when the number of decimals is 0
    error InvalidBeneficiary(); // Used when the beneficiary address is 0
    error InvalidAmount(); // Used when the amount is 0
    error NothingToRedeem(); // Used when the balance of Staker tokens is 0

    event UsdcStaked(address indexed beneficiary, uint256 amount);
    event UsdcRedeemed(address indexed beneficiary, uint256 amount);

    ERC20 private immutable i_usdcToken;
    uint8 private immutable i_decimals;

    /// @notice Constructor initializes the contract with the usdc token address.
    /// @param _usdcToken The address of the usdc contract.
    constructor(address _usdcToken) ERC20("Simple Staker", "STK") {
        if (_usdcToken == address(0)) revert InvalidUsdcToken();
        i_usdcToken = ERC20(_usdcToken);
        i_decimals = i_usdcToken.decimals();
        if (i_decimals == 0) revert InvalidNumberOfDecimals();
    }

    function stake(address _beneficiary, uint256 _amount) external {
        if (_beneficiary == address(0)) revert InvalidBeneficiary();
        if (_amount == 0) revert InvalidAmount();

        i_usdcToken.safeTransferFrom(msg.sender, address(this), _amount);
        _mint(_beneficiary, _amount);
        emit UsdcStaked(_beneficiary, _amount);
    }

    function redeem() external {
        uint256 balance = balanceOf(msg.sender);
        if (balance == 0) revert NothingToRedeem();
        _burn(msg.sender, balance);
        i_usdcToken.safeTransfer(msg.sender, balance);
        emit UsdcRedeemed(msg.sender, balance);
    }

    function decimals() public view override returns (uint8) {
        return i_decimals;
    }
}
