---
layout: ../../../layouts/MainLayout.astro
section: solana
title: "Solana Data Feeds Addresses"
stub: data-feeds-solana
permalink: "docs/solana/data-feeds-solana/"
metadata:
  ecosystem: solana
  networkstatusurl: "https://status.solana.com/"
date: Last Modified
setup: |
  import FeedPage from "@features/feeds/components/FeedPage.astro"
---

<FeedPage initialNetwork="solana"  ecosystem="solana" />
