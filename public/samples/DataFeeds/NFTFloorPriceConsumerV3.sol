// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract NFTFloorPriceConsumerV3 {
    AggregatorV3Interface internal nftFloorPriceFeed;

    /**
     * Network: Mumbai Testnet
     * Aggregator: Azuki Floor Price
     * Address: 0x16c74d1f6986c6Ffb48540b178fF8Cb0ED9F13b0
     */
    constructor() {
        nftFloorPriceFeed = AggregatorV3Interface(
            0x16c74d1f6986c6Ffb48540b178fF8Cb0ED9F13b0
        );
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            int nftFloorPrice,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = nftFloorPriceFeed.latestRoundData();
        return nftFloorPrice;
    }
}
