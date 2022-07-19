// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

/**
 * Find information on LINK Token Contracts here: https://docs.chain.link/docs/link-token-contracts/
 */

contract ArbitrumPriceConsumer {
	// Identifier of the Sequencer offline flag on the Flags contract
    AggregatorV2V3Interface internal priceFeed;
    AggregatorV2V3Interface internal sequencerUptimeFeed;

    /**
     * Network: Rinkeby
     * Data Feed: BTC/USD
     * Data Feed Proxy Address: 0x2431452A0010a43878bF198e170F6319Af6d27F4
     * Sequencer Uptime Proxy Address: 0x13E99C19833F557672B67C70508061A2E1e54162
		 * For a list of available sequencer proxy addresses, see:
		 * https://docs.chain.link/docs/l2-sequencer-flag/
     */
    constructor() {
        priceFeed = AggregatorV2V3Interface(0x2431452A0010a43878bF198e170F6319Af6d27F4);
        sequencerUptimeFeed = AggregatorV2V3Interface(0x13E99C19833F557672B67C70508061A2E1e54162);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        if (checkSequencerState()) {
		        // If the sequencer is down, do not perform any critical operations
            revert("L2 sequencer down: Chainlink feeds are not being updated");
        }
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

		/**
     * Check if the L2 sequencer is running
     */
    function checkSequencerState() public view returns (bool sequencerIsUp) {
        (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) = sequencerUptimeFeed.latestRoundData();

        // Answer == 0: Sequencer is up
        // Snswer == 1: Sequencer is down
        if (answer == 0 && (block.timestamp - updatedAt) < 3600) {
            return true;
        }
        return false;
    }
}