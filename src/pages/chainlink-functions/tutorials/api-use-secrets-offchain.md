---
layout: ../../../layouts/MainLayout.astro
section: chainlinkFunctions
date: Last Modified
title: "Using Off-chain Secrets in Requests"
setup: |
  import ChainlinkFunctions from "@features/chainlink-functions/common/ChainlinkFunctions.astro"
---

This tutorial shows you how to leverage the Off-chain Secrets capability to share encrypted secrets off-chain via HTTP with a Decentralized Oracle Network.
Off-chain secrets are encrypted, users decide where to host them (e.g., aws S3, google drive, or IPFS), and fetched by the Decentralized Oracle Network via HTTP(s).
Using off-chain secrets has two main advantages:

- Security: The encrypted secrets are never stored on-chain. Users choose where to store their encrypted secrets and pass the URLs to the encrypted secrets in their requests. The URLs are encrypted with the DON public key so that only an oracle node part of the DON can decrypt the URLs with the DON private key. Once the DON has fulfilled the request, a user may delete the URL to mitigate the risk of exposing their secrets if the DON's private key were ever to be leaked.
- Reduced gas: When initiating a request, part of the gas consumption is due to the size of the request parameters: source code, arguments, and secrets. The size of an encrypted secrets object is larger than an encrypted HTTP(s) URL. Thus, using off-chain secrets reduce the gas cost of making requests.

Read the [API multiple calls](/chainlink-functions/tutorials/api-multiple-calls/) tutorial before you follow the steps in this example. This tutorial uses the same example, but with a slightly different process:

1. Instead of sending encrypted secrets to the DON directly, encrypt your secrets using the public key of the DON. This means only the DON can decrypt the secrets and use them.
1. Include the encrypted secrets in an `offchain-secrets.json` file.
1. Host the secrets file off-chain.
1. Include the HTTP URL to the file in your Chainlink Functions request.

