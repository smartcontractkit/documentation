---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (Brent Crude Oil)"
permalink: "docs/aggregator-job-brent-crude-oil/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run one of the jobs on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node. These jobs make use of external adapters instead of specifying the URLs directly in the HttpGet adapter.

Here are the links to the repositories of the external adapters:
- <a href="https://github.com/smartcontractkit/oilpriceapi-adapter" target="_blank">Oil Price API</a>
- <a href="https://github.com/smartcontractkit/eodhistoricaldata-adapter" target="_blank">EOD Historical Data</a>
- <a href="https://github.com/smartcontractkit/yahoo-finance-adapter" target="_blank">Yahoo Finance</a>

Follow [these instructions](../node-operators/) for adding a bridge to your node before adding jobs.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. Follow [these instructions](../node-operators/) for adding that bridge to your node.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"BZ=F\"\n            },\n            \"type\": \"yahoofinance\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test Yahoo Finance"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"BZ.COMM\"\n            },\n            \"type\": \"eodhistoricaldata\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test EOD Historical Data"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"BRENT_CRUDE_USD\"\n            },\n            \"type\": \"oilpriceapi\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test Oil Price API"
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
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"BZ=F\"\n            },\n            \"type\": \"yahoofinance\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Yahoo Finance"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"BZ.COMM\"\n            },\n            \"type\": \"eodhistoricaldata\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "EOD Historical Data"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"BRENT_CRUDE_USD\"\n            },\n            \"type\": \"oilpriceapi\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Oil Price API"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.