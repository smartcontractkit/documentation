---
layout: ../../../layouts/MainLayout.astro
section: ethereum
date: Last Modified
title: "NFT Floor Pricing Feeds"
permalink: "docs/data-feeds/nft-floor-price/"
whatsnext:
  {
    "Learn how to read answers from Data Feeds": "/data-feeds/price-feeds/",
    "Find contract addresses for NFT Floor Pricing Feeds": "/data-feeds/nft-floor-price/addresses/",
  }
---

Chainlink NFT Floor Pricing Feeds provide a conservative and risk averse floor price estimate for an NFT collection. These feeds operate the same way as other Chainlink Data Feeds. NFT Floor Pricing Feeds are supported by [Coinbase Cloud’s](https://www.coinbase.com/cloud/) aggregation algorithm and Chainlink’s oracle infrastructure to help eliminate extreme price outliers and make these feeds resistant to market manipulation. You can use NFT Floor Pricing Feeds for use cases that rely on high-quality NFT data, including lending and borrowing, on-chain derivatives, dynamic NFTs, gaming guilds, CeFi products, prediction markets, and more.

Find the list of testnet feeds on the [Contract Addresses](/data-feeds/nft-floor-price/addresses/) page. To sign up for access to NFT Floor Pricing feeds on Ethereum Mainnet, [use this TypeForm](https://chainlinkcommunity.typeform.com/nft-price-feeds).

## Using NFT Floor Pricing Feeds

Read answers from NFT Floor Pricing Feeds the same way that you use [Price Feeds](/data-feeds/price-feeds/).

Using Solidity, your smart contract should reference [`AggregatorV3Interface`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol), which defines the external functions implemented by Data Feeds.

::solidity-remix[samples/PriceFeeds/NFTFloorPriceConsumerV3.sol]
