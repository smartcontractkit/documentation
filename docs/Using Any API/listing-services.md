---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Find Existing Jobs'
permalink: 'docs/listing-services/'
whatsnext: { 'API Reference': '/docs/chainlink-framework/', 'Testnet Oracles': '/docs/any-api-testnet-oracles/' }
---

## Overview

This page explains how to find an existing Oracle Job to suit the needs of your API call.

**Topics**

- [Introduction to Oracles](#introduction-to-oracles)
- [Oracle Jobs and Types of Data Available](#oracle-jobs-and-types-of-data-available)
  - [Data provider nodes](#data-provider-nodes)
  - [Find a job](#find-a-job)
    - [Community node operators](#community-node-operators)
    - [Alternatives on testnets](#alternatives-on-testnets)

## Introduction to Oracles

Oracles enable smart contracts to retrieve data from the outside world. Each oracle node can be configured to perform a wide range of tasks depending on the adapters it supports. For example, if your contract needs to make an HTTP GET request, it needs to use an oracle that supports the HTTP GET adapter.

Oracles [jobs](/docs/jobs/) can be specialized even further by implementing the configuration using [External Adapters](/docs/external-adapters/). For example, an Oracle job could implement URL, parameters, and conversion to Solidity compatible data, to retrieve a very specific piece of data from a specific API endpoint. This process is demonstrated in [Make an Existing Job Request](/docs/existing-job-request/).

## Oracle Jobs and Types of Data Available

### Data provider nodes

Chainlink has facilitated the launch of several oracle data services that allow dApps to access rich data from external data sources through provider-owned nodes. The full list of such provider nodes is available here:

- [Data Provider Node List](/docs/data-provider-nodes/#data-provider-nodes-list)

### Find a job

#### Community node operators

To find an Oracle Job that is pre-configured for your use case and available on the right network, join the [Chainlink operator-requests discord channel](https://discord.gg/eGcxsdZzKR) to directly communicate with community node operators.

#### Alternatives on testnets

On testnets, several alternatives are provided:

- The Chainlink Development Relations team maintains [Testnet Oracles](/docs/any-api-testnet-oracles/) that you can use to test implementations. If you don't find a suitable job for your needs, join [Chainlink operator-requests discord channel](https://discord.gg/eGcxsdZzKR) or check the other alternatives below.
- You can also deploy testnet nodes and external adapters on [naas.link](https://naas.link/). You must write your own [jobs](/docs/jobs/): To help you get started, each [ANY API tutorial](/docs/make-a-http-get-request/) has a corresponding job attached to it. **Note:** [naas.link](https://naas.link) is managed by [linkpool.io](https://linkpool.io/). Refer to the contact section at the bottom of the page for more assistance.
- Run your own testnet nodes as explained [here](/docs/running-a-chainlink-node/). You must write your own [jobs](/docs/jobs/): To help you get started, each [ANY API tutorial](/docs/make-a-http-get-request/) has a corresponding job attached to it.
