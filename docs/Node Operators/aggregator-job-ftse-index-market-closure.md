---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (FTSE Index, market closure)"
permalink: "docs/aggregator-job-ftse-index-market-closure/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run the job on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node. These jobs make use of external adapters instead of specifying the URLs directly in the HttpGet adapter.

Use this repository to build an adapter using the data provider you have been assigned: 
[external-adapters-js/market-closure](https://github.com/smartcontractkit/external-adapters-js/tree/master/market-closure)

When using this adapter, you need to set the API key for your data provider, TradingHours.com and an RPC URL for an Ethereum node. Example .env file:

```
API_KEY=YOUR_DATA_PROVIDER_API_KEY
TH_API_KEY=YOUR_TRADINGHOURS_API_KEY
RPC_URL=http://YOUR_MAINNET_RPC_URL
```

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. Follow [these instructions](../node-operators/) for adding that bridge to your node.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\":[\n        {\n            \"type\":\"web\"\n        }\n    ],\n    \"tasks\":[\n        {\n            \"params\":{\n                \"asset\":\"FTSE\",\n                \"referenceContract\":\"0x5F4Ce2e0d0b9AE3CA0652FbBa1401cb9C8495718\",\n                \"multiply\":100000000,\n                \"schedule\":{\n                    \"timezone\":\"Europe/London\",\n                    \"hours\":{\n                        \"monday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"tuesday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"wednesday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"thursday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"friday\":[\n                            \"08:00-16:30\"\n                        ]\n                    },\n                    \"holidays\":[\n                        {\n                            \"year\":2020,\n                            \"month\":4,\n                            \"day\":10\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":4,\n                            \"day\":13\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":5,\n                            \"day\":8\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":5,\n                            \"day\":25\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":8,\n                            \"day\":31\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":24,\n                            \"hours\":\"12:30-23:59\"\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":25\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":28\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":31,\n                            \"hours\":\"12:30-23:59\"\n                        },\n                        {\n                            \"year\":2021,\n                            \"month\":1,\n                            \"day\":1\n                        }\n                    ]\n                }\n            },\n            \"type\":\"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\":{\n                \"copyPath\":[\n                    \"result\"\n                ]\n            },\n            \"type\":\"copy\"\n        },\n        {\n            \"params\":{\n                \"times\":100000000\n            },\n            \"type\":\"multiply\"\n        },\n        {\n            \"type\":\"ethuint256\"\n        }\n    ]\n}",
      "language": "json"
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
If the test job has ran successfully, add the following job to your node, replacing `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address,.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\":[\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\":[\n        {\n            \"params\":{\n                \"asset\":\"FTSE\",\n                \"referenceContract\":\"0x5F4Ce2e0d0b9AE3CA0652FbBa1401cb9C8495718\",\n                \"multiply\":100000000,\n                \"schedule\":{\n                    \"timezone\":\"Europe/London\",\n                    \"hours\":{\n                        \"monday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"tuesday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"wednesday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"thursday\":[\n                            \"08:00-16:30\"\n                        ],\n                        \"friday\":[\n                            \"08:00-16:30\"\n                        ]\n                    },\n                    \"holidays\":[\n                        {\n                            \"year\":2020,\n                            \"month\":4,\n                            \"day\":10\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":4,\n                            \"day\":13\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":5,\n                            \"day\":8\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":5,\n                            \"day\":25\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":8,\n                            \"day\":31\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":24,\n                            \"hours\":\"12:30-23:59\"\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":25\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":28\n                        },\n                        {\n                            \"year\":2020,\n                            \"month\":12,\n                            \"day\":31,\n                            \"hours\":\"12:30-23:59\"\n                        },\n                        {\n                            \"year\":2021,\n                            \"month\":1,\n                            \"day\":1\n                        }\n                    ]\n                }\n            },\n            \"type\":\"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\":{\n                \"copyPath\":[\n                    \"result\"\n                ]\n            },\n            \"type\":\"copy\"\n        },\n        {\n            \"params\":{\n                \"times\":100000000\n            },\n            \"type\":\"multiply\"\n        },\n        {\n            \"type\":\"ethuint256\"\n        },\n        {\n            \"type\":\"ethtx\"\n        }\n    ]\n}",
      "language": "json"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.