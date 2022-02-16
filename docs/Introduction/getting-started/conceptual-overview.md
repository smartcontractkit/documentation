---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Chainlink Overview"
permalink: "docs/conceptual-overview/"
excerpt: "Smart Contracts and Chainlink"
whatsnext: {"Deploy Your First Smart Contract":"/docs/deploy-your-first-contract/", "Consuming Data Feeds":"/docs/consuming-data-feeds/"}
metadata:
  title: "Conceptual Overview"
  description: "Learn the basic concepts about what smart contracts are and, how to write them, and how Chainlink oracles work with smart contracts."
  image:
    0: "/files/1a63254-link.png"
---

Welcome to the Smart Contract Getting Started guide. This overview explains the basic concepts of smart contract development and oracle networks.

**Skip ahead**
To get your hands on the code right away, you can skip this overview:
- [Deploy Your First Smart Contract](/docs/deploy-your-first-contract/): If you are new to smart contracts, deploy your first smart contract in an interactive web development environment.
- [Learn how to use Data Feeds](/docs/consuming-data-feeds/): If you are already familiar with smart contracts and want to learn how to create *hybrid* smart contracts, use Chainlink Data Feeds to get asset price data on-chain.

<p>
  https://www.youtube.com/watch?v=rFXSEEQG9YE
</p>

## Table of Contents

