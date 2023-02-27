---
layout: nodes.liquid
section: solana
date: Last Modified
title: "Using Data Feeds On-Chain (Solana)"
permalink: "docs/solana/using-data-feeds-solana/"
whatsnext: {
  "Use data feeds off-chain":"/docs/solana/using-data-feeds-off-chain/",
  "See the available data feeds on Solana":"/docs/solana/data-feeds-solana/"
}
metadata:
  title: "Using Data Feeds On-Chain (Solana)"
  description: "How to use Chainlink Data Feeds in your on-chain Solana programs."
---

Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world market prices of assets. This guide demonstrates how to deploy a program to the Solana Devnet cluster and access Data Feeds on-chain using the [Chainlink Solana Starter Kit](https://github.com/smartcontractkit/solana-starter-kit). To learn how to read price feed data using off-chain applications, see the [Using Data Feeds Off-Chain](/docs/solana/using-data-feeds-off-chain/) guide.

To get the full list of available Chainlink Data Feeds on Solana, see the [Solana Feeds](/docs/solana/data-feeds-solana/) page. View the program that owns the Chainlink Data Feeds in the [Solana Devnet Explorer](https://solscan.io/account/HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny?cluster=devnet), or the [Solana Mainnet Explorer](https://solscan.io/account/HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny).

{% include 'data-quality.md' %}

**Topics**

- [The Chainlink Data Feeds OCR2 Program](#the-chainlink-data-feeds-ocr2-program)
- [Adding Data Feeds On-Chain In An Existing Project](#adding-data-feeds-on-chain-in-an-existing-project)
- [Using the Solana Starter Kit](#using-the-solana-starter-kit)
  - [Install the required tools](#install-the-required-tools)
  - [Deploy the example program](#deploy-the-example-program)
  - [Call the deployed program](#call-the-deployed-program)
  - [Clean up](#clean-up)

## The Chainlink Data Feeds OCR2 Program

The program that owns the data feeds on both Devnet and Mainnet is [HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny](https://solscan.io/account/HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny?cluster=devnet). This is the program ID that you use to retrieve Chainlink Price Data on-chain in your program. The source code for this program is available in the [smartcontractkit/chainlink-solana](https://github.com/smartcontractkit/chainlink-solana/tree/develop/contracts/programs/ocr2) repository on GitHub.

You can [add data feeds to an existing project](#adding-data-feeds-on-chain-in-an-existing-project) or [use the Solana Starter Kit](#using-the-solana-starter-kit).

## Adding Data Feeds On-Chain In An Existing Project

You can read Chainlink Data Feed data on-chain in your existing project using the [Chainlink Solana Crate](https://crates.io/crates/chainlink_solana).

> 🚧 Reading feed data
>
> Although you can directly query the data feed accounts, you should not rely on the memory layout always being the same as it currently is. Based on this, the recommendation is to always use the consumer library queries below.

Import the Chainlink Solana Crate into your project and use the code sample to make function calls.

1. Add the Chainlink Solana Crate as an entry in your `Cargo.toml` file dependencies section, as shown in the [starter kit Cargo.toml example](https://github.com/smartcontractkit/solana-starter-kit/blob/main/programs/chainlink_solana_demo/Cargo.toml).

    ```toml
    [dependencies]
    chainlink_solana = "1.0.0"
    ```

1. Use the following code sample to query price data. Each function call to the Chainlink Solana library takes two parameters:

    - The [feed account](/docs/solana/data-feeds-solana/) that you want to query.
    - The [Chainlink Data Feeds OCR2 Program](#the-chainlink-data-feeds-ocr2-program) for the network. This is a static value that never changes.

The code sample has the following components:

- `latest_round_data`: Returns the latest round information for the specified price pair including the latest price
- `description`: Returns a price pair description such as SOL/USD
- `decimals`: Returns the precision of the price, as in how many numbers the price is padded out to
- `Display`: A helper function that formats the padded out price data into a human-readable price

```rust Rust
{% include 'samples/Solana/PriceFeeds/on-chain-read.rs' %}
```
```rust Rust and Anchor
{% include 'samples/Solana/PriceFeeds/on-chain-read-anchor.rs' %}
```

Program Transaction logs:

```sh Rust
> Program logged: "Chainlink Price Feed Consumer entrypoint"
> Program logged: "SOL / USD price is 83.99000000"
> Program consumed: 95953 of 1400000 compute units
> Program return: HNYSbr77Jc9LhHeb9tx53SrWbWfNBnQzQrM4b3BB3PCR CA==
```
```sh Rust with Anchor
Fetching transaction logs...
[
  'Program HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny consumed 1826 of 1306895 compute units',
  'Program return: HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny CA==',
  'Program HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny success',
  'Program log: SOL / USD price is 93.76988029',
]
```

To learn more about Solana and Anchor, see the [Solana Documentation](https://docs.solana.com/) and the [Anchor Documentation](https://project-serum.github.io/anchor/).

## Using the Solana Starter Kit

This guide demonstrates the following tasks:

- Write and deploy programs to the [Solana Devnet](https://solscan.io/?cluster=devnet) cluster using Anchor.
- Retrieve price data data using the [Solana Web3 JavaScript API](https://www.npmjs.com/package/@solana/web3.js) with Node.js.

This example shows a full end to end example of using Chainlink Price Feeds on Solana. It includes an on-chain program written in rust, as well as an off-chain client written in JavaScript. The client passes in an account to the program, the program then looks up the latest price of the specified price feed account, and then stores the result in the passed in account. The off-chain client then reads the value stored in the account.

### Install the required tools

Before you begin, set up your environment for development on Solana:

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already configured on your system.

1. Install [Node.js 14 or higher](https://nodejs.org/en/download/). Run `node --version` to verify which version you have installed:

    ```sh
    node --version
    ```

1. Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) to simplify package management and run code samples.

1. Install a C compiler such as the one included in [GCC](https://gcc.gnu.org/install/). Some of the dependencies require a C compiler.

1. Install [Rust](https://www.rust-lang.org/tools/install):

    ```sh
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh &&
    source $HOME/.cargo/env
    ```

1. Install the latest Mainnet version of [the Solana CLI](https://github.com/solana-labs/solana/releases) and export the path to the CLI:

    ```sh
    sh -c "$(curl -sSfL https://release.solana.com/v1.9.28/install)" &&
    export PATH="~/.local/share/solana/install/active_release/bin:$PATH"
    ```

    Run `solana --version` to make sure the Solana CLI is installed correctly.

    ```sh
    solana --version
    ```

1. [Install Anchor](https://book.anchor-lang.com/getting_started/installation.html). On some operating systems, you might need to build and install Anchor locally. See the [Anchor documentation](https://book.anchor-lang.com/getting_started/installation.html#build-from-source-for-other-operating-systems-without-avm) for instructions.

After you install the required tools, build and deploy the example program from the [solana-starter-kit](https://github.com/smartcontractkit/solana-starter-kit) repository.

### Deploy the example program

This example includes a contract written in Rust. Deploy the contract to the Solana Devnet cluster.

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

1. Create a temporary Solana wallet to use for this example. Use a temporary wallet to isolate development from your other wallets and prevent you from unintentionally using lamports on the Solana Mainnet. Alternatively, if you have an existing wallet that you want to use, locate the path to your [keypair](https://docs.solana.com/terminology#keypair) file and use it as the keypair for the rest of this guide.

    ```sh
    solana-keygen new --outfile ./id.json
    ```

    When you build your production applications and deploy Solana programs to the Mainnet cluster, always follow the security best practices in the [Solana Wallet Guide](https://docs.solana.com/wallet-guide) for managing your wallets and keypairs.

1. Fund your Solana wallet. On Devnet, use `solana airdrop` to add tokens to your account. The contract requires at least 4 SOL to deploy and the faucet limits each request to 2 SOL, so you must make two requests to get a total of 4 SOL on your wallet:

    ```sh
    solana airdrop 2 --keypair ./id.json --url devnet &&
    solana airdrop 2 --keypair ./id.json --url devnet
    ```

    - If the command line faucet does not work, run `solana address` on the temporary wallet to print the public key value for the wallet and request tokens from [SolFaucet](https://solfaucet.com/):

        ```sh
        solana address -k ./id.json
        ```

1. Run `anchor build` to build the example program. If you receive the `no such subcommand: 'build-bpf'` error, restart your terminal session and run `anchor build` again:

    ```sh
    anchor build
    ```

1. The build process generates the keypair for your program's account. Before you deploy your program, you must add this public key to the `lib.rs` file:

    1. Get the keypair from the `./target/deploy/chainlink_solana_demo-keypair.json` file that Anchor generated:

        ```sh
        solana address -k ./target/deploy/chainlink_solana_demo-keypair.json
        ```

    1. Edit the `./programs/chainlink_solana_demo/src/lib.rs` file and replace the keypair in the `declare_id!()` definition:

        ```sh
        vi ./programs/chainlink_solana_demo/src/lib.rs
        ```

        ```sh
        declare_id!("JC16qi56dgcLoaTVe4BvnCoDL6FhH5NtahA7jmWZFdqm");
        ```

1. With the new program ID added, run `anchor build` again. This recreates the necessary program files with the correct program ID:

    ```sh
    anchor build
    ```

1. Run `anchor deploy` to deploy the program to the Solana Devnet. Remember to specify the keypair file for your wallet and override the default. This wallet is the [account owner](https://docs.solana.com/terminology#account-owner) (authority) for the program:

    ```sh
    anchor deploy --provider.wallet ./id.json --provider.cluster devnet
    ```

1. To confirm that the program deployed correctly, run `solana program show --programs` to get a list of deployed programs that your wallet owns. For this example, check the list of deployed programs for the `id.json` wallet on the Solana Devnet:

    ```sh
    solana program show --programs --keypair ./id.json --url devnet
    ```

    The command prints the program ID, slot number, the wallet address that owns the program, and the program balance:

    ```sh
    Program Id                                   | Slot      | Authority                                    | Balance
    GRt21UnJFHZvcaWLbcUrXaTCFMREewDrm1DweDYBak3Z | 110801571 | FsQPnANKDhqpoayxCL3oDHFCBmrhP34NrfbDR34qbQUt | 3.07874904 SOL
    ```

    To see additional details of your deployed program, copy the program ID and look it up in the [Solana Devnet Explorer](https://solscan.io/?cluster=devnet).

Now that the program is on-chain, you can call it using the [Anchor Web3 module](https://project-serum.github.io/anchor/ts/modules/web3.html).

### Call the deployed program

Use your deployed program to retrieve price data from a Chainlink data feed on Solana Devnet. For this example, call your deployed program using the [Anchor Web3 module](https://project-serum.github.io/anchor/ts/modules/web3.html) and the [`client.js` example](https://github.com/smartcontractkit/solana-starter-kit/blob/main/client.js) code.

1. Set the [Anchor environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). Anchor uses these to determine which wallet to use and Solana cluster to use.

    ```sh
    export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com &&
    export ANCHOR_WALLET=./id.json
    ```

1. Run the `client.js` example and pass the program address in using the `--program` flag:

    ```sh
    node client.js --program $(solana address -k ./target/deploy/chainlink_solana_demo-keypair.json)
    ```

    If the script executes correctly, you will see output with the current price of SOL / USD.

    ```sh
    ⋮
    Price Is: 96.79778375
    Success
    ⋮
    ```

1. Each request costs an amount of SOL that is subtracted from the `id.json` wallet. Run `solana balance` to check the remaining balance for your temporary wallet on Devnet.

    ```sh
    solana balance --keypair ./id.json --url devnet
    ```

1. To get prices for a different asset pair, run `client.js` again and add the `--feed` flag with one of the available [Chainlink data feeds](/docs/solana/data-feeds-solana/). For example, to get the price of BTC / USD on Devnet, use the following command:

    ```sh
    node client.js \
    --program $(solana address -k ./target/deploy/chainlink_solana_demo-keypair.json) \
    --feed CzZQBrJCLqjXRfMjRN3fhbxur2QYHUzkpaRwkWsiPqbz
    ```

    ```sh
    Price Is: 12.4215826
    Success
    ```

The program that owns the data feeds is [HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny](https://solscan.io/account/HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny?cluster=devnet), which you can see defined for `const CHAINLINK_PROGRAM_ID` in the `client.js` file.

### Clean up

After you are done with your deployed contract and no longer need it, it is nice to close the program and withdraw the Devnet SOL tokens for future use. In a production environment, you will want to withdraw unused SOL tokens from any Solana program that you no longer plan to use, so it is good to practice the process when you are done with programs on Devnet.

1. Run `solana program show` to see the list of deployed programs that your wallet owns and the balances for each of those programs:

    ```sh
    solana program show --programs --keypair ./id.json --url devnet
    ```

    ```sh
    Program Id                                   | Slot      | Authority                                    | Balance
    GRt21UnJFHZvcaWLbcUrXaTCFMREewDrm1DweDYBak3Z | 110801571 | FsQPnANKDhqpoayxCL3oDHFCBmrhP34NrfbDR34qbQUt | 3.07874904 SOL
    ```

1. Run `solana program close` and specify the program that you want to close:

    ```sh
    solana program close [YOUR_PROGRAM_ID] --keypair ./id.json --url devnet
    ```

    The program closes and the remaining SOL is transferred to your temporary wallet.

1. If you have deployments that failed, they might still be in the buffer holding SOL tokens. Run `solana program show` again with the `--buffers` flag:

    ```sh
    solana program show --buffers --keypair ./id.json --url devnet
    ```

    If you have open buffers, they will appear in the list.

    ```sh
    Buffer Address                               | Authority                                    | Balance
    CSc9hnBqYJoYtBgsryJAmrjAE6vZ918qaFhL6N6BdEmB | FsQPnANKDhqpoayxCL3oDHFCBmrhP34NrfbDR34qbQUt | 1.28936088 SOL
    ```

1. If you have any buffers that you do not plan to finish deploying, run the same `solana program close` command to close them and retrieve the unused SOL tokens:

    ```sh
    solana program close [YOUR_PROGRAM_ID] --keypair ./id.json --url devnet
    ```

1. Check the balance on your temporary wallet.

    ```sh
    solana balance --keypair ./id.json --url devnet
    ```

1. If you are done using this wallet for examples and testing, you can use [`solana transfer`](https://docs.solana.com/cli/transfer-tokens) to send the remaining SOL tokens to your default wallet or another Solana wallet that you use. For example, if your default wallet keypair is at `~/.config/solana/id.json`, you can send `ALL` of the temporary wallet's balance with the following command:

    ```sh
    solana transfer ~/.config/solana/id.json ALL --keypair ./id.json --url devnet
    ```

    Alternatively, you can send the remaining balance to a web wallet. Specify the public key for your wallet instead of the path the default wallet keypair. Now you can use those Devnet funds for other examples and development.

To learn more about Solana and Anchor, see the [Solana Documentation](https://docs.solana.com/) and the [Anchor Documentation](https://project-serum.github.io/anchor/).
