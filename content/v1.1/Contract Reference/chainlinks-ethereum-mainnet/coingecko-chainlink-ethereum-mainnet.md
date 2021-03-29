---
layout: nodes.liquid
title: "CoinGecko Chainlink (Ethereum Mainnet)"
slug: "coingecko-chainlink-ethereum-mainnet"
hidden: false
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://www.coingecko.com/en" target="_blank">CoinGecko's</a> API. In addition to tracking price, volume and market capitalization, CoinGecko tracks community growth, open-source code development, major events and on-chain metrics.
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
JobID: 6916485d575143e989e1f81d921e785d
Price: 0.1 LINK
[block:api-header]
{
  "title": "Use the Detailed Documentation for this Chainlink"
}
[/block]
See the [CoinGecko Chainlink (Testnet)](doc:coingecko-chainlink-testnet#section-create-your-chainlinked-contract) for documentation on how to use this Chainlink. It is **strongly suggested** that you develop your smart contracts in a testing environment first, before deploying to main net.