// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

/**
* THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
* THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
* DO NOT USE THIS CODE IN PRODUCTION.
*/

contract PriceConsumerWithSequencerCheck {

  AggregatorV2V3Interface internal priceFeed;
  AggregatorV2V3Interface internal sequencerUptimeFeed;

  uint256 private constant GRACE_PERIOD_TIME = 3600;

  error SequencerDown();
  error GracePeriodNotOver();

  /**
  * Network: Optimism
  * Data Feed: BTC/USD
  * Data Feed Proxy Address: 0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593
  * Sequencer Uptime Proxy Address: 0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389
  * For a list of available sequencer proxy addresses, see:
  * https://docs.chain.link/docs/data-feeds/l2-sequencer-feeds/#available-networks
  */
  constructor() {
    priceFeed = AggregatorV2V3Interface(0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593);
    sequencerUptimeFeed = AggregatorV2V3Interface(0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389);
  }

  // Check the sequencer status and return the latest price
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

    // Make sure the grace period has passed after the sequencer is back up.
    uint256 timeSinceUp = block.timestamp - startedAt;
    if (timeSinceUp <= GRACE_PERIOD_TIME) {
      revert GracePeriodNotOver();
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