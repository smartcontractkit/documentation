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
- **Failover nodes**: The process for configuring failover nodes has changed and includes a new `DATABASE_LOCKING_MODE=lease` configuration variable. The default locking mode is still `DATABASE_LOCKING_MODE=advisorylock`. See the new [Failover Node Example](/docs/performing-system-maintenance/#failover-node-example) to learn the new best practices for configuring and testing failover nodes that share the same database.
- **Full EIP1559 Support**: Chainlink nodes include experimental support for submitting transactions using type 0x2 (EIP-1559) envelope. EIP-1559 mode is off by default, but can be enabled either globally or on a per-chain basis.
- **Multichain support (Beta)**: Chainlink now supports connecting to multiple different EVM chains simultaneously. This is disabled by default. See the [v1.1.0 Changelog](https://github.com/smartcontractkit/chainlink/blob/v1.1.0/docs/CHANGELOG.md#multichain-support-added) for details.

See the [v1.1.0 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.1.0) for a complete list of changes and fixes.

## Changes to v1.0.0 and v1.0.1 nodes

**[v1.0.0 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.0.0)**
**[v1.0.1 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.0.1)**

Before you upgrade your nodes to v1.0.0 or v1.0.1, be aware of the following requirements:

- If you are upgrading from a previous version, you **MUST** first upgrade the node to [v0.10.15](https://github.com/smartcontractkit/chainlink/releases/tag/v0.10.15).
- Always take a Database snapshot before you upgrade your Chainlink nodes. You must be able to roll the node back to a previous version in the event of an upgrade failure.
