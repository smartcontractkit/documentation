---
layout: nodes.liquid
title: "BraveNewCoin Chainlink (Ethereum Mainnet)"
slug: "bravenewcoin-chainlink-ethereum-mainnet"
hidden: false
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://bravenewcoin.com" target="_blank">Brave New Coin's</a> API. Brave New Coin aggregates prices 24/7 for the overall marketplace for cryptographic assets from over 200 exchanges. Currently fresh price points are calculated every 5 minutes and are time-stamped with the date-time for the start of each period.
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
Oracle address: <<MAINNET_CHAINLINK_ORACLE>> 
JobID: b274f037ddb4470d976a7079279bd300
Price: 0.1 LINK
[block:api-header]
{
  "title": "Use the Detailed Documentation for this Chainlink"
}
[/block]
See the [BraveNewCoin Chainlink (Testnet)](doc:bravenewcoin#section-create-your-chainlinked-contract) for documentation on how to use this Chainlink. It is **strongly suggested** that you develop your smart contracts in a testing environment first, before deploying to main net.