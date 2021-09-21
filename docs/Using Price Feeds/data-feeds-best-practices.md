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

In the event you require a denomination other than what is provided, two price feeds can be used to derive the pair you need. For example, if you needed an BTC / EUR price, you could take the BTC / USD feed and the EUR / USD feed and derive BTC / EUR using <a href="https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol" target="_blank">OpenZeppelin's SafeMath</a> division.

![Request Model Diagram](/files/price-feed-conversion-equation.gif)


```solidity
using SafeMath for uint256;

function derivedPrice(uint256 priceBTCUSD, uint256 priceEURUSD) public view returns (uint256) {
    return div(priceBTCUSD, priceEURUSD);
}
```
