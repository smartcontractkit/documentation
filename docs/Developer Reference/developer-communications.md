---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Developer Communications"
permalink: "docs/developer-communications/"
hidden: false
metadata: 
  title: "Developer Communications"
  description: "We are committed to communicating these changes with you in advance. This page will provide information on our current communication channels and detail active notifications / upgrade plans with timelines."
  image: 
    0: "https://files.readme.io/34e5b55-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
# Stay up to date with the latest upgrades
[block:callout]
{
  "type": "warning",
  "title": "Important: Sign up for update notifications",
  "body": ""
}
[/block]
Developers should subscribe to update notifications via any of the following channels:

* <a href="http://eepurl.com/hbUYlz" target="_blank">Developer Email List</a>
* <a href="http://eepurl.com/hnh_5H" target="_blank">Node Operator Email List</a>
* <a href="https://discord.gg/qj9qarT" target="_blank">Discord Channel</a>
* [On-chain registry](../ens): To increase security, we will be utilizing ENS to provide an onchain registry of all feeds and their latest addresses. 

**Subscribe to the channels above for future notifications about the newest resiliency, scalability and security updates to Chainlink reference data.**

---

# Current notifications

## Aug 2020 Flux Aggregator Update

> ❗️ Required
>
> Please follow the [Migration Instructions](../migrating-to-aggregator-proxies)  and update to the latest [Price Feed Contracts](../reference-contracts) to ensure your contracts always reference the most up to date aggregator. If you do not upgrade after the timeline in this document, your consumer contracts may not receive the most accurate price data.

The update to [`FluxAggregator`](https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/FluxAggregator.sol) adds congestion resilience capabilities and gas optimizations for reports involving median calculations over the previous version. 

- A new function `latestRoundData` has been added. It returns `roundId`, `answer`, `startedAt`, `updatedAt`, and `answeredInRound`. This allows consumers of reference data to make decisions around if the data is acceptable in a single function call (ex: if answeredInRound < roundId could indicate stale data). 
- A `description` view has been added. This shows the name of the price feed (e.g. ETH/USD). 
- A `decimals` view has been added. This indicates the number of 0s to the right of the decimal point (e.g. 18).
- Backwards compatible: existing interface functions from old aggregators are still supported.  

---
### Migration timeline

**24 Aug 2020: Upgrade Information Released**
Please visit our [Migration Instructions](../migrating-to-aggregator-proxies) or go directly to the latest [Price Feed Contracts](../reference-contracts) page to update today. 

**1 Sep 2020: First Upgrade Notice**

At this date, we will begin notifying smart contracts pointing at legacy data feeds to update their feed addresses. 

An onchain study will be done to investigate if calls are still being made to legacy data feeds, and we will make our best effort to contact smart contracts that have not yet updated. On specific legacy data feeds where all users have fully migrated, update frequency will be reduced. The frequency of updates will be available with increased resiliency on the new feeds to which users have migrated. 

**15 Sep 2020: Second Upgrade Notice**

We will once again notify all users via email and discord. On specific legacy data feeds where all users have fully migrated, update frequency will be reduced. The frequency of updates will be available with increased resiliency on the new feeds to which users have migrated. 

**22 Sep 2020: Final Upgrade Notice**

We will post a final notification message before beginning to deprecate legacy feeds. 

Over time, the frequency at which the legacy aggregators are updated will be reduced. This means that if you do not migrate, your contracts will not consume the most up-to-date price data available. The frequency of updates will be available with increased resiliency on the new feeds to which users have migrated. 

We are here to help. If you require assistance or more time to make updates to your contracts, please get in touch with our team on the Discord developer chat.