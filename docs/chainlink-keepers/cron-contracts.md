---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Keeper Utility Contracts: Cron Jobs'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

# Overview 
This guide explains the use cases for Keeper utility contracts and specifically for the [`CronUpkeepFactory` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/factories/CronUpkeepFactory.sol). This Keeper automates running recurring cron jobs for users. As a result, these recurring jobs are autmatically funded.

**Table of Contents**


# `CronUpkeepFactory` Overview

To take full advantage of `CronUpkeepFactory`, developers should follow the steps below to ensure their cron jobs are automated. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

1. [Deploy](../compatible-contracts) your Keeper-compatible contract.
2. [Register](../register-upkeep) your contract with the Chainlink Keeper network.
3. Implement `CronUpkeepFactory` in your contract to automate cron jobs.

# Example Contract

# Useful Patterns and Best Practices

