---
layout: ../../../layouts/MainLayout.astro
section: dataFeeds
date: Last Modified
title: "Using Data Feeds on StarkNet"
whatsnext: { "Starknet Price Feed Contract Addresses": "/data-feeds/price-feeds/addresses?network=starknet" }
metadata:
  description: "Using Chainlink Data Feeds on StarkNet"
---

StarkNet is a permissionless decentralized ZK-Rollup operating as an L2 network over Ethereum. Unlike other Ethereum L2 networks, StarkNet is not EVM-compatible and uses [Cairo](https://www.cairo-lang.org/docs/index.html) as its smart contract language. Chainlink Data Feeds are available on the StarkNet testnet as Cairo smart contracts.

You can read Chainlink Data Feeds on StarkNet using an [on-chain contract](#running-the-on-chain-example) that you compile and deploy. Alternatively, you can [read the data feed off-chain](#running-the-off-chain-example) without a StarkNet account. You can complete these steps using only the [StarkNet CLI commands](https://docs.starknet.io/documentation/tools/CLI/commands/), but the example scripts demonstrate how to compile, deploy, and interact with StarkNet contracts programmatically. [StarkNet.js](https://www.starknetjs.com/), [HardHat](https://hardhat.org/), and the [StarkNet Hardhat Plugin](https://shard-labs.github.io/starknet-hardhat-plugin/) simplify the processes, which normally require you to keep track of your class hashes and ABI files. See [https://docs.starknet.io/](https://docs.starknet.io/documentation/getting_started/intro/) for more information about writing and compiling Cairo contracts for StarkNet.

For a complete list of Chainlink Price Feeds available on StarkNet testnet, see the [Price Feed Contract Addresses](/data-feeds/price-feeds/addresses?network=starknet) page.

## Requirements

Set up your environment to run the examples.

- [Set up your local StarkNet environment](https://starknet.io/docs/quickstart.html). Note that a Python version in the `>=3.6 <=3.9` range is required for compiling and deploying contracts on-chain. The [`cairo-lang` Python package](https://pypi.org/project/cairo-lang/) is not compatible with newer versions of Python as of the [`cairo-lang` 0.10.3](https://pypi.org/project/cairo-lang/0.10.3/) package. Check [starknet.io](https://starknet.io/docs/quickstart.html) for the latest requirements.
- [Install NodeJS](https://nodejs.org/en/download/) in the version in the `>=14 <=18` version range.
- [Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/).
- Clone and configure the code examples:

  1. Clone the [smartcontractkit/chainlink-starknet](https://github.com/smartcontractkit/chainlink-starknet) repository, which includes the example contracts for this guide:

     ```shell
     git clone https://github.com/smartcontractkit/chainlink-starknet.git
     ```

  1. In your clone of the [chainlink-starknet](https://github.com/smartcontractkit/chainlink-starknet) repository, change directories to the proxy consumer example:

     ```shell
     cd ./chainlink-starknet/examples/contracts/proxy-consumer/
     ```

  1. Run `yarn install` to install the required packages including [StarkNet.js](https://www.starknetjs.com/), [HardHat](https://hardhat.org/), and the [StarkNet Hardhat Plugin](https://shard-labs.github.io/starknet-hardhat-plugin/).

     ```shell
     yarn install
     ```

- If you want to run the on-chain examples, you must [set up a StarkNet account](https://starknet.io/docs/hello_starknet/account_setup.html) on StarkNet's `alpha-goerli` network and fund it with [testnet ETH](https://faucet.goerli.starknet.io/). These examples expect the OpenZeppelin wallet, which stores your addresses and private keys in the following default path:

  ```
  ~/.starknet_accounts/starknet_open_zeppelin_accounts.json
  ```

After you prepare the requirements, check to make sure the required tools are configured correctly:

- StarkNet CLI:

  ```text
  starknet -v
  starknet 0.10.3
  ```

- Cairo CLI:

  ```text
  cairo-compile -v
  cairo-compile 0.10.3
  ```

- NodeJS:

  ```text
  node -v
  v18.12.1
  ```

- Yarn:

  ```text
  yarn --version
  1.22.19
  ```

## Running the on-chain example

The on-chain [proxy consumer](https://github.com/smartcontractkit/chainlink-starknet/tree/develop/examples/contracts/proxy-consumer/) example uses a local OpenZeppelin wallet as the account to deploy a contract on-chain. This contract reads a specified Chainlink data feed and stores the information for the latest round of data. This example has the following components:

- The example [Proxy_consumer.cairo](https://github.com/smartcontractkit/chainlink-starknet/tree/develop/examples/contracts/proxy-consumer/contracts/Proxy_consumer.cairo) contract: You will compile and deploy this example contract to the StarkNet Goerli testnet where it can read and store values from one of the [data feed proxy contracts](https://docs.chain.link/data-feeds/price-feeds/addresses?network=starknet). The proxy address is defined in the constructor when you deploy the contract.
- The [deployConsumer.ts](https://github.com/smartcontractkit/chainlink-starknet/tree/develop/examples/contracts/proxy-consumer/scripts/deployConsumer.ts) script: This script uses [StarkNet.js](https://www.starknetjs.com/) to identify your OpenZeppelin wallet and deploy the compiled contract.
- The [readLatestRound.ts](https://github.com/smartcontractkit/chainlink-starknet/tree/develop/examples/contracts/proxy-consumer/scripts/readLatestRound.ts) script: This script submits an invoke transaction on the `get_stored_round` function in your contract and prints the result.

Build, deploy, and invoke the example contract:

1. Find the account address and private key for your funded StarkNet testnet account. By default, the OpenZeppelin wallet contains these values at `~/.starknet_accounts/starknet_open_zeppelin_accounts.json`.
1. Export your address to the `DEPLOYER_ACCOUNT_ADDRESS` environment variable and your private key to the `DEPLOYER_PRIVATE_KEY` environment variable.

   ```shell
   export DEPLOYER_ACCOUNT_ADDRESS=<YOUR_WALLET_ADDRESS>
   ```

   ```shell
   export DEPLOYER_PRIVATE_KEY=<YOUR_KEY>
   ```

1. In the `./chainlink-starknet/examples/contracts/proxy-consumer/` directory, run `yarn build` to run Hardhat and create `./starknet-artifacts/` with the compiled contracts. The [`@shardlabs/starknet-hardhat-plugin` package](https://www.npmjs.com/package/@shardlabs/starknet-hardhat-plugin) handles the compile step.
1. Run `yarn deploy` to deploy the example consumer contract to the StarkNet Goerli testnet. The deployment might take several minutes depending on network conditions. The console prints the contract address and transaction hash. Record the contract address.

   ```text
   yarn deploy
   yarn run v1.22.19

   Contract address: 0x297d4d4e0dc667c82a452cf809176c50a3e3707408ce39d0f1a1a881d35a83f
   Transaction hash: 0x545bf14dd55447c95065092a142cdf240806a594af39e25fd283e3059131f7d
   Done in 110.04s.
   ```

1. Run `yarn readLatestRound <CONTRACT_ADDRESS>` to send an invoke transaction to the deployed contract. Specify the contract address printed by the deploy step. The deployed contract reads the latest round data from the proxy, stores the values, and prints the resulting values.

   ```text
   yarn readLatestRound 0x297d4d4e0dc667c82a452cf809176c50a3e3707408ce39d0f1a1a881d35a83f

   Invoking the get_latest_round_data function.
   Transaction hash: 0x44ce5582f0ae7d144fec2d47ffa879096f7b01a540d7b1d2169aa1fe3798d4f
   Waiting for transaction...
   Transaction status is: NOT_RECEIVED
   Transaction status is: RECEIVED
   Transaction status is: PENDING
   Transaction is: ACCEPTED_ON_L2

   Stored values are:
   round_id = 3.402823669209385e+38
   answer = 6
   block_num = 613094
   observation_timestamp = 1673365796
   transmission_timestamp = 1673365809
   Done in 99.10s.
   ```

If the invoke request is successful, you can see the stored values in the [StarkScan testnet explorer](https://testnet.starkscan.co/). Search for your contract by the address. Under the **Read Contract** tab, run a query on the `get_stored_round()` method. For example, you can see the [contract methods](https://testnet.starkscan.co/contract/0x0297d4d4e0dc667c82a452cf809176c50a3e3707408ce39d0f1a1a881d35a83f#read-contract) from the previous output examples.

You can achieve a similar result by running the `starknet-compile`, `starknet declare`, `starknet deploy`, and `starknet invoke` [CLI commands](https://docs.starknet.io/documentation/tools/CLI/commands/), but the scripts are useful for interacting with StarkNet contracts and accounts programmatically.

## Running the off-chain example

This example reads the proxy contract to get the latest values with no account or contract compiling steps required. The [readLatestRoundOffChain.ts](https://github.com/smartcontractkit/chainlink-starknet/tree/develop/examples/contracts/proxy-consumer/scripts/readLatestRoundOffChain.ts) script uses [StarkNet.js](https://www.starknetjs.com/) to make a call directly to the data feed proxy address. By default, the script reads the [LINK / USD feed](https://testnet.starkscan.co/contract/0x02579940ca3c41e7119283ceb82cd851c906cbb1510908a913d434861fdcb245), but you can change the address to read any of the [available data feeds](https://docs.chain.link/data-feeds/price-feeds/addresses?network=starknet) on the StarkNet testnet.

In the `./chainlink-starknet/examples/contracts/proxy-consumer/` directory, run `yarn readLatestRoundOffChain`.

```text
yarn readLatestRoundOffChain
yarn run v1.22.19

round_id = 3.402823669209385e+38
answer = 6
block_num = 613151
observation_timestamp = 1673367749
transmission_timestamp = 1673367801
Done in 3.09s.
```

You can achieve a similar result by running the [`starknet call` CLI command](https://docs.starknet.io/documentation/tools/CLI/commands/#starknet_call) and specifying the proxy address, function, and the ABI file for the data feed proxy contract. For this example, the ABI file is available in the repository, but you can also generate the ABI yourself from the [aggregator_proxy.cairo](https://github.com/smartcontractkit/chainlink-starknet/blob/develop/contracts/src/chainlink/cairo/ocr2/aggregator_proxy.cairo) contract source file.

```shell
starknet call --address 0x2579940ca3c41e7119283ceb82cd851c906cbb1510908a913d434861fdcb245 --function latest_round_data --abi ./contracts/aggregator_proxy_abi.json
```

The command prints the result:

```text
0x100000000000000000000000000017c51 6 613174 1673368490 1673368507
```