The `functions-build-offchain-secrets` task encrypts the secrets and creates the secrets file for you. For reference, you can find the public key for the DON by running the `getDONPublicKey` function on the [Functions Oracle Proxy contract](https://mumbai.polygonscan.com/address/0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4#readProxyContract#F5). See the [Supported Networks](https://docs.chain.link/chainlink-functions/supported-networks#contract-addresses) page to find the Functions Oracle Proxy contract for each supported network.

## Before you begin

:::note[Request Access]
Chainlink Functions is currently in a limited BETA.
Apply [here](http://functions.chain.link/) to add your EVM account address to the Allow List.
:::

1. **[Complete the setup steps in the Getting Started guide](/chainlink-functions/getting-started):** The Getting Started Guide shows you how to set up your environment with the necessary tools for these tutorials. You can re-use the same consumer contract for each of these tutorials.

1. Make sure to understand the [API multiple calls](/chainlink-functions/tutorials/api-multiple-calls/) guide.

1. Make sure your subscription has enough LINK to pay for your requests. Read [Get Subscription details](/chainlink-functions/resources/subscriptions#get-subscription-details) to learn how to check your subscription balance. If your subscription runs out of LINK, follow the [Fund a Subscription](/chainlink-functions/resources/subscriptions#fund-a-subscription) guide.

1. **Check out the correct branch before you try this tutorial:** Each tutorial is stored in a separate branch of the [Chainlink Functions Starter Kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit) repository.

   ```bash
   git checkout tutorial-7
   ```

1. Install and configure the [GitHub CLI](https://cli.github.com/manual/). You will use the GitHub CLI to store the encrypted secrets as [gists](https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/creating-gists). Include the HTTP URL of the gist when you make requests to the DON. Optionally, you can store the encrypted secrets on any other hosting service such as S3 or IPFS as long as the URL is publicly accessible through HTTP(s).
1. Get a free API key from [CoinMarketCap](https://coinmarketcap.com/api/).
1. Open your `.env` file.
1. Add a line to the `.env` file with the `COINMARKETCAP_API_KEY=` variable and set it to your API key. For example: `COINMARKETCAP_API_KEY="78143127-fe7e-d5fe-878f-143notarealkey"`
1. Save your `.env` file.

## Tutorial

:::note[Complete the Before you begin section]
This tutorial has some unique `.env` setup steps. Make sure that you configured your `.env` file with the necessary variables in the [Before you begin](#before-you-begin) section.
:::

This tutorial is configured to get the median `BTC/USD` price from multiple data sources. For a detailed explanation of the code example, read the [Explanation](#explanation) section.

- Open `Functions-request-config.js`. Note the `args` value is `["1", "bitcoin", "btc-bitcoin"]`. These arguments are BTC IDs at CoinMarketCap, CoinGecko, and Coinpaprika. You can adapt `args` to fetch other asset prices. See the API docs for [CoinMarketCap](https://coinmarketcap.com/api/documentation/v1/), [CoinGecko](https://www.coingecko.com/en/api/documentation), and [CoinPaprika](https://api.coinpaprika.com/) for details. For more information about the request, read the [request config](#functions-request-configjs) section.
- Open `Functions-request-source.js` to analyze the JavaScript source code. Read the [source code explanation](#functions-request-sourcejs) for a more detailed explanation of the request source file.

### Build Off-chain Secrets

Before you make a request, prepare the secrets file and host it off-chain:

1. Encrypt the secrets with the public key of the DON and store them in the `offchain-secrets.json` file. The `--network` flag is required because each network has a unique DON with a different public key.

   ```bash
   npx hardhat functions-build-offchain-secrets --network REPLACE_NETWORK
   ```

   Example:

   ```bash
   $ npx hardhat functions-build-offchain-secrets --network mumbai
   secp256k1 unavailable, reverting to browser version
   Using public keys from FunctionsOracle contract 0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4 on network mumbai

   Wrote offchain secrets file to offchain-secrets.json
   ```

1. Upload the file to a public hosting service. For this example, store the file as a gist.

   ```bash
   gh gist create offchain-secrets.json
   ```

   Example:

   ```bash
   $ gh gist create offchain-secrets.json
   - Creating gist offchain-secrets.json
   ✓ Created secret gist offchain-secrets.json
   https://gist.github.com/23f5d2cae58b2e35f1887221287da37b
   ```

   Note the gist ID. In this example, the ID is `23f5d2cae58b2e35f1887221287da37b`.

   The secrets object is accessible on the following HTTPs URL: `https://gist.githubusercontent.com/GITHUB_USER_ID/GIST_ID/raw/`. In this example, the URL is `https://gist.githubusercontent.com/aelmanaa/23f5d2cae58b2e35f1887221287da37b/raw/`

1. Open `Functions-request-config.js`. Fill in the `secretsURLs` variable. For example: `secretsURLs: ["https://gist.githubusercontent.com/aelmanaa/23f5d2cae58b2e35f1887221287da37b/raw/"]`. **Note**: When you make requests, any URLs in `secretsURL` are encrypted so no third party can view them.

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

### Request

:::note[Reminder]
Before you can make a successful request, you must complete the setup steps in the [Before you begin](#before_you_begin) section. Each tutorial is in a separate Git branch and some require unique entries in your `.env` file.
:::

Send a request to the Decentralized Oracle Network to fetch the asset price. Run the `functions-request` task with the `subid` (subscription ID) and `contract` parameters. This task passes the functions JavaScript source code and any arguments and secrets when calling the `executeRequest` function in your deployed `FunctionsConsumer` contract. Read the [functionsConsumer](#functionsconsumersol) section for a more detailed explanation about the consumer contract.

```bash
npx hardhat functions-request --subid REPLACE_SUBSCRIPTION_ID --contract REPLACE_CONSUMER_CONTRACT_ADDRESS --network REPLACE_NETWORK
```

Example (You will see several compile warnings, but no errors):

```bash
$ npx hardhat functions-request --subid 10 --contract 0xED9eeB56CEA17aFe7F6299da446aF0963bE82701   --network mumbai
secp256k1 unavailable, reverting to browser version
Simulating Functions request locally...
WARNING: No secrets found for node 0xca46169b34e00cadabb8ecbffa34ae4d1f7050e4.  That node will use default secrets specified by the "0x0" entry.
WARNING: No secrets found for node 0x7a0fd7a68d0257139c9a90c130fb732e6d997c4b.  That node will use default secrets specified by the "0x0" entry.
WARNING: No secrets found for node 0x4225387e43e066598300e6ef18af183060b4145b.  That node will use default secrets specified by the "0x0" entry.
WARNING: No secrets found for node 0x42918d83b9298113274420350fd901d9ac382b89.  That node will use default secrets specified by the "0x0" entry.

__Console log messages from sandboxed code__
Median Bitcoin price: $24792.59

__Output from sandboxed source code__
Output represented as a hex string: 0x000000000000000000000000000000000000000000000000000000000025d49b
Decoded as a uint256: 2479259


If all 100000 callback gas is used, this request is estimated to cost 0.000180903971177574 LINK
Continue? (y) Yes / (n) No
y

Requesting new data for FunctionsConsumer contract 0xED9eeB56CEA17aFe7F6299da446aF0963bE82701 on network mumbai
Waiting 2 blocks for transaction 0x3502687738c452b0a77ad907c6d5c06b1ff7cd8cbae07774dedcac4ea618cba4 to be confirmed...

Request 0xed3bf996d52df4b15934e5a406d69aa8953dae050cc41282cf836768cc2705c4 initiated
Waiting for fulfillment...

Transmission cost: 0.002092962159977623 LINK
Base fee: 0.0 LINK
Total cost: 0.202092962159977623 LINK

Request 0xed3bf996d52df4b15934e5a406d69aa8953dae050cc41282cf836768cc2705c4 fulfilled!
Response returned to client contract represented as a hex string: 0x000000000000000000000000000000000000000000000000000000000025d49b
Decoded as a uint256: 2479259
```

The output of the example above gives you the following information:

- The `executeRequest` function was successfully called in the `FunctionsConsumer` contract. The transaction in this example is [0x3502687738c452b0a77ad907c6d5c06b1ff7cd8cbae07774dedcac4ea618cba4](https://mumbai.polygonscan.com/tx/0x3502687738c452b0a77ad907c6d5c06b1ff7cd8cbae07774dedcac4ea618cba4).
- The request ID is `0xed3bf996d52df4b15934e5a406d69aa8953dae050cc41282cf836768cc2705c4`.
- The DON successfully fulfilled your request. The total cost was: `0.202092962159977623 LINK`.
- The consumer contract received a response in `bytes` with a value of `0x000000000000000000000000000000000000000000000000000000000025d49b`. Decoding the response off-chain to `uint256` gives you a result of `2479259`.

At any time, you can run the `functions-read` task with the `contract` parameter to read the latest received response.

```bash
npx hardhat functions-read  --contract REPLACE_CONSUMER_CONTRACT_ADDRESS --network REPLACE_NETWORK
```

Example:

```bash
$ npx hardhat functions-read  --contract 0xED9eeB56CEA17aFe7F6299da446aF0963bE82701 --network mumbai
secp256k1 unavailable, reverting to browser version
Reading data from Functions client contract 0xED9eeB56CEA17aFe7F6299da446aF0963bE82701 on network mumbai

On-chain response represented as a hex string: 0x000000000000000000000000000000000000000000000000000000000025d49b
Decoded as a uint256: 2479259
```

## Explanation

### FunctionsConsumer.sol

<ChainlinkFunctions section="functions-consumer" />

### Functions-request-config.js

Read the [Request Configuration](https://github.com/smartcontractkit/functions-hardhat-starter-kit#functions-library) section for a detailed description of each setting. In this example, the settings are the following:

- `codeLocation: Location.Inline`: The JavaScript code is provided within the request.
- `secretsLocation: Location.Remote`: The secrets are referenced via encrypted URLs.
- `codeLanguage: CodeLanguage.JavaScript`: The source code is developed in the JavaScript language.
- `source: fs.readFileSync("./Functions-request-source.js").toString()`: The source code must be a script object. This example uses `fs.readFileSync` to read `Functions-request-source.js` and calls `toString()` to get the content as a `string` object.
- `secretsURLs: ["YOUR_HTTP_URL"]`: This is an array that contains the URLs of encrypted secrets.
- `globalOffchainSecrets: { apiKey: process.env.COINMARKETCAP_API_KEY }`: JavaScript object which contains secret values. The `process.env.COINMARKETCAP_API_KEY` setting means `COINMARKETCAP_API_KEY` is fetched from the environment variables. Make sure to set `COINMARKETCAP_API_KEY` in your `.env` file. **Note**: `secrets` is limited to a key-value map that can only contain strings. It cannot include any other types or nested parameters.
- `walletPrivateKey: process.env["PRIVATE_KEY"]`: This is your EVM account private key. It is used to generate a signature for the encrypted secrets such that an unauthorized third party cannot reuse them.
- `args: ["1", "bitcoin", "btc-bitcoin"]`: These arguments are passed to the source code. This example requests the `BTC/USD` price. These arguments are BTC IDs at CoinMarketCap, CoinGecko, and Coinpaprika. You can adapt `args` to fetch other asset prices. See the API docs for [CoinMarketCap](https://coinmarketcap.com/api/documentation/v1/), [CoinGecko](https://www.coingecko.com/en/api/documentation), and [CoinPaprika](https://api.coinpaprika.com/) for details.
- `expectedReturnType: ReturnType.uint256`: The response received by the DON is encoded in `bytes`. Because the asset price is `uint256`, you must define `ReturnType.uint256` to inform users how to decode the response received by the DON.

### Functions-request-source.js

To check the expected API responses, run these commands in your terminal:

- CoinMarketCap:
  ```bash
  curl -X 'GET' \
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1&convert=USD' \
  -H 'accept: application/json' \
  -H 'X-CMC_PRO_API_KEY: REPLACE_WITH_YOUR_API_KEY'
  ```
- CoinGecko:

  ```bash
  curl -X 'GET' \
  'https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=bitcoin' \
  -H 'accept: application/json'
  ```

- Coinpaprika:

  ```bash
  curl -X 'GET' \
  'https://api.coinpaprika.com/v1/tickers/btc-bitcoin' \
  -H 'accept: application/json'
  ```

The price is located at:

- CoinMarketCap: `data,1,quote,USD,price`
- CoinGecko: `bitcoin,usd`
- Coinpaprika: `quotes,USD,price`

Read the [JavaScript code](https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code) section for a detailed explanation of how to write a compatible JavaScript source code. This JavaScript source code uses [Functions.makeHttpRequest](https://github.com/smartcontractkit/functions-hardhat-starter-kit#functions-library) to make HTTP requests.

The code is self-explanatory and has comments to help you understand all the steps. The main steps are:

- Construct the HTTP objects `coinMarketCapRequest`, `coinGeckoRequest`, and `coinPaprikaRequest` using `Functions.makeHttpRequest`. The values for `coinMarketCapCoinId`, `coinGeckoCoinId`, and `coinPaprikaCoinId` are fetched from the `args`. See the [request config](#functions-request-configjs) section for details.
- Make the HTTP calls.
- Read the asset price from each response.
- Calculate the median of all the prices.
- Return the result as a [buffer](https://nodejs.org/api/buffer.html#buffer) using the `Functions.encodeUint256` helper function. Because solidity doesn't support decimals, multiply the result by `100` and round the result to the nearest integer. **Note**: Read this [article](https://www.freecodecamp.org/news/do-you-want-a-better-understanding-of-buffer-in-node-js-check-this-out-2e29de2968e8/) if you are new to Javascript Buffers and want to understand why they are important.
