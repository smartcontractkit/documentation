---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (JPY/USD)"
permalink: "docs/aggregator-job-jpyusd/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run one of the jobs on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. If the API requires an API key, replace `YOUR_API_KEY` with your own.

If using an external adapter, follow [these instructions](../node-operators/) for adding that bridge to your node. Replace `YOUR_BRIDGE_NAME` with the name of your bridge in the job spec.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://api.1forge.com/convert?from=JPY&to=USD&quantity=1&api_key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"value\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test 1Forge"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=JPY&to_currency=USD&apikey=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"Realtime Currency Exchange Rate\",\n                    \"5. Exchange Rate\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test AlphaVantage"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://currencyapi.net/api/v1/convert?amount=1&from=JPY&to=USD&key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"conversion\",\n                    \"result\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test CurrencyAPI"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://apilayer.net/api/convert?from=JPY&to=USD&amount=1&access_key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test CurrencyLayer"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://data.fixer.io/api/convert?from=JPY&to=USD&amount=1&access_key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test Fixer"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://openexchangerates.org/api/convert/1/JPY/USD?app_id=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"response\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test OpenExchangeRates"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://api.polygon.io/v1/conversion/JPY/USD?amount=1&precision=4&apikey=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"converted\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Test Polygon"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"JPY\",\n                \"to\": \"USD\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
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
If the test job has ran successfully, add the following job to your node, replacing `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address, and if required, replacing `YOUR_API_KEY` with yours as well.
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://api.1forge.com/convert?from=JPY&to=USD&quantity=1&api_key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"value\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "1Forge"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=JPY&to_currency=USD&apikey=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"Realtime Currency Exchange Rate\",\n                    \"5. Exchange Rate\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "AlphaVantage"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://currencyapi.net/api/v1/convert?amount=1&from=JPY&to=USD&key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"conversion\",\n                    \"result\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "CurrencyAPI"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://apilayer.net/api/convert?from=JPY&to=USD&amount=1&access_key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}\n",
      "language": "json",
      "name": "CurrencyLayer"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://data.fixer.io/api/convert?from=JPY&to=USD&amount=1&access_key=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Fixer"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://openexchangerates.org/api/convert/1/JPY/USD?app_id=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"response\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "OpenExchangeRates"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"get\": \"https://api.polygon.io/v1/conversion/JPY/USD?amount=1&precision=4&apikey=YOUR_API_KEY\"\n            },\n            \"type\": \"httpget\"\n        },\n        {\n            \"params\": {\n                \"path\": [\n                    \"converted\"\n                ]\n            },\n            \"type\": \"jsonparse\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Polygon"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"JPY\",\n                \"to\": \"USD\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 100000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Bridge"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above.

Make sure that your `MINIMUM_CONTRACT_PAYMENT_LINK_JUELS` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.
