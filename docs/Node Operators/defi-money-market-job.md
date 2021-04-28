---
layout: nodes.liquid
date: Last Modified
title: "Defi Money Market Job"
permalink: "docs/defi-money-market-job/"
hidden: true
---
You will need the following external adapter:
- <a href="https://github.com/smartcontractkit/defi-money-market-adapter" target="_blank">Defi Money Market Adapter</a>

Follow the instructions in the README to run the adapter as a function in your infrastructure or to run as a Docker container

Follow [these instructions](../node-operators/) for adding a bridge to your node. Then add the following job to your node. Replace `YOUR_BRIDGE_NAME` with the name of your bridge.
[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"YOUR_BRIDGE_NAME\"\n    },\n    {\n      \"type\": \"multiply\"\n    },\n    {\n      \"type\": \"ethuint256\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "Flux Monitor Job"
    }
  ]
}
[/block]
Give the Job ID to the Chainlink team.