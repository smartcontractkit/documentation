---
layout: ../layouts/MainLayout.astro
title: "Ethereum Price Feeds"
stub: ethereum-addresses
section: ethereum
setup: |
  import { FeedList } from "@features/feeds"
---

<FeedList client:idle stub="ethereum-addresses" />
