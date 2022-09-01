---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink VRF v2 UI'
permalink: 'docs/vrf/v2/ui/'
metadata:
  title: 'Chainlink VRF v2 UI'
  description: 'Walkthrough Chainlink VRF v2 UI'
---

The VRF v2 Subscription Manager is accessible on _https://vrf.chain.link_. It lets you create an account and pre-pay for VRF v2, so you don't provide funding each time your application requests randomness.
This guide will walk you through the main sections of the UI.

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

- Status: whether the subscription is still active or not.
- ID: id of the subscription. Link token will be debited from this subscription id with each randomness request.
- Admin: Owner account address of the subscription id.
- Consumers: number of subscription consumers.
- Fulfillment: number of successful randomness requests.
- Balance: Amount of Link tokens remaining for the subscription.

You can also cancel your subscription from there. When you cancel your subscription, you must specify the account address to receive the remaining balance.

## Consumers

![VRF v2 ui consumers](/images/vrf/v2-ui-consumers.png)

This shows the list of the subscription consumers:

- Address: Account address of the consumer.
- Added: Time when the consumer was added to the subscription.
- Last fulfillment: when was the last time a VRF request was fulfilled for the consumer.
- Total spent: Total amount of Link tokens spent by the consumer.

You can also add/remove consumers from there.

## Pending

![VRF v2 ui pending](/images/vrf/v2-ui-pending.png)

This list appears if there are pending requests:

- Time: Time when the pending VRF request was made.
- Consumer: Account address of the consumer.
- Transaction hash: transaction hash of the pending VRF request.
- Status: Timer informing the user when the pending VRF request will move to a failed status. **Note** Pending requests will fail after 24h.
- Max Cost: Calculated total gas cost in Link based on the configuration. see [VRF v2 Limits](/docs/vrf/v2/introduction/#limits) for more details.
- Projected Balance: Informs the user their subscription is underfunded and how many Link tokens they need to fund their subscription with.

## History

### Recent fulfillments

![VRF v2 ui recent fulfill](/images/vrf/v2-ui-recent-fulfill.png)

Displays successful VRF fulfilments:

- Time: Time when the VRF request was successfully fulfilled.
- Consumer: Account address of the consumer originating the VRF request.
- Transaction Hash: Transaction hash of the VRF callback.
- Status: In this case, the status will show _Success_.
- Spent: Total Amount of Link tokens that cost to fulfill the VRF request.
- Balance: Link balance amount of the subscription after the VRF request was fulfilled.

### Events

![VRF v2 ui history events](/images/vrf/v2-ui-history-events.png)

Displays events linked to the subscription. There are five main events:

- Subscription created.
- Subscription funded.
- Consumer added.
- Consumer removed.
- Subscription canceled.

The list displays:

- Time: Time when the event was made.
- Event: Event name.
- Transaction Hash: Transaction Hash of the event.
- Consumer: Consumer account address in case it was added or removed.
- Amount. There are two cases where it is displayed:
  - Amount of Link tokens added to the subscription balance (Only relevant for _Consumer added_ events).
  - Amount of Link tokens withdrawn from the subscription balance (Only relevant for _Consumer canceled_ events).
- Balance. There are two cases where it is displayed:
  - Link balance amount of the subscription after it was funded (Only relevant for _Consumer added_ events).
  - Should display _0_ for _Consumer canceled_ events.

### Failed requests

![VRF v2 ui history failed](/images/vrf/v2-ui-history-failed.png)

Displays all failed requests:

- Time: Time of the VRF request.
- Transaction Hash: This can be either the transaction hash of the originating VRF request if the request was pending for over 24 hours _or_ the transaction hash of the VRF callback if the callback failed.
- Status: In this case, the status will show _Failed_.
- Reason: could be one of the following:
  - Pending for over 24 hours
  - Wrong key hash specified
  - Callback gas limit set too low
