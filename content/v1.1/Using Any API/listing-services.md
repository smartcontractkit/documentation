---
layout: nodes.liquid
title: "Find Existing Jobs"
slug: "listing-services"
hidden: false
date: Last Modified
---
This page explains how to find an existing Oracle Job to suit the needs of your API call.

# Overview

Oracles enable smart contracts to retrieve data from the outside world. Each oracle node can be configured to perform a wide range of tasks depending on the adapters it supports. For example, if your contract needs to make an HTTP GET request, it needs to use an oracle that supports the HTTP GET adapter.

Oracles jobs can be specialized even further by implementing all the configuration. For example, an Oracle job could implement URL, parameters, and conversion to Solidity compatible data, to retrieve a very specific piece of data from a specific API endpoint. This is demonstrated in [Make an Existing Job Request](doc:existing-job-request).

# Choosing an Oracle Job

Here are some resources to facilitate choosing an Oracle job:

* [Testnet Oracle details](doc:testnet-oracles)
* [Mainnet Oracle details](doc:decentralized-oracles-ethereum-mainnet)

There are also independent listing services to help find Oracle Jobs that are pre-configured to call the APIs and endpoints you wish to access in your smart contracts:

* <a href="https://market.link/" target="_blank" rel="noreferrer, noopener">Chainlink Market</a>
* <a href="https://reputation.link/" target="_blank" rel="noreferrer, noopener">Chainlink Oracle Reputation</a>
* <a href="https://chainlinkadapters.com/" target="_blank" rel="noreferrer, noopener">CL Adapters</a>