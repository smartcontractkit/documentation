---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Smart Contracts & Oracles Payments"
permalink: "docs/paying-for-smart-contracts-oracles/"
hidden: true
---
For every transaction on the blockchain that is not just reading data, we need to pay ETH to compensate Ethereum nodes for providing their resources. Similarly, with calls to Chainlink nodes, it's required to pay LINK for bringing data, price feeds, VRF, and off-chain computation on-chain. This page explains how to pay these nodes correctly and avoid unexpected issues.

## Contract Deployment

A wallet that deploys a contract needs to have enough ETH to cover gas costs. If you're deploying contracts that depend on Chainlink Price Feeds, VRF or API calls, you still need only ETH.

For instance, the contract below uses the existing job via [dxFeed Price Oracle](../dxfeed-oracle) to retrieve the price of a given asset pair and requires only ETH for deployment.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/aa0ff6f-Screenshot_2021-04-08_at_14.32.58.png",
        "Screenshot 2021-04-08 at 14.32.58.png",
        2864,
        1384,
        "#575866"
      ]
    }
  ]
}
[/block]
## State-changing Function Calls

Function calls that modify the state of the contract but don't have any Chainlink dependencies require only ETH to cover gas fees. In this case, the fees have to be paid by a wallet making a corresponding call.

Here's an example:

```
tbd
```

## Chainlink Function Calls

If the function contains a Chainlink VRF or Any-API request, then the contract will need to be pre-funded with enough LINK for the transaction to execute successfully. In addition to this, the caller of the function will need enough ETH (or whatever the native gas token of the network is), to pay the transaction fee for modifying the blockchain state. The amount of LINK and ETH/gas required depends on the scenario and the Chainlink Node processing the request.

For instance, the same contract mentioned earlier needs LINK to pay oracle node for performing an API request that is a part of the <a href="https://market.link/adapters/5b85b098-6b1b-4613-aaaf-1d8d2d71a34f" target="_blank">dxFeed</a> external adapter.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/4ffc692-Screenshot_2021-04-08_at_14.35.42.png",
        "Screenshot 2021-04-08 at 14.35.42.png",
        2880,
        1212,
        "#5d5e6b"
      ]
    }
  ]
}
[/block]
If the contract doesn't have enough LINK to pay the oracle node, you'll encounter a `Gas estimation failed` error:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/322e28d-Screenshot_2021-04-08_at_14.34.51.png",
        "Screenshot 2021-04-08 at 14.34.51.png",
        2868,
        1308,
        "#15151d"
      ]
    }
  ]
}
[/block]
When the contract has enough LINK to make a `sendChainlinkRequestTo` function call, a wallet that initiates this call should pay ETH as a gas fee. 
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5aed95f-Screenshot_2021-04-08_at_14.36.19.png",
        "Screenshot 2021-04-08 at 14.36.19.png",
        2870,
        1324,
        "#5a5b69"
      ]
    }
  ]
}
[/block]
