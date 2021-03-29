---
layout: nodes.liquid
title: "Kaiko Chainlink (Ethereum Mainnet)"
slug: "kaiko-chainlink-ethereum-mainnet"
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
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project) contract using the network details below
- [Fund your contract](doc:fund-your-contract) 
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following oracle address, and Job ID in order to create the Chainlink request.

### <a href="https://www.kaiko.com" target="_blank">Kaiko</a>
Oracle address: 0x8c85a06EB3854Df0d502B2b00169DBfB8B603Bf3
JobID: 9f62e63ac2424e96aa873a8d43ef600c
Price: 0.05 LINK
[block:api-header]
{
  "title": "Use the Detailed Documentation for this Chainlink"
}
[/block]
See the [Kaiko Chainlink (Testnet)](doc:kaiko-chainlink-testnet#section-create-your-chainlinked-contract) for documentation on how to use this Chainlink. It is **strongly suggested** that you develop your smart contracts in a testing environment first, before deploying to main net.