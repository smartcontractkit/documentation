---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Install Instructions"
permalink: "docs/create-a-chainlinked-project/"
whatsnext: {"Introduction to Data Feeds":"/docs/using-chainlink-reference-contracts/", "Introduction to Chainlink VRF":"/docs/chainlink-vrf/", "Introduction to Using Any API":"/docs/request-and-receive-data/"}
metadata:
  title: "Getting Started with Chainlink for Smart Contract Developers"
  description: "Everything you need to know on how to create a new Chainlink project or update an existing one using the Chainlink Library for Solidity"
  image:
    0: "/files/OpenGraph_V3.png"
---
![Starter Kits Logos](/files/c6e99c5-Untitled_design_23.png)

This page explains how to install and use the [Chainlink Library](../chainlink-framework/) in your projects, either manually or via the user of the Chainlink Starter Kits.

> 📘 Important
>
> If you're new to smart contract development and want a step-by-step guide, try out our [Getting Started Guide](/getting-started/) 

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

Install <a href="https://hardhat.org" target="_blank"> hardhat </a>

```shell
npm install --save-dev hardhat
```

Then, clone the starter kit

```shell
git clone https://github.com/smartcontractkit/hardhat-starter-kit
cd hardhat-starter-kit
```

For more information on Hardhat, see our blog post <a href="https://blog.chain.link/using-chainlink-with-hardhat/" target="_blank">How to use Hardhat with Chainlink</a>. Alternatively, visit the <a href="https://github.com/smartcontractkit/hardhat-starter-kit/blob/main/README.md" target="_blank">repo</a> for more instructions.
___

## Brownie Starter Kit

Install <a href="https://eth-brownie.readthedocs.io/en/stable/install.html" target="_blank" rel="noreferrer, noopener">Brownie</a> with pip:

```shell
pip install eth-brownie
```

With Brownie installed, run the commands below to open a Brownie project into a new directory.

```shell
mkdir MyChainlinkProject
cd MyChainlinkProject/
brownie bake chainlink-mix
cd chainlink-mix
```

For more information on working with Brownie, see our blog <a href="https://blog.chain.link/develop-python-defi-project/" target="_blank"  rel="noreferrer, noopener">how to use Brownie with Chainlink</a> or visit the <a href="https://github.com/smartcontractkit/chainlink-mix/blob/master/README.md" target="_blank" rel="noreferrer, noopener"> repo</a> to learn more.

Environment variables are required when working with Brownie. <a target="_blank" href="https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html">Learn how to set environment variables</a>.
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

For more details on how to use the Truffle, see our <a href="https://www.trufflesuite.com/blog/using-truffle-to-interact-with-chainlink-smart-contracts" target="_blank">blog post</a>. Alternatively, visit the <a href="https://github.com/smartcontractkit/box/blob/master/README.md" target="_blank">repo</a> for more information.
___


# Using Chainlink Contracts

Once you have the Chainlink library installed, you can leverage the Chainlink ecosystem.

If you're interested in retrieving up to date crypto prices in your contracts, learn more about our [Data Feeds](../using-chainlink-reference-contracts/).

If you need to consume randomness in your contracts, learn about [Chainlink VRF](../chainlink-vrf/).

And if you want your contracts to retrieve data from off-chain APIs, learn about [Using Any API](../request-and-receive-data/).

# Testing Chainlink Contracts

See our blog post on <a href="https://blog.chain.link/testing-chainlink-smart-contracts/" target="_blank">Testing Chainlink Smart Contracts</a> or watch the <a href="https://www.youtube.com/watch?v=d8SqLaH8pu0" target="_blank">Chainlink Hackathon Workshop</a>.

Tests samples can be found on <a href="https://github.com/smartcontractkit/hardhat-starter-kit/tree/main/test" target="_blank">Hardhat Starter Kit</a> and <a href="https://github.com/smartcontractkit/truffle-starter-kit/tree/master/test" target="_blank">Truffle Starter Kit</a> respectively.
