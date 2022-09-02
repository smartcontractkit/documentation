---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Subscription Manager User Interface'
permalink: 'docs/vrf/v2/ui/'
metadata:
  title: 'Subscription Manager User Interface'
  description: 'Walkthrough Subscription Manager User Interface'
---

The VRF v2 Subscription Manager is accessible on _https://vrf.chain.link_. It lets you create a subcription and pre-pay for VRF v2, so you don't need to provide funding each time your application requests randomness.
This guide will walk you through the main sections of the UI.

> 📘 Troubleshooting
>
> Checkout [pending](#pending) and [failed requests](#failed-requests) sections to learn how to troubleshoot your VRF requests.

**Topics**

- [Overview](#overview)
- [Consumers](#consumers)
- [Pending](#pending)
- [History](#history)
  - [Recent fulfillments](#recent-fulfillments)
  - [Events](#events)
  - [Failed requests](#failed-requests)

## Overview

![VRF v2 ui overview](/images/vrf/v2-ui-overview.png)

This shows an overview of the subscription:

- **Status**: whether the subscription is still active or not.
- **ID**: id of the subscription. Link token will be debited from this subscription id with each randomness request.
- **Admin**: Owner account address of the subscription id.
- **Consumers**: number of the consuming contracts that are allowed to make VRF requests for your subscription.
- **Fulfillment**: number of successful randomness requests.
- **Balance**: Amount of Link tokens remaining for the subscription.

You can also cancel your subscription from here. When you cancel your subscription, you must specify the account address to receive the remaining balance. See [Clean up](/docs/vrf/v2/examples/get-a-random-number/#clean-up) to learn more.

## Consumers

![VRF v2 ui consumers](/images/vrf/v2-ui-consumers.png)

This shows a list of the consumer contracts allowed to request randomness from your subscription:

- **Address**: Contract address of the consumer.
- **Added**: Time when the consumer was added to the subscription.
- **Last fulfillment**: The last time a VRF request was fulfilled for the consumer.
- **Total spent**: Total amount of Link tokens spent by the consumer.

You can also add/remove consumers from here.

## Pending

![VRF v2 ui pending](/images/vrf/v2-ui-pending.png)

This list appears if there are pending requests:

- **Time**: Time when the pending VRF request was made.
- **Consumer**: Contract address of the consumer.
- **Transaction hash**: Transaction hash of the pending VRF request.
- **Status**: Timer informing the user when the pending VRF request will move to a failed status.

  > ⚠️ Pending requests will fail after 24h.
  >
  >   </br>

- **Max Cost**: Calculated total gas cost in Link based on the configuration. see [VRF v2 Limits](/docs/vrf/v2/introduction/#limits) for more details.
- **Projected Balance**: Informs the user their subscription is underfunded and how many Link tokens they need to fund their subscription with.

## History

### Recent fulfillments

![VRF v2 ui recent fulfill](/images/vrf/v2-ui-recent-fulfill.png)

Displays successful VRF fulfilments:

- **Time**: Time when the VRF request was successfully fulfilled.
- **Consumer**: Contract address of the consumer originating the VRF request.
- **Transaction Hash**: Transaction hash of the VRF callback.
- **Status**: In this case, the status will show _Success_.
- **Spent**: Total Amount of Link tokens spent to fulfill the VRF request.
- **Balance**: Link balance amount of the subscription after the VRF request was fulfilled.

### Events

![VRF v2 ui history events](/images/vrf/v2-ui-history-events.png)

Displays events linked to the subscription. There are five main events:

- Subscription created.
- Subscription funded.
- Consumer added.
- Consumer removed.
- Subscription canceled.

The list displays:

- **Time**: Time when the event was made.
- **Event**: Event type.
- **Transaction Hash**: Transaction Hash of the event.
- **Consumer**: Consumer contract address (Only relevant for _Consumer added_ and _Consumer canceled_ events).
- **Amount**:
  - Amount of Link tokens added to the subscription balance (Only relevant for _Subscription funded_ events).
  - Amount of Link tokens withdrawn from the subscription balance (Only relevant for _Subscription canceled_ events).
- **Balance**:
  - Link balance amount of the subscription after it was funded (Only relevant for _Subscription funded_ events).
  - Should display _0_ for _Subscription canceled_ events.

### Failed requests

![VRF v2 ui history failed](/images/vrf/v2-ui-history-failed.png)

Displays all failed requests:

- **Time**: Time of the VRF request.
- **Transaction Hash**: This can be either the transaction hash of the originating VRF request if the request was pending for over 24 hours _or_ the transaction hash of the VRF callback if the callback failed.
- **Status**: In this case, the status will show _Failed_.
- **Reason**: could be one of the following:
  - Pending for over 24 hours
  - Wrong key hash specified
  - Callback gas limit set too low
