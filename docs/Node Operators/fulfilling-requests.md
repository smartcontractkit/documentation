---
layout: nodes.liquid
date: Last Modified
title: "Fulfilling Requests"
permalink: "docs/fulfilling-requests/"
whatsnext: {"Performing System Maintenance":"/docs/performing-system-maintenance/", "Miscellaneous":"/docs/miscellaneous/", "Best Security and Operating Practices":"/docs/best-security-practices/"}
metadata:
  title: "Chainlink Node Operators: Fulfilling Requests"
  description: "Deploy your own Oracle contract and add jobs to your node so that it can provide data to smart contracts."
---
With your own Oracle contract, you can use your own node to fulfill requests. This guide will show you how to deploy your own Oracle contract and add jobs to your node so that it can provide data to smart contracts.

## Prerequisites

- Going through the [Beginner Walkthrough](../beginners-tutorial) will help you obtain Testnet LINK and set up Metamask- [Run an Ethereum Client](../run-an-ethereum-client/) - [Running a Chainlink Node](../running-a-chainlink-node/)

> 👍 Make sure to fund your node address!
>
> In the `keys` tab, you'll see at the bottom `Account Addresses`. The address of your node is the `regular` one.
>
> IN OLDER VERSIONS: Go to `configuration` in your node. You'll see `ACCOUNT_ADDRESS`. This is the address of your node. Send this address ETH. You can find testnet ETH on various [faucets](../link-token-contracts/). If you don't see `ACCOUNT_ADDRESS` there, check the 'Keys' tab and scroll down

## Deploy your own Oracle contract

