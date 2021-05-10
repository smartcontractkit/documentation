---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (REP/ETH)"
permalink: "docs/aggregator-job-repeth/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run one of the jobs on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. If the API requires an API key, replace `YOUR_API_KEY` with your own.

If using an external adapter, follow [these instructions](../node-operators/) for adding that bridge to your node. Replace `YOUR_BRIDGE_NAME` with the name of your bridge in the job spec.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://bravenewcoin-v1.p.rapidapi.com/convert?qty=1&from=rep&to=eth\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-rapidapi-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t],\n          \"x-rapidapi-host\": [\n          \t\"bravenewcoin-v1.p.rapidapi.com\"\n          ]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonParse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"to_quantity\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test BNC"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://rest.coinapi.io/v1/exchangerate/REP/ETH?apikey=YOUR_API_KEY\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"rate\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test CoinApi"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.coingecko.com/api/v3/simple/price?ids=augur&vs_currencies=eth\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"augur\",\n\t\t\t\t\t\"eth\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test CoinGecko"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=REP&convert=ETH\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"X-CMC_PRO_API_KEY\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonParse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"data\",\n\t\t\t\t\t\"REP\",\n\t\t\t\t\t\"quote\",\n\t\t\t\t\t\"ETH\",\n\t\t\t\t\t\"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test CoinMarketCap"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.cryptoapis.io/v1/exchange-rates/REP/ETH\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"X-API-Key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonParse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"payload\",\n\t\t\t\t\t\"weightedAveragePrice\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test CryptoAPIs"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://min-api.cryptocompare.com/data/price?fsym=REP&tsyms=ETH&apikey=YOUR_API_KEY\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"ETH\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test CryptoCompare"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://web3api.io/api/v2/market/prices/rep/latest?quote=eth\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-api-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"payload\",\n          \"rep_eth\",\n          \"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test Amberdata"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=REP&to_currency=ETH&apikey=YOUR_API_KEY\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"Realtime Currency Exchange Rate\",\n          \"5. Exchange Rate\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test Alpha Vantage"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.nomics.com/v1/currencies/ticker?key=YOUR_API_KEY&ids=REP&interval=1d&convert=ETH\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"0\",\n\t\t\t\t\t\"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test Nomics"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.coinpaprika.com/v1/tickers/rep-augur?quotes=eth\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"quotes\",\n\t\t\t\t\t\"ETH\",\n\t\t\t\t\t\"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Test Coinpaprika"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"type\": \"web\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"REP\",\n                \"to\": \"ETH\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 1000000000000000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        }\n    ]\n}",
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
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://bravenewcoin-v1.p.rapidapi.com/convert?qty=1&from=rep&to=eth\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-rapidapi-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t],\n          \"x-rapidapi-host\": [\n          \t\"bravenewcoin-v1.p.rapidapi.com\"\n          ]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonParse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"to_quantity\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "BNC"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://rest.coinapi.io/v1/exchangerate/REP/ETH?apikey=YOUR_API_KEY\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"rate\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "CoinApi"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.coingecko.com/api/v3/simple/price?ids=augur&vs_currencies=eth\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"augur\",\n\t\t\t\t\t\"eth\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "CoinGecko"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=REP&convert=ETH\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"X-CMC_PRO_API_KEY\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"data\",\n\t\t\t\t\t\"REP\",\n\t\t\t\t\t\"quote\",\n\t\t\t\t\t\"ETH\",\n\t\t\t\t\t\"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "CoinMarketCap"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.cryptoapis.io/v1/exchange-rates/REP/ETH\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"X-API-Key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonParse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"payload\",\n\t\t\t\t\t\"weightedAveragePrice\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "CryptoAPIs"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://min-api.cryptocompare.com/data/price?fsym=REP&tsyms=ETH&apikey=YOUR_API_KEY\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"ETH\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "CryptoCompare"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://web3api.io/api/v2/market/prices/rep/latest?quote=eth\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-api-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"payload\",\n          \"rep_eth\",\n          \"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Amberdata"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=REP&to_currency=ETH&apikey=YOUR_API_KEY\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"Realtime Currency Exchange Rate\",\n          \"5. Exchange Rate\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Alpha Vantage"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.nomics.com/v1/currencies/ticker?key=YOUR_API_KEY&ids=REP&interval=1d&convert=ETH\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"0\",\n\t\t\t\t\t\"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Nomics"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://api.coinpaprika.com/v1/tickers/rep-augur?quotes=eth\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"quotes\",\n\t\t\t\t\t\"ETH\",\n\t\t\t\t\t\"price\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Coinpaprika"
    },
    {
      "code": "{\n    \"initiators\": [\n        {\n            \"params\": {\n                \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n            },\n            \"type\": \"runlog\"\n        }\n    ],\n    \"tasks\": [\n        {\n            \"params\": {\n                \"from\": \"REP\",\n                \"to\": \"ETH\"\n            },\n            \"type\": \"YOUR_BRIDGE_NAME\"\n        },\n        {\n            \"params\": {\n                \"copyPath\": [\n                    \"result\"\n                ]\n            },\n            \"type\": \"copy\"\n        },\n        {\n            \"params\": {\n                \"times\": 1000000000000000000\n            },\n            \"type\": \"multiply\"\n        },\n        {\n            \"type\": \"ethint256\"\n        },\n        {\n            \"type\": \"ethtx\"\n        }\n    ]\n}",
      "language": "json",
      "name": "Bridge"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.