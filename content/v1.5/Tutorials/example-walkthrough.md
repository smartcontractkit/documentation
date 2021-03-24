---
title: "Intermediates - Calling APIs"
slug: "example-walkthrough"
hidden: false
metadata: 
  title: "Step-by-step Guide for Smart Contracts Developers"
  description: "This guide will teach you to deploy your first smart contract that fetches API data from Chainlink. Anyone can follow along!"
  image: 
    0: "https://files.readme.io/598f549-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
createdAt: "2019-04-11T18:26:45.684Z"
updatedAt: "2020-12-03T13:44:33.360Z"
---
# Introduction

To realise the full potential of smart contracts, a reliable bridge to the outside world is necessary. There is no native way for smart contracts to interact with data outside of the blockchain with which they are constrained. Chainlink solves this problem by enabling smart contracts to [Call Any Off-chain API](doc:request-and-receive-data).

This section is designed to support your next steps in launching a successful Chainlink project by providing a complete example of executing a Chainlink project from start to finish.

After following this step-by-step guide for deploying a Chainlinked contract, you will:
  - Deploy a testnet contract on Kovan
  - Fund your contract with testnet LINK
  - Request and receive data (ETH/USD price)
  - View the data from your contract

There are no setup steps or prerequisites. This guide will walk you through every step with images. The examples in this guide use Remix so you don't need to setup a development environment. You do not need to run a Chainlink or Ethereum node to complete this guide.


[block:callout]
{
  "type": "warning",
  "title": "Use Kovan instead of Ropsten",
  "body": "Although Ropsten is mentioned in this video, please use Kovan testnet instead."
}
[/block]

[block:embed]
{
  "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FNsyFGzhktYA%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DNsyFGzhktYA&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FNsyFGzhktYA%2Fhqdefault.jpg&key=f2aa6fc3595946d0afc3d76cbbd25dc3&type=text%2Fhtml&schema=youtube\" width=\"854\" height=\"480\" scrolling=\"no\" title=\"YouTube embed\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen=\"true\"></iframe>",
  "url": "https://www.youtube.com/watch?v=NsyFGzhktYA&feature=youtu.be",
  "title": "What is Ethereum? - Chainlink Engineering Tutorials",
  "favicon": "https://www.youtube.com/s/desktop/d750d05d/img/favicon.ico",
  "image": "https://i.ytimg.com/vi/NsyFGzhktYA/hqdefault.jpg"
}
[/block]