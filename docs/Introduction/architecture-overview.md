---
layout: nodes.liquid
title: "Architecture Overview"
hidden: false
metadata: 
  title: "Chainlink Architecture Overview"
  image: 
    0: "https://files.readme.io/8d4c52c-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
date: Last Modified
---
[block:callout]
{
  "type": "success",
  "body": "This March, you have the chance to help build the next generation of smart contracts.\n\nThe Chainlink Spring Hackathon has a prize pot of over $80k+ and is sponsored by some of the most prominent crypto projects.\n\nMarch 15th - April 11th\n<a href=\"https://chain.link/hackathon?utm_source=chainlink&utm_medium=developer-docs&utm_campaign=hackathon\" target=\"_blank\"><b>Register Here.</b></a>",
  "title": "Join the Spring 2021 Chainlink Hackathon"
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/906a744-5c0ae00-8c35025-Request__Receive_Data.png",
        "5c0ae00-8c35025-Request__Receive_Data.png",
        3246,
        730,
        "#f1f4fb"
      ]
    }
  ]
}
[/block]
# Basic Request Model

Chainlink connects smart contracts with external data using its decentralized oracle network. Chainlink API requests are handled 1:1 by an oracle.

The [Basic Request Model](doc:architecture-request-model) describes the on-chain architecture of requesting data from a single oracle source.

To learn how to make a GET request using a single oracle, see [Make a GET Request](doc:make-a-http-get-request).

# Decentralized Data Model

For a more robust and trustworthy answer, you can aggregate data from many oracles. With on-chain aggregation, data is aggregated from a decentralized network of independent oracle nodes. This architecture is applied to Chainlink Price Feeds, which aggregate asset price data.

The [Decentralized Data Model](doc:architecture-decentralized-model) describes how data is aggregated, and how consumer contracts can retrieve this data.

To learn how to consume the price of ETH in your smart contract, see [Get the Latest Price](doc:get-the-latest-price).