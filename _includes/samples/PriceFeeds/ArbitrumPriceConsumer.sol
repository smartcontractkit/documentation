// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

/**
* Find information on LINK Token Contracts here: https://docs.chain.link/docs/link-token-contracts/
*/

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract ArbitrumPriceConsumer {
  // Identifier of the Sequencer offline flag on the Flags contract
  AggregatorV2V3Interface internal priceFeed;
  AggregatorV2V3Interface internal sequencerUptimeFeed;

  uint256 private constant STALENESS_THRESHOLD = 3600;

  error SequencerDown();
  error StaleL2SequencerFeed();

  /**
  * Network: Rinkeby
  * Data Feed: BTC/USD
  * Data Feed Proxy Address: 0xECe365B379E1dD183B20fc5f022230C044d51404
  * Sequencer Uptime Proxy Address: 0x13E99C19833F557672B67C70508061A2E1e54162
  * For a list of available sequencer proxy addresses, see:
  * https://docs.chain.link/docs/l2-sequencer-flag/
  */
  constructor() {
    priceFeed = AggregatorV2V3Interface(0xECe365B379E1dD183B20fc5f022230C044d51404);
    sequencerUptimeFeed = AggregatorV2V3Interface(0x13E99C19833F557672B67C70508061A2E1e54162);
  }

  /**
  * Checks the sequencer status and returns the latest price
  */
  function getLatestPrice() public view returns (int) {
    (
      /*uint80 roundId*/,
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

    // Make sure the sequencer status is not stale.
    uint256 timeSinceUpdated = block.timestamp - startedAt;
    if (timeSinceUpdated > STALENESS_THRESHOLD) {
      revert StaleL2SequencerFeed();
    }

    (
      /*uint80 roundID*/,
      int price,
      /*uint startedAt*/,
      /*uint timeStamp*/,
      /*uint80 answeredInRound*/
    ) = priceFeed.latestRoundData();
    return price;
  }
}