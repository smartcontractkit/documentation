---
layout: nodes.liquid
date: Last Modified
title: "Flux Monitor Job (LINK/USD)"
permalink: "docs/flux-monitor-job-linkusd/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run one of the jobs on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node.

You will need to set the configuration variable `FEATURE_FLUX_MONITOR` to `true`.

External adapters can be found <a href="https://github.com/smartcontractkit/external-adapters-js" target="_blank">here</a>.

Follow the instructions in the README to run the adapter as a function in your infrastructure. You may need to obtain an API key for the data provider assigned to you.

Make sure your node's `ACCOUNT_ADDRESS` is updated in the <a href="https://github.com/smartcontractkit/reference-data-directory" target="_blank">reference-data-directory repository</a>. Your node needs to only have one wallet to manage. If your node is using multiple addresses, consolidate to one.

Follow [these instructions](../node-operators) for adding a bridge to your node. Then add the following job to your node. Replace `YOUR_BRIDGE_NAME` with the name of your bridge.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"fluxmonitor\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"0x613a38AC1659769640aaE063C651F48E0250454C\",\n\t\t\t\t\"requestData\": {\n\t\t\t\t\t\"data\": {\n\t\t\t\t\t\t\"from\": \"LINK\",\n\t\t\t\t\t\t\"to\": \"USD\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t\"feeds\": [\n\t\t\t\t\t{ \"bridge\": \"YOUR_BRIDGE_NAME\" }\n\t\t\t\t],\n\t\t\t\t\"threshold\": 1,\n\t\t\t\t\"precision\": 8,\n\t\t\t\t\"idleTimer\": { \"disabled\": true },\n\t\t\t\t\"pollTimer\": { \"period\": \"1m\" }\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 100000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Flux Monitor Job"
    }
  ]
}
[/block]