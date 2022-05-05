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

**Table of contents:**

- [Using Data Feeds Off-Chain In An Existing Project](#using-data-feeds-off-chain-in-an-existing-project)
- [Using Data Feeds Off-Chain: Solana Starter Kit Example](#using-data-feeds-off-chain-solana-starter-kit-example)

## Using Data Feeds Off-Chain In An Existing Project

You can read Chainlink Data Feed data off-chain in your existing project by using the [Chainlink Solana NPM library](https://www.npmjs.com/package/@chainlink/solana-sdk).

## Install the required tools

Before you begin, set up your environment. Any of these steps can be skipped if you have already done them as part of your project:

1. Install [Node.js 14 or higher](https://nodejs.org/en/download/). Run `node --version` to verify which version you have installed:

    ```sh
    node --version
    ```

1. Add the [Anchor library](https://www.npmjs.com/package/@project-serum/anchor) to your project:

    ```sh
    npm i -g @project-serum/anchor
    ```

1. Add the [Chainlink Solana NPM library](https://www.npmjs.com/package/@chainlink/solana-sdk) to your project:

    ```sh
    npm i -g @chainlink/solana-sdk
    ```

1. Set the [Anchor environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). Anchor uses these to determine which wallet to use and how to get a connection to a Solana cluster. Take note that beacuse we are not generating or signing any transactions, the wallet isn't used, it's just required by the Anchor library, so you can create a dummy one if you need to (see [step 3](http://localhost:4200/docs/solana/using-data-feeds-off-chain/#run-the-example-program) further below). For a list of available networks and endpoints, see the [Solana Cluster RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints) documentation.

    ```sh
    export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com &&
    export ANCHOR_WALLET=./id.json
    ```

1. Use the following code sample to query price data off-chain, making sure to replace the `CHAINLINK_FEED_ADDRESS` variable value with the [feed account](https://docs.chain.link/docs/solana/data-feeds-solana/) that you wish to query

## JavaScript

    ```
    const anchor = require("@project-serum/anchor");
    const  chainlink = require("@chainlink/solana-sdk");
    const provider = anchor.Provider.env();


    async function main() {
        const provider = anchor.Provider.env();
        anchor.setProvider(provider);

        const CHAINLINK_FEED_ADDRESS="2ypeVyYnZaW2TNYXXTaZq9YhYvnqcjCiifW1C6n8b7Go"
        const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
        const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS); //ETH-USD Devnet

        //load the data feed account
        let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
        let listener = null;

        //listen for events agains the price feed, and grab the latest rounds price data
        listener = dataFeed.onRound(feedAddress, (event) => {
            console.log(event.answer.toNumber())
        });

        //block execution and keep waiting for events to be emitted with price data
        await new Promise(function () {});
    }

    main().then(
        () => process.exit(),
        err => {
            console.error(err);
            process.exit(-1);
        },
    );
    ```

## TypeScript

    ```
    import * as anchor from "@project-serum/anchor";
    import { OCR2Feed } from "@chainlink/solana-sdk";

    async function main() {
        const provider = anchor.Provider.env();
        anchor.setProvider(provider);

        const CHAINLINK_FEED_ADDRESS="2ypeVyYnZaW2TNYXXTaZq9YhYvnqcjCiifW1C6n8b7Go"
        const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
        const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS); //ETH-USD Devnet

        //load the data feed account
        let dataFeed = await OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
        let listener = null;

        //listen for events agains the price feed, and grab the latest rounds price data
        listener = dataFeed.onRound(feedAddress, (event) => {
            console.log(event.answer.toNumber())
        });

        //block execution and keep waiting for events to be emitted with price data
        await new Promise(function () {});
    }

    main().then(
        () => process.exit(),
        err => {
            console.error(err);
            process.exit(-1);
        },
    );
    ```

## Using Data Feeds Off-Chain: Solana Starter Kit Example

In this example, we'll read price data from an off-chain client using the Solana Starter Kit.

## Install the required tools

Before you begin, set up your environment for development on Solana:

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already configured on your system.

1. Install [Node.js 14 or higher](https://nodejs.org/en/download/). Run `node --version` to verify which version you have installed:

    ```sh
    node --version
    ```

1. Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) to simplify package management and run code samples.

1. Use the Node package manager to [Install Anchor](https://project-serum.github.io/anchor/getting-started/installation.html) globally. The global install allows you to run the [Anchor CLI](https://project-serum.github.io/anchor/cli/commands.html). Depending on your environment, this step might require `sudo` permissions:

    ```sh
    npm i -g @project-serum/anchor-cli
    ```

    On some operating systems, you might need to build and install Anchor locally. See the [Anchor documentation](https://project-serum.github.io/anchor/getting-started/installation.html#build-from-source-for-other-operating-systems) for instructions.

## Run the example program

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

1. Set the [Anchor environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). Anchor uses these to determine which wallet to use and Solana cluster to use. Take note that beacuse we are not generating or signing any transactions, the wallet isn't used, it's just required by the Anchor library. For a list of available networks and endpoints, see the [Solana Cluster RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints) documentation.

    ```sh
    export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com &&
    export ANCHOR_WALLET=./id.json
    ```

1. If you are using TypeScript, run the `read-data.ts` example:

    ```sh
    yarn run read-data
    ```

    The example code retrieves and prints the current price feed data until you close the application:

    ```
    yarn run v1.22.18
    $ ts-node ./read-data.ts
    9731000000
    9732000000
    9730839909
    9734000000
    ```

1. If you are using JavaScript, run the `read-data.js` example:

    ```sh
    node read-data.js
    ```

    The example code retrieves and prints the current price feed data until you close the application:

    ```
    285378472482
    285388880269
    285378649498
    285373633029
    285295000000
    ```

To learn more about Solana and Anchor, see the [Solana Documentation](https://docs.solana.com/) and the [Anchor Documentation](https://project-serum.github.io/anchor/).
