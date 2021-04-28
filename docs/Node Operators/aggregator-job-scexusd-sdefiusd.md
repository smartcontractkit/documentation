---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (sCEX/USD & sDEFI/USD)"
permalink: "docs/aggregator-job-scexusd-sdefiusd/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run one of the jobs on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node.

Here are the links to the repositories of the external adapters:
- <a href="https://github.com/smartcontractkit/synth-index-alphavantage-adapter" target="_blank">AlphaVantage</a>
- <a href="https://github.com/smartcontractkit/synth-index-bnc-adapter" target="_blank">Brave New Coin</a>
- <a href="https://github.com/smartcontractkit/synth-index-coinapi-adapter" target="_blank">CoinAPI</a>
- <a href="https://github.com/smartcontractkit/synth-index-coingecko-adapter" target="_blank">CoinGecko</a>
- <a href="https://github.com/smartcontractkit/synth-index-cmc-adapter" target="_blank">CoinMarketCap</a>
- <a href="https://github.com/smartcontractkit/synth-index-coinpaprika-adapter" target="_blank">CoinPaprika</a>
- <a href="https://github.com/smartcontractkit/synth-index-cc-adapter" target="_blank">CryptoCompare</a>

Follow the instructions in the README to run the adapter as a function in your infrastructure. You may need to obtain an API key for the data provider assigned to you.

Once the adapter is deployed in your infrastructure, [add the adapter](../node-operators/) as a bridge to your node with the name: `synth-index`. The Bridge URL should be the URL of the adapter, and leave Minimum Contract Payment and Confirmations at 0.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"sCEX\"\n            },\n            \"type\": \"synth-index\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "Web sCEX Test"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"sDEFI\"\n            },\n            \"type\": \"synth-index\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "Web sDEFI Test"
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
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"sCEX\"\n            },\n            \"type\": \"synth-index\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "Runlog sCEX"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"asset\": \"sDEFI\"\n            },\n            \"type\": \"synth-index\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "Runlog sDEFI"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above for the data provider you've been assigned.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.