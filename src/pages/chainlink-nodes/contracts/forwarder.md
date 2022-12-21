---
layout: ../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Forwarder"
---

In the EVM world, [Externally-owned accounts'](https://ethereum.org/en/developers/docs/accounts/) transactions are confirmed sequentially. Chainlink nodes that use a single Externally-owned account (EOA) per chain face several important challenges:

- Transactions are broadcast through a single FIFO queue. Hence the throughput is limited to a single lane. A low throughput is terrible for the overall User experience as concurrent clients have to wait to get their requests fulfilled (the more clients, the more they have to wait).
- Transactions are not executed by priority. For example, let's consider there are two transactions in a row: the first one is a fulfillment of an API request(e.g., get the winner of the Fifa world cup 2022), and the second one is an _ETH/USD_ price feed update used by multiple DeFi protocols. Relying on a single EOA makes the 2nd transaction (price feed update) be confirmed after the 1st one (get the Fifa world cup winner).
- A stuck transaction (e.g., because the gas price was too low) will cause all the subsequent transactions to remain pending.
- As a workaround, some node operators deploy multiple Chainlink nodes per chain. While this allows them to set up different strategies (e.g., one Chainlink node for price feed and another to fulfill API requests), this comes with an overhead in infrastructure and maintenance costs.

To solve these challenges, we introduced two major features that will allow node operators to set up different transaction-sending strategies more securely while lowering their infrastructure costs:

- Chainlink nodes support multiple EOAs.
- [Forwarder](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/AuthorizedForwarder.sol) contracts. Forwarder contracts allow a node operator to manage multiple EOAs and make them look like a single address. If you use a web2 analogy, Forwarder contracts act like a reverse proxy server, where the user is served by the same address (reverse proxy) and does not see where(server) the traffic is coming from. To do so, nodes call the [forward](#forward) function on the Forwarder contract.

Combining multiple EOAs setups and Forwarder contracts opens up a lot of flexibility and security in terms of design:

- Node operators can expand horizontally using multiple EOAs. They can deploy one or multiple Forwarder contracts for these EOAs. These combinations of EOAs + forwarders offer a lot of flexibility for setting up different transaction-sending strategies.
- Node operators can support different job types (OCR, VRF, API request..Etc) on the same node, reducing maintenance and infrastructure costs.
- Security-wise, Forwarder contracts distinguish between Owner and Authorized Senders. Authorized senders are hot wallets (Chainlink nodes' EOAs). The owner is responsible for changing the Authorized senders' list (e.g., if a node is compromised).
- Node operators do not need to manually compile and deploy [Operator](/chainlink-nodes/contracts/operator) or/and [Forwarder](/chainlink-nodes/contracts/forwarder) contracts. They can deploy them directly from the [OperatorFactory](/chainlink-nodes/contracts/operatorfactory) by calling the [deploynewoperatorandforwarder](/chainlink-nodes/contracts/operatorfactory#deploynewoperatorandforwarder) function. From a design perspective, the owner of a Forwarder contract is an [Operator](/chainlink-nodes/contracts/operator) contract. The owner of the Operator contract is a more secure address, such as a hardware wallet or a multisig wallet. Therefore, node operators can manage a set of Forwarder contracts through an Operator contract using a secure account such as hardware or a multisig wallet.

## Api Reference

The Forwarder contract inherits [AuthorizedReceiver](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/AuthorizedReceiver.sol) and [ConfirmedOwnerWithProposal](https://github.com/smartcontractkit/chainlink/edit/develop/contracts/src/v0.7/ConfirmedOwnerWithProposal.sol). Read [AuthorizedReceiver](/chainlink-nodes/contracts/receiver) and [ConfirmedOwnerWithProposal](/chainlink-nodes/contracts/ownership) API references.

### Methods

#### typeAndVersion

```solidity
function typeAndVersion() external pure virtual returns (string)
```

The type and version of this contract.

##### Return Values

| Name | Type   | Description             |
| ---- | ------ | ----------------------- |
|      | string | Type and version string |

#### forward

```solidity
function forward(address to, bytes data) external
```

Forward a call to another contract.

_Only callable by an authorized sender_

##### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| to   | address | address     |
| data | bytes   | to forward  |

#### ownerForward

```solidity
function ownerForward(address to, bytes data) external
```

Forward a call to another contract.

_Only callable by the owner_

##### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| to   | address | address     |
| data | bytes   | to forward  |

#### transferOwnershipWithMessage

```solidity
function transferOwnershipWithMessage(address to, bytes message) external
```

Transfer ownership with instructions for recipient.Emit [OwnershipTransferRequestedWithMessage](#ownershiptransferrequestedwithmessage) event.

##### Parameters

| Name    | Type    | Description                                         |
| ------- | ------- | --------------------------------------------------- |
| to      | address | address proposed recipient of ownership             |
| message | bytes   | instructions for recipient upon accepting ownership |

#### Events

##### OwnershipTransferRequestedWithMessage

```solidity
event OwnershipTransferRequestedWithMessage(address from, address to, bytes message)
```
