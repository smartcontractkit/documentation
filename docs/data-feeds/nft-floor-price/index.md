---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "NFT Floor Pricing Feeds"
permalink: "docs/data-feeds/nft-floor-price/"
whatsnext: {
  "Learn how to read answers from Data Feeds":"/docs/data-feeds/price-feeds/",
  "Find contract addresses for NFT Floor Pricing Feeds":"/docs/data-feeds/nft-floor-price/addresses/"
}
---

Chainlink NFT Floor Pricing Feeds provide the lowest price of an NFT in a collection. These feeds operate the same way as other Chainlink Data Feeds. NFT Floor Pricing Feeds are supported by [Coinbase Cloud’s](https://www.coinbase.com/cloud/) aggregation algorithm and Chainlink’s oracle infrastructure to help eliminate extreme price outliers and make these feeds resistant to market manipulation. You can use NFT Floor Pricing Feeds for use cases that rely on high-quality NFT data, including lending and borrowing, on-chain derivatives, dynamic NFTs, gaming guilds, CeFi products, prediction markets, and more.

Find the list of testnet feeds on the [Contract Addresses](/docs/data-feeds/nft-floor-price/addresses/) page. To sign up for access to NFT Floor Pricing feeds on Ethereum Mainnet, [use this TypeForm](https://chainlinkcommunity.typeform.com/nft-price-feeds).

## Using NFT Floor Pricing Feeds

Read answers from NFT Floor Pricing Feeds the same way that you use [Price Feeds](/docs/data-feeds/price-feeds/).

Using Solidity, your smart contract should reference [`AggregatorV3Interface`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol), which defines the external functions implemented by Data Feeds.

```solidity Goerli
{% include 'samples/PriceFeeds/NFTFloorPriceConsumerV3.sol' %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/NFTFloorPriceConsumerV3.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>