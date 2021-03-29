---
layout: nodes.liquid
title: "CoinMarketCap Chainlink (Ethereum Mainnet)"
slug: "coinmarketcap-chainlink-ethereum-mainnet"
hidden: false
date: Last Modified
---
This Chainlink supports the <a href="https://pro.coinmarketcap.com/api/v1#operation/getV1CryptocurrencyQuotesLatest" target="_blank">latest market quotes</a> endpoint for any coin and market supported by CoinMarketCap. The <a href="https://pro.coinmarketcap.com/api/v1#" target="_blank">CoinMarketCap Professional API</a> is a suite of high-performance RESTful JSON endpoints that are specifically designed to meet the mission-critical demands of application developers, data scientists, and enterprise business platforms.
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

### <a href="https://chain.link" target="_blank">Chainlink</a>
Oracle address: 0x89f70fA9F439dbd0A1BC22a09BEFc56adA04d9b4
JobID: f1805afed6a0482bb43702692ff9e061
Price: 0.1 LINK
[block:api-header]
{
  "title": "Use the Detailed Documentation for this Chainlink"
}
[/block]
See the [CoinMarketCap Chainlink (Testnet)](doc:coinmarketcap#section-create-your-chainlinked-contract) for documentation on how to use this Chainlink. It is **strongly suggested** that you develop your smart contracts in a testing environment first, before deploying to main net.