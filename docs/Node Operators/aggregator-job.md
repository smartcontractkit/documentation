---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Jobs"
permalink: "docs/aggregator-job/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run an external adapter for the provider you have been assigned. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs to your node.

External adapters can be found <a href="https://github.com/smartcontractkit/external-adapters-js" target="_blank">here</a>.

Follow the instructions in the README to run the adapter in your infrastructure. You may need to obtain an API key for the data provider assigned to you. Follow [these instructions](../node-operators/) for adding the external adapter as a bridge to your node.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. Replace the following values:
- `YOUR_BRIDGE_NAME` with the name of your bridge
- `FROM_SYMBOL` with the symbol of the currency
- `TO_SYMBOL` with the symbol to convert to
- `TIMES_VALUE` with the value to multiply the result by (as a number)
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"FROM_SYMBOL\",\n                \"to\": \"TO_SYMBOL\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": TIMES_VALUE\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
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
        "/files/8cfc185-Screenshot_from_2019-06-21_08-29-07.png",
        "Screenshot from 2019-06-21 08-29-07.png",
        1894,
        806,
        "#fafafb"
      ]
    }
  ]
}
[/block]
If the test job has ran successfully, add the following job to your node. Replace the following values:
- `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address
- `AGGREGATOR_ADDRESS` with the address of the aggregator contract
- `YOUR_BRIDGE_NAME` with the name of your bridge
- `FROM_SYMBOL` with the symbol of the currency
- `TO_SYMBOL` with the symbol to convert to
- `TIMES_VALUE` with the value to multiply the result by (as a number)
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\",\n                \"requesters\": [\n                  \"AGGREGATOR_ADDRESS\"\n                  \"0xBd2263cd600749a7072B41C04678f7647ee47e95\",\n                  \"0xC7A524e42d834408Ff001E5471Fac0117B3A9E88\",\n                  \"0xc9d995bc276385e6E9136Dabe1223Db8a1777d2a\",\n                  \"0x88424e492b31D46f9F2e12A3d9187a9C486cA4B8\",\n                  \"0xAAf337687be186caE90Db1230d4C31567BeB32Ef\",\n                  \"0xb96051214aaa35CEA7e95F2f6940bF15AACcc896\",\n                  \"0xabd9290B57A0FBC565D21aDE4311AE6393AeA822\"\n                ]\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"FROM_SYMBOL\",\n                \"to\": \"TO_SYMBOL\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": TIMES_VALUE\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Bridge"
    }
  ]
}
[/block]
Once added, open a PR with the Job ID associated with the job above. Base this PR off the branch of the PR sent to you by the Chainlink team.

Make sure that your `MINIMUM_CONTRACT_PAYMENT_LINK_JUELS` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.
