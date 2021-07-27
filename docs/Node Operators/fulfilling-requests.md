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
[block:api-header]
{
  "title": "Prerequisites"
}
[/block]
- Going through the [Beginner Walkthrough](../beginners-tutorial) will help you obtain Testnet LINK and set up Metamask- [Run an Ethereum Client](../run-an-ethereum-client/) - [Running a Chainlink Node](../running-a-chainlink-node/)
[block:callout]
{
  "type": "success",
  "title": "Make sure to fund your node address!",
  "body": "In the `keys` tab, you'll see at the bottom `Account Addresses`. The address of your node is the `regular` one. \n\nIN OLDER VERSIONS: Go to `configuration` in your node. You'll see `ACCOUNT_ADDRESS`. This is the address of your node. Send this address ETH. You can find testnet ETH on various [faucets](../link-token-contracts/).\n\nIf you don't see `ACCOUNT_ADDRESS` there, check the 'Keys' tab and scroll down"
}
[/block]

[block:api-header]
{
  "title": "Deploy your own Oracle contract"
}
[/block]
- Go to <a href="https://remix.ethereum.org/#gist=1d2cb55e777589e59847bc60ebabb005&optimize=true&version=soljson-v0.4.24+commit.e67f0147.js" target="_blank" rel="noreferrer, noopener">Remix</a> and expand the gist menu

![Remix File Explorer](/files/05f12f3-00eeef4-remix001.jpg)


[block:callout]
{
  "type": "info",
  "body": "If you open Remix for the first time, you should chose the **Environments** to **Solidity**"
}
[/block]
- Click on Oracle.sol. The contents of this file will be very minimal, since we only need to import the code hosted on Github.
- On the Compile tab, click on the "Compile Oracle.sol" button near the left

![Remix Select compile-Oracle.sol](/files/6aa5936-remix002.jpg)

- Change to the Run tab
- Select Oracle from the drop-down in the left panel
- Copy the line below for your network and paste it into the text field next to the Deploy button

[block:code]
{
  "codes": [
    {
      "code": "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
      "language": "text",
      "name": "Rinkeby"
    },
    {
      "code": "0xa36085F69e2889c224210F603D836748e7dC0088",
      "language": "text",
      "name": "Kovan"
    },
    {
      "code": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      "language": "text",
      "name": "Mainnet"
    }
  ]
}
[/block]

![Remix Click Deploy Button](/files/b9d3620-remix004.jpg)

- Click Deploy. Metamask will prompt you to Confirm the Transaction

[block:callout]
{
  "type": "warning",
  "body": "If Metamask does not prompt you and instead displays the error below, you will need to disable \"Privacy Mode\" in Metamask. You can do this by clicking on your unique account icon at the top-right, then go to the Settings. Privacy Mode will be a switch near the bottom.\n&nbsp;\nThe error:\n> **Send transaction failed: invalid address . if you use an injected provider, please check it is properly unlocked.**",
  "title": "Metamask doesn't pop up?"
}
[/block]
A link to Etherscan will display at the bottom, you can open that in a new tab to keep track of the transaction

![Remix Pending Transaction Message](/files/b6fe1ac-remix005.jpg)

Once successful, you should have a new address for the deployed contract

![Remix Deployed Contract Address](/files/6858cf3-remix006.jpg)

[block:callout]
{
  "type": "info",
  "body": "Keep note of the Oracle contract's address, you will need it for your consuming contract later."
}
[/block]

[block:api-header]
{
  "title": "Add your node to the Oracle contract"
}
[/block]

- In Remix, call the `setFulfillmentPermission` function with the address of your node, a comma, and the value `true`, as the input parameters. This will allow your node the ability to fulfill requests to your oracle contract.

![Remix Click setFulfillmentPermission](/files/c6925db-remix007.jpg)

You can get the address of your node when it starts or by visiting the Configuration page of the GUI.

1. Bottom of the Keys page in the Account addresses section on recent versions of Chainlink.
![Node UI Account Addresses](/images/node-operators/node-address.png)

1. Configurations page on older Chainlink node versions
![Node UI Configuration Account Address](/files/d2e5225-Screenshot_from_2018-12-17_08-23-16.png)

Once you call the `setFulfillmentPermission` function, Confirm it in Metamask and wait for it to confirm on the blockchain.

