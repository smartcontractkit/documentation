---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (Fast Gas)"
permalink: "docs/aggregator-job-fast-gas/"
hidden: true
---
In order to contribute to the gas price aggregator contract, you will need to run one of the external adapters listed below. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node.

External adapters can be found <a href="https://github.com/smartcontractkit/external-adapters-js" target="_blank">here</a>.
These directories have the adapters:
- amberdata-gasprice
- anyblock-gasprice
- etherchain
- ethgasstation
- poa-gasprice

Follow the instructions in the README to run the adapter in your infrastructure. Follow [these instructions](../node-operators) for adding a bridge to your node. Then add the following job to your node. Replace `YOUR_BRIDGE_NAME` with the name of your bridge.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. If the API requires an API key, replace `YOUR_API_KEY` with your own.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"speed\": \"fast\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test Bridge"
    }
  ]
}
[/block]
On the Job Spec Detail page for the job, click the Run button. You should see a green bar at the top that the node Successfully created job run <JobRunID>. Click on that Job Run ID and verify that all tasks have been Completed with green check marks.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8cfc185-Screenshot_from_2019-06-21_08-29-07.png",
        "Screenshot from 2019-06-21 08-29-07.png",
        1894,
        806,
        "#fafafb"
      ]
    }
  ]
}
[/block]
If the test job has ran successfully, add the following job to your node, replacing `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address, and if required, replacing `YOUR_API_KEY` with yours as well.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"speed\": \"fast\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Bridge"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.