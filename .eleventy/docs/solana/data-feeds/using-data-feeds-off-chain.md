---
layout: nodes.liquid
section: solana
date: Last Modified
title: "Using Data Feeds Off-Chain (Solana)"
permalink: "docs/solana/using-data-feeds-off-chain/"
whatsnext: {
  "Use data feeds on-chain":"/docs/solana/using-data-feeds-solana/",
  "See the available data feeds on Solana":"/docs/solana/data-feeds-solana/"
}
metadata:
  title: "Using Data Feeds Off-Chain (Solana)"
  description: "How to use Chainlink Data Feeds in your off-chain applications."
---

Chainlink Data Feeds are the quickest way to access market prices for real-world assets. This guide demonstrates how to read Chainlink Data Feeds on the Solana Devnet using off-chain examples in the [Chainlink Solana Starter Kit](https://github.com/smartcontractkit/solana-starter-kit). To learn how to use Data Feeds in your on-chain Solana programs, see the [Using Data Feeds On-Chain](/docs/solana/using-data-feeds-solana/) guide.

To get the full list of Chainlink Data Feeds on Solana, see the [Solana Feeds](/docs/solana/data-feeds-solana/) page.

{% include 'data-quality.md' %}

**Topics**

- [The Chainlink Data Feeds Store Program](#the-chainlink-data-feeds-store-program)
- [Adding data feeds to an existing off-chain project](#adding-data-feeds-to-an-existing-off-chain-project)
- [Using the Solana Starter Kit](#using-the-solana-starter-kit)

## The Chainlink Data Feeds Store Program

The program that contains the logic required for the storing and retrieval of Chainlink Data Feeds data on both Devnet and Mainnet is [cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ](https://solscan.io/account/cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ?cluster=devnet). This is the program ID that you use to read price data from off-chain. You can find the source code for this program in the [smartcontractkit/chainlink-solana](https://github.com/smartcontractkit/chainlink-solana/tree/develop/contracts/programs/store/src) on GitHub.

You can [add data feeds to an existing off-chain project](#adding-data-feeds-to-an-existing-off-chain-project) or [use the Solana Starter Kit](#using-the-solana-starter-kit).

## Adding Data Feeds to an existing off-chain project

You can read Chainlink Data Feeds off-chain in your existing project by using the [Chainlink Solana NPM library](https://www.npmjs.com/package/@chainlink/solana-sdk).

> 🚧 Reading feed data
>
> Although you can directly query the data feed accounts, you should not rely on the memory layout always being the same as it currently is. Based on this, the recommendation is to always use the consumer library.

Install the necessary components and include the example code in your project. Optionally, you can run the example code by itself to learn how it works before you integrate it with your project.

1. Install the latest Mainnet version of [the Solana CLI](https://github.com/solana-labs/solana/releases) and export the path to the CLI:

    ```sh
    sh -c "$(curl -sSfL https://release.solana.com/v1.9.28/install)" &&
    export PATH="~/.local/share/solana/install/active_release/bin:$PATH"
    ```

    Run `solana --version` to make sure the Solana CLI is installed correctly.

    ```sh
    solana --version
    ```

1. Install [Node.js 14 or higher](https://nodejs.org/en/download/). Run `node --version` to verify which version you have installed:

    ```sh
    node --version
    ```

1. Change to your project directory or create a new directory.

    ```sh
    mkdir off-chain-project && cd off-chain-project
    ```

1. Optionally [install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) to use as a package manager and initialize yarn if your project does not already have a `package.json` file:

    ```sh
    npm install -g yarn && yarn init
    ```

1. Add the [Anchor library](https://www.npmjs.com/package/@project-serum/anchor) to your project:

    ```sh yarn
    yarn add @project-serum/anchor
    ```
    ```sh npm
    npm i @project-serum/anchor
    ```

1. Add the [Chainlink Solana NPM library](https://www.npmjs.com/package/@chainlink/solana-sdk) to your project:

    ```sh yarn
    yarn add @chainlink/solana-sdk
    ```
    ```sh npm
    npm i -g @chainlink/solana-sdk
    ```

1. Create a temporary Solana wallet to use for this example. Alternatively, if you have an existing wallet that you want to use, locate the path to your [keypair](https://docs.solana.com/terminology#keypair) file and use it as the keypair for the rest of this guide.

    ```sh
    solana-keygen new --outfile ./id.json
    ```

1. Set the [Anchor environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). Anchor uses these to determine which wallet to use and how to get a connection to a Solana cluster. Because this example does not generate or sign any transactions, no lamports are required. The wallet is required only by the Anchor library. For a list of available networks and endpoints, see the [Solana Cluster RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints) documentation.

    ```sh
    export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com &&
    export ANCHOR_WALLET=./id.json
    ```

1. Copy the sample code into your project. This example queries price data off-chain. By default, the script reads the SOL/USD feed, but you can change the `CHAINLINK_FEED_ADDRESS` variable to point to the [feed account addresses](/docs/solana/data-feeds-solana/) that you want to query. You can take the components of these code samples and integrate them with your existing project. Because these examples read data feeds without making any on-chain changes, no lamports are required to run them.

```javascript JavaScript
{% include 'samples/Solana/PriceFeeds/off-chain-read.js' %}
```
```typescript TypeScript
{% include 'samples/Solana/PriceFeeds/off-chain-read.ts' %}
```

You can run these examples using the following commands:

```sh JavaScript
node javascript-example.js
```
```sh TypeScript
yarn add ts-node typescript && yarn ts-node typescript-example.ts
```

To learn more about Solana and Anchor, see the [Solana Documentation](https://docs.solana.com/) and the [Anchor Documentation](https://book.anchor-lang.com/).

## Using the Solana Starter Kit

This example reads price data from an off-chain client using the [Solana Starter Kit](https://github.com/smartcontractkit/solana-starter-kit).

### Install the required tools

Before you begin, set up your environment for development on Solana:

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already configured on your system.

1. Install the latest Mainnet version of [the Solana CLI](https://github.com/solana-labs/solana/releases) and export the path to the CLI:

    ```sh
    sh -c "$(curl -sSfL https://release.solana.com/v1.9.28/install)" &&
    export PATH="~/.local/share/solana/install/active_release/bin:$PATH"
    ```

    Run `solana --version` to make sure the Solana CLI is installed correctly.

    ```sh
    solana --version
    ```

1. Install [Node.js 14 or higher](https://nodejs.org/en/download/). Run `node --version` to verify which version you have installed:

    ```sh
    node --version
    ```

1. [Install Anchor](https://book.anchor-lang.com/getting_started/installation.html). On some operating systems, you might need to build and install Anchor locally. See the [Anchor documentation](https://book.anchor-lang.com/getting_started/installation.html#build-from-source-for-other-operating-systems-without-avm) for instructions.

1. Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) to simplify package management and run code samples in the Starter Kit.

    ```sh
    npm install -g yarn
    ```

### Run the example program

After you install the required tools, clone the example code from the [solana-starter-kit](https://github.com/smartcontractkit/solana-starter-kit) repository.

1. In a terminal, clone the [solana-starter-kit](https://github.com/smartcontractkit/solana-starter-kit) repository and change to the `solana-starter-kit` directory:

    ```sh
    git clone https://github.com/smartcontractkit/solana-starter-kit &&
    cd ./solana-starter-kit
    ```

    You can see the complete code for the example on [GitHub](https://github.com/smartcontractkit/solana-starter-kit/).

1. In the `./solana-starter-kit` directory, install Node.js dependencies defined in the `package.json` file:

    ```sh
    yarn install
    ```

1. Create a temporary Solana wallet file to use for this example. Because your application runs off-chain and does not run any functions or alter data on-chain, the wallet does not require any SOL tokens to function.

    ```sh
    solana-keygen new --outfile ./id.json
    ```

1. Set the [Anchor environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). Anchor uses these to determine which wallet to use and Solana cluster to use. Take note that because we are not generating or signing any transactions, the wallet isn't used, it's just required by the Anchor library. For a list of available networks and endpoints, see the [Solana Cluster RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints) documentation.

    ```sh Solana Devnet
    export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com &&
    export ANCHOR_WALLET=./id.json
    ```

1. Run the example:

    ```sh JavaScript
    node read-data.js
    ```
    ```sh TypeScript
    yarn run read-data
    ```

    The example code retrieves and prints the current price feed data until you close the application:

    ```
    4027000000
    4026439929
    4026476542
    4023000000
    ```

To learn more about Solana and Anchor, see the [Solana Documentation](https://docs.solana.com/) and the [Anchor Documentation](https://book.anchor-lang.com/).
