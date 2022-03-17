---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "External Adapters Introduction"
permalink: "docs/external-adapters/"
whatsnext: {"External Adapters in Solidity":"/docs/contract-creators/", "Building External Adapters":"/docs/developers/", "Bridges: Adding External Adapters to Nodes":"/docs/node-operators/"}
---
External adapters are how Chainlink enables easy integration of custom computations and specialized APIs. External adapters are services which the core of the Chainlink node communicates via its API with a simple JSON specification. If you want a step by step, be sure to check out our [blog post](https://blog.chain.link/build-and-use-external-adapters/). 

Information on external adapters is broken up into three main categories: contract creators, developers, and node operators. 
- [Contract Creators](../contract-creators/) will need to know how to specify an external adapter in their request for external data. 
- [Developers](../developers/) will need to know how to implement an external adapter for an API. 
- [Node Operators](../node-operators/) will need to know how to add an external adapter to their node so that they can provide specialized services to smart contracts.