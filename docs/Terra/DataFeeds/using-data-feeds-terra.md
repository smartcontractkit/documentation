---
layout: nodes.liquid
section: nonEvm
date: Last Modified
title: "Using Data Feeds (Terra)"
permalink: "docs/terra/using-data-feeds-terra/"
metadata:
  title: "Using Data Feeds (Terra)"
  description: "How to use Chainlink Data Feeds in your Terra programs."
---

Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world market prices of assets. For example, one use for data feeds is to enable smart contracts to retrieve the latest pricing data of an asset in a single call.

Price data feeds are available on the following networks:
- **Terra**
- [Solana](/docs/solana/using-data-feeds-solana/)
- [EVM-compatible networks](/docs/get-the-latest-price/)

This guide applies specifically to using data feeds on the [Terra network](https://www.terra.money/). To get the full list of Chainlink Data Feeds running on the Terra Devnet, see the [Terra Feeds](/docs/terra/data-feeds-terra/) page.

{% include data-quality.md %}

## Overview

This guide demonstrates the following tasks:

- Write and deploy programs to the [Terra Bombay-12 Devnet](https://finder.terra.money/bombay-12/) using the [Rust](https://docs.terra.money/Tutorials/Smart-contracts/Overview.html) language.
- Compile the smart contract using the [CosmWasm](https://docs.cosmwasm.com/docs/) platform.
- Deploy, instantiate, and execute the contract using a NodeJS script to a call the Wasm artifact and retrieve the latest price.

## Requirements

This guide requires the following tools:

- Rust:
  - [`rustup`](https://rustup.rs/) with `cargo` 1.44.1+.
  - [`rustc`](https://www.rust-lang.org/tools/install) and `cargo` 1.44.1+.
  - Install the `wasm32-unknown-unknown` target for Rust: `rustup target add wasm32-unknown-unknown`
- [NodeJS](https://nodejs.org/en/) 14 LTS or later.
- [Terra.js](https://terra-money.github.io/terra.js/#installation)
- A C compiler such as the one included in [GCC](https://gcc.gnu.org/install/).
- [Docker](https://www.docker.com/)

Confirm that the necessary requirements are installed:

```shell
rustc --version
cargo --version
rustup target list --installed
docker --version
node --version
```

## Create and fund a Terra wallet

You need a Terra Station wallet with testnet LUNA to complete the steps in this guide. If you don't already have a Terra wallet, create one to use for this guide.

1. Go to the [Terra Station](https://station.terra.money/wallet) interface.
1. In the Terra Station interface, click **Connect** and follow the steps to create a new wallet. You can use whatever wallet option you like, but the browser extension is the most simple option.
1. Take note of your seed phrase and your wallet address. You need these to execute your smart contract later.
1. Go to the [Terra Testnet Faucet](https://faucet.terra.money/) and follow the instructions to send testnet LUNA to your Terra wallet.

After you complete these steps, you should see the LUNA balance for your wallet on the testnet.

![The Terra Station browser extension showing a LUNA balance on Testnet.](/images/terra/terra-wallet.png)

## Clone the example code repository

Use `git clone` to clone the example code:

```shell
git clone https://github.com/smartcontractkit/chainlink-terra-feeds-demo.git && cd ./chainlink-terra-feeds-demo
```

## Compile the consumer contract

The example data feed consumer contract is in `.contracts/consumer`.

1. From the base of the cloned repository, run `cargo wasm` to
produce the `./target/wasm32-unknown-unknown/release/consumer.wasm` build file:

   ```shell
   cargo wasm
   ```

1. Run `cargo schema` in the `./contracts/consumer` directory to generate the schema files. These files expose the schema for the expected messages to the clients.

   ```shell
   (cd ./contracts/consumer && cargo schema)
   ```

1. From the base of the cloned repository, run the `workspace-optimizer` Rust optimizer to ensure the smallest output size and create a reproducible build process. The optimizer runs in a Docker container and creates an `/artifacts` directory with the compiled and optimized output of the contract:

   ```shell
   docker run --rm -v "$(pwd)":/code \
   --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
   --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
   cosmwasm/workspace-optimizer:0.11.4
   ```

1. Install the [Terra.js](https://terra-money.github.io/terra.js/#installation) package.

   ```shell
   npm install @terra-money/terra.js
   ```

1. Export your wallet seed phrase to the `TERRA_SEED` environment variable. The script uses the seed phrase to determine the wallet key that you want to use to deploy and call the smart contract.

   ```shell
   export TERRA_SEED="YOUR SEED PHRASE"
   ```

1. From the base of the cloned repository, use NodeJS to run the `readLatestPrice.mjs` to deploy, instantiate, and execute the contract.

   ```shell
   node ./scripts/readLatestPrice.mjs
   ```

If the script is successful, it prints the current price from the of [LUNA/USD feed](https://finder.terra.money/bombay-12/address/terra1u475ps69rmhpf4f4gx2pc74l7tlyu4hkj4wp9d).

```json
{
  round_data_response: {
    round_id: 39516,
    answer: '3706000000',
    started_at: 1634497952,
    updated_at: 1634497952,
    answered_in_round: 39516
  }
}
```

If the script is not successful, check to make sure that you compiled the contracts correctly, that your wallet is funded, and that you entered the correct seed phrase. You can also check the [Terra Bombay Testnet Status](https://status.terra.money/) to make sure that the testnet is available.

## Review the example code

You can view the Rust code and scripts for this example on GitHub. See the [chainlink-terra-feeds-demo](https://github.com/smartcontractkit/chainlink-terra-feeds-demo/) repository. The example code has a few main components:

- The [lib.rs](https://github.com/smartcontractkit/chainlink-terra-feeds-demo/blob/master/contracts/consumer/src/lib.rs) file that defines the functions for the smart contract and is eventually compiled into the `./artifacts/consumer.wasm` bytecode file.
- The [`readLatestPrice.mjs` script](https://github.com/smartcontractkit/chainlink-terra-feeds-demo/blob/master/scripts/readLatestPrice.mjs)

The `./scripts/readLatestPrice.mjs` script completes each of the steps to deploy, instantiate, and execute the `consumer.wasm` compiled smart contract. The `run()` function deploys and instantiates the `consumer.wasm` smart contract. Then, the script uses an [`LCDClient`](https://terra-money.github.io/terra-sdk-python/guides/lcdclient.html) object from [Terra.js](https://terra-money.github.io/terra.js/#installation) to call the `get_latest_round_data` function on the aggregator contract and retrieve the price data.

```javascript
async function run() {
  console.log("Deploying Price Consumer Contract");

  const consmCodeId = await upload(CONSUMER_PATH);
  console.log("instatiating contract");
  const consmAddress = await instantiate(consmCodeId, {"proxy": "terra1dw5ex5g802vgrek3nzppwt29tfzlpa38ep97qy"})
  console.log("reading contract");
  const result = await terra.wasm.contractQuery(consmAddress, { "get_latest_round_data": {} } )
  console.log(result);
}
```
