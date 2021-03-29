---
layout: nodes.liquid
title: "ENS"
slug: "ens"
excerpt: "Ethereum Name Service"
hidden: false
date: Last Modified
---
Chainlink is moving to the <a href="https://docs.ens.domains/" target="_blank">Ethereum Name Service (ENS)</a> as the source of truth for Price Feed addresses. ENS is a distributed, open, and extensible naming system based on the Ethereum blockchain, which eliminates the need to copy or type long addresses. Instead, addresses can be retrieved inside deployed code.

# Naming Structure

Chainlink price feeds fall under the `data.eth` naming suffix. To obtain a specific feed address, prefix this with the assets in the feed, separated by a dash (-).

|Pair|ENS Domain Name|
|:---|:---|
|ETH / USD|`eth-usd.data.eth`|
|BTC / USD|`btc-usd.data.eth`|
|...|`...`|

## Subdomains

By default, the base name structure (`eth-usd.data.eth`) returns the proxy address for that feed. However, subdomains enable callers to retrieve other associated contract addresses, as shown in the following table.

|Contract Addresses|Subdomain Prefix|Example|
|:-----------|:------------------|:---------|
|Proxy|`proxy`|`proxy.eth-usd.data.eth`|
|Underlying aggregator|`aggregator`|`aggregator.eth-usd.data.eth`|
|Proposed aggregator|`proposed`|`proposed.eth-usd.data.eth`|

# Obtaining Addresses

## Javascript

The example below uses Javascript Web3 library to interact with ENS. See the <a href="https://docs.ens.domains/dapp-developer-guide/resolving-names" target="_blank">ENS documentation</a> for the full list of languages and libraries libraries that support ENS.

This example logs the address of the ETH / USD price feed on the Ethereum mainnet.

```javascript
const Web3 = require("web3");

const web3 = new Web3("https://mainnet.infura.io/v3/<api_key>");
web3.eth.ens.getAddress('eth-usd.data.eth')
  .then((address) => {
    console.log(address)
  })
```

## Solidity

In Solidity, the address of the ENS registry must be known. According to <a href="https://docs.ens.domains/ens-deployments" target="_blank">ENS documentation</a>, this address is the same across Mainnet, Ropsten, Rinkeby and Goerli networks:

ENS registry address: <a href="https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" target="_blank">`0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`</a>.

Also, instead of using readable string names like `eth-usd.data.eth`, resolvers accept bytes32 hash IDs for names. Hash IDs can currently be retrieved from <a href="https://thegraph.com/explorer/subgraph/ensdomains/ens" target="_blank">this subgraph</a>.

"ETH / USD" hash: `0xf599f4cd075a34b92169cf57271da65a7a936c35e3f31e854447fbb3e7eb736d`

```javascript
pragma solidity ^0.6.0;

// ENS Registry Contract
interface ENS {
    function resolver(bytes32 node) external view returns (Resolver);
}

// Chainlink Resolver
interface Resolver {
    function addr(bytes32 node) external view returns (address);
}

// Consumer contract
contract ENSConsumer {
    ENS ens;

    // ENS registry address: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
    constructor(address ensAddress) public {
        ens = ENS(ensAddress);
    }
    
    // Use ID Hash instead of readable name
    // ETH / USD hash: 0xf599f4cd075a34b92169cf57271da65a7a936c35e3f31e854447fbb3e7eb736d
    function resolve(bytes32 node) public view returns(address) {
        Resolver resolver = ens.resolver(node);
        return resolver.addr(node);
    }
}
```