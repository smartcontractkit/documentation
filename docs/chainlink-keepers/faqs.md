---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Chainlink Keepers Frequently Asked Questions'
---
{% include keepers-beta %}

## Why isn't `performUpkeep` being executed on my contract?
There are several common reasons

* You don't have a high enough balance of LINK with the [registry](https://keeper.chain.link)
* Your `checkUpkeep` calls are not indicating that Upkeep is needed
