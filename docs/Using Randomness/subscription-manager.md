---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Using the Subscription Manager"
permalink: "docs/subscription-manager/"
whatsnext: {"Contract Addresses":"/docs/get-a-random-number/"}
metadata:
  description: "How to create and manage subscriptions to use with Chainlink VRF v2."
  image:
    0: "/files/OpenGraph_V3.png"
---

The [Subscription Manager](https://vrf.chain.link) lets you create an account and pre-pay for Chainlink products like VRF v2 so you don't need a funding transaction each time your application requests randomness. This reduces the total number of transactions required to use Chainlink products and reduces the total gas costs for your smart contract applications. It also provides a simple way to fund your use of Chainlink products from a single location so you don't have to manage multiple wallets across several different systems and applications.

Requests to a Chainlink product like VRF v2 follow the [Request & Receive Data](/docs/request-and-receive-data/) cycle. When you make a request for randomness, VRF calculates the gas that is used to fulfill the request, converts it to LINK using an ETH/LINK feed, and charges your subscription rather than asking you to make a separate transaction for payment.

## Table of Contents

- [Overview](#overview)
- [Limitations](#limitations)
- [Creating and managing a subscription](#creating-and-managing-a-subscription)

## Overview

Subscriptions have the following core concepts:

- **Subscription accounts:** An account that holds LINK tokens and makes them available to fund requests to a Chainlink product like VRF v2.
- **Subscription owner:** The wallet address that creates and manages a subscription account. You can add additional owners to a subscription account after you create it. Any account can add LINK to subscription account, but only the owners can add approved consumers or withdraw funds.
- **Consumers:** Contracts that are approved to use funding from your subscription account.
- **Subscription balance:** The amount of LINK maintained on your subscription account. Requests from consumer contracts will continue to be funded until the balance runs out, so be sure to maintain sufficient funds in your subscription balance to pay for the requests and keep your applications running.

In general, subscriptions have the following life cycle:

1. Create a new subscription in the [Subscription Manager](https://vrf.chain.link) application.
1. Fund the subscription balance.
1. Add approved consumer contracts that are allowed to use the subscription for funding.
1. Consumer contracts make requests to Chainlink products like VRF v2. Funding is subtracted from the subscription balance for each request.
1. Add additional funding to the subscription balance as necessary to continue funding your applications.
1. If your applications no longer require the subscription or switch to a new subscription, you can close the subscription and retrieve the remaining balance.

## Limitations

The Subscription Manager system has the following limitations:

- Each subscription supports up to 100 consumer contracts. If you need more than 100 consumers, create multiple subscriptions.
- Each subscription must maintain a minimum balance in order to fund requests from consumer contracts. If your balance drops below this threshold

## Creating and managing a subscription

<!-- TODO: Add step by step instructions with screenshots for how to use the subscription app. -->