+ [What is a smart contract? What is a hybrid smart contract?](#what-is-a-smart-contract-what-is-a-hybrid-smart-contract)
+ [What language is a smart contract written in?](#what-language-is-a-smart-contract-written-in)
+ [What does a smart contract look like?](#what-does-a-smart-contract-look-like)
+ [What does "deploying" mean?](#what-does-deploying-mean)
+ [What is a LINK token?](#what-is-a-link-token)
+ [What are oracles? Why are they important?](#what-are-oracles)
+ [How do smart contracts use oracles?](#how-do-smart-contracts-use-oracles)
+ [What is Remix?](#what-is-remix)
+ [What is Metamask?](#what-is-metamask)

## What is a smart contract? What is a hybrid smart contract?

When deployed to a blockchain, a *smart contract* is a set of instructions that can be executed without intervention from third parties. The smart contract code defines how it responds to input, just like the code of any other computer program.

A valuable feature of smart contracts is that they can store and manage on-chain assets (like [ETH or ERC20 tokens](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)), just like you can with an Ethereum wallet. Because they have an on-chain address like a wallet, they can do everything any other address can. This enables you to program automated actions when receiving and transferring assets.

Smart contracts can connect to real-world market prices of assets to produce powerful applications. Securely connecting smart contracts with off-chain data and services is what makes them *hybrid* smart contracts. This is done using oracles.

## What language is a smart contract written in?

The most popular language for writing smart contracts on Ethereum and EVM Chains is [Solidity](https://docs.soliditylang.org/en/v0.8.7/). It was created by the Ethereum Foundation specifically for smart contract development and is constantly being updated. Other languages exist for writing smart contracts on Ethereum and EVM Chains, but Solidity is the language used for Chainlink smart contracts.

If you've ever written Javascript, Java, or other object-oriented scripting languages, Solidity should be easy to understand. Similar to object-oriented languages, Solidity is considered to be a *contract*-oriented language.

Some networks are not EVM-compatible and use languages other than Solidity for smart contracts:

- [Solana](/solana/)
  - [Writing Solana contracts in Rust](https://docs.solana.com/developing/on-chain-programs/developing-rust)
  - [Writing Solana contracts in C](https://docs.solana.com/developing/on-chain-programs/developing-c)
- [Terra](/terra/)
  - [Writing Terra smart contracts in Rust](https://docs.solana.com/developing/on-chain-programs/developing-rust)

## What does a smart contract look like?

The structure of a smart contract is similar to that of a class in Javascript, with a few differences. For example, the following `HelloWorld` contract is a simple smart contract that stores a single variable and includes a function to update the value of that variable.

```solidity
{% include samples/Tutorials/HelloWorld.sol %}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Tutorials/HelloWorld.sol" target="_blank" >Open in Remix</a>
  <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

### Solidity versions

The first thing that every Solidity file must have is the Solidity version definition. The `HelloWorld.sol` contract uses version `0.8.7`, which is defined in the contract as `pragma solidity 0.8.7;`

You can see the latest versions of the Solidity compiler [here](https://github.com/ethereum/solc-bin/blob/gh-pages/bin/list.txt/?target=_blank). You might also notice smart contracts that are compatible with a range of versions.

```solidity
pragma solidity >=0.7.0 <0.9.0;
```
This means that the code is written for Solidity version 0.7.0, or a newer version of the language up to, but not including version 0.9.0. The `pragma` selects the compiler, which defines how the code is treated.

### Naming a Contract

The `contract` keyword defines the name of the contract, which in this example is `HelloWorld`. This is similar to declaring a `class` in Javascript. The implementation of `HelloWorld` is inside this definition and denoted with curly braces.

```solidity
contract HelloWorld {

}
```

### Variables

Like Javascript, contracts can have state variables and local variables. **State variables** are variables with values that are permanently stored in contract storage. The values of **local variables**, however, are present only until the function is executing. There are also different types of variables you can use within Solidity, such as `string`, `uint256`, etc. Check out the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.7/) to learn more about the different kinds of variables and types.

*Modifiers* are used to change the level of access to these variables. Here are some examples of state variables with different modifiers:

```solidity
string public message;
uint256 internal internalVar;
uint8 private privateVar;
bool external isTrue;
```

### Constructors

Another familiar concept to programmers is the **constructor**. When you deploy a contract, the constructor sets the state of the contract when it is first created.

In `HelloWorld`, the constructor takes in a `string` as a parameter and sets the `message` state variable to that string.

```solidity
constructor(string memory initialMessage) {
  message = initialMessage;
}
```

### Functions

**Functions** can access and modify the state of the contract or call other functions on external contracts. `HelloWorld` has a function named `updateMessage`, which updates the current message stored in the state.

```solidity
constructor(string memory initialMessage) {
  message = initialMessage;
}

function updateMessage(string memory newMessage) public {
  message = newMessage;
}
```

### Interfaces

An **interface** is another concept that is familiar to programmers of other languages. Interfaces define functions without their implementation, which leaves inheriting contracts to define the actual implementation themselves. This makes it easier to know what functions to call in a contract. Here's an example of an interface:

```solidity
{% include samples/Tutorials/Test.sol %}
```
<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Tutorials/Test.sol" target="_blank">Open in Remix</a>
  <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

For this example, `override` is necessary in the `Test` contract function because it overrides the base function contained in the `numberComparison` interface. The contract uses `pure` instead of `view` because the `isSameNum` function in the `Test` contract does not return a storage variable.

## What does "deploying" mean?

**Deploying** a smart contract is the process of pushing the code to the blockchain, at which point it resides with an on-chain address. Once it's deployed, the code cannot be changed and is said to be *immutable*.

As long as the address is known, its functions can be called through an interface, on [Etherscan](https://etherscan.io/), or through a library like [web3js](https://web3js.readthedocs.io/), [web3py](https://web3py.readthedocs.io/), [ethers](https://docs.ethers.io), and more. Contracts can also be written to interact with other contracts on the blockchain.

## What is a LINK token?

The LINK token is an ERC677 token that inherits functionality from the [ERC20 token standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) and allows token transfers to contain a data payload. It is used to pay node operators for retrieving data for smart contracts and also for deposits placed by node operators as required by contract creators.

Any wallet that handles ERC20 tokens can store LINK tokens. The ERC677 token standard that the LINK token implements still retains all functionality of ERC20 tokens.

## What are oracles?

**Oracles** provide a bridge between the real-world and on-chain smart contracts by being a source of data that smart contracts can rely on, and act upon.

Oracles play a critical role in facilitating the full potential of smart contract utility. Without a reliable connection to real-world conditions, smart contracts cannot effectively serve the real-world.

## How do smart contracts use oracles?

Oracles are most popularly used with [*Data Feeds*](../using-chainlink-reference-contracts/). DeFi platforms like [AAVE](https://aave.com/) and [Synthetix](https://www.synthetix.io/) use Chainlink data feed oracles to obtain accurate real-time asset prices in their smart contracts.

Chainlink data feeds are sources of data [aggregated from many independent Chainlink node operators](../architecture-decentralized-model/). Each data feed has an on-chain address and functions that enable contracts to read from that address. For example, the [ETH / USD feed](https://feeds.chain.link/eth-usd/).

![Chainlink Feeds List](/images/contract-devs/price-aggr.png)

Smart contracts also use oracles to get other capabilities on-chain:

- [Generate Verifiable Random Numbers (VRF)](/docs/chainlink-vrf/): Use Chainlink VRF to consume randomness in your smart contracts.
- [Call External APIs (Any API)](/docs/request-and-receive-data/): Request & Receive data from any API using the Chainlink contract library.
- [Automate Smart Contract Functions (Keepers)](/docs/chainlink-keepers/introduction/): Automating smart contract functions and regular contract maintenance.

## What is Remix?

<p>
  https://www.youtube.com/watch?v=JWJWT9cwFbo
</p>

[Remix](https://remix.ethereum.org/) is a web IDE (integrated development environment) for creating, running, and debugging smart contracts in the browser. It is developed and maintained by the Ethereum foundation. Remix allows Solidity developers to write smart contracts without a development machine since everything required is included in the web interface. It allows for a simplified method of interacting with deployed contracts, without the need for a command line interface. Remix also has support for samples. This means that Remix can load code from Github.

To learn how to use Remix, see the [Deploying Your First Smart Contract
](/docs/deploy-your-first-contract/) guide.

<div class="remix-callout">
  <a href="/docs/deploy-your-first-contract/">Deploy Your First Smart Contract</a>
</div>

## What is Metamask?

Contracts are deployed by other addresses on the network. To deploy a smart contract, you need an address. Not only that, but you need an address which you can easily use with Remix. Fortunately, [MetaMask](https://metamask.io) is just what is needed. **Metamask** allows anyone to create an address, store funds, and interact with Ethereum compatible blockchains from a browser extension.
