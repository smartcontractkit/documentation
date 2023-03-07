---
layout: ../../../../layouts/MainLayout.astro
section: vrf
date: Last Modified
title: "Subscription Manager User Interface"
permalink: "docs/vrf/v2/subscription/ui/"
whatsnext:
  {
    "Security Considerations": "/vrf/v2/security/",
    "Best Practices": "/vrf/v2/best-practices/",
    "Migrating from VRF v1 to v2": "/vrf/v2/subscription/migration-from-v1/",
    "Supported Networks": "/vrf/v2/subscription/supported-networks/",
  }
metadata:
  title: "Subscription Manager User Interface"
  description: "Walkthrough Subscription Manager User Interface"
setup: |
  import VrfCommon from "@features/vrf/v2/common/VrfCommon.astro"
---

<VrfCommon callout="subscription"/>

The VRF v2 Subscription Manager is available at [vrf.chain.link](https://vrf.chain.link/). The Subscription Manager lets you create a subcription and pre-pay for VRF v2 so you don't need to provide funding each time your application requests randomness. This guide walks you through the main sections of the UI.

:::tip[Troubleshooting]
Read the [pending](#pending) and [failed requests](#failed-requests) sections to learn how to troubleshoot your VRF requests.
:::

![VRF v2 UI overview](/images/vrf/v2-ui-overview.png)

Subscription components:

- **Status**: Indicates if the subscription is still active or not.
- **ID**: The unique subscription identifier. Approved consuming contracts use LINK from this subscription to pay for each randomness request.
- **Admin**: The account address that owns this subscription ID.
- **Consumers**: The number of consuming contracts that are approved to make VRF requests using this subscription.
- **Fulfillment**: The number of successful randomness requests that are already completed.
- **Balance**: The amount of LINK remaining to be used for requests that use this subscription.

You can cancel your subscription in the user interface. When you cancel your subscription, specify the account address to receive the remaining balance. See the clean up instructions in the [Get a Random Number](/vrf/v2/subscription/examples/get-a-random-number/#clean-up) guide to learn more.

## Consumers

![VRF v2 UI consumers](/images/vrf/v2-ui-consumers.png)

The **Consumers** section lists the contracts that are allowed to use your subscription to pay for requests.

- **Address**: The address of the consuming contract.
- **Added**: The time when the consumer was added to the subscription.
- **Last fulfillment**: The last time a VRF request was fulfilled for the consumer.
- **Total spent**: The total amount of LINK that has been used by the consuming contract.

You can use this section to add or remove consumers.

## Pending

![VRF v2 UI pending](/images/vrf/v2-ui-pending.png)

The **Pending** list appears if there are requests currently being processed.

- **Time**: The time when the pending VRF request was made.
- **Consumer**: The address of the consuming contract.
- **Transaction hash**: The transaction hash of the pending VRF request.
- **Status**: A timer that informs you when the pending VRF request will move to a failed status. **Note**: Pending requests fail after 24h.
- **Max Cost**: The calculated total gas cost in LINK based on the configuration. See [VRF v2 Subscription Limits](/vrf/v2/subscription/#limits) for details.
- **Projected Balance**: This indicates when the subscription is underfunded and how many LINK tokens are required to fund the subscription.

## History

### Recent fulfillments

![VRF v2 UI recent fulfill](/images/vrf/v2-ui-recent-fulfill.png)

The **Recent fulfillments** tab shows the details for successful VRF fulfillments.

- **Time**: The time and block number indicating when the VRF request was successfully fulfilled.
- **Consumer**: The address of the consuming contract that initiated the VRF request.
- **Transaction Hash**: The transaction hash of the VRF callback.
- **Status**: The status of the request. Recent fulfillments always show _Success_.
- **Spent**: The total amount of LINK spent to fulfill the VRF request.
- **Balance**: The LINK balance of the subscription after the VRF request was fulfilled.

### Events

![VRF v2 ui history events](/images/vrf/v2-ui-history-events.png)

The **Events** tab displays events linked to the subscription. There are five main events:

- Subscription created
- Subscription funded
- Consumer added
- Consumer removed
- Subscription canceled

Components of VRF events:

- **Time**: The time when the event happened.
- **Event**: The type of the event.
- **Transaction Hash**: The transaction hash for the event.
- **Consumer**: The address of the consuming contract. This is used only for _Consumer added_ and _Consumer canceled_ events.
- **Amount**:
  - For _Subscription funded_ events, this indicates the amount of LINK added to the subscription balance.
  - For _Subscription canceled_ events, this indicates the amount of LINK withdrawn from the subscription balance.
- **Balance**:
  - For _Subscription funded_ events, this indicates the LINK balance of the subscription after it was funded.
  - For _Subscription canceled_ events, this field should display _0_.

### Failed requests

![VRF v2 UI history failed](/images/vrf/v2-ui-history-failed.png)

The **Failed requests** tab displays failed VRF requests.

- **Time**: The time when the VRF request was made.
- **Transaction Hash**: This can be either the transaction hash of the originating VRF request if the request was pending for over 24 hours _or_ the transaction hash of the VRF callback if the callback failed.
- **Status**: The status of the request. Failed requests always show _Failed_.
- **Reason**: The reason why the request failed. Requests fail for one of the following reasons:
  - Pending for over 24 hours
  - Wrong key hash specified
  - Callback gas limit set too low
