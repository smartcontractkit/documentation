---
layout: nodes.liquid
title: "Introduction"
slug: "external-adapters"
hidden: false
date: Last Modified
---
[block:callout]
{
  "type": "success",
  "body": "This March, you have the chance to help build the next generation of smart contracts.\n\nThe Chainlink Spring Hackathon has a prize pot of over $80k+ and is sponsored by some of the most prominent crypto projects.\n\nMarch 15th - April 11th\n<a href=\"https://chain.link/hackathon?utm_source=chainlink&utm_medium=developer-docs&utm_campaign=hackathon\" target=\"_blank\"><b>Register Here.</b></a>",
  "title": "Join the Spring 2021 Chainlink Hackathon"
}
[/block]
External adapters are how Chainlink enables easy integration of custom computations and specialized APIs. External adapters are services which the core of the Chainlink node communicates via its API with a simple JSON specification. If you want a step by step, be sure to check out our [blog post](https://blog.chain.link/build-and-use-external-adapters/). 

Information on external adapters is broken up into three main categories: contract creators, developers, and node operators. 
- [Contract Creators](doc:contract-creators) will need to know how to specify an external adapter in their request for external data. 
- [Developers](doc:developers) will need to know how to implement an external adapter for an API. 
- [Node Operators](doc:node-operators) will need to know how to add an external adapter to their node so that they can provide specialized services to smart contracts.