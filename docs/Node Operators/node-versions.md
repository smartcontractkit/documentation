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

## Upgrading to v1.0.0 nodes

**[v1.0.0 release notes](https://github.com/smartcontractkit/chainlink/releases/tag/v1.0.0)**

Before you upgrade your nodes to [v1.0.0](https://github.com/smartcontractkit/chainlink/releases/tag/v1.0.0) or later, be aware of the following requirements:

- If you are upgrading from a previous version, you **MUST** first upgrade the node to [v0.10.15](https://github.com/smartcontractkit/chainlink/releases/tag/v0.10.15).
- Always take a Database snapshot before you upgrade your Chainlink nodes. You must be able to roll the node back to a previous version in the event of an upgrade failure.
- The [v1.0.0](https://github.com/smartcontractkit/chainlink/releases/tag/v1.0.0) nodes support only the following job types:
  - [Offchain Reporting Jobs](/docs/jobs/types/offchain-reporting/)