- Go to [Remix](https://remix.ethereum.org/#optimize=true&version=soljson-v0.4.24+commit.e67f0147.js&url=https://docs.chain.link/samples/NodeOperators/Oracle.sol) and expand the gist menu

![Remix File Explorer](/files/05f12f3-00eeef4-remix001.jpg)

> 📘 Important
>
> If you open Remix for the first time, you should chose the **Environments** to **Solidity**

- Click on Oracle.sol. The contents of this file will be very minimal, since we only need to import the code hosted on Github.- On the Compile tab, click on the "Compile Oracle.sol" button near the left

![Remix Select compile-Oracle.sol](/files/6aa5936-remix002.jpg)

- Change to the Run tab
- Select Oracle from the drop-down in the left panel
- Copy the line below for your network and paste it into the text field next to the Deploy button

``` text Rinkeby
0x01BE23585060835E02B77ef475b0Cc51aA1e0709
```
``` text Kovan
0xa36085F69e2889c224210F603D836748e7dC0088
```
``` text Mainnet
0x514910771AF9Ca656af840dff83E8264EcF986CA
```

![Remix Click Deploy Button](/files/b9d3620-remix004.jpg)

- Click Deploy. Metamask will prompt you to Confirm the Transaction

> 🚧 Metamask doesn't pop up?
>
> If Metamask does not prompt you and instead displays the error below, you will need to disable "Privacy Mode" in Metamask. You can do this by clicking on your unique account icon at the top-right, then go to the Settings. Privacy Mode will be a switch near the bottom.
>
> The error: **Send transaction failed: invalid address. If you use an injected provider, please check it is properly unlocked.**

A link to Etherscan will display at the bottom, you can open that in a new tab to keep track of the transaction

![Remix Pending Transaction Message](/files/b6fe1ac-remix005.jpg)

Once successful, you should have a new address for the deployed contract

![Remix Deployed Contract Address](/files/6858cf3-remix006.jpg)

> 📘 Important
>
> Keep note of the Oracle contract's address, you will need it for your consuming contract later.

## Add your node to the Oracle contract

- In Remix, call the `setFulfillmentPermission` function with the address of your node, a comma, and the value `true`, as the input parameters. This will allow your node the ability to fulfill requests to your oracle contract.

![Remix Click setFulfillmentPermission](/files/c6925db-remix007.jpg)

You can get the address of your node when it starts or by visiting the Configuration page of the GUI.

1. Bottom of the Keys page in the Account addresses section on recent versions of Chainlink.
![Node UI Account Addresses](/images/node-operators/node-address.png)

1. Configurations page on older Chainlink node versions
![Node UI Configuration Account Address](/files/d2e5225-Screenshot_from_2018-12-17_08-23-16.png)

Once you call the `setFulfillmentPermission` function, Confirm it in Metamask and wait for it to confirm on the blockchain.

## Add jobs to the node

Adding jobs to the node is easily accomplished via the GUI. We have example [Job Specifications](../job-specifications/) below.

> ❗️ Required
>
> Replace `YOUR_ORACLE_CONTRACT_ADDRESS` below with the address of your deployed oracle contract address from the previous steps. Note that this is different than the `ACCOUNT_ADDRESS` from your node.

If using Chainlink version `0.9.4` or above, you can add a `name` to your job spec.

```json EthBytes32 (GET)
{
  "name": "Get > Bytes32",
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
      "type": "httpget"
    },
    {
      "type": "jsonparse"
    },
    {
      "type": "ethbytes32"
    },
    {
      "type": "ethtx"
    }
  ]
}
```
```json EthBytes32 (POST)
{
  "name": "POST > Bytes32",
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
      "type": "httpget"
    },
    {
      "type": "jsonparse"
    },
    {
      "type": "ethbytes32"
    },
    {
      "type": "ethtx"
    }
  ]
}
```
```json EthInt256
{
  "name": "Get > Int256",
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
      "type": "httpget"
    },
    {
      "type": "jsonparse"
    },
    {
      "type": "multiply"
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
```json EthUint256
{
  "name": "Get > Uint256",
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
      "type": "httpget"
    },
    {
      "type": "jsonparse"
    },
    {
      "type": "multiply"
    },
    {
      "type": "ethuint256"
    },
    {
      "type": "ethtx"
    }
  ]
}
```
```json EthBool
{
  "name": "Get > Bool",
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
      "type": "httpget"
    },
    {
      "type": "jsonparse"
    },
    {
      "type": "ethbool"
    },
    {
      "type": "ethtx"
    }
  ]
}
```

- From the admin dashboard, click on New Job.

![Node UI New Job Button](/files/25bb51c-Screenshot_from_2018-11-02_08-30-26.png)

- Paste the job from above into the text field.

![Node UI New Job Screen](/files/ee412d6-Screenshot_from_2018-12-15_08-30-43.png)

- Click Create Job and you'll be notified of the new JobID creation. Take note of this JobID as you'll need it later.

![Node UI New Job Message](/files/a7a2f0c-Screenshot_from_2018-11-02_08-42-22.png)

- Repeat this process for each of the jobs above.

> 📘 Note
>
> The address for the jobs will auto-populate with the zero-address. This means the Chainlink node will listen to your Job ID from any address. You can also specify an address in the params object of the RunLog initiator for your oracle contract.

## Create a request to your node

> 📘 Important
>
> If you're going through this guide on Ethereum mainnet, the TestnetConsumer.sol contract will still work. However, understand that you're sending real LINK to yourself. **Be sure to practice on the test networks multiple times before attempting to run a node on mainnet.**

With the jobs added, you can now use your node to fulfill requests. This last section shows what requesters will do when they send requests to your node. It is also a way to test and make sure that your node is functioning correctly.- In Remix, create a new file named TestnetConsumer.sol and copy and paste the [TestnetConsumer.sol](https://docs.chain.link/samples/APIRequests/ATestnetConsumer.sol) contract into it.- Click "Start to compile".

![Remix Click Compile](/files/a8a5ecd-Screenshot_from_2019-05-16_15-39-05.png)

The contract should compile. You can now deploy it and fund it by sending some LINK to its address. See the [Fund your contract.](../fund-your-contract/) page for instructions on how to do that.
- To create a request, input your oracle contract address and the JobID for the EthUint256 job into the `requestEthereumPrice` request method, separated by a comma.

![Remix Click requestEthereumPrice](/files/dfce3b0-Screenshot_from_2019-05-16_17-12-51.png)

- Click the request method button and you should see your node log the request coming in and its fulfillment.Once the transaction from the node is confirmed, you should see the value updated on your contract by clicking on the `currentPrice` button.

![Remix currentPrice Result](/files/6741635-Screenshot_from_2019-05-15_15-38-25.png)

## Withdrawing LINK

To withdraw LINK from the Oracle contract, head to Remix and search for the "withdraw" function in the function list.

![Remix Click Withdraw Button](/files/f8ffdc0-c6925db-remix007.jpg)

Paste the address you want to withdraw to, and the amount of LINK, then click "withdraw". Confirm the transaction in Metamask when the popup appears.
