---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (AMPL/USD)"
permalink: "docs/aggregator-job-amplusd/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run one of the jobs on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node.

Here are the links to the repositories of the external adapters:
- <a href="https://github.com/smartcontractkit/bnc-rapidapi-adapter" target="_blank">Brave New Coin</a>
- <a href="https://github.com/smartcontractkit/cryptocompare-vwap-adapter" target="_blank">CryptoCompare</a>
- <a href="https://github.com/challengerdeep/exchange-rates-vwap-chainlink-adapter" target="_blank">Kaiko</a>
- <a href="https://github.com/anyblockanalytics/chainlink-oracle-market-adapter" target="_blank">Anyblock Analytics</a>

Follow the instructions in the README to run the adapter as a function in your infrastructure. You will need to obtain an API key for the data provider assigned to you.

Once the adapter is deployed in your infrastructure, [add the adapter](../node-operators/) as a bridge to your node with one of the names:
-  `bnc-vwap`
- `cryptocompare-vwap`
- `kaiko-vwap`
- `anyblock-vwap`
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"type\": \"bnc-vwap\",\n            \"params\": {\n                \"coin\": \"AMPL\"\n            }\n        },\n        {\n            \"type\": \"copy\",\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            }\n        },\n        {\n            \"type\": \"multiply\",\n            \"params\": {\n                \"times\": 1000000000000000000\n            }\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Web BNC Test"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"type\": \"cryptocompare-vwap\",\n            \"params\": {\n                \"coin\": \"AMPL\"\n            }\n        },\n        {\n            \"type\": \"multiply\",\n            \"params\": {\n                \"times\": 1000000000000000000\n            }\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Web CryptoCompare Test"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"type\": \"kaiko-vwap\",\n            \"params\": {\n                \"coin\": \"AMPL\"\n            }\n        },\n        {\n            \"type\": \"multiply\",\n            \"params\": {\n                \"times\": 1000000000000000000\n            }\n        },\n        {\n            \"type\": \"ethuint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Web Kaiko Test"
    },
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"web\",\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"anyblock-vwap\",\n    },\n    {\n      \"type\": \"copy\",\n      \"params\": {\n        \"copyPath\": [\n          \"overallVWAP\"\n        ]\n      }\n    },\n    {\n      \"type\": \"multiply\",\n      \"params\": {\n        \"times\": 1000000000000000000\n      }\n    },\n    {\n      \"type\": \"ethuint256\"\n    }\n  ]\n}",
      "language": "json",
      "name": "Web Anyblock Test"
    }
  ]
}
[/block]
On the Job Spec Detail page for the job, click the Run button. You should see a green bar at the top that the node Successfully created job run <JobRunID>. Click on that Job Run ID and verify that all tasks have been Completed with green check marks (similar to the screenshot below).
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
If the test job has ran successfully, add the following job to your node, replacing `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"runlog\",\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            }\n        }\n    ],\n    \"tasks\": [\n        {\n            \"type\": \"bnc-vwap\",\n            \"params\": {\n                \"coin\": \"AMPL\"\n            }\n        },\n        {\n            \"type\": \"copy\",\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            }\n        },\n        {\n            \"type\": \"multiply\",\n            \"params\": {\n                \"times\": 1000000000000000000\n            }\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "Runlog BNC"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"runlog\",\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            }\n        }\n    ],\n    \"tasks\": [\n        {\n            \"type\": \"cryptocompare-vwap\",\n            \"params\": {\n                \"coin\": \"AMPL\"\n            }\n        },\n        {\n            \"type\": \"multiply\",\n            \"params\": {\n                \"times\": 1000000000000000000\n            }\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "Runlog CryptoCompare"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"runlog\",\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            }\n        }\n    ],\n    \"tasks\": [\n        {\n            \"type\": \"kaiko-vwap\",\n            \"params\": {\n                \"coin\": \"AMPL\"\n            }\n        },\n        {\n            \"type\": \"multiply\",\n            \"params\": {\n                \"times\": 1000000000000000000\n            }\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "Runlog Kaiko"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"runlog\",\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            }\n        }\n    ],\n    \"tasks\": [\n        {\n            \"type\": \"anyblock-vwap\"\n        },\n{\n      \"type\": \"copy\",\n      \"params\": {\n        \"copyPath\": [\n          \"overallVWAP\"\n        ]\n      }\n    },\n        {\n            \"type\": \"multiply\",\n            \"params\": {\n                \"times\": 1000000000000000000\n            }\n        },\n        {\n            \"type\": \"ethuint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Runlog Anyblock"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above for the data provider you've been assigned.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.