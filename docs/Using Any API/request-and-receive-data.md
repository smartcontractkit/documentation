---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Introduction to Using Any API"
permalink: "docs/request-and-receive-data/"
whatsnext: {"Make a GET Request":"/docs/make-a-http-get-request/","Make an Existing Job Request":"/docs/existing-job-request/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
metadata: 
  title: "Request and Receive API Data with Chainlink"
  description: "Chainlink provides your smart contract with access to any external API. Learn how to integration any API into your smart contract."
  image: 
    0: "/files/bc12c34-link.png"
---
![Chainlink Any API](/files/8c35025-Request__Receive_Data.png)

# Call Any External API

> 📘 Note
> 
> If your smart contracts need access to price data, try using [Chainlink Data Feeds](../using-chainlink-reference-contracts/).

Chainlink enables your contracts to access to *any* external data source, through our decentralized oracle network.

Whether your contract requires sports results, the latest weather, or any other publicly available data, the <a href="https://github.com/smartcontractkit/chainlink/tree/master/contracts" target="_blank">Chainlink contract library</a> provides the tools required for your contract to consume it.

# Connect Your Smart Contracts to the Outside World

We understand that building smart contracts is difficult enough as it is, and making your contracts compatible with off-chain data just adds to the complexity. Therefore, we created a framework with minimal requirements, yet unbounded flexibility, so you can focus more on the functionality of your smart contracts rather than what feeds them.

Chainlink’s decentralized oracle network provides smart contracts with the ability to push and pull data, facilitating the interoperability between on-chain and off-chain applications.

Learn how to [Make a GET Request](../make-a-http-get-request/) from your smart contract.