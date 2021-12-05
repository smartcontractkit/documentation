---
layout: nodes.liquid
section: ethereumAnyAPI
date: Last Modified
title: "Find Existing Jobs"
permalink: "docs/listing-services/"
whatsnext: {"API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
---
This page explains how to find an existing Oracle Job to suit the needs of your API call.

# Overview

Oracles enable smart contracts to retrieve data from the outside world. Each oracle node can be configured to perform a wide range of tasks depending on the adapters it supports. For example, if your contract needs to make an HTTP GET request, it needs to use an oracle that supports the HTTP GET adapter.

Oracles jobs can be specialized even further by implementing the configuration using [External Adapters](../developers/). For example, an Oracle job could implement URL, parameters, and conversion to Solidity compatible data, to retrieve a very specific piece of data from a specific API endpoint. Consuming a job like this is demonstrated in [Make an Existing Job Request](../existing-job-request/).

# Choosing an Oracle Job

Chainlink has facilitated the launch of several oracle data services that allow dApps to access rich data from external data sources through provider-owned nodes. The full list of such provider nodes is available here:

* [Data Provider Node List](../data-provider-nodes/#data-provider-nodes-list)

Additionally, here are some independent listing services to help find Oracle Jobs that are pre-configured to call the APIs and endpoints you wish to access in your smart contracts:

* [Chainlink Market](https://market.link/)
* [Chainlink Oracle Reputation](https://reputation.link/)
* [CL Adapters](https://chainlinkadapters.com/)

# Types of Data Available

Your smart contracts can obtain a wide range of data from a vast number of data providers. Here are some examples of data widely consumed through Chainlink oracles today.

Implementation information for these can be found in the listing services above.
