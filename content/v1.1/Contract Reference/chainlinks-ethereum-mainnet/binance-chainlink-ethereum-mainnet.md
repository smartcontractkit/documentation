---
layout: nodes.liquid
title: "Binance Chainlink (Ethereum Mainnet)"
slug: "binance-chainlink-ethereum-mainnet"
hidden: false
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://github.com/binance-exchange/binance-official-api-docs">Binance's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
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

#### Mainnet
LINK Token address: 0x514910771AF9Ca656af840dff83E8264EcF986CA
Oracle address: 0x89f70fA9F439dbd0A1BC22a09BEFc56adA04d9b4
Bool JobID: 25ee580823694eb1bb8318ebf92ce65d
Bytes32 JobID: 1e647a9cac34420b9bf338adb1cb0e68
Uint256 JobID: 09016552ca8a491aa5dd8e9654992d19
Price: 0.1 LINK
[block:api-header]
{
  "title": "Use the Detailed Documentation for this Chainlink"
}
[/block]
See the [Binance Chainlink (Testnet)](doc:binance-chainlink-testnet#section-create-your-chainlinked-contract) page for documentation on how to use this Chainlink. It is **strongly suggested** that you develop your smart contracts in a testing environment first, before deploying to main net.