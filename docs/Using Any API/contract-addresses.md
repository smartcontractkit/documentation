---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Contract Addresses"
permalink: "docs/decentralized-oracles-ethereum-mainnet/"
---
# Overview

This page details example addresses and jobs that are supported by oracles on various networks, so you can test your implementation quickly and easily.

For a comprehensive list of data providers, oracles, jobs, adapters, and more, visit <a href="https://market.link/" target="_blank">Chainlink Market</a>.

![Chainlink Market Logo](/files/afe3efe-marketlink.jpg)

# Mainnet

> 🚧 Important
> 
> We strongly recommend that you deploy to a [testnet](#testnets) first, then move to mainnet.
LINK address:  [`0x514910771af9ca656af840dff83e8264ecf986ca`](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca)

Head to [Chainlink Market](https://market.link/) for the latest Node and Job details.

# Testnets

Each request on the test networks cost 0.1 LINK. Each oracle will wait for 3 confirmations before processing a request.

These are examples which enable you to deploy and test quickly. Many more testnet oracle nodes and jobs can be found on [Chainlink Market](https://market.link/).

## Kovan

Kovan LINK address: [`0xa36085F69e2889c224210F603D836748e7dC0088`](https://kovan.etherscan.io/address/0xa36085F69e2889c224210F603D836748e7dC0088)

For Faucet details, please refer to [LINK Token Contracts](../link-token-contracts/).

|Chainlink Node Operator|Oracle Address|
|-------------------------|--------------------------------------------|
|[Chainlink](https://chain.link)|[`0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8`](https://kovan.etherscan.io/address/0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8)|

<br>

|Adapters|Job ID|Parameters|
|--------------------------------|----------------------------------|--------------------------------------------------------------|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters/#jsonparse)<br>[EthBytes32](../core-adapters/#ethbytes32)|`7401f318127148a894c00c292e486ffd `|`get` (string)<br>`path` (dot-delimited string or array of strings)|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters#jsonparse)<br>[Multiply](../core-adapters/#multiply)<br>[EthInt256](../core-adapters/#ethint256)|`83ba9ddc927946198fbd0bf1bd8a8c25 `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters#jsonparse)<br>[Multiply](../core-adapters/#multiply)<br>[EthUint256](../core-adapters/#ethuint256)|`d5270d1c311941d0b08bead21fea7747 `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters/#jsonparse)<br>[EthBool](../core-adapters/#ethbool)|`bc746611ebee40a3989bbe49e12a02b9 `|`get` (string)<br>`path` (dot-delimited string or array of strings)|

## Rinkeby

> ❗️ Maintanence
> 
> Currently, Rinkeby is in maintenance mode. Please use other environments (e.g. Kovan) to perform tests.

Rinkeby LINK address:  [`0x01BE23585060835E02B77ef475b0Cc51aA1e0709`](https://rinkeby.etherscan.io/address/0x01BE23585060835E02B77ef475b0Cc51aA1e0709)

For Faucet details, please refer to [LINK Token Contracts](../link-token-contracts/).

|Chainlink Node Operator|Oracle Address|
|-------------------------|--------------------------------------------|
|[Chainlink](https://chain.link)|[`0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e`](https://rinkeby.etherscan.io/address/0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e)|

<br>

|Adapters|Job ID|Parameters|
|--------------------------------|----------------------------------|--------------------------------------------------------------|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters/#jsonparse)<br>[EthBytes32](../core-adapters/#ethbytes32)|`b0bde308282843d49a3a8d2dd2464af1`|`get` (string)<br>`path` (dot-delimited string or array of strings)|
|[HttpPost](../core-adapters/#httppost)<br>[JsonParse](../core-adapters/#jsonparse)<br>[EthBytes32](../core-adapters/#ethbytes32)|`c28c092ad6f045c79bdbd54ebb42ce4d `|`post` (string)<br>`path` (dot-delimited string or array of strings)|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters#jsonparse)<br>[Multiply](../core-adapters/#multiply)<br>[EthInt256](../core-adapters/#ethint256)|`c8084988f0b54520ba17945c4a2ab7bc `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters#jsonparse)<br>[Multiply](../core-adapters/#multiply)<br>[EthUint256](../core-adapters/#ethuint256)|`6d1bfe27e7034b1d87b5270556b17277 `|`get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional)|
|[HttpGet](../core-adapters/#httpget)<br>[JsonParse](../core-adapters/#jsonparse)<br>[EthBool](../core-adapters/#ethbool)|`4ce9b71a1ac94abcad1ff9198e760b8c`|`get` (string)<br>`path` (dot-delimited string or array of strings)|