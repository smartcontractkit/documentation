---
layout: ../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Find Existing Jobs"
permalink: "docs/any-api/find-oracle/"
whatsnext:
  {
    "API Reference": "/any-api/api-reference/",
    "Testnet Oracles": "/any-api/testnet-oracles/",
    "Data Provider Nodes": "/any-api/data-providers/introduction/",
  }
---

This page explains how to find an existing Oracle Job to suit the needs of your API call.

## Introduction to Oracles

Oracles enable smart contracts to retrieve data from the outside world. Each oracle node can be configured to perform a wide range of tasks depending on the adapters it supports. For example, if your contract needs to make an HTTP GET request, it needs to use an oracle that supports the HTTP GET adapter.

Oracles [jobs](/chainlink-nodes/oracle-jobs/jobs/) can be specialized even further by implementing the configuration using [External Adapters](/chainlink-nodes/external-adapters/external-adapters/). For example, an Oracle job could implement URL, parameters, and conversion to Solidity compatible data, to retrieve a very specific piece of data from a specific API endpoint. This process is demonstrated in [Make an Existing Job Request](/any-api/get-request/examples/existing-job-request/).

## Oracle Jobs and Types of Data Available

### Data provider nodes

Chainlink has facilitated the launch of several oracle data services that allow dApps to access rich data from external data sources through provider-owned nodes. The full list of such provider nodes is available here:

- [Data Provider Node List](/any-api/data-providers/introduction/#data-provider-nodes-list)

### Find a job

#### Community node operators

To find an Oracle Job that is pre-configured for your use case and available on the right network, join the [Chainlink operator-requests discord channel](https://discord.gg/eGcxsdZzKR) to directly communicate with community node operators.

#### Alternatives on testnets

On testnets, several alternatives are provided:

- The Chainlink Development Relations team maintains [Testnet Oracles](/any-api/testnet-oracles/) that you can use to test implementations. If you don't find a suitable job for your needs, join [Chainlink operator-requests discord channel](https://discord.gg/eGcxsdZzKR) or check the other alternatives below.
- You can also deploy testnet nodes and external adapters on [naas.link](https://naas.link/). You must write your own [jobs](/chainlink-nodes/oracle-jobs/jobs/): To help you get started, each [ANY API tutorial](/any-api/get-request/introduction/) has a corresponding job attached to it. **Note:** [naas.link](https://naas.link) is managed by [linkpool.io](https://linkpool.io/). Refer to the contact section at the bottom of the page for more assistance.
- Run your own testnet nodes as explained [here](/chainlink-nodes/v1/running-a-chainlink-node/). You must write your own [jobs](/chainlink-nodes/oracle-jobs/jobs/): To help you get started, each [ANY API tutorial](/any-api/get-request/introduction/) has a corresponding job attached to it.
