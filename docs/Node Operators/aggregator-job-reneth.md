---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (REN/ETH)"
permalink: "docs/aggregator-job-reneth/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run an external adapter for the provider you have been assigned. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs to your node.

External adapters can be found <a href="https://github.com/smartcontractkit/external-adapters-js" target="_blank">here</a>.

Follow the instructions in the README to run the adapter in your infrastructure. You may need to obtain an API key for the data provider assigned to you. Follow [these instructions](../node-operators/) for adding the external adapter as a bridge to your node.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. Replace `YOUR_BRIDGE_NAME` with the name of your bridge.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"REN\",\n                \"to\": \"ETH\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 1000000000000000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
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
If the test job has ran successfully, add the following job to your node, replacing `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address, and  `YOUR_BRIDGE_NAME` with the name of your bridge.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"REN\",\n                \"to\": \"ETH\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 1000000000000000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Bridge"
    }
  ]
}
[/block]
Once added, open a PR with the Job ID associated with the job above.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.