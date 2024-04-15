// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract NFTFloorPriceConsumerV3 {
    AggregatorV3Interface internal nftFloorPriceFeed;

    /**
     * Network: Ethereum Mainnet
     * Aggregator: Azuki Floor Price
     * Address: 0xA8B9A447C73191744D5B79BcE864F343455E1150
     */
    constructor() {
        nftFloorPriceFeed = AggregatorV3Interface(
            0xA8B9A447C73191744D5B79BcE864F343455E1150
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
