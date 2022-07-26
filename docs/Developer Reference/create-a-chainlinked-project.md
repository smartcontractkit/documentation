---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Install Frameworks'
permalink: 'docs/create-a-chainlinked-project/'
whatsnext:
  {
    'Introduction to Data Feeds': '/docs/using-chainlink-reference-contracts/',
    'Introduction to Chainlink VRF': '/docs/vrf/v2/introduction/',
    'Introduction to Using Any API': '/docs/request-and-receive-data/',
  }
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

For instructions on how to use the starter kit, refer to the [Hardhat starter kit README](https://github.com/smartcontractkit/hardhat-starter-kit/blob/main/README.md).

For more details on how to use Chainlink with Hardhat, see our blog post about [How to use Hardhat with Chainlink](https://blog.chain.link/using-chainlink-with-hardhat/).

---

## Brownie Starter Kit

Before you begin, [install Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html).

With Brownie installed, run the commands below to open a Brownie project in a new directory.

```shell
mkdir MyChainlinkProject
cd MyChainlinkProject/
brownie bake chainlink-mix
cd chainlink-mix
```

For instructions on how to use the starter kit, refer to the [Brownie starter kit README](https://github.com/smartcontractkit/chainlink-mix/blob/master/README.md).

For more details on how to use Chainlink with Brownie, see the [Develop a DeFi Project Using Python](https://blog.chain.link/develop-python-defi-project/) blog post.

---

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

For instructions on how to use the starter kit, refer to the [Truffle starter kit README](https://github.com/smartcontractkit/truffle-starter-kit/blob/master/README.md).

For more details on how to use Chainlink with Truffle, see our blog post about [Using Truffle to interact with Chainlink Smart Contracts](https://www.trufflesuite.com/blog/using-truffle-to-interact-with-chainlink-smart-contracts).

---

## DappTools Starter Kit

To learn more about DappTools, refer to the [DappTools Documentation](https://dapp.tools/).

1. Install Dapp tools using the [Installation instructions](https://github.com/dapphub/dapptools#installation) in the Dapp tools GitHub repository.

1. After you install the tools, clone the starter kit and install the dependencies:

   ```shell
   git clone https://github.com/smartcontractkit/dapptools-starter-kit
   cd dapptools-starter-kit
   make # This installs the project's dependencies.
   ```

For instructions on how to use the starter kit, refer to the DappTools starter kit [README](https://github.com/smartcontractkit/dapptools-starter-kit#readme).

For more details on how to use Chainlink with DappTools, see the [How To Use DappTools](https://blog.chain.link/how-to-use-dapptools/) blog post.

---

## Foundry Starter Kit

To learn more about Foundry, refer to the [Foundry Documentation](https://onbjerg.github.io/foundry-book/).

1. Install Foundry using the [Installation instructions](https://onbjerg.github.io/foundry-book/getting-started/installation.html) on GitHub.io.

1. After you install Foundry, clone the starter kit and install the project dependencies:

   ```shell
   git clone https://github.com/smartcontractkit/foundry-starter-kit
   cd foundry-starter-kit
   make # This installs the project's dependencies.
   ```

For instructions on how to use the starter kit, refer to the [Foundry starter kit README](https://github.com/smartcontractkit/foundry-starter-kit#readme).

---

# Using Chainlink Contracts

Once you have the Chainlink library installed, you can leverage the Chainlink ecosystem.

If you're interested in retrieving up to date crypto prices in your contracts, learn more about our [Data Feeds](../using-chainlink-reference-contracts/).

If you need to consume randomness in your contracts, learn about [Chainlink VRF](/docs/vrf/v2/introduction/).

And if you want your contracts to retrieve data from off-chain APIs, learn about [Using Any API](../request-and-receive-data/).

# Testing Chainlink Contracts

See our blog post on [Testing Chainlink Smart Contracts](https://blog.chain.link/testing-chainlink-smart-contracts/) or watch the [Chainlink Hackathon Workshop](https://www.youtube.com/watch?v=d8SqLaH8pu0).

Tests samples can be found on [Hardhat Starter Kit](https://github.com/smartcontractkit/hardhat-starter-kit/tree/main/test) and [Truffle Starter Kit](https://github.com/smartcontractkit/truffle-starter-kit/tree/master/test) respectively.
