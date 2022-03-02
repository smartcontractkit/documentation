---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Install Frameworks"
permalink: "docs/create-a-chainlinked-project/"
whatsnext: {"Introduction to Data Feeds":"/docs/using-chainlink-reference-contracts/", "Introduction to Chainlink VRF":"/docs/chainlink-vrf/", "Introduction to Using Any API":"/docs/request-and-receive-data/"}
---
![Starter Kits Logos](/files/c6e99c5-Untitled_design_23.png)

This page explains how to install and use the [Chainlink Library](../chainlink-framework/) in your projects, either manually or via the user of the Chainlink Starter Kits.

> 📘 Important
>
> If you're new to smart contract development and want a step-by-step guide, try out our [Getting Started](/docs/conceptual-overview/) guide.

# Install into Existing Projects

Chainlink is supported by [Hardhat](http://hardhat.org), [Brownie](https://eth-brownie.readthedocs.io/en/stable), [Truffle](https://www.trufflesuite.com) and other frameworks.

If you already have a project, you can add Chainlink to it by using the following package managers.

## NPM

Install using [NPM](https://www.npmjs.com/):

```shell npm
npm install @chainlink/contracts --save
```

## Yarn

Install using [Yarn](https://yarnpkg.com/):

```shell yarn
yarn add @chainlink/contracts
```

# Create a New Project

If you're creating a new project from scratch, these commands will help you set up your project to interact with Chainlink tools and features via the use of our Starter Kits.

## Hardhat Starter Kit

To learn more about Hardhat, see the [Hardhat Documentation](https://hardhat.org/getting-started/).

Clone the starter kit. The starter kit includes Hardhat, so you don't need to install it separately.

```shell
git clone https://github.com/smartcontractkit/hardhat-starter-kit
cd hardhat-starter-kit
```

For instructions about how to use the starter kit, see the [Hardhat starter kit README](https://github.com/smartcontractkit/hardhat-starter-kit/blob/main/README.md).

For more information on how to use Chainlink with Hardhat, see our blog post [How to use Hardhat with Chainlink](https://blog.chain.link/using-chainlink-with-hardhat/).
___

## Brownie Starter Kit

Before you begin, [install Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html).

With Brownie installed, run the commands below to open a Brownie project in a new directory.

```shell
mkdir MyChainlinkProject
cd MyChainlinkProject/
brownie bake chainlink-mix
cd chainlink-mix
```
For instructions about how to use the starter kit, see the [Brownie starter kit README](https://github.com/smartcontractkit/chainlink-mix/blob/master/README.md).

For more information on how to use Chainlink with Brownie, see our blog post [Develop a DeFi Project Using Python](https://blog.chain.link/develop-python-defi-project/).
___

## Truffle Starter Kit

Before you begin, [install Truffle with NPM](https://www.trufflesuite.com/truffle):

```shell
npm install truffle -g
```

Once installed, unbox the Truffle Starter Kit:

```shell Truffle
mkdir MyChainlinkProject
cd MyChainlinkProject/
truffle unbox smartcontractkit/truffle-starter-kit
```

For instructions about how to use the starter kit, see the [Truffle starter kit README](https://github.com/smartcontractkit/truffle-starter-kit/blob/master/README.md).

For more details on how to use Chainlink with Truffle, see our blog post [Using Truffle to interact with Chainlink Smart Contracts](https://www.trufflesuite.com/blog/using-truffle-to-interact-with-chainlink-smart-contracts).
___


# Using Chainlink Contracts

Once you have the Chainlink library installed, you can leverage the Chainlink ecosystem.

If you're interested in retrieving up to date crypto prices in your contracts, learn more about our [Data Feeds](../using-chainlink-reference-contracts/).

If you need to consume randomness in your contracts, learn about [Chainlink VRF](../chainlink-vrf/).

And if you want your contracts to retrieve data from off-chain APIs, learn about [Using Any API](../request-and-receive-data/).

# Testing Chainlink Contracts

See our blog post on [Testing Chainlink Smart Contracts](https://blog.chain.link/testing-chainlink-smart-contracts/) or watch the [Chainlink Hackathon Workshop](https://www.youtube.com/watch?v=d8SqLaH8pu0).

Tests samples can be found on [Hardhat Starter Kit](https://github.com/smartcontractkit/hardhat-starter-kit/tree/main/test) and [Truffle Starter Kit](https://github.com/smartcontractkit/truffle-starter-kit/tree/master/test) respectively.
