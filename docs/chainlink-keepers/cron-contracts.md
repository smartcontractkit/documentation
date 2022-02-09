---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Keepers Job Scheduler'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

# Overview
This guide outlines how you can quickly set up a time schedule to automatically execute your smart contracts using the Chainlink Keepers Job Scheduler.

**Table of Contents**

+ [Overview](#overview)
+ [Job Scheduler Overview](#job-scheduler-overview)
+ [Job Scheduling Tutorial](#job-scheduling-tutorial)
+ [Useful Patterns and Best Practices](#useful-patterns-and-best-practices)
+ [Resources](#resources)


# Job Scheduler Overview

With the Job Scheduler you can schedule jobs to automatically execute your smart contract functions at specific times using the Chainlink Keepers network. Simply specify the address of your target contract, the function to execute, and the execution time(s) to create a new scheduled job. Once you register your Job Scheduler with Chainlink Keepers, the decentralized Keepers network will start monitoring and executing your scheduled jobs.  

# Job Scheduling Tutorial

We will be using [Remix](https://remix.ethereum.org/) for this tutorial. To learn more about Remix and how you can use it to deploy a smart contract, visit our [tutorial](https://www.youtube.com/watch?v=JWJWT9cwFbo).

You will also need a MetaMask (or other Remix compatible wallet) in your browser with some testnet tokens of choice. See our [MetaMask tutorial](https://www.youtube.com/watch?v=4ZgFijd02Jo) if you need help setting up a wallet.

We recommend you first test the tutorial on an EVM-compatible testnet where Chainlink Keepers is deployed.

## Creating your own Job Scheduler contract

To create your own on-chain Job Scheduler contract, we will use the externally audited and pre-deployed Chainlink  [CronUpkeepFactory](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/factories/CronUpkeepFactory.sol) smart contract to deploy a new on-chain smart contract. This is called the [Factory pattern](https://www.youtube.com/watch?v=Q1zZo4O_Ong), where one contract deploys another contract. To generate your Job Scheduler (called `CronUpkeep`), select the new file icon in Remix, name it `CronUpkeepFactory.abi` and paste the ABI for `CronUkeepFactory`. The ABI is the application binary interface that is used to interact with the smart contract that has been deployed to the network.

![Remix ABI Cron](/images/keepers/cron-1.png)

Now select the **DEPLOY & RUN TRANSACTIONS** icon on the left and set **Environment** to *Injected Web3*. Paste the address of your deployed `CronUpkeepFactory` contract in the **At Address** box and select the **At Address** button. You can find the addresses for `CronUpkeepFactory` [below](#contract-addresses). Once this step is completed, you will be able to view callable functions fo the `CronUpkeepFactory`. Select the orange `newCronUpkeep` button and follow the prompts to confirm the transaction. Once the transaction is complete you should see a transaction hash in the terminal pointing to the creation of your Job Scheduler

## Finding the address of your Job Scheduler

Please copy the transaction hash of your transaction, and open it in the scanner of the chain you are working on. For example, if you were working on Ethereum Kovan please go to https://kovan.etherscan.io/ and search for your Transaction Hash. Now select the *Internal Txns* tab which will show the contract creation and contract address in the To field. Please note the address and transaction hash for future use.

![Remix Transaction Hash](/images/keepers/cron-2.png)

## Interacting with your Job Scheduler

To interact with your Job Scheduler contract, create a new file called `CronUpkeep.abi` in Remix and paste the ABI for `CronUpkeep` contract from the Resources section below. Select the **DEPLOY & RUN TRANSACTIONS** icon on the left and paste the address of your Job Scheduler contract in the **At Address** box, and then select the **At Address** button. Please accept the prompts after which the contract interface will open in the bottom left of Remix.

![Remix Contract Interface](/images/keepers/cron-3.png)

## Scheduling a Job

To schedule a new job, use the function `createCronJobFromEncodedSpec`. This function has three inputs: 

+ The target address of the smart contract you want to automate
+ The [function signature](#function-signature), or the encoding of the function, you want to call 
+ The [encodedCronSpec](#encodedcronspec), which is an encoding of your specified time interval.

Please see each of the sections below to get the function signature and the encodedCronSpec. 

We will now paste, minus <> brackets, 
```json
<your target address>, <your function specification>, <your encodedCronSpec>
```
into the into the createCronJobFromEncodedSpec function in Remix and execute it. Once executed, you can call the getActiveCronJobIDs to see if your job has been registered. You can execute the getCronJob function to see the details of your job played back. You can add multiple jobs on this contract in this fashion, and also use the other functions in your Job Scheduler to delete jobs or pause the scheduler.

[[To do insert picture!!!!!!!]]

While the job has been scheduled, you still have to register your Job Scheduler with the Chainlink Keepers service to have it monitored. 

## Setting up Chainlink Keepers

To learn how to make your smart contract Keeper-compatible refer to [Making Compatible Contracts](../compatible-contracts). To register yout contract on the Chainlink Keeper Network, refer to [Register Upkeep for a Contract](../register-upkeep). Be sure to provide the address of your Job Scheduler contract in **Upkeep address**. For Gas limit you should specify the upper limit of Gas your target function will use.

Once you have registered your contract, you can view your Upkeep. The *Upkeep History* will display **Perform Upkeep** for all registerd jobs on your Job Scheduler contract. To ensure Chainlink Keepers monitors your Job Scheduler, please ensure you fund your Upkeep.


### Function Signature
The Function Signature (or bytes handler) is the first four bytes of the Keccak-hash used in EVM chains to encode a function. You can use the following Python script to retrieve the function signature.

```{python}
#Install pycryptodome from https://pypi.org/project/pycryptodome/
#pip install pycryptodome 
from Crypto.Hash import keccak
import binascii

#Our example smart contract function is called increment()
#and remember to include the brackets
#Note Job Scheduler will not pass a parameter
functionToEncode = 'increment()'

#Calculate the Hash
functionEncoding = keccak.new(data=functionToEncode.encode('UTF-8'), digest_bits=256).digest()

#Decode to UTF-8 and return first 4 bits (8 characters)
functionSig = binascii.hexlify(functionEncoding).decode('UTF-8')[:8]
print("Function Signature:", functionSig)
#Should return Function Signature: d09de08a
```

### EncodedCronSpec

The EncodedCronSpec is an encoded version the time interval specification used to schedule a job.

```json
Cron jobs are interpreted according to this format:

  ┌───────────── minute (0 - 59)
  │ ┌───────────── hour (0 - 23)
  │ │ ┌───────────── day of the month (1 - 31)
  │ │ │ ┌───────────── month (1 - 12)
  │ │ │ │ ┌───────────── day of the week (0 - 6) (Monday to Sunday)
  │ │ │ │ │
  │ │ │ │ │
  │ │ │ │ │
  * * * * *

  Special limitations:
    * there is no year field
    * No special characters: ? L W #
    * lists can have a max length of 26
    * No words like JAN / FEB or MON / TUES
    * No <division operators> (eg */5 * * * *)
*/
```

For example, if we want to create a job that runs every hour we specify the Cron expression as `0 * * * *`. For a job that runs every weekday at 9am the equivalent Cron expression would be  `0 9 * * 0-4`. For a job that runs at 5pm on Monday, Wednesday, and Friday, the equivalent Cron expression would be `0 17 * * 0,2,4`.

For our example, our contract to execute every 5 minutes. We will encode the following Cron expression:

```json
"0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
```

Paste this expression into the `cronStringToEncodeSpec` function in Remix and run the function. This will produce the following result:

```json
0x00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000f00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000230000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```


# Useful Patterns and Best Practices


# Resources

## CronUpkeepFactory ABI
```json
[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "upkeep",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "NewCronUpkeepCreated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "cronDelegateAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "newCronUpkeep",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
```


## Job Scheduler (CronUpkeep) ABI
```json
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "delegate",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "CallFailed",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "CronJobIDNotFound",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidHandler",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "OnlySimulatedBackend",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "TickDoesntMatchSpec",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "TickInFuture",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "TickTooOld",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "UnknownFieldType",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "handler",
				"type": "bytes"
			}
		],
		"name": "CronJobCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "CronJobDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CronJobExecuted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "acceptOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "checkUpkeep",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "handler",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "encodedCronSpec",
				"type": "bytes"
			}
		],
		"name": "createCronJobFromEncodedSpec",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "cronString",
				"type": "string"
			}
		],
		"name": "cronStringToEncodedSpec",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "deleteCronJob",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getActiveCronJobIDs",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getCronJob",
		"outputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "handler",
				"type": "bytes"
			},
			{
				"internalType": "string",
				"name": "cronString",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "nextTick",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "performData",
				"type": "bytes"
			}
		],
		"name": "performUpkeep",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
```

## Contract Addresses

| Chain name               | Factory address                            |   |   |   |
|--------------------------|--------------------------------------------|---|---|---|
| Ethereum Mainnet         | 0x9Da0C828dd778917Ca19EbAcfeADc2C0411BF18F |   |   |   |
| Ethereum Kovan           | 0x8ed750705F8c0E5Cb56C1bF50Df6626Dc06553f1 |   |   |   |
| BSC Mainnet              | TBD                                        |   |   |   |
| BSC Testnet              | TBD                                        |   |   |   |
| Polygon Mainnet          | 0x72d17B985D2CAD363eA05F84D600d80ea8D0Fa15 |   |   |   |
| Polygon Testnet (Mumbai) | 0x9BfA401b5912D6d6EBd8dB03139d5C7861FBC7f3 |   |   |   |