---
layout: ../../../layouts/MainLayout.astro
title: "Feed Addresses"
section: dataFeeds
metadata:
  title: "Rate Feeds Addresses"
  description: "A list of feed addresses for Rate, Index, and Volatility Data Feeds."
date: Last Modified
setup: |
  import FeedPage from "@features/feeds/components/FeedPage.astro"
---

<FeedPage dataFeedType="rate" />
