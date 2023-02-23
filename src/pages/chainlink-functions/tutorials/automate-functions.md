---
layout: ../../../layouts/MainLayout.astro
section: chainlinkFunctions
date: Last Modified
title: "Automate your Functions"
setup: |
  import ChainlinkFunctions from "@features/chainlink-functions/common/ChainlinkFunctions.astro"
  import ClickToZoom from "@components/ClickToZoom.astro"
---

This tutorial shows you how to leverage [Chainlink Automation](/chainlink-automation/introduction/) to automate your Chainlink Functions. Automation is essential in case you want to trigger the same Chainlink Functions regularly, such as fetching weather data daily or fetching an asset price every block.
Read the [API multiple calls](/chainlink-functions/tutorials/api-multiple-calls/) tutorial before you follow the steps in this example. This tutorial uses the same example but with an important difference:

- You will deploy [AutomatedFunctionsConsumer.sol](https://github.com/smartcontractkit/functions-hardhat-starter-kit/blob/main/contracts/AutomatedFunctionsConsumer.sol) instead of [FunctionsConsumer.sol](https://github.com/smartcontractkit/functions-hardhat-starter-kit/blob/main/contracts/FunctionsConsumer.sol). `AutomatedFunctionsConsumer.sol` is a Chainlink Functions Consumer contract that is [Chainlink Automation compatible contract](/chainlink-automation/compatible-contracts/).

## Before you begin

:::note[Request Access]
Chainlink Functions is currently in a limited BETA.
Apply [here](http://functions.chain.link/) to add your EVM account address to the Allow List.
:::

1. **[Complete the setup steps in the Getting Started guide](/chainlink-functions/getting-started):** The Getting Started Guide shows you how to set up your environment with the necessary tools for these tutorials.

1. Make sure to understand the [API multiple calls](/chainlink-functions/tutorials/api-multiple-calls/) guide.

1. Make sure your subscription has enough LINK to pay for your requests. Read [Get Subscription details](/chainlink-functions/resources/subscriptions#get-subscription-details) to learn how to check your subscription balance. If your subscription runs out of LINK, follow the [Fund a Subscription](/chainlink-functions/resources/subscriptions#fund-a-subscription) guide.

1. **Check out the correct branch before you try this tutorial:** Each tutorial is stored in a separate branch of the [Chainlink Functions Starter Kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit) repository.

   ```bash
   git checkout tutorial-6
   ```

1. Get a free API key from [CoinMarketCap](https://coinmarketcap.com/api/).
1. Open your `.env` file.
1. Add a line to the `.env` file with the `COINMARKETCAP_API_KEY=` variable and set it to your API key. For example: `COINMARKETCAP_API_KEY="78143127-fe7e-d5fe-878f-143notarealkey"`
1. Save your `.env` file.

## Tutorial

:::note[Complete the Before you begin section]
This tutorial has some unique `.env` setup steps. Make sure that you configured your `.env` file with the necessary variables in the [Before you begin](#before-you-begin) section.
:::

This tutorial is configured to get the median `BTC/USD` price from multiple data sources according to a time schedule. For a detailed explanation of the code example, read the [Explanation](#explanation) section.

- Open `Functions-request-config.js`. Note the `args` value is `["1", "bitcoin", "btc-bitcoin"]`. These arguments are BTC IDs at CoinMarketCap, CoinGecko, and Coinpaprika. You can adapt `args` to fetch other asset prices. See the API docs for [CoinMarketCap](https://coinmarketcap.com/api/documentation/v1/), [CoinGecko](https://www.coingecko.com/en/api/documentation), and [CoinPaprika](https://api.coinpaprika.com/) for details. For more information about the request, read the [request config](#functions-request-configjs) section.
- Open `Functions-request-source.js` to analyze the JavaScript source code. Read the [source code explanation](#functions-request-sourcejs) for a more detailed explanation of the request source file.

### Simulation

The [Chainlink Functions Hardhat Starter Kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit) includes a simulator to test your Functions code on your local machine. The `functions-simulate` command executes your code in a local runtime environment and simulates an end-to-end fulfillment. This helps you to fix issues before you submit functions to the Decentralized Oracle Network.

Run the `functions-simulate` task to run the source code locally and make sure `Functions-request-config.js` and `Functions-request-source.js` are correctly written:

```bash
npx hardhat functions-simulate
```

Example:

```bash
$ npx hardhat functions-simulate
secp256k1 unavailable, reverting to browser version
__Compiling Contracts__
Nothing to compile
Duplicate definition of Transfer (Transfer(address,address,uint256,bytes), Transfer(address,address,uint256))
Executing JavaScript request source code locally...
__Console log messages from sandboxed code__
Median Bitcoin price: $24821.05
__Output from sandboxed source code__
Output represented as a hex string: 0x000000000000000000000000000000000000000000000000000000000025dfb9
Decoded as a uint256: 2482105
__Simulated On-Chain Response__
Response returned to client contract represented as a hex string: 0x000000000000000000000000000000000000000000000000000000000025dfb9
Decoded as a uint256: 2482105
Gas used by sendRequest: 392690
Gas used by client callback function: 75029
```

Reading the output of the example above, you can note that the `BTC/USD` median price is: _24821.05 USD_. Because Solidity does not support decimals, we move the decimal point so that the value looks like the integer `2482105` before returning the `bytes` encoded value `0x000000000000000000000000000000000000000000000000000000000025dfb9` in the callback. Read the [source code explanation](#functions-request-sourcejs) for a more detailed explanation.

### Deploy an Automation Consumer contract

After running the simulator and confirming that your Function runs without issues, run the `functions-deploy-auto-client` command. This command does the following:

- Deploy the [AutomatedFunctionsConsumer.sol](https://github.com/smartcontractkit/functions-hardhat-starter-kit/blob/main/contracts/AutomatedFunctionsConsumer.sol) contract. You can set the interval of executions when deploying the contract.
- Add the deployed contract to your subscription.
- Simulate the request that will be stored in your deployed contract.
- Store the request (which includes the source code, encrypted secrets, and arguments) in the contract storage. **Note**: The stored request will be sent to the DON according to the provided interval.

In your terminal, run the `functions-deploy-auto-client` command:

```shell
npx hardhat functions-deploy-auto-client --network REPLACE_NETWORK --subid REPLACE_SUBSCRIPTION_ID --interval REPLACE_INTERVAL_SECONDS
```

Example:

```shell
$ npx hardhat functions-deploy-auto-client --network mumbai --subid 10 --interval 60
secp256k1 unavailable, reverting to browser version
Deploying AutomatedFunctionsConsumer contract to mumbai

__Compiling Contracts__
Nothing to compile

Waiting 1 block for transaction 0xe008c95a9e2643ad41e0b7edc9d6b59862a58fdde7db5beff411f4ddd43efdec to be confirmed...
Adding consumer contract address 0x7a2499dd81D40d12104Af556440099611E675E02 to subscription 10
Waiting 2 blocks for transaction 0x0f989ae76f66e6f68eaa60563140dea66558e47c6ab66d55c11093ff25213ecb to be confirmed...

Added consumer contract address 0x7a2499dd81D40d12104Af556440099611E675E02 to subscription 10
3 authorized consumer contracts for subscription 10:
[
  '0xED9eeB56CEA17aFe7F6299da446aF0963bE82701',
  '0xf23c01Ac45682295C9369a5Cd7dd7E3961C14d5c',
  '0x7a2499dd81D40d12104Af556440099611E675E02'
]
Setting the Functions request in AutomatedFunctionsConsumer contract 0x7a2499dd81D40d12104Af556440099611E675E02 on mumbai
Simulating Functions request locally...

__Console log messages from sandboxed code__
Median Bitcoin price: $24438.00

__Output from sandboxed source code__
Output represented as a hex string: 0x0000000000000000000000000000000000000000000000000000000000254a18
Decoded as a uint256: 2443800

Setting Functions request

Waiting 2 block for transaction 0xfb0e8658e702c5783570c7f87f8fc86cda8d15988769fa491fe3b1f4dc4843cf to be confirmed...

Set new Functions request in AutomatedFunctionsConsumer contract 0x7a2499dd81D40d12104Af556440099611E675E02 on mumbai

AutomatedFunctionsConsumer contract deployed to 0x7a2499dd81D40d12104Af556440099611E675E02 on mumbai
```

In the example above, we deployed a Chainlink Functions consumer contract and configured it to get the median bitcoin price every 60 seconds.

### Configure Chainlink Automation

Follow this [guide](/chainlink-automation/register-upkeep/#register-an-upkeep-using-the-chainlink-automation-app) to register your deployed contract using the [Chainlink Automation App](https://automation.chain.link/). Once registered, you can check your upkeep on the Chainlink Automation App:

<ClickToZoom src='/images/chainlink-functions/tutorials/automation/myupkeep.jpg' />

Chainlink Automation will trigger sending the request according to your provided interval.

:::note[Monitor your balances]
There are two balances that you have to monitor:

- Your Subscription balance: Your balance will be charged each time your Chainlink Functions is fulfilled. If your balance is insufficient, your contract will not be able to send requests. Automating your Chainlink Functions means they will be regularly triggered, so monitor and fund your subscription account regularly. Read [Get Subscription details](/chainlink-functions/resources/subscriptions#get-subscription-details) to learn how to check your subscription balance.
- Your Upkeep balance: You can check this balance on the [Chainlink Automation App](https://automation.chain.link/). The Upkeep balance pays Chainlink Automation Network to send your requests according to your provided interval. Chainlink Automation will not trigger your requests if your Upkeep balance runs low.
  :::
