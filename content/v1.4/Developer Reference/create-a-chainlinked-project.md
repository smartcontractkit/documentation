---
title: "Install Instructions"
slug: "create-a-chainlinked-project"
hidden: false
metadata: 
  title: "Getting Started with Chainlink for Smart Contract Developers"
  description: "Everything you need to know on how to create a new Chainlink project or update an existing one using the Chainlink Library for Solidity"
  image: 
    0: "https://files.readme.io/1e53dff-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
createdAt: "2019-04-11T20:44:47.860Z"
updatedAt: "2021-01-07T11:10:41.761Z"
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/61ad5d8-Create_a_Chainlinked_Project.png",
        "Create a Chainlinked Project.png",
        3246,
        731,
        "#f7f8fd"
      ]
    }
  ]
}
[/block]
This page explains how to install and use the [Chainlink Library](doc:chainlink-framework) in your projects.

> 📘 
>
> If you're new to smart contract development and want a step-by-step guide, try out our [Beginner Walkthrough](doc:example-walkthrough) 

# Install into Existing Projects

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

## Truffle Box

Install <a href="https://www.trufflesuite.com/truffle" target="_blank" rel="noreferrer, noopener">Truffle</a> with NPM:

```shell
npm install truffle -g
```

With Truffle installed, run the commands below to unbox a Chainlink contract into a new directory.

```shell Truffle
mkdir MyChainlinkProject
cd MyChainlinkProject/
truffle unbox smartcontractkit/box
```

For more details on how to use the Truffle, see <a href="https://www.trufflesuite.com/blog/using-truffle-to-interact-with-chainlink-smart-contracts" target="_blank">this blog post</a>.

___

## Brownie Mix

Install <a href="https://eth-brownie.readthedocs.io/en/stable/install.html" target="_blank" rel="noreferrer, noopener">Brownie</a> with pip:

```shell
pip install eth-brownie
```

With Brownie installed, run the commands below to open a Brownie project into a new directory.

```shell Truffle
mkdir MyChainlinkProject
cd MyChainlinkProject/
brownie bake chainlink-mix
cd chainlink-mix
```

Set your `WEB3_INFURA_PROJECT_ID`, and `PRIVATE_KEY` <a target="_blank" href="https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html">environment variables</a>. You can get this from <a target="_blank" href="https://infura.io/">Infura</a>. You can find your `PRIVATE_KEY` from your Ethereum wallet like <a target="_blank" href="https://metamask.io/">Metamask</a>. 

<a target="_blank" href="https://github.com/smartcontractkit/chainlink-mix">Learn more</a>. 


# Using Chainlink Contracts

Once you have the Chainlink library installed, you can leverage the Chainlink ecosystem. 

If you're interested in retrieving up to date crypto prices in your contracts, learn more about our [Price Feeds](doc:using-chainlink-reference-contracts). 

If you need to consume randomness in your contracts, learn about [Chainlink VRF](doc:chainlink-vrf). 

And if you want your contracts to retrieve data from off-chain APIs, learn about [Using Any API](doc:request-and-receive-data).