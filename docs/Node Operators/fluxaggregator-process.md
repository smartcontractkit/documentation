---
layout: nodes.liquid
date: Last Modified
title: "FluxAggregator Process"
permalink: "docs/fluxaggregator-process/"
hidden: true
---
This page describes how the <a href="https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/FluxAggregator.sol" target="_blank">`FluxAggregator`</a> contract interacts with oracle nodes to aggregate data.

# Introduction

The `FluxAggregator` contract is responsible for aggregating data from multiple verified nodes, ensuring the integrity of the data. Whenever the time requirement `pollTimer` has passed, or the price has fluctuated greater than the `threshold`, oracle nodes submit data to it.

# Decision Tree
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/32b02f2-FluxAggregator_Decision_Tree.png",
        "FluxAggregator Decision Tree.png",
        2196,
        3096,
        "#f9f8f4"
      ]
    }
  ]
}
[/block]