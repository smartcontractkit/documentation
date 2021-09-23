---
layout: nodes.liquid
date: Last Modified
title: "Node Operators FAQ"
permalink: "docs/node-operators-faq/"
metadata: 
  title: "Node Operators FAQ"
  description: "Find answers to common questions about developing on Chainlink."
---

### Do I need LINK to run a node?

You don’t need any LINK to run a Chainlink node. However, you will need a corresponding currency for the chain you are integrating with to pay transaction fees (e.g. ETH for gas on Ethereum).

### Can I use a local Chainlink node with Ganache?

Yes, it is possible but the implementation may behave differently due to the fact that Ganache is not a real testnet.

### What are the hardware requirements for running a Chainlink node?

The hardware requirements of the Chainlink node are relatively light. Check out the [documentation](https://github.com/smartcontractkit/chainlink#install) on running a node for the latest requirements.

### Do I need to have access to APIs in order to provide data?

The Chainlink node can fulfill requests from open (unauthenticated) APIs out-of-the-box, without the need for External Adapters as long as you’ve added the jobs in the [Fulfilling Requests guide](/docs/fulfilling-requests/). For these requests, requesters would supply the URL to the open API they wish each node to retrieve, and the Chainlink node will use its core adapters to fulfill the request.

If you would like to provide access to an API which requires authentication, you will need to create a job specific for that API, either with an external adapter or by using the parameters of the HttpGet adapter.

### Is there a list of external adapters available?

Currently, the community maintains lists of available external adapters. Use [Chainlink Market](https://market.link/) for more details.

### How many nodes are currently active on the Chainlink network?

There are dozens of active nodes on the network. You can find the up-to-date list on the [Chainlink Market](https://market.link/search/nodes).