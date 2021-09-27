---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Data Feeds Best Practices'
permalink: 'docs/data-feeds-best-practices/'
---

Below are some of the practices for using Chainlink Data Feeds.

## Getting a different price denomination

Chainlink Price Feeds can be used in combination to derive denominated price pairs in other currencies.

If you require a denomination other than what is provided, you can use two price feeds to derive the pair that you need. For example, if you needed an BTC / EUR price, you could take the BTC / USD feed and the EUR / USD feed and derive BTC / EUR using [OpenZeppelin's SafeMath](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol) division.

![Request Model Diagram](/files/price-feed-conversion-equation.gif)


```solidity
using SafeMath for uint256;

function derivedPrice(uint256 priceBTCUSD, uint256 priceEURUSD) public view returns (uint256) {
    return div(priceBTCUSD, priceEURUSD);
}
```
