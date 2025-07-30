// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract ReserveConsumerV3 {
    AggregatorV3Interface internal reserveFeed;

    /**
     * Network: Ethereum Mainnet
     * Aggregator: WBTC PoR
     * Address: 0xa81FE04086865e63E12dD3776978E49DEEa2ea4e
     */
    constructor() {
        reserveFeed = AggregatorV3Interface(
            0xa81FE04086865e63E12dD3776978E49DEEa2ea4e
        );
    }

    /**
     * Returns the latest price
     */
    function getLatestReserve() public view returns (int) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            int reserve,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = reserveFeed.latestRoundData();

        return reserve;
    }
}
