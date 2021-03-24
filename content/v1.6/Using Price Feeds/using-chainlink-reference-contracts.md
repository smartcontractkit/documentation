---
title: "Introduction to Price Feeds"
slug: "using-chainlink-reference-contracts"
hidden: false
metadata: 
  title: "How to Use Chainlink Decentralized Price Feeds in Smart Contracts"
  description: "Add cryptocurrency price data to your smart contract. Chainlink price feeds include BTC/USD, BTC/ETH, ETH/USD and more!"
  image: 
    0: "https://files.readme.io/d2484e7-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
createdAt: "2019-05-29T23:20:19.690Z"
updatedAt: "2021-03-18T11:56:35.649Z"
---
[block:callout]
{
  "type": "success",
  "title": "Join the Spring Chainlink 2021 Hackathon",
  "body": "This March, you have the chance to help build the next generation of smart contracts.\n\nThe Chainlink Spring Hackathon has a prize pot of over $80k+ and is sponsored by some of the most prominent crypto projects.\n\nMarch 15th - April 11th\n<a href=\"https://chain.link/hackathon?utm_source=chainlink&utm_medium=developer-docs&utm_campaign=hackathon\" target=\"_blank\"><b>Register Here.</b></a>"
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2306b8b-Decentralized_Oracles_V3.png",
        "Decentralized Oracles V3.png",
        1558,
        352,
        "#f3f5fc"
      ],
      "caption": ""
    }
  ]
}
[/block]
# Connect Your Smart Contracts to the Outside World

Chainlink Price Feeds are the quickest way to connect your smart contracts to the real-world market prices of assets. They enable smart contracts to retrieve the latest price of an asset in a single call.

# Retrieve the Latest Asset Prices

Often, smart contracts need to act upon prices of assets in real-time. This is especially true in <a href="https://defi.chain.link/" target="_blank">DeFi</a>.

For example, <a href="https://www.synthetix.io/" target="_blank">Synthetix</a> use Price Feeds to determine prices on their derivatives platform. Lending and Borrowing platforms like <a href="https://aave.com/" target="_blank">AAVE</a> use Price Feeds to ensure the total value of the collateral.

The [Decentralized Data Model](doc:architecture-decentralized-model) describes how Price Feeds are aggregated from many data sources and published on-chain.