---
layout: ../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Receiver"
---

[AuthorizedReceiver](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/AuthorizedReceiver.sol) is an abstract contract inherited by [Operator](/chainlink-nodes/contracts/operator) and [Forwarder](/chainlink-nodes/contracts/forwarder) contracts.

## Api Reference

### Methods

#### setAuthorizedSenders

```solidity
function setAuthorizedSenders(address[] senders) external
```

Sets the fulfillment permission for a given node. Use `true` to allow, `false` to disallow.
Emit [AuthorizedSendersChanged](#authorizedsenderschanged) event.

##### Parameters

| Name    | Type      | Description                                    |
| ------- | --------- | ---------------------------------------------- |
| senders | address[] | The addresses of the authorized Chainlink node |

#### getAuthorizedSenders

```solidity
function getAuthorizedSenders() external view returns (address[])
```

Retrieve a list of authorized senders.

##### Return Values

| Name | Type      | Description        |
| ---- | --------- | ------------------ |
|      | address[] | array of addresses |

#### isAuthorizedSender

```solidity
function isAuthorizedSender(address sender) public view returns (bool)
```

Use this to check if a node is authorized for fulfilling requests.

##### Parameters

| Name   | Type    | Description                       |
| ------ | ------- | --------------------------------- |
| sender | address | The address of the Chainlink node |

##### Return Values

| Name | Type | Description                          |
| ---- | ---- | ------------------------------------ |
|      | bool | The authorization status of the node |

### Events

#### AuthorizedSendersChanged

```solidity
event AuthorizedSendersChanged(address[] senders, address changedBy)
```