[block:api-header]
{
  "title": "Add jobs to the node"
}
[/block]
Adding jobs to the node is easily accomplished via the GUI. We have example [Job Specifications](../job-specifications/) below.

[block:callout]
{
  "type": "danger",
  "body": "Replace `YOUR_ORACLE_CONTRACT_ADDRESS` below with the address of your deployed oracle contract address from the previous steps. Note that this is different than the `ACCOUNT_ADDRESS` from your node."
}
[/block]
If using Chainlink version `0.9.4` or above, you can add a `name` to your job spec. 

[block:code]
{
  "codes": [
    {
      "code": "{ \n  \"name\": \"Get > Bytes32\",\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"ethbytes32\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "EthBytes32 (GET)"
    },
    {
      "code": "{ \n  \"name\": \"Post > Bytes32\",\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httppost\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"ethbytes32\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "EthBytes32 (POST)"
    },
    {
      "code": "{\n  \"name\": \"Get > Int256\",\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"multiply\"\n    },\n    {\n      \"type\": \"ethint256\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "EthInt256"
    },
    {
      "code": "{\n  \"name\": \"Get > Uint256\",\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"multiply\"\n    },\n    {\n      \"type\": \"ethuint256\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "EthUint256"
    },
    {
      "code": "{\n  \"name\": \"Get > Bool\",\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"ethbool\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "EthBool"
    }
  ]
}
[/block]
- From the admin dashboard, click on New Job.

![Node UI New Job Button](/files/25bb51c-Screenshot_from_2018-11-02_08-30-26.png)

- Paste the job from above into the text field.

![Node UI New Job Screen](/files/ee412d6-Screenshot_from_2018-12-15_08-30-43.png)

- Click Create Job and you'll be notified of the new JobID creation. Take note of this JobID as you'll need it later.

![Node UI New Job Message](/files/a7a2f0c-Screenshot_from_2018-11-02_08-42-22.png)

- Repeat this process for each of the jobs above.

[block:callout]
{
  "type": "info",
  "body": "The address for the jobs will auto-populate with the zero-address. This means the Chainlink node will listen to your Job ID from any address. You can also specify an address in the params object of the RunLog initiator for your oracle contract."
}
[/block]

[block:api-header]
{
  "title": "Create a request to your node"
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "If you're going through this guide on Ethereum mainnet, the TestnetConsumer.sol contract will still work. However, understand that you're sending real LINK to yourself. **Be sure to practice on the test networks multiple times before attempting to run a node on mainnet.**"
}
[/block]

With the jobs added, you can now use your node to fulfill requests. This last section shows what requesters will do when they send requests to your node. It is also a way to test and make sure that your node is functioning correctly.
- In Remix, create a new file named TestnetConsumer.sol and copy and paste the <a href="https://gist.githubusercontent.com/thodges-gh/8df9420393fb29b216d1832e037f2eff/raw/350addafcd19e984cdd4465921fbcbe7ce8500d4/ATestnetConsumer.sol" target="_blank" rel="noreferrer, noopener">TestnetConsumer.sol</a> contract into it.
- Click "Start to compile".

![Remix Click Compile](/files/a8a5ecd-Screenshot_from_2019-05-16_15-39-05.png)

The contract should compile. You can now deploy it and fund it by sending some LINK to its address. See the [Fund your contract.](../fund-your-contract/) page for instructions on how to do that.
- To create a request, input your oracle contract address and the JobID for the EthUint256 job into the `requestEthereumPrice` request method, separated by a comma.

![Remix Click requestEthereumPrice](/files/dfce3b0-Screenshot_from_2019-05-16_17-12-51.png)

- Click the request method button and you should see your node log the request coming in and its fulfillment.Once the transaction from the node is confirmed, you should see the value updated on your contract by clicking on the `currentPrice` button.

![Remix currentPrice Result](/files/6741635-Screenshot_from_2019-05-15_15-38-25.png)

[block:api-header]
{
  "title": "Withdrawing LINK"
}
[/block]
To withdraw LINK from the Oracle contract, head to Remix and search for the "withdraw" function in the function list.

![Remix Click Withdraw Button](/files/f8ffdc0-c6925db-remix007.jpg)

Paste the address you want to withdraw to, and the amount of LINK, then click "withdraw". Confirm the transaction in Metamask when the popup appears.