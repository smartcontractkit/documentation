---
layout: ../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Operator contract"
---

To handle API requests, Oracles must deploy an on-chain contract to handle requests made through the LINK token (Read [Basic Request Model](/architecture-overview/architecture-request-model) to learn more).

When the _Basic Request_ model was introduced, node operators had to deploy [Oracle.sol contracts](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/Oracle.sol). However, these come with some limitations and soon, we introduced [Operator.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol). Node operators are recommended to use _Operator.sol_ over _Oracle.sol_.

## Operator.sol vs Oracle.sol

[Operator.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol) is a remplacement of [Oracle.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/Oracle.sol). It comes with the following improvements:

### Multi-word Response

In the EVM architecture a word is made up of 32 bytes. For various reasons the _Oracle_ contract limited responses to requests to 32 bytes. On the other hand, _Operator_ supports a response made of multiple EVM words.

### Factory deployment

To deploy an _Oracle_ contract, each node operator has to manually compile and deploy [Oracle.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/Oracle.sol). Given the wide number of Solidity versions, and steps involved in verifying the contract, this made it difficult for a client to verify that the deployed contract had not been tampered with.
To fix this, node operators can use a [factory](/chainlink-nodes/contracts/operatorFactory) to deploy an instance of the _Operator_ contract. Moreover, the factory exposes a getter for clients to check if it deployed a specific _Operator_ contract address.

### Funding addresses
