---
layout: nodes.liquid
title: "Random.org Chainlink (Ethereum Mainnet)"
slug: "randomorg-chainlink-ethereum-mainnet"
hidden: true
date: Last Modified
---
Chainlink has a dedicated connection to <a href="https://www.random.org/" target="_blank">Random.org's API</a>. This Chainlink will retrieve a single random number to return to your smart contract.
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
JobID: 85e21af0bcfb45d5888851286d57ce0c
Price: 0.1 LINK
[block:api-header]
{
  "title": "Use the Detailed Documentation for this Chainlink"
}
[/block]
See the [Random.org Chainlink (Testnet)](doc:randomorg-chainlink-testnet#section-create-your-chainlinked-contract) for documentation on how to use this Chainlink. It is **strongly suggested** that you develop your smart contracts in a testing environment first, before deploying to main net.