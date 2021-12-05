---
layout: nodes.liquid
section: solana
date: Last Modified
title: "Using Data Feeds (Solana)"
permalink: "docs/solana/using-data-feeds-solana/"
metadata:
  title: "Using Data Feeds (Solana)"
  description: "How to use Chainlink Data Feeds in your Solana programs."
---

Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world market prices of assets. For example, one use for data feeds is to enable smart contracts to retrieve the latest pricing data of an asset in a single call.

Price data feeds are available on the following networks:
- **Solana**
- [Terra](/docs/terra/using-data-feeds-terra/)
- [EVM-compatible networks](/docs/get-the-latest-price/)

This guide applies specifically to using data feeds on the [Solana network](https://solana.com/). To get the full list of Chainlink Data Feeds running on the Solana Devnet, see the [Solana Feeds](/docs/solana/data-feeds-solana/) page. You can view the program ID that owns these feeds in the [Solana Devnet Explorer](https://explorer.solana.com/address/2yqG9bzKHD59MxD9q7ExLvnDhNycB3wkvKXFQSpBoiaE?cluster=devnet).

{% include data-quality.md %}

## Overview

This guide demonstrates the following tasks:

- Write and deploy programs to the [Solana Devnet](https://explorer.solana.com/?cluster=devnet) using Rust.
- Retrieve data using the [Solana Web3 JavaScript API](https://www.npmjs.com/package/@solana/web3.js) with Node and Yarn.

This example shows you how to work with a program that you deploy, but you can refactor the client section to work with a program ID of your choice.

## Requirements

This guide requires the following tools:

- Build and deploying Solana programs:
  - [Rust](https://www.rust-lang.org/tools/install)
  - [The Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool)
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Call the deployed program to read the data feed for the [SOL / USD price](https://explorer.solana.com/address/FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf?cluster=devnet):
  - [Node.js 12 or higher](https://nodejs.org/en/download/)
  - [Yarn](https://classic.yarnpkg.com/en/docs/install/)

## Create and deploy a program to the Solana Devnet

1. Clone the [chainlink-solana-demo](https://github.com/smartcontractkit/chainlink-solana-demo) repository:

    ```bash
    git clone https://github.com/smartcontractkit/chainlink-solana-demo
    ```

    ```bash
    cd chainlink-solana-demo
    ```

1. Set the Solana cluster (network) to [Devnet](https://docs.solana.com/clusters#devnet):

    ```bash
    solana config set --url https://api.devnet.solana.com
    ```

1. Create a [keypair](https://docs.solana.com/terminology#keypair) for your account that you can use for testing and development. For production deployments, follow the security best practices for [Command Line Wallets](https://docs.solana.com/wallet-guide/cli#file-system-wallet-security).

    ```bash
    mkdir solana-wallet
    ```

    ```bash
    solana-keygen new --outfile ./solana-wallet/keypair.json
    ```

1. Fund your account. On Devnet, you can use `solana airdrop` to add tokens to your account:

    ```bash
    solana airdrop 5 $(solana-keygen pubkey solana-wallet/keypair.json)
    ```

    - If the command line faucet doesn't work, use `solana-keygen pubkey` to see your public key value and request tokens from [SolFaucet](https://solfaucet.com/):

        ```bash
        solana-keygen pubkey ./solana-wallet/keypair.json
        ```

1. Build the program using the [Solana BPF](https://docs.solana.com/developing/on-chain-programs/developing-rust#how-to-build):

    ```bash
    cargo build-bpf
    ```

1. Deploy the program. The output from the previous step will give you the command to execute to deploy the program. It should look similar to this:

    ```bash
    solana program deploy target/deploy/chainlink_solana_demo.so --keypair solana-wallet/keypair.json
    ```

    If the deployment is successful, it prints your program ID:

    ```bash
    RPC URL: https://api.devnet.solana.com
    Default Signer Path: solana-wallet/keypair.json
    Commitment: confirmed
    Program Id: AZRurZi6N2VTPpFJZ8DB45rCBn2MsBBYaHJfuAS7Tm4v
    ```

1. Copy the program ID and look it up in the [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet).

## Call a deployed program

After you deploy the program, you can use it to retrieve data from a feed. The code for this part of the guide is in the `client` folder from the [chainlink-solana-demo](https://github.com/smartcontractkit/chainlink-solana-demo) repository.

1. Change to the `client` directory and run `yarn` to install Node.js dependencies:

    ```bash
    cd client
    ```

    ```bash
    yarn
    ```

1. Run `yarn start` to execute the script:

    ```bash
    yarn start
    ```
    The script completes the following steps. This does require SOL tokens. If the script cannot run due to insufficient funds, airdrop more funds to your Devnet account again.

    If the script executes correctly, you will see output with the current price of SOL/USD.

## Review the example code

You can view the Rust code and Typescript for this example on GitHub. See the [chainlink-solana-demo](https://github.com/smartcontractkit/chainlink-solana-demo) repository. The example code has a few main components:

- The [client Typescript files](https://github.com/smartcontractkit/chainlink-solana-demo/tree/main/client/src) that establish a connection to the deployed program, determine the fees associated with retrieving the feed data, handle serialization and deserialization of data, and report the returned price from the specified data feed. In this case, the script tells your deployed Solana program to retrieve the price of SOL / USD from [FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf](https://explorer.solana.com/address/FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf?cluster=devnet).
- The [`./src/lib.rs`](https://github.com/smartcontractkit/chainlink-solana-demo/blob/main/src/lib.rs) file that defines the on-chain program for retrieving price data from a specified [Solana Data Feed](/docs/solana/data-feeds-solana/). This program also imports some methods from the main [smartcontractkit/chainlink-solana](https://github.com/smartcontractkit/chainlink-solana) repository.
- The program imports some dependencies from the [chainlink-solana](https://github.com/smartcontractkit/chainlink-solana) repository.

The example code operates using the following process:

1. The client [`main.ts`](https://github.com/smartcontractkit/chainlink-solana-demo/blob/main/client/src/main.ts) script defines the process for connecting to the cluster, establishing fee payment, and verifying that your Solana program deployed correctly. The script also calls `getPrice` and `reportPrice` in the [`hello_world.ts`](https://github.com/smartcontractkit/chainlink-solana-demo/blob/main/client/src/hello_world.ts) file.

1. The `getPrice` function defines `const priceFeedAccount` to specify which data feed to use. Then, it creates `const instruction` with a formatted [transaction](https://docs.solana.com/terminology#transaction) that your deployed Solana program can process. The script sends that instruction and waits for the transaction to confirm that it is complete.

    ```Typescript
    export async function getPrice(): Promise<void> {
      console.log('Getting data from ', readingPubkey.toBase58())
      const priceFeedAccount = "FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf"
      const AggregatorPublicKey = new PublicKey(priceFeedAccount)
      const instruction = new TransactionInstruction({
        keys: [{ pubkey: readingPubkey, isSigner: false, isWritable: true },
        { pubkey: AggregatorPublicKey, isSigner: false, isWritable: false }],
        programId,
        data: Buffer.alloc(0), // All instructions are hellos
      })
      await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [payer],
      )
    }
    ```

1. Your deployed program receives the request and starts processing at the [`entrypoint` in `src/lib.rs`](https://github.com/smartcontractkit/chainlink-solana-demo/blob/main/src/lib.rs#L45). This is the Rust program that you built and deployed to the Solana Devnet.

1. The `process_instruction` function in `lib.rs` receives the transaction with the specified feed address and handles the steps to retrieve and store the price data on-chain. The function also calls `get_price()` from the [chainlink-solana](https://github.com/smartcontractkit/chainlink-solana) package, which gets imported from GitHub in the `Cargo.toml` file. See the [`Cargo.toml`](https://github.com/smartcontractkit/chainlink-solana-demo/blob/main/Cargo.toml#L19) file, which maps the `chainlink-solana` package to `chainlink`.

    ```rust
    pub fn process_instruction(
        _program_id: &Pubkey, // Ignored
        accounts: &[AccountInfo], // Public key of the account to read price data from
        _instruction_data: &[u8], // Ignored
    ) -> ProgramResult {
        msg!("Chainlink Solana Demo program entrypoint");

        let accounts_iter = &mut accounts.iter();
        // This is the account of our our account
        let my_account = next_account_info(accounts_iter)?;
        // This is the account of the data feed for prices
        let feed_account = next_account_info(accounts_iter)?;

        const DECIMALS: u32 = 9;

        let price = chainlink::get_price(&chainlink::id(), feed_account)?;

        if let Some(price) = price {
            let decimal = Decimal::new(price, DECIMALS);
            msg!("Price is {}", decimal);
        } else {
            msg!("No current price");
        }

         // Store the price ourselves
         let mut price_data_account = PriceFeedAccount::try_from_slice(&my_account.data.borrow())?;
         price_data_account.answer = price.unwrap_or(0);
         price_data_account.serialize(&mut &mut my_account.data.borrow_mut()[..])?;


        Ok(())
    }
    ```

1. After the deployed Solana program finishes storing the data on-chain, the script retrieves the price data from the on-chain storage and prints it to the console.

    ```rust
    export async function reportPrice(): Promise<void> {
      // const priceFeedAccount = "FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf"
      // const AggregatorPublicKey = new PublicKey(priceFeedAccount)
      const accountInfo = await connection.getAccountInfo(readingPubkey)
      if (accountInfo === null) {
        throw new Error('Error: cannot find the aggregator account')
      }
      const latestPrice = borsh.deserialize(
        AggregatorSchema,
        AggregatorAccount,
        accountInfo.data,
      )
      console.log("Current price of SOL/USD is: ", latestPrice.answer.toString())
    }
    ```

In addition to the main functions of this example, several smaller components are required:

- The [`solana-program` crate](https://lib.rs/crates/solana-program) provides necessary functions for on-chain transactions.
- The communications between the script and the deployed program are serialized and deserialized using [Borsh](https://borsh.io/).
- The [Solana JavaScript API](https://solana-labs.github.io/solana-web3.js/) handles RPCs required to retrieve account data.

If you want to experiment with the code yourself to learn how it works, see this [example code on GitHub](https://github.com/smartcontractkit/chainlink-solana-demo/).

To learn more about Solana, head to the [Solana Documentation](https://docs.solana.com/), as well as our blog post on [How to Build and Deploy a Solana Smart Contract](https://blog.chain.link/how-to-build-and-deploy-a-solana-smart-contract/)
