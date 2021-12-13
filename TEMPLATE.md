---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "[insert title here]"
permalink: "[insert path here]"
excerpt: "Smart Contracts and Chainlink"
whatsnext: {"[insert hyperlink title]":"insert path to hyperlink", "":""}
metadata:
  image:
    0: "insert image here"
---
*This doc is meant to be used as a template for creating a tutorial doc. Contributors should emulate the structure of this document when creating new pages. The content of this doc comes from the Getting Started Guides.*

*Prerequisites should have its own block at the beginning of the tutorial. Tell the user what tools are required, what knowledge they should already have, and where to go if they need previous reading. Provide links to the other docs pages.*
> 👍 Prerequisites
>
> This tutorial requires .... If you're unfamiliar with these concepts, follow ...
> or
> New to []? We'll walk you through...

*If a tutorial has a corresponding YouTube tutorial, link it at the beginning of the page.*
<p>
  https://www.youtube.com/watch?v=rFXSEEQG9YE
</p>

*If a portion of the YouTube video is deprecated or out-of-date, add a note alerting the user.*

> 🚧 Note
>
> The video uses a seed phrase to request randomness. This feature is deprecated. Refer to the code in this tutorial for the most up to date procedures.


# Overview

*Write 1-4 sentences on what this tutorial covers. Focus on the end result of the tutorial and the overarching concepts a user will learn and implement. Throughout the entire document, use second person singular (you). This should be consistent throughout the entire document, but exceptions can be made. Avoid passive voice as well. Remember, anyone reading the tutorial should interpret it as a source of truth. Make sure to write in a voice which is factual and objective.*

*Example:*
In this tutorial, you will write and deploy a Chainlink smart contract to an Ethereum testnet.

**Table of Contents**

*Table of contents are generated automatically using vscode markdown: https://github.com/yzhang-gh/vscode-markdown make sure settings are changed so that only header1 are in TOC.*

+ [1. What are smart contracts? What are data feeds?](#1-what-are-smart-contracts-what-are-data-feeds)
+ [2. What language is a smart contract written in?](#2-what-language-is-a-smart-contract-written-in)
+ [3. What does a smart contract look like?](#3-what-does-a-smart-contract-look-like)
+ [4. Further Reading](#4-further-reading)

*Remember to number each main header and use questions when possible. Make questions succinct and bold key terms in the answers. Link to relevant articles where possible and make sure there are no gaps in learning. Users should be able to use the article as a source of truth and not have to rely on external searches to understand the material of the article. Example:*

# 1. What are smart contracts? What are data feeds?

When deployed to a blockchain, a **smart contract** is a set of instructions that can be executed without intervention from third parties. The code of a smart contract determines how it responds to input, just like the code of any other computer program.

A valuable feature of smart contracts is that they can store and manage on-chain assets (like [ETH or ERC20 tokens](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)), just like you can with an Ethereum wallet. Because they have an on-chain address like a wallet, they can do everything any other address can. This opens the door for programming automated actions when receiving and transferring assets.

*Notice how users are given external links to read more about concepts such as ETH or ERC20 tokens. They do not have to undertake a separate search.*

Smart contracts can connect to real-world market prices of assets to produce powerful applications. Chainlink's **[Data Feeds](../using-chainlink-reference-contracts/)** feature allows users to quickly and securely connect smart contracts to such assets in a single call.

# 2. What language is a smart contract written in?

...

# 3. What does a smart contract look like?

*For code samples, be thorough. Redundancy is better than assuming the user have sufficient knowledge on a certain topic. Create markdown code samples wherever  applicable. Provide a detailed explanation about what each code sample does.*

The structure of a smart contract is similar to that of a _class_ in Javascript, with a few differences. Let's take a look at this `HelloWorld` example.

```solidity
pragma solidity 0.8.7;

contract HelloWorld {
    string public message;

    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function updateMessage(string memory newMessage) public {
        message = newMessage;
    }
}
```

*Subheadings don't need to be numbered. If a step of the tutorial doesn't need its own heading, it's best to make a subheading. Example:*

## Define the Version

The first thing that every Solidity file must have is the Solidity version definition. The version HelloWorld.sol is using is 0.8.7, defined by `pragma solidity 0.8.7;`

You can see the latest versions of the Solidity compiler [here](https://github.com/ethereum/solc-bin/blob/gh-pages/bin/list.txt/?target=_blank). You may also notice Solidity files containing definitions with multiple versions of Solidity:

```solidity
pragma solidity >=0.7.0 <0.9.0;
```
This means that the code is written for Solidity version 0.7.0, or a newer version of the language up to, but not including version 0.9.0. In short, `pragma` is used to instruct the compiler as how to treat the code.

...

*As a final step, include further reading with relevant blog posts and link users to other tutorials. Example:*

# 4. Further Reading

To learn more about data feeds, read the Data Feed blog posts:

- [Build a dApp on xDai Chain With Secure Data Feeds](https://blog.chain.link/build-a-dapp-on-xdai-chain-with-secure-data-feeds/)
- [Build a dApp on Binance Smart Chain With Secure Data Feeds](https://blog.chain.link/build-a-dapp-on-binance-smart-chain-with-secure-data-feeds/)
- [The 3 Levels of Data Aggregation in Chainlink Price Feeds](https://blog.chain.link/levels-of-data-aggregation-in-chainlink-price-feeds/)

To explore more applications for data feeds, check out our [other tutorials](/docs/other-tutorials/#data-feeds-applications).
