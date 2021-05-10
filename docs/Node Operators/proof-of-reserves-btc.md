---
layout: nodes.liquid
date: Last Modified
title: "Proof of Reserves (BTC)"
permalink: "docs/proof-of-reserves-btc/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run external adapters for the provider you have been assigned. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs to your node.

External adapters can be found <a href="https://github.com/smartcontractkit/external-adapters-js" target="_blank">here</a>.

Follow the instructions in the README to run the adapter in your infrastructure. You may need to obtain an API key for the data provider assigned to you. Follow [these instructions](../node-operators/) for adding the external adapter as a bridge to your node.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. Rename bridge names if required.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"renvm-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockcypher\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 6\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "Test RenVM & Blockcypher"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"wbtc-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockcypher\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 6\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "Test wBTC & Blockcypher"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"renvm-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockchain-com\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "Test RenVM & Blockchain.com"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"wbtc-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockchain-com\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "Test wBTC & Blockchain.com"
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
If the test job has ran successfully, add the following job to your node. Rename bridge names if required. Replace the following values:
- `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"renvm-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockcypher\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 6\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "RenVM & Blockcypher"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"wbtc-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockcypher\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 6\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "wBTC & Blockcypher"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"renvm-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockchain-com\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "RenVM & Blockchain.com"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"wbtc-address-set\",\n\t\t\t\"params\": {\n\t\t\t\t\"network\": \"mainnet\",\n\t\t\t\t\"tokenOrContract\": \"btc\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"blockchain-com\",\n\t\t\t\"params\": {\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"endpoint\": \"balance\",\n\t\t\t\t\"confirmations\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"reduce\",\n\t\t\t\"params\": {\n\t\t\t\t\"reducer\": \"sum\",\n\t\t\t\t\"dataPath\": \"result\",\n\t\t\t\t\"valuePath\": \"balance\",\n\t\t\t\t\"initialValue\": 0\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}\n",
      "language": "json",
      "name": "wBTC & Blockchain.com"
    }
  ]
}
[/block]
Once added, open a PR with the Job ID associated with the job above. Base this PR off the branch of the PR sent to you by the Chainlink team.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.