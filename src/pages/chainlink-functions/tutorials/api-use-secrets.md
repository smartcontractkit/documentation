---
layout: ../../../layouts/MainLayout.astro
section: chainlinkFunctions
date: Last Modified
title: "Using Secrets in Requests"
setup: |
  import ChainlinkFunctions from "@features/chainlink-functions/common/ChainlinkFunctions.astro"
---

This tutorial shows you how to send a request to a Decentralized Oracle Network to call with encrypted secrets to the [Coinmarketcap API](https://coinmarketcap.com/api/documentation/v1/). After [OCR](/chainlink-functions/resources/concepts/) completes off-chain computation and aggregation, it returns the `BTC/USD` asset price to your smart contract. Because the API requires you to provide an API key, this guide will also show you how to encrypt and sign your API key before you send the request.

## Before you begin

:::note[Request Access]
Chainlink Functions is currently in a limited BETA.
Apply [here](http://functions.chain.link/) to add your EVM account address to the Allow List.
:::

1. **[Complete the setup steps in the Getting Started guide](/chainlink-functions/getting-started):** The Getting Started Guide shows you how to set up your environment with the necessary tools for these tutorials. You can re-use the same consumer contract for each of these tutorials.

1. Make sure your subscription has enough LINK to pay for your requests. Read [Get Subscription details](/chainlink-functions/resources/subscriptions#get-subscription-details) to learn how to check your subscription balance. If your subscription runs out of LINK, follow the [Fund a Subscription](/chainlink-functions/resources/subscriptions#fund-a-subscription) guide.

1. **Check out the correct branch before you try this tutorial:** Each tutorial is stored in a separate branch of the [Chainlink Functions Starter Kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit) repository.

   ```bash
   git checkout tutorial-5
   ```

1. Get a free API key from [CoinMarketCap](https://coinmarketcap.com/api/).
1. Open your `.env` file.
1. Add a line to the `.env` file with the `COINMARKETCAP_API_KEY=` variable and set it to your API key. For example: `COINMARKETCAP_API_KEY="78143127-fe7e-d5fe-878f-143notarealkey"`
1. Save your `.env` file.

## Tutorial

:::note[Set up your environment variables]
This tutorial has some unique `.env` setup steps. Make sure that you configured your `.env` file with the necessary variables in the [Before you begin](#before-you-begin) section.
:::

This tutorial is configured to get the `BTC/USD` price with a request that requires API keys. For a detailed explanation of the code example, read the [Explanation](#explanation) section.

- Open `Functions-request-config.js`. The `args` value is `["1", "USD"]`, which fetches the current `BTC/USD` price. The value of `"1"` is the BTC CoinMarketCap ID. You can change `args` to fetch other asset prices. See the [CoinMarketCap API documentation](https://coinmarketcap.com/api/documentation/v1/) to learn about the available values. Read the [request config](#functions-request-configjs) section for more details about the request config file.
- Open `Functions-request-source.js` to analyze the JavaScript source code. Read the [source code](#functions-request-sourcejs) section for more details about the source code file.

### Simulation

The [Chainlink Functions Hardhat Starter Kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit) includes a simulator to test Functions code on your local machine. The `functions-simulate` command executes your code in a local runtime environment and simulate an end-to-end fulfillment. This helps you fix issues before you submit functions to a Decentralized Oracle Network.

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
Price: 23028.81 USD

__Output from sandboxed source code__
Output represented as a hex string: 0x00000000000000000000000000000000000000000000000000000000002323a1
Decoded as a uint256: 2302881

__Simulated On-Chain Response__
Response returned to client contract represented as a hex string: 0x00000000000000000000000000000000000000000000000000000000002323a1
Decoded as a uint256: 2302881

Estimated transmission cost: 0.000047065031311669 LINK (This will vary based on gas price)
Base fee: 0.0 LINK
Total estimated cost: 0.000047065031311669 LINK
```

Reading the output of the example above, you can note that the `BTC/USD` price is _23028.81 USD_. Because Solidity does not support decimals, move the decimal point so that the value looks like an integer `2302881` before returning the `bytes` encoded value `0x00000000000000000000000000000000000000000000000000000000002323a1` in the callback. Read the [source code](#functions-request-sourcejs) section for a more details.

### Request

:::note[Reminder]
Before you can make a successful request, you must complete the setup steps in the [Before you begin](#before-you-begin) section. Each tutorial is in a separate Git branch and some require unique entries in your `.env` file.
:::

Send a request to the Decentralized Oracle Network to fetch the asset price. Run the `functions-request` task with the `subid` (subscription ID) and `contract` parameters. This task passes the functions JavaScript source code, arguments, and secrets to the `executeRequest` function in your deployed `FunctionsConsumer` contract. Read the [functionsConsumer](#functionsconsumersol) section for more details about the consumer contract.

```bash
npx hardhat functions-request --subid REPLACE_SUBSCRIPTION_ID --contract REPLACE_CONSUMER_CONTRACT_ADDRESS --network REPLACE_NETWORK
```

Example:

```bash
$ npx hardhat functions-request --subid 6 --contract 0xa9b286E892d579dc727c79D3be9b01949796240A  --network mumbai
secp256k1 unavailable, reverting to browser version
Simulating Functions request locally...

__Console log messages from sandboxed code__
Price: 23037.75 USD

__Output from sandboxed source code__
Output represented as a hex string: 0x000000000000000000000000000000000000000000000000000000000023271f
Decoded as a uint256: 2303775


If all 100000 callback gas is used, this request is estimated to cost 0.000056501884149695 LINK
Continue? (y) Yes / (n) No
y

Requesting new data for FunctionsConsumer contract 0xa9b286E892d579dc727c79D3be9b01949796240A on network mumbai
Waiting 2 blocks for transaction 0xa4095597991025b3d576102b24e595a078f2576888efb9736b53caab38bb5434 to be confirmed...

Request 0x028a59b9eff85ef2f50438c63521669a028d45e4036c480b5b06bbbdf9f3aaca initiated
Waiting for fulfillment...

Request 0x028a59b9eff85ef2f50438c63521669a028d45e4036c480b5b06bbbdf9f3aaca fulfilled!
Response returned to client contract represented as a hex string: 0x00000000000000000000000000000000000000000000000000000000002325e2
Decoded as a uint256: 2303458

Transmission cost: 0.001531752977777777 LINK
Base fee: 0.0 LINK
Total cost: 0.001531752977777777 LINK
```

The example output tells you the following information:

- The `executeRequest` function was successfully called in the `FunctionsConsumer` contract. The transaction in this example is[0xa4095597991025b3d576102b24e595a078f2576888efb9736b53caab38bb5434](https://mumbai.polygonscan.com/tx/0xa4095597991025b3d576102b24e595a078f2576888efb9736b53caab38bb5434).
- The request ID is `0x028a59b9eff85ef2f50438c63521669a028d45e4036c480b5b06bbbdf9f3aaca`.
- The DON successfully fulfilled your request. The total cost was: `0.001531752977777777 LINK`.
- The consumer contract received a response in `bytes` with a value of `0x00000000000000000000000000000000000000000000000000000000002325e2`. Decoding it off-chain to `uint256` give you a result: `2303458`.

At any time, you can run the `functions-read` task with the `contract` parameter to read the latest received response.

```bash
npx hardhat functions-read  --contract REPLACE_CONSUMER_CONTRACT_ADDRESS --network REPLACE_NETWORK
```

Example:

```bash
$ npx hardhat functions-read  --contract 0xa9b286E892d579dc727c79D3be9b01949796240A --network mumbai
secp256k1 unavailable, reverting to browser version
Reading data from Functions client contract 0xa9b286E892d579dc727c79D3be9b01949796240A on network mumbai

On-chain response represented as a hex string: 0x00000000000000000000000000000000000000000000000000000000002325e2
Decoded as a uint256: 2303458
```

## Explanation

### FunctionsConsumer.sol

<ChainlinkFunctions section="functions-consumer" />

### Functions-request-config.js

Read the [Request Configuration](https://github.com/smartcontractkit/functions-hardhat-starter-kit#functions-library) section for a detailed description of each setting. In this example, the settings are the following:

- `codeLocation: Location.Inline`: The JavaScript code is provided within the request.
- `secretsLocation: Location.Inline`: The secrets are provided within the request.
- `codeLanguage: CodeLanguage.JavaScript`: The source code is developed in the JavaScript language.
- `source: fs.readFileSync("./Functions-request-source.js").toString()`: The source code must be a script object. This example uses `fs.readFileSync` to read `Functions-request-source.js` and calls `toString()` to get the content as a `string` object.
- `secrets: { apiKey: process.env.COINMARKETCAP_API_KEY }`: JavaScript object which contains secret values. Before making the request, these secrets are encrypted using the DON public key. The `process.env.COINMARKETCAP_API_KEY` setting means `COINMARKETCAP_API_KEY` is fetched from the environment variables. Make sure to set `COINMARKETCAP_API_KEY` in your `.env` file. **Note**: `secrets` is limited to a key-value map that can only contain strings. It cannot include any other types or nested parameters.
- `walletPrivateKey: process.env["PRIVATE_KEY"]`: This is your EVM account private key. It is used to generate a signature for the encrypted secrets such that an unauthorized third party cannot reuse them.
- `args: ["1", "USD"]`: These arguments are passed to the source code. In this example, request the `BTC/USD` price. The value of `"1"` is the BTC ID for CoinMarketCap. You can adapt `args` to fetch other asset prices. Read the [CoinMarketCap API documentation](https://coinmarketcap.com/api/documentation/v1/) to see what options are available.
- `expectedReturnType: ReturnType.uint256`: The response received by the DON is encoded in `bytes`. Because the asset price is a `uint256`, define `ReturnType.uint256` to inform users how to decode the response received by the DON.

### Functions-request-source.js

To check the expected API response, run the `curl` command in your terminal:

```bash
curl -X 'GET' \
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1&convert=USD' \
  -H 'accept: application/json' \
  -H 'X-CMC_PRO_API_KEY: REPLACE_WITH_YOUR_API_KEY'
```

The response should be similar to the following example:

<!-- prettier-ignore -->
```json
{
  ...,
  "data": {
    "1": {
      "id": 1,
      "name": "Bitcoin",
      "symbol": "BTC",
      "slug": "bitcoin",
      ...,
      "quote": {
        "USD": {
          "price": 23036.068560170934,
          "volume_24h": 33185308895.694683,
          "volume_change_24h": 24.8581,
          "percent_change_1h": 0.07027098,
          "percent_change_24h": 1.79073805,
          "percent_change_7d": 10.29859656,
          "percent_change_30d": 38.10735851,
          "percent_change_60d": 39.26624921,
          "percent_change_90d": 11.59835416,
          "market_cap": 443982488416.99316,
          "market_cap_dominance": 42.385,
          "fully_diluted_market_cap": 483757439763.59,
          "tvl": null,
          "last_updated": "2023-01-26T18:27:00.000Z"
        }
      }
    }
  }
}
```

The price is located at `data,1,quote,USD,price`.

Read the [JavaScript code](https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code) section for a detailed explanation of how to write a compatible JavaScript source code. This JavaScript source code uses [Functions.makeHttpRequest](https://github.com/smartcontractkit/functions-hardhat-starter-kit#functions-library) to make HTTP requests. If you read the [Functions.makeHttpRequest](https://github.com/smartcontractkit/functions-hardhat-starter-kit#functions-library) documentation, you can see the following required parameters:

- `url`: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`
- `headers`: This is an HTTP headers object set to `{ "X-CMC_PRO_API_KEY": secrets.apiKey }`. The `apiKey` is defined in the [request config file](#functions-request-configjs).
- `params`: The query parameters object:

  ```
  {
    convert: currencyCode,
    id: coinMarketCapCoinId
  }
  ```

Note `currencyCode` and `coinMarketCapCoinId` are fetched from `args` (see [request config](#functions-request-configjs)).

The code is self-explanatory and has comments to help you understand all the steps. The main steps are:

- Construct the HTTP object `coinMarketCapRequest` using `Functions.makeHttpRequest`.
- Make the HTTP call.
- Read the asset price from the response.
- Return the result as a [buffer](https://nodejs.org/api/buffer.html#buffer) using the helper function: `Functions.encodeUint256`. Note: Because solidity doesn't support decimals, we multiply the result by `100` and round the result to the nearest integer. **Note**: Read this [article](https://www.freecodecamp.org/news/do-you-want-a-better-understanding-of-buffer-in-node-js-check-this-out-2e29de2968e8/) if you are new to Javascript Buffers and want to understand why they are important.
