import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract SVRConsumer {
  AggregatorV3Interface internal svrFeed;

  constructor(
    address _svrFeedAddress
  ) {
    svrFeed = AggregatorV3Interface(_svrFeedAddress);
  }

  function getLatestPrice() public view returns (int256) {
    (, /* uint80 roundID */
      int256 price,/* uint256 startedAt */
      /* uint256 timeStamp */
      /* uint80 answeredInRound */,,
    ) = svrFeed.latestRoundData();
    return price;
  }
}
