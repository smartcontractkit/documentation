---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Proof of Reserves (BTC)"
permalink: "docs/proof-of-reserves-btc/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run external adapters for the provider you have been assigned. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs to your node.

External adapters can be found [here](https://github.com/smartcontractkit/external-adapters-js).

Follow the instructions in the README to run the adapter in your infrastructure. You may need to obtain an API key for the data provider assigned to you. Follow [these instructions](../node-operators/) for adding the external adapter as a bridge to your node.

First, add a test job to your node which uses the Web initiator so that you can validate that the job will run successfully. Rename bridge names if required.

```json Test RenVM & Blockcypher
{
    "initiators": [
        {
            "type": "web"
        }
    ],
    "tasks": [
        {
            "type": "renvm-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockcypher",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 6
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        }
    ]
}
```
```json Test wBTC & Blockcypher
{
    "initiators": [
        {
            "type": "web"
        }
    ],
    "tasks": [
        {
            "type": "wbtc-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockcypher",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 6
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        }
    ]
}
```
```json Test RenVM & Blockchain.com
{
    "initiators": [
        {
            "type": "web"
        }
    ],
    "tasks": [
        {
            "type": "renvm-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockchain-com",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        }
    ]
}
```
```json Test wBTC & Blockchain.com
{
    "initiators": [
        {
            "type": "web"
        }
    ],
    "tasks": [
        {
            "type": "wbtc-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockchain-com",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        }
    ]
}
```

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

```json RenVM & Blockcypher
{
    "initiators": [
        {
            "type": "runlog",
            "params": {
                "address": "YOUR_ORACLE_CONTRACT_ADDRESS"
            }
        }
    ],
    "tasks": [
        {
            "type": "renvm-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockcypher",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 6
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        },
        {
            "type": "ethtx"
        }
    ]
}
```
```json wBTC & Blockcypher
{
    "initiators": [
        {
            "type": "runlog",
            "params": {
                "address": "YOUR_ORACLE_CONTRACT_ADDRESS"
            }
        }
    ],
    "tasks": [
        {
            "type": "wbtc-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockcypher",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 6
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        },
        {
            "type": "ethtx"
        }
    ]
}
```
```json RenVM & Blockchain.com
{
    "initiators": [
        {
            "type": "runlog",
            "params": {
                "address": "YOUR_ORACLE_CONTRACT_ADDRESS"
            }
        }
    ],
    "tasks": [
        {
            "type": "renvm-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockchain-com",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        },
        {
            "type": "ethtx"
        }
    ]
}
```
```json wBTC & Blockchain.com
{
    "initiators": [
        {
            "type": "runlog",
            "params": {
                "address": "YOUR_ORACLE_CONTRACT_ADDRESS"
            }
        }
    ],
    "tasks": [
        {
            "type": "wbtc-address-set",
            "params": {
                "network": "mainnet",
                "tokenOrContract": "btc"
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "blockchain-com",
            "params": {
                "dataPath": "result",
                "endpoint": "balance",
                "confirmations": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "reduce",
            "params": {
                "reducer": "sum",
                "dataPath": "result",
                "valuePath": "balance",
                "initialValue": 0
            }
        },
        {
            "type": "copy",
            "params": {
                "copyPath": [
                    "result"
                ]
            }
        },
        {
            "type": "ethint256"
        },
        {
            "type": "ethtx"
        }
    ]
}
```

Once added, open a PR with the Job ID associated with the job above. Base this PR off the branch of the PR sent to you by the Chainlink team.

Make sure that your `MINIMUM_CONTRACT_PAYMENT_LINK_JUELS` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.
