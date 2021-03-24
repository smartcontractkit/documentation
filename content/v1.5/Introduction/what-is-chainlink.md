---
title: "What is Chainlink?"
slug: "what-is-chainlink"
hidden: true
metadata: 
  image: 
    0: "https://files.readme.io/eb786d1-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
createdAt: "2020-03-19T16:17:04.105Z"
updatedAt: "2020-09-28T15:24:01.743Z"
---
Chainlink is a general-purpose framework for building decentralized oracle networks that give your smart contract access to secure and reliable data inputs and outputs.

Each decentralized oracle network consists of a collection of independent node operators, a method for aggregating data, and pre-made "Chainlinks" (also called external adaptor) that act as middleware to give you access to any API you want to leverage for data and/or external services.

You can take advantage of existing oracle networks, such as our <a href="https://feeds.chain.link/" target="_blank" rel="noreferrer, noopener">Price Reference Data feeds for DeFi</a>, providing highly accurate market prices, or you can build your own oracle network and external adaptor.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/9f3fac5-connected-diagram-iso-01.png",
        "connected-diagram-iso-01.png",
        1275,
        309,
        "#f5f6f8"
      ],
      "caption": ""
    }
  ]
}
[/block]
Chainlink currently provides decentralization at both the oracle and data source level. By using multiple independent Chainlink nodes, the user can protect against one oracle being a single point of failure. Similarly, using multiple data sources for sourcing market prices, the user can protect against one data source being a single source of truth. Both of these ensure that the oracle mechanism triggering your important smart contract is as secure and reliable as the underlying blockchain.
 
You can use Chainlink to connect to data providers, web APIs, enterprise systems, cloud providers, IoT devices, payment systems, other blockchains and much more.