---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Contract Addresses"
permalink: "docs/decentralized-oracles-ethereum-mainnet/"
hidden: false
---
# Overview

This page details example addresses and jobs that are supported by oracles on various networks, so you can test your implementation quickly and easily.

For a comprehensive list of data providers, oracles, jobs, adapters, and more, visit <a href="https://market.link/" target="_blank">Chainlink Market</a>.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/afe3efe-marketlink.jpg",
        "marketlink.jpg",
        113,
        113,
        "#8a92d9"
      ],
      "caption": "<a href=\"https://market.link/\" target=\"_blank\">Chainlink Market</a>",
      "sizing": "smart"
    }
  ]
}
[/block]
# Mainnet

> 🚧
>
> We strongly recommend that you deploy to a [testnet](#testnets) first, then move to mainnet.
LINK address:  <a href="https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca" target="_blank" rel="noreferrer, noopener">`0x514910771af9ca656af840dff83e8264ecf986ca`</a>

Head to <a href="https://market.link/" target="_blank">Chainlink Market</a> for the latest Node and Job details.

# Testnets

Each request on the test networks cost 0.1 LINK. Each oracle will wait for 3 confirmations before processing a request.

These are examples which enable you to deploy and test quickly. Many more testnet oracle nodes and jobs can be found on <a href="https://market.link/" target="_blank">Chainlink Market</a>.

## Kovan

Kovan LINK address:  <a href="https://kovan.etherscan.io/address/0xa36085F69e2889c224210F603D836748e7dC0088" target="_blank">`0xa36085F69e2889c224210F603D836748e7dC0088`</a>

For Faucet details, please refer to [LINK Token Contracts](../link-token-contracts).

|Chainlink Node Operator|Oracle Address|
|-------------------------|--------------------------------------------|
|<a href="https://chain.link" target="_blank">Chainlink</a>|<a href="https://kovan.etherscan.io/address/0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e" target="_blank">`0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e`</a>|

|Adapters|Job ID|Parameters|
|--------------------------------|----------------------------------|--------------------------------------------------------------|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[EthBytes32](../adapters#section-ethbytes32)|`50fc4215f89443d185b061e5d7af9490 `|`get` (string)<br>`path` (dot-delimited string or array of strings)|
|[HttpPost](../adapters#section-httppost)<br>[JsonParse](../adapters#section-jsonparse)<br>[EthBytes32](../adapters#section-ethbytes32)|`b9fd06bb42dd444db1b944849cbffb11 `|`post` (string)<br>`path` (dot-delimited string or array of strings)|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[Multiply](../adapters#secion-multiply)<br>[EthInt256](../adapters#section-ethint256)|`ad752d90098243f8a5c91059d3e5616c `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[Multiply](../adapters#secion-multiply)<br>[EthUint256](../adapters#section-ethuint256)|`29fa9aa13bf1468788b7cc4a500a45b8 `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[EthBool](../adapters#section-ethbool)|`6d914edc36e14d6c880c9c55bda5bc04 `|`get` (string)<br>`path` (dot-delimited string or array of strings)|

## Rinkeby
[block:callout]
{
  "type": "danger",
  "title": "Maintanence",
  "body": "Currently, Rinkeby is in maintenance mode. Please use other environments (e.g. Kovan) to perform tests."
}
[/block]
Rinkeby LINK address:  <a href="https://rinkeby.etherscan.io/address/0x01be23585060835e02b77ef475b0cc51aa1e0709" target="_blank">`0x01be23585060835e02b77ef475b0cc51aa1e0709`</a>

For Faucet details, please refer to [LINK Token Contracts](../link-token-contracts).

|Chainlink Node Operator|Oracle Address|
|-------------------------|--------------------------------------------|
|<a href="https://chain.link" target="_blank">Chainlink</a>|<a href="https://rinkeby.etherscan.io/address/0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e" target="_blank">`0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e`</a>|

|Adapters|Job ID|Parameters|
|--------------------------------|----------------------------------|--------------------------------------------------------------|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[EthBytes32](../adapters#section-ethbytes32)|`b0bde308282843d49a3a8d2dd2464af1`|`get` (string)<br>`path` (dot-delimited string or array of strings)|
|[HttpPost](../adapters#section-httppost)<br>[JsonParse](../adapters#section-jsonparse)<br>[EthBytes32](../adapters#section-ethbytes32)|`c28c092ad6f045c79bdbd54ebb42ce4d `|`post` (string)<br>`path` (dot-delimited string or array of strings)|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[Multiply](../adapters#secion-multiply)<br>[EthInt256](../adapters#section-ethint256)|`c8084988f0b54520ba17945c4a2ab7bc `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[Multiply](../adapters#secion-multiply)<br>[EthUint256](../adapters#section-ethuint256)|`6d1bfe27e7034b1d87b5270556b17277 `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../adapters#section-httpget)<br>[JsonParse](../adapters#section-jsonparse)<br>[EthBool](../adapters#section-ethbool)|`4ce9b71a1ac94abcad1ff9198e760b8c`|`get` (string)<br>`path` (dot-delimited string or array of strings)|