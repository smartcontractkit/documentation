---
layout: nodes.liquid
title: "Kaiko Chainlink (Testnet)"
slug: "kaiko-chainlink-testnet"
hidden: false
date: Last Modified
---
This Chainlink has a dedicated connection to Kaiko's API. Kaiko is the leading provider of institutional grade cryptocurrency market data.

This Chainlink currently supports <a href="https://docs.kaiko.com/#recent-aggregated-price-direct-exchange-rate" target="_blank">recent direct exchange rates</a>, <a href="https://docs.kaiko.com/#recent-count-ohlcv-vwap-period-alpha-release" target="_blank">recent trade aggregates</a>, and <a href="https://docs.kaiko.com/#recent-trades" target="_blank">recent trades</a> for all supported exchanges and instruments.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
  - <a href="https://kovan.chain.link/" target="_blank">Kovan faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `Chainlinked.sol` into your contract so you can inherit the `Chainlinked` behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract KaikoChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Constructor"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
- [Kaiko](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
Parameters are required unless specifically marked as optional:
- `region`:  (string) `us` or `eu`.
- `endpoint`: (string) URI excluding domain and query string.
- `params`: (string, optional) Query string
- `times`: (int) See [Multiply](doc:adapters#section-multiply) adapter
- `copyPath`: (string or array of strings) See [Copy](doc:adapters#section-copy) adapter

Refer to the <a href="https://docs.kaiko.com/#market-data-api" target="_blank">Kaiko Market Data API documentation</a> for how to construct endpoints and params. For information on available exchanges and instruments, refer to the <a href="https://docs.kaiko.com/#reference-data-api" target="_blank">Kaiko Reference Data API documentation</a> or <a href="https://instruments.kaiko.com/" target="_blank">Instrument Explorer</a>.
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
We have provided a full <a href="https://gist.github.com/Legogris/3a4dac51976ab5f32aa118715ed44178#file-kaikomarketdataconsumer-sol-L985" target="_blank">example Chainlinked Contract</a> to request the most recent spot price for a given asset pair.

This example shows how to create the request for the Chainlink node:
[block:code]
{
  "codes": [
    {
      "code": "function requestSpotPrice\n(\n  address _oracle,\n  bytes32 _jobId\n) \n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"region\", \"us\");\n  req.add(\"endpoint\", \"v1/data/trades.v1/spot_direct_exchange_rate/btc/usdt/recent\");\n  req.add(\"params\", \"interval=1m&limit=2\");\n  req.addInt(\"times\", 100);\n  req.add(\"copyPath\", \"data.-1.price\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Request"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public currentPrice;\n\nfunction fulfill(bytes32 _requestId, uint256 _price)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  currentPrice = _price;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]