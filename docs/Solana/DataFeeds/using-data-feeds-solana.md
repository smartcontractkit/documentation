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

This guide applies specifically to using data feeds on [Solana](https://solana.com/) clusters. To get the full list of Chainlink Data Feeds on Solana, see the [Solana Feeds](/docs/solana/data-feeds-solana/) page.

View the program that owns the Chainlink Data Feeds in the [Solana Devnet Explorer](https://solscan.io/account/CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT?cluster=devnet).

{% include data-quality.md %}

## Overview

This guide demonstrates the following tasks:

- Write and deploy programs to the [Solana Devnet](https://solscan.io/?cluster=devnet) cluster using Anchor.
- Retrieve data using the [Solana Web3 JavaScript API](https://www.npmjs.com/package/@solana/web3.js) with Node.js.

This example shows you how to work with a program that you deploy, but you can refactor the client section to work with a program ID of your choice.

**Table of contents:**

- [Install the required tools](#install-the-required-tools)
- [Deploy the example program](#deploy-the-example-program)
- [Call the deployed program](#call-the-deployed-program)
- [Clean up](#clean-up)

## Install the required tools

Before you begin, set up your environment for development on Solana:

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already configured on your system.

1. Install [Node.js 12 or higher](https://nodejs.org/en/download/). Run `node --version` to verify which version you have installed:

    ```sh
    node --version
    ```

1. Install a C compiler such as the one included in [GCC](https://gcc.gnu.org/install/). Some dependencies require a C compiler.

    ```sh
    sudo apt install gcc
    ```

1. Install [Rust](https://www.rust-lang.org/tools/install):

    ```sh
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh &&
    source $HOME/.cargo/env
    ```

1. Install the latest Mainnet version of [the Solana CLI](https://github.com/solana-labs/solana/releases) and export the path to the CLI:

    ```sh
    sh -c "$(curl -sSfL https://release.solana.com/v1.8.14/install)" &&
    export PATH="~/.local/share/solana/install/active_release/bin:$PATH"
    ```

    Run `solana --version` to make sure the Solana CLI is installed correctly.

    ```sh
    solana --version
    ```

1. Use the Node package manager to [Install Anchor](https://project-serum.github.io/anchor/getting-started/installation.html). Depending on your environment, this step might require `sudo` permissions:

    ```sh
    npm i -g @project-serum/anchor-cli
    ```

    On some operating systems, you might need to build and install Anchor locally. See the [Anchor documentation](https://project-serum.github.io/anchor/getting-started/installation.html#build-from-source-for-other-operating-systems) for instructions.

After you install the required tools, deploy the example program from the [solana-starter-kit](https://github.com/smartcontractkit/solana-starter-kit) repository.

## Deploy the example program

This example includes a contract written in Rust. Deploy the contract to the Solana Devnet cluster.

1. In a terminal, clone the [solana-starter-kit](https://github.com/smartcontractkit/solana-starter-kit) repository and change to the `solana-starter-kit` directory:

    ```sh
    git clone https://github.com/smartcontractkit/solana-starter-kit &&
    cd ./solana-starter-kit
    ```

    You can see the complete code for the example on [GitHub](https://github.com/smartcontractkit/solana-starter-kit/).

1. In the `./solana-starter-kit` directory, install Node.js dependencies defined in the `package.json` file:

    ```sh
    npm install
    ```

1. Create a temporary Solana wallet to use for this example. Use a temporary wallet to isolate development and testing from your other wallets. Alternatively, if you have an existing wallet that you want to use, locate the path to your [keypair](https://docs.solana.com/terminology#keypair) file and use it as the keypair for the rest of this guide.

    ```sh
    solana-keygen new --outfile ./id.json
    ```

    Always follow the security best practices in the [Solana Wallet Guide](https://docs.solana.com/wallet-guide) when managing your wallets and keypairs.

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

## Call the deployed program

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
    Price Is: 9056000000
    Success
    ⋮
    ```

1. Each request costs an amount of SOL that is subtracted from the `id.json` wallet. Run `solana balance` to check the remaining balance for your temporary wallet on Devnet.

    ```sh
    solana balance --keypair ./id.json --url devnet
    ```

1. To get prices for a different asset pair, run `client.js` again and add the `--feed` flag with one of the available [Chainlink data feeds on the Solana Devnet](/docs/solana/data-feeds-solana/). For example, to get the price of LINK / USD, use the following command:

    ```sh
    node client.js \
    --program $(solana address -k ./target/deploy/chainlink_solana_demo-keypair.json) \
    --feed CFRkaCg9PcuMaCZZdcePkaa8d8ugtH221HL7tXQHNVia
    ```

    ```sh
    Price Is: 1517000000
    Success
    ```

The program that owns the data feeds is [CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT](https://solscan.io/account/CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT?cluster=devnet), which you can see defined for `const CHAINLINK_PROGRAM_ID` in the `client.js` file.

<!-- TODO: Add a step by step explanation for what the contract is doing and how client.js functions. -->

## Clean up

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
