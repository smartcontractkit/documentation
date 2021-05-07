---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Install Instructions"
permalink: "docs/create-a-chainlinked-project/"
whatsnext: {"Introduction to Price Feeds":"/docs/using-chainlink-reference-contracts/", "Introduction to Chainlink VRF":"/docs/chainlink-vrf/", "Introduction to Using Any API":"/docs/request-and-receive-data/"}
hidden: false
metadata: 
  title: "Getting Started with Chainlink for Smart Contract Developers"
  description: "Everything you need to know on how to create a new Chainlink project or update an existing one using the Chainlink Library for Solidity"
  image: 
    0: "/files/OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
[block:image]
{
  "images": [
    {
      "image": [
        "/files/c6e99c5-Untitled_design_23.png",
        "Untitled design (23).png",
        800,
        418,
        "#c0b98b"
      ]
    }
  ]
}
[/block]
This page explains how to install and use the [Chainlink Library](../chainlink-framework/) in your projects.

> 📘 
>
> If you're new to smart contract development and want a step-by-step guide, try out our [Beginner Walkthrough](../intermediates-tutorial/) 

# Install into Existing Projects

Chainlink is supported by <a href="http://hardhat.org" target="_blank">Hardhat</a>, <a href="https://eth-brownie.readthedocs.io/en/stable" target="_blank">Brownie</a>, <a href="https://www.trufflesuite.com" target="_blank">Truffle</a> and other frameworks.

If you already have a project, you can add Chainlink to it by using the following package managers.

## NPM 

Install using <a href="https://www.npmjs.com/" target="_blank" rel="noreferrer, noopener">NPM</a>
[block:code]
{
  "codes": [
    {
      "code": "npm install @chainlink/contracts --save",
      "language": "shell",
      "name": "npm"
    }
  ]
}
[/block]
## Yarn

Install using <a href="https://yarnpkg.com/" target="_blank" rel="noreferrer, noopener">Yarn</a>
[block:code]
{
  "codes": [
    {
      "code": "yarn add @chainlink/contracts",
      "language": "shell",
      "name": "yarn"
    }
  ]
}
[/block]
# Create a New Project

If you're creating a new project from scratch, these commands will help you set up your project to interact with Chainlink.

## Hardhat Box

Install <a href="https://hardhat.org" target="_blank"> hardhat </a>

```shell
npm install --save-dev hardhat
```

Then, clone the boilerplate repository.

```shell
git clone https://github.com/smartcontractkit/chainlink-hardhat-box
cd chainlink-hardhat-box
```

For more information on Hardhat, see our blog post <a href="https://blog.chain.link/using-chainlink-with-hardhat/" target="_blank">How to use Hardhat with Chainlink</a>. Alternatively, visit the <a href="https://github.com/smartcontractkit/chainlink-hardhat-box/blob/main/README.md" target="_blank">repo</a> for more instructions.
___

## Brownie Mix

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

For more information on working with Bownie, see our blog <a href="https://blog.chain.link/develop-python-defi-project/" target="_blank"  rel="noreferrer, noopener">how to use Brownie with Chainlink</a> or visit the <a href="https://github.com/smartcontractkit/chainlink-mix/blob/master/README.md" target="_blank" rel="noreferrer, noopener"> repo</a> to learn more.

Environment variables are required when working with Brownie. <a target="_blank" href="https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html">Learn how to set environment variables</a>.
___

## Truffle Box

Install <a href="https://www.trufflesuite.com/truffle" target="_blank" rel="noreferrer, noopener">Truffle</a> with NPM:

```shell
npm install truffle -g
```

Once installed, unbox the Chainlink box.

```shell Truffle
mkdir MyChainlinkProject
cd MyChainlinkProject/
truffle unbox smartcontractkit/box
```

For more details on how to use the Truffle, see our <a href="https://www.trufflesuite.com/blog/using-truffle-to-interact-with-chainlink-smart-contracts" target="_blank">blog post</a>. Alternatively, visit the <a href="https://github.com/smartcontractkit/box/blob/master/README.md" target="_blank">repo</a> for more information.
___


# Using Chainlink Contracts

Once you have the Chainlink library installed, you can leverage the Chainlink ecosystem. 

If you're interested in retrieving up to date crypto prices in your contracts, learn more about our [Price Feeds](../using-chainlink-reference-contracts/). 

If you need to consume randomness in your contracts, learn about [Chainlink VRF](../chainlink-vrf/). 

And if you want your contracts to retrieve data from off-chain APIs, learn about [Using Any API](../request-and-receive-data/).

# Testing Chainlink Contracts

See our blog post on <a href="https://blog.chain.link/testing-chainlink-smart-contracts/" target="_blank">Testing Chainlink Smart Contracts</a> or watch the <a href="https://www.youtube.com/watch?v=d8SqLaH8pu0" target="_blank">Chainlink Hackathon Workshop</a>.

Tests samples can be found on <a href="https://github.com/smartcontractkit/chainlink-hardhat-box/tree/main/test" target="_blank">Chainlink Hardhat Box</a> and <a href="https://github.com/smartcontractkit/box/tree/master/test" target="_blank">Chainlink Truffle Box</a> respectively.