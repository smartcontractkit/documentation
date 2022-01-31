---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Node Versions and Upgrades"
permalink: "docs/node-versions/"
whatsnext: {"Running a Chainlink Node":"/docs/running-a-chainlink-node/"}
metadata:
  title: "Node Versions and Release Notes"
  description: "Details about various node versions and how to migrate between them."
---

You can find a list of release notes for Chainlink nodes in the [smartcontractkit GitHub repository](https://github.com/smartcontractkit/chainlink/releases). Docker images are available in the [Chainlink Docker hub](https://hub.docker.com/r/smartcontract/chainlink/tags).

## Changes to v1.1.0 nodes

**[v1.1.0 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.1.0)**

The v1.1.0 release includes several substantial changes to the way you configure and operate Chainlink nodes:

- **Legacy environment variables**: Legacy environment variables are supported, but they might be removed in future node versions. See the [Configuring Chainlink Nodes](/docs/configuration-variables/#evmethereum-legacy-environment-variables) page to learn how to migrate your nodes away from legacy environment variables and use the API, CLI, or GUI exclusively to administer chains and nodes.
- **Full EIP1559 Support**: Chainlink nodes include experimental support for submitting transactions using type 0x2 (EIP-1559) envelope. EIP-1559 mode is off by default, but can be enabled either globally or on a per-chain basis.
- **New log level added**:
  - [crit]: Critical level logs are more severe than [error] and require quick action from the node operator.
- **Multichain support (Beta)**: Chainlink now supports connecting to multiple different EVM chains simultaneously. This is disabled by default. See the [v1.1.0 Changelog](https://github.com/smartcontractkit/chainlink/blob/v1.1.0/docs/CHANGELOG.md#multichain-support-added) for details.

With multliple chain support, eth node configuration is stored in the database.

The following environment variables are DEPRECATED:

- ETH_URL
- ETH_HTTP_URL
- ETH_SECONDARY_URLS

Setting ETH_URL will cause Chainlink to automatically overwrite the database records with the given ENV values every time Chainlink boots. This behavior is used mainly to ease the process of upgrading from older versions, and on subsequent runs (once your old settings have been written to the database) it is recommended to unset these ENV vars and use the API commands exclusively to administer chains and nodes.

If you wish to continue using these environment variables (as it used to work in 1.0.0 and below) you must ensure that the following are set:

- ETH_CHAIN_ID (mandatory)
- ETH_URL (mandatory)
- ETH_HTTP_URL (optional)
- ETH_SECONDARY_URLS (optional)

If, instead, you wish to use the API/CLI/GUI to configure your chains and eth nodes (recommended) you must REMOVE the following environment variables:

- ETH_URL
- ETH_HTTP_URL
- ETH_SECONDARY_URLS

This will cause Chainlink to use the database for its node configuration.

NOTE: ETH_CHAIN_ID does not need to be removed, since it now performs the additional duty of specifying the default chain in a multichain environment (if you leave ETH_CHAIN_ID unset, the default chain is simply the "first").

For more information on configuring your node, check the [configuration variables in the docs](https://docs.chain.link/docs/configuration-variables/).

Before you upgrade your nodes to v1.1.0, be aware of the following requirements:

- If you are upgrading from a previous version, you **MUST** first upgrade the node to at least [v0.10.15](https://github.com/smartcontractkit/chainlink/releases/tag/v0.10.15).
- Always take a Database snapshot before you upgrade your Chainlink nodes. You must be able to roll the node back to a previous version in the event of an upgrade failure.

See the [v1.1.0 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.1.0) for a complete list of changes and fixes.

## Changes to v1.0.0 and v1.0.1 nodes

**[v1.0.0 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.0.0)**
**[v1.0.1 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.0.1)**

Before you upgrade your nodes to v1.0.0 or v1.0.1, be aware of the following requirements:

- If you are upgrading from a previous version, you **MUST** first upgrade the node to at least [v0.10.15](https://github.com/smartcontractkit/chainlink/releases/tag/v0.10.15).
- Always take a Database snapshot before you upgrade your Chainlink nodes. You must be able to roll the node back to a previous version in the event of an upgrade failure.
