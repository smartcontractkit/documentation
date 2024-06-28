// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title The EthBalanceMonitor contract
 * @notice A contract compatible with Chainlink Automation Network that monitors and funds eth addresses
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract EthBalanceMonitor is
    ConfirmedOwner,
    Pausable,
    AutomationCompatibleInterface
{
    // observed limit of 45K + 10k buffer
    uint256 private constant MIN_GAS_FOR_TRANSFER = 55_000;

    event FundsAdded(uint256 amountAdded, uint256 newBalance, address sender);
    event FundsWithdrawn(uint256 amountWithdrawn, address payee);
    event TopUpSucceeded(address indexed recipient);
    event TopUpFailed(address indexed recipient);
    event ForwarderAddressUpdated(address oldAddress, address newAddress);
    event MinWaitPeriodUpdated(
        uint256 oldMinWaitPeriod,
        uint256 newMinWaitPeriod
    );

    error InvalidWatchList();
    error OnlyForwarder();
    error DuplicateAddress(address duplicate);

    struct Target {
        bool isActive;
        uint96 minBalanceWei;
        uint96 topUpAmountWei;
        uint56 lastTopUpTimestamp; // enough space for 2 trillion years
    }

    address private s_forwarderAddress;
    uint256 private s_minWaitPeriodSeconds;
    address[] private s_watchList;
    mapping(address => Target) internal s_targets;

    /**
     * @param minWaitPeriodSeconds The minimum wait period for addresses between funding
     */
    constructor(uint256 minWaitPeriodSeconds) ConfirmedOwner(msg.sender) {
        setMinWaitPeriodSeconds(minWaitPeriodSeconds);
    }

    /**
     * @notice Sets the list of addresses to watch and their funding parameters
     * @param addresses the list of addresses to watch
     * @param minBalancesWei the minimum balances for each address
     * @param topUpAmountsWei the amount to top up each address
     */
    function setWatchList(
        address[] calldata addresses,
        uint96[] calldata minBalancesWei,
        uint96[] calldata topUpAmountsWei
    ) external onlyOwner {
        if (
            addresses.length != minBalancesWei.length ||
            addresses.length != topUpAmountsWei.length
        ) {
            revert InvalidWatchList();
        }
        address[] memory oldWatchList = s_watchList;
        for (uint256 idx = 0; idx < oldWatchList.length; idx++) {
            s_targets[oldWatchList[idx]].isActive = false;
        }
        for (uint256 idx = 0; idx < addresses.length; idx++) {
            if (s_targets[addresses[idx]].isActive) {
                revert DuplicateAddress(addresses[idx]);
            }
            if (addresses[idx] == address(0)) {
                revert InvalidWatchList();
            }
            if (topUpAmountsWei[idx] == 0) {
                revert InvalidWatchList();
            }
            s_targets[addresses[idx]] = Target({
                isActive: true,
                minBalanceWei: minBalancesWei[idx],
                topUpAmountWei: topUpAmountsWei[idx],
                lastTopUpTimestamp: 0
            });
        }
        s_watchList = addresses;
    }

    /**
     * @notice Gets a list of addresses that are under funded
     * @return list of addresses that are underfunded
     */
    function getUnderfundedAddresses() public view returns (address[] memory) {
        address[] memory watchList = s_watchList;
        address[] memory needsFunding = new address[](watchList.length);
        uint256 count = 0;
        uint256 minWaitPeriod = s_minWaitPeriodSeconds;
        uint256 balance = address(this).balance;
        Target memory target;
        for (uint256 idx = 0; idx < watchList.length; idx++) {
            target = s_targets[watchList[idx]];
            if (
                target.lastTopUpTimestamp + minWaitPeriod <= block.timestamp &&
                balance >= target.topUpAmountWei &&
                watchList[idx].balance < target.minBalanceWei
            ) {
                needsFunding[count] = watchList[idx];
                count++;
                balance -= target.topUpAmountWei;
            }
        }
        if (count != watchList.length) {
            assembly {
                mstore(needsFunding, count)
            }
        }
        return needsFunding;
    }

    /**
     * @notice Send funds to the addresses provided
     * @param needsFunding the list of addresses to fund (addresses must be pre-approved)
     */
    function topUp(address[] memory needsFunding) public whenNotPaused {
        uint256 minWaitPeriodSeconds = s_minWaitPeriodSeconds;
        Target memory target;
        for (uint256 idx = 0; idx < needsFunding.length; idx++) {
            target = s_targets[needsFunding[idx]];
            if (
                target.isActive &&
                target.lastTopUpTimestamp + minWaitPeriodSeconds <=
                block.timestamp &&
                needsFunding[idx].balance < target.minBalanceWei
            ) {
                bool success = payable(needsFunding[idx]).send(
                    target.topUpAmountWei
                );
                if (success) {
                    s_targets[needsFunding[idx]].lastTopUpTimestamp = uint56(
                        block.timestamp
                    );
                    emit TopUpSucceeded(needsFunding[idx]);
                } else {
                    emit TopUpFailed(needsFunding[idx]);
                }
            }
            if (gasleft() < MIN_GAS_FOR_TRANSFER) {
                return;
            }
        }
    }

    /**
     * @notice Get list of addresses that are underfunded and return payload compatible with Chainlink Automation Network
     * @return upkeepNeeded signals if upkeep is needed, performData is an abi encoded list of addresses that need funds
     */
    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        whenNotPaused
        returns (bool upkeepNeeded, bytes memory performData)
    {
        address[] memory needsFunding = getUnderfundedAddresses();
        upkeepNeeded = needsFunding.length > 0;
        performData = abi.encode(needsFunding);
        return (upkeepNeeded, performData);
    }

    /**
     * @notice Called by Chainlink Automation Node to send funds to underfunded addresses
     * @param performData The abi encoded list of addresses to fund
     */
    function performUpkeep(
        bytes calldata performData
    ) external override onlyForwarder whenNotPaused {
        address[] memory needsFunding = abi.decode(performData, (address[]));
        topUp(needsFunding);
    }

    /**
     * @notice Withdraws the contract balance
     * @param amount The amount of eth (in wei) to withdraw
     * @param payee The address to pay
     */
    function withdraw(
        uint256 amount,
        address payable payee
    ) external onlyOwner {
        require(payee != address(0));
        emit FundsWithdrawn(amount, payee);
        payee.transfer(amount);
    }

    /**
     * @notice Receive funds
     */
    receive() external payable {
        emit FundsAdded(msg.value, address(this).balance, msg.sender);
    }

    /**
     * @notice Sets the upkeep's unique forwarder address
     * for upkeeps in Automation versions 2.0 and later
     * https://docs.chain.link/chainlink-automation/guides/forwarder
     */
    function setForwarderAddress(address forwarderAddress) public onlyOwner {
        require(forwarderAddress != address(0));
        emit ForwarderAddressUpdated(s_forwarderAddress, forwarderAddress);
        s_forwarderAddress = forwarderAddress;
    }

    /**
     * @notice Sets the minimum wait period (in seconds) for addresses between funding
     */
    function setMinWaitPeriodSeconds(uint256 period) public onlyOwner {
        emit MinWaitPeriodUpdated(s_minWaitPeriodSeconds, period);
        s_minWaitPeriodSeconds = period;
    }

    /**
     * @notice Gets the forwarder address of the Chainlink Automation upkeep
     */
    function getForwarderAddress()
        external
        view
        returns (address forwarderAddress)
    {
        return s_forwarderAddress;
    }

    /**
     * @notice Gets the minimum wait period
     */
    function getMinWaitPeriodSeconds() external view returns (uint256) {
        return s_minWaitPeriodSeconds;
    }

    /**
     * @notice Gets the list of addresses being watched
     */
    function getWatchList() external view returns (address[] memory) {
        return s_watchList;
    }

    /**
     * @notice Gets configuration information for an address on the watchlist
     */
    function getAccountInfo(
        address targetAddress
    )
        external
        view
        returns (
            bool isActive,
            uint96 minBalanceWei,
            uint96 topUpAmountWei,
            uint56 lastTopUpTimestamp
        )
    {
        Target memory target = s_targets[targetAddress];
        return (
            target.isActive,
            target.minBalanceWei,
            target.topUpAmountWei,
            target.lastTopUpTimestamp
        );
    }

    /**
     * @notice Pauses the contract, which prevents executing performUpkeep
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    modifier onlyForwarder() {
        if (msg.sender != s_forwarderAddress) {
            revert OnlyForwarder();
        }
        _;
    }
}
