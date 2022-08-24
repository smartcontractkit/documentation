---
layout: nodes.liquid
section: solana
date: Last Modified
title: "Overview"
permalink: "docs/solana/"
whatsnext: {
  "Use data feeds off-chain":"/docs/solana/using-data-feeds-off-chain/",
  "Use data feeds on-chain":"/docs/solana/using-data-feeds-solana/",
  "See the available data feeds on Solana":"/docs/solana/data-feeds-solana/"
}
---

Chainlink provides data feeds on the [Solana](https://solana.com/) network. Chainlink data feeds on Solana employ [Off-Chain Reporting (OCR)](/docs/off-chain-reporting/) to aggregate data from data providers who pull from both centralized and decentralized exchanges. Chainlink’s Solana deployment has no dependencies on external blockchain networks such as Ethereum. In Solana, storage and smart contract logic are separate. Programs store all the logic similar to an EVM (Ethereum) smart contract. The accounts store all the data. Compared to Solidity, the combination of an account and a program is equivalent to a smart contract on an EVM chain. State and logic are separate in Solana.

Solana programs are stateless, so you don't always need to deploy your program to the network to test it. You can deploy and test your programs on a [Solana Test Validator](https://docs.solana.com/developing/test-validator). However, to use Chainlink products on Solana, you must deploy your contract on-chain to one of the [supported Solana clusters](#chainlink-products-and-solana-clusters).

> 📘 Please note that Price Feeds performance relies on the chains they are deployed on. Periods of high network congestion may impact the frequency of Chainlink Price Feeds. Subscribe to [Solana status](https://status.solana.com/) notifications to stay updated on system performance.

To learn how to mitigate risk to your applications, read the [Selecting Quality Data Feeds](/docs/selecting-data-feeds/) page.

**Topics**

+ [Chainlink products and Solana clusters](#chainlink-products-and-solana-clusters)
+ [Languages, tools, and frameworks](#languages-tools-and-frameworks)
+ [Solana wallets](#solana-wallets)

## Chainlink products and Solana clusters

[Data Feeds](/docs/solana/data-feeds-solana/) are available on the following Solana clusters:

- [Solana Mainnet](https://solscan.io/)
- [Solana Devnet](https://solscan.io/?cluster=devnet)

Solana provides a [Testnet cluster](https://docs.solana.com/clusters#testnet) that runs newer [Solana releases](https://github.com/solana-labs/solana/releases), but Chainlink Data Feeds are not available on this cluster.

See the [Solana Data Feeds](/docs/solana/data-feeds-solana/) page for a full list of Chainlink data feeds that are available on Solana.

To learn when more Chainlink services become available, follow us on [Twitter](https://twitter.com/chainlink) or sign up for our [mailing list](/docs/developer-communications/).

## Languages, tools, and frameworks

The examples in the Chainlink documentation use the following languages, tools, and frameworks:

- [Node.js 14 or higher](https://nodejs.org/en/download/): Used to run client code
- [Rust](https://docs.solana.com/developing/on-chain-programs/developing-rust): A general-purpose programming language designed for performance and memory safety
- [Anchor](https://project-serum.github.io/anchor/getting-started/introduction.html): A framework for the [Solana Sealevel runtime](https://github.com/solana-labs/sealevel) that provides several developer tools
- [Chainlink Solana Starter Kit](https://github.com/smartcontractkit/solana-starter-kit): An Anchor based program and client that shows developers how to use and interact with Chainlink Data Feeds on Solana
- [Solana CLI](https://docs.solana.com/cli): The Solana command line interface
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git): Used to clone the example code repository

When developing applications to use Chainlink products on Solana, always use a [Mainnet release](https://github.com/solana-labs/solana/releases) version of the Solana CLI that is equal to or greater than the version currently running on your target cluster. Use `solana --version` and `solana cluster-version` to check CLI and cluster versions:

```sh
solana --version
solana-cli 1.9.28 (src:b576e9cc; feat:320703611)

solana cluster-version --url devnet
1.9.25

solana cluster-version --url mainnet-beta
1.9.28
```

The examples in this documentation use Solana programs in [Rust](https://docs.solana.com/developing/on-chain-programs/developing-rust), but you can also write Solana programs in [C](https://docs.solana.com/developing/on-chain-programs/developing-c). To learn more about the Solana programming model, see the [Solana Documentation](https://docs.solana.com/developing/programming-model/overview).

## Solana Wallets

When you use Chainlink on Solana, you need a [Solana wallet](https://docs.solana.com/wallet-guide/). The Chainlink documentation uses [file system wallets](https://docs.solana.com/wallet-guide/file-system-wallet) and free Devnet SOL tokens to demonstrate examples. When you deploy your programs to the Solana Mainnet, you must use wallets with mainnet lamports.

If you have existing wallets that you want to use for the guides in the Chainlink documentation, find your wallet keypair and make it available in your development environment as a file. You can point [Anchor](https://project-serum.github.io/anchor/getting-started/introduction.html) and the [Solana CLI](https://docs.solana.com/cli) to a specific keypair when you deploy or manage your Solana programs.

```sh
anchor build
⋮

anchor deploy --provider.wallet ~/.config/solana/id.json --provider.cluster devnet
⋮

solana program show --programs --keypair ~/.config/solana/id.json --url devnet

Program Id                                   | Slot      | Authority                                    | Balance
6U4suTp55kiJRKqV7HGAQvFgcLaStLnUA4myg5DRqsKw | 109609728 | E6gKKToCJPgf4zEL1GRLL6T99g2WcfAzJAMvtma1KijT | 2.57751768 SOL
```

When you build your production applications and deploy Solana programs to the Mainnet cluster, always follow the security best practices in the [Solana Wallet Guide](https://docs.solana.com/wallet-guide) for managing your wallets and keypairs.
