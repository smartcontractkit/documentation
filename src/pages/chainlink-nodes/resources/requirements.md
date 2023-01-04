---
layout: ../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Chainlink nodes requirements"
---

## LINK

You can run a Chainlink node with 0 LINK, but the node will not be able to participate in requests that require a deposit until it has earned some LINK first.

Requesters can specify an amount of LINK that all nodes must deposit as a penalty fee in the event that the node doesn’t fulfill the request. However, since penalty fees are optional, not all requests will require it.

## Chainlink Node

CPU and memory requirements:

- Minimum: To get started running a Chainlink node, you will need a machine with at least **2 cores** and **4 GB of RAM**.
- Recommended: The requirements for running a Chainlink node scale as the number of jobs your node services also scales. For nodes with over 100 jobs, you will need at least **4 cores** and **8GB of RAM**.

## PostgreSQL Database

- Version: 11 or newer
- Minimum: At least **2 cores**, **4GB of RAM**, and **100 GB of storage**.
- Recommended: To support more than 100 jobs, your database server will need at least **4 cores**, **16 GB of RAM**, and **100 GB of storage**.

Make sure that your DB host provides access to logs.

If you run your node on AWS, use an instance type with dedicated core time. [Burstable Performance Instances](https://aws.amazon.com/ec2/instance-types/#Burstable_Performance_Instances) have a limited number of [CPU credits](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-credits-baseline-concepts.html), so you should not use them to run Chainlink nodes that require consistent performance.

## Ethereum Client

Connectivity to an Ethereum client is also required for communication with the blockchain. If you decide to run your own Ethereum client, you will want to run that on a separate machine. Hardware requirements of Ethereum clients can change over time. See [Run an Ethereum client](/chainlink-nodes/resources/run-an-ethereum-client) for more details.
