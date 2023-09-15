// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract DataConsumerWithSequencerCheck {
    AggregatorV2V3Interface internal dataFeed;
    AggregatorV2V3Interface internal sequencerUptimeFeed;

    uint256 private constant GRACE_PERIOD_TIME = 3600;

    error SequencerDown();
    error GracePeriodNotOver();

    /**
     * Network: Optimism Goerli testnet
     * Data Feed: BTC/USD
     * Data Feed address: 0xC16679B963CeB52089aD2d95312A5b85E318e9d2
     * Uptime Feed address: 0x4C4814aa04433e0FB31310379a4D6946D5e1D353
     * For a list of available Sequencer Uptime Feed proxy addresses, see:
     * https://docs.chain.link/docs/data-feeds/l2-sequencer-feeds
     */
    constructor() {
        dataFeed = AggregatorV2V3Interface(
            0xC16679B963CeB52089aD2d95312A5b85E318e9d2
        );
        sequencerUptimeFeed = AggregatorV2V3Interface(
            0x4C4814aa04433e0FB31310379a4D6946D5e1D353
        );
    }

    // Check the sequencer status and return the latest data
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            int256 answer,
            uint256 startedAt,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = sequencerUptimeFeed.latestRoundData();

        // Answer == 0: Sequencer is up
        // Answer == 1: Sequencer is down
        bool isSequencerUp = answer == 0;
        if (!isSequencerUp) {
            revert SequencerDown();
        }

        // Make sure the grace period has passed after the
        // sequencer is back up.
        uint256 timeSinceUp = block.timestamp - startedAt;
        if (timeSinceUp <= GRACE_PERIOD_TIME) {
            revert GracePeriodNotOver();
        }

        // prettier-ignore
        (
            /*uint80 roundID*/,
            int data,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();

        return data;
    }
}
