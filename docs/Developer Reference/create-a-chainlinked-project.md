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

Chainlink is supported by <a href="http://hardhat.org" target="_blank">Hardhat</a>, <a href="https://eth-brownie.readthedocs.io/en/stable" target="_blank">Brownie</a>, <a href="https://www.trufflesuite.com" target="_blank">Truffle</a> and other frameworks.

If you already have a project, you can add Chainlink to it by using the following package managers.

## NPM

Install using <a href="https://www.npmjs.com/" target="_blank" rel="noreferrer, noopener">NPM</a>

```shell npm
npm install @chainlink/contracts --save
```

## Yarn

Install using <a href="https://yarnpkg.com/" target="_blank" rel="noreferrer, noopener">Yarn</a>

```shell yarn
yarn add @chainlink/contracts
```

# Create a New Project

If you're creating a new project from scratch, these commands will help you set up your project to interact with Chainlink tools and features via the use of our Starter Kits.

## Hardhat Starter Kit

It's recommended that you are familiar with [hardhat](https://hardhat.org/getting-started/) before proceeding. 

Clone the starter kit

```shell
git clone https://github.com/smartcontractkit/hardhat-starter-kit
cd hardhat-starter-kit
```

Visit the <a href="https://github.com/smartcontractkit/hardhat-starter-kit/blob/main/README.md" target="_blank">Hardhat starter kit README</a> for more instructions.

For more information on how to use Chainlink with Hardhat, see our blog post <a href="https://blog.chain.link/using-chainlink-with-hardhat/" target="_blank">How to use Hardhat with Chainlink</a>.
___

## Brownie Starter Kit

Make sure to [install Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html).

With Brownie installed, run the commands below to open a Brownie project into a new directory.

```shell
mkdir MyChainlinkProject
cd MyChainlinkProject/
brownie bake chainlink-mix
cd chainlink-mix
```
Visit the <a href="https://github.com/smartcontractkit/chainlink-mix/blob/master/README.md" target="_blank">Brownie starter kit README</a> for more instructions.

For more information on how to use Chainlink with Brownie, see our blog post <a href="https://blog.chain.link/develop-python-defi-project/" target="_blank"  rel="noreferrer, noopener">Develop a DeFi Project Using Python</a>.
___

## Truffle Starter Kit

Install <a href="https://www.trufflesuite.com/truffle" target="_blank" rel="noreferrer, noopener">Truffle</a> with NPM:

```shell
npm install truffle -g
```

Once installed, unbox the Truffle Starter Kit.

```shell Truffle
mkdir MyChainlinkProject
cd MyChainlinkProject/
truffle unbox smartcontractkit/truffle-starter-kit
```

Visit the <a href="https://github.com/smartcontractkit/truffle-starter-kit/blob/master/README.md" target="_blank">Truffle starter kit README</a> for more instructions.

For more details on how to use the Truffle, see our blog post <a href="https://www.trufflesuite.com/blog/using-truffle-to-interact-with-chainlink-smart-contracts" target="_blank">Using Truffle to interact with Chainlink Smart Contracts</a>.
___


# Using Chainlink Contracts

Once you have the Chainlink library installed, you can leverage the Chainlink ecosystem.

If you're interested in retrieving up to date crypto prices in your contracts, learn more about our [Data Feeds](../using-chainlink-reference-contracts/).

If you need to consume randomness in your contracts, learn about [Chainlink VRF](../chainlink-vrf/).

And if you want your contracts to retrieve data from off-chain APIs, learn about [Using Any API](../request-and-receive-data/).

# Testing Chainlink Contracts

See our blog post on <a href="https://blog.chain.link/testing-chainlink-smart-contracts/" target="_blank">Testing Chainlink Smart Contracts</a> or watch the <a href="https://www.youtube.com/watch?v=d8SqLaH8pu0" target="_blank">Chainlink Hackathon Workshop</a>.

Tests samples can be found on <a href="https://github.com/smartcontractkit/hardhat-starter-kit/tree/main/test" target="_blank">Hardhat Starter Kit</a> and <a href="https://github.com/smartcontractkit/truffle-starter-kit/tree/master/test" target="_blank">Truffle Starter Kit</a> respectively.
