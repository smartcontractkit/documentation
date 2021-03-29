---
layout: nodes.liquid
title: "CryptoCompare Chainlink (Ethereum Mainnet)"
slug: "cryptocompare-chainlink-ethereum-mainnet"
hidden: false
date: Last Modified
---
CryptoCompare provides a <a href="https://min-api.cryptocompare.com/" target="_blank">free API</a> for getting cryptocurrency live pricing data, OHLC historical data, volume data or tick data from multiple exchanges. You can also get free aggregated news and block explorer data (supply, hashrate, latest block number etc).
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
JobID: 513907f96955437a8ac02a5d70e5bdea
Price: 0.1 LINK
[block:api-header]
{
  "title": "Use the Detailed Documentation for this Chainlink"
}
[/block]
See the [CryptoCompare Chainlink (Testnet)](doc:cryptocompare#section-create-your-chainlinked-contract) for documentation on how to use this Chainlink. It is **strongly suggested** that you develop your smart contracts in a testing environment first, before deploying to main net.