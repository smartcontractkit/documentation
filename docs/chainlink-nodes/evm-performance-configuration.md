---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'Optimizing EVM Performance'
permalink: 'docs/evm-performance-configuration/'
whatsnext: {
  "Performing System Maintenance":"/docs/performing-system-maintenance/",
  "Security and Operation Best Practices":"/docs/best-security-practices/"
}
metadata:
  title: 'Optimizing EVM Performance'
  description: 'Configure your Chainlink and EVM nodes for high throughput and reliability'
---

The most basic Chainlink node deployment uses the default configuration on only a single primary node with a websocket URL. This configuration is appropriate for small or simple workloads with only a few jobs that execute infrequently. If you need to run hundreds of jobs and thousands of transactions per hour, your Chainlink and RPC nodes will require a more advanced configuration. This guide explains how to configure Chainlink and your EVM nodes for high reliability and throughput.

> 📘 Note:
>
> Ethereum clients have bugs. Much work is done on the Chainlink node software to mitigate bugs in various different RPC implementations. This guide helps you understand how to mitigate and work around these bugs.

**Topics**

- [Using multiple nodes](#using-multiple-nodes)
- [Automatic load balancing and failover](#automatic-load-balancing-and-failover)
- [Configuring websocket and HTTP URLs](#configuring-websocket-and-http-urls)
- [Increasing transaction throughput](#increasing-transaction-throughput)
  - [Increase ETH_MAX_QUEUED_TRANSACTIONS](#increase-eth_max_queued_transactions)
  - [Increase ETH_MAX_IN_FLIGHT_TRANSACTIONS](#increasing-transaction-throughput)
- [Optimizing RPC nodes](#optimizing-rpc-nodes)
- [Remove rejections on expensive transactions](#remove-rejections-on-expensive-transactions)
- [Adjusting minimum outgoing confirmations for high throughput jobs](#adjusting-minimum-outgoing-confirmations-for-high-throughput-jobs)
- [Increase ORM_MAX_OPEN_CONNS and ORM_MAX_IDLE_CONNS](#increase-orm_max_open_conns-and-orm_max_idle_conns)

## Using multiple nodes

> 📘 Providing multiple primary nodes can improve performance and reliability.

Chainlink node version 1.3.0 and later support configurations with multiple primary nodes and send-only nodes with automatic liveness detection and failover. It is no longer necessary to run a load balancing failover RPC proxy between Chainlink and its EVM RPC nodes.

If you are using a failover proxy transparently for commercial node provider services, it will continue to work properly as long as the RPC you are talking to acts just like a standard RPC node.

You can have as many primary nodes as you want. Requests are evenly distributed across all nodes, so the performance increase will be linear as you add more nodes. If a node fails with no heads for several minutes or a failed liveness check, it is removed from the live pool and all requests are routed to one of the live nodes. If no live nodes are available, the system attempts to use nodes from the list of failed nodes at random.

You can configure as many send-only nodes as you want. Send-only nodes only broadcast transactions and do not process regular RPC calls. Specifying additional send-only nodes uses a minimum number of RPC calls and can help to include transactions faster. Send-only nodes also act as backup if your primary node starts to blackhole transactions.

> 📘 Transaction broadcasts are always sent to every primary node and send-only node. It is redundant to specify the same URL for a send-only node as an existing primary node, and it has no effect.

Here is an example for how to specifiy the [`EVM_NODES` environment variable](/docs/configuration-variables/#evm_nodes):

```shell
export EVM_NODES='
[
  {
    "name": "primary_1",
    "evmChainId": "137",
    "wsUrl": "wss://endpoint-1.example.com/ws",
    "httpUrl": "http://endpoint-1.example.com/",
    "sendOnly": false
  },
  {
    "name": "primary_2",
    "evmChainId": "137",
    "wsUrl": "ws://endpoint-2.example.com/ws",
    "httpUrl": "http://endpoint-2.example.com/",
    "sendOnly": false
  },
  {
    "name": "primary_3",
    "evmChainId": "137",
    "wsUrl": "wss://endpoint-3.example.com/ws",
    "httpUrl": "http://endpoint-3.example.com/",
    "sendOnly": false
  },
  {
    "name": "sendonly_1",
    "evmChainId": "137",
    "httpUrl": "http://endpoint-4.example.com/",
    "sendOnly": true
  },
  {
    "name": "sendonly_2",
    "evmChainId": "137",
    "httpUrl": "http://endpoint-5.example.com/",
    "sendOnly": true
  },
]
'
```

Send-only nodes are used for broadcasting transactions only, and must support the following RPC calls:

- `eth_chainId`: Returns the chain ID
- `eth_sendRawTransaction`: Both regular and batched
- `web3_clientVersion`: Can return any arbitrary string

## Automatic load balancing and failover

Chainlink node version 1.3.0 and above has built in failover and load balancing for primary nodes. Chainlink always uses round-robin requests across all primary nodes. Chainlink monitors when nodes go offline and stops routing requests to those nodes. If you don’t want to use Chainlink’s built-in failover, or you want to use an external proxy instead, you can disable failover completely using the following environment variables:

```text
NODE_NO_NEW_HEADS_THRESHOLD=0
NODE_POLL_FAILURE_THRESHOLD=0
NODE_POLL_INTERVAL=0
```

- [NODE_NO_NEW_HEADS_THRESHOLD](/docs/configuration-variables/#node_no_new_heads_threshold): Controls how long to wait receiving no new heads before marking a node dead
- [NODE_POLL_FAILURE_THRESHOLD](/docs/configuration-variables/#node_poll_failure_threshold): Controls how many consecutive poll failures will disable a node
- [NODE_POLL_INTERVAL](/docs/configuration-variables/#node_poll_interval): Controls how often the node will be polled

By default, these environment variables use the following values:

```text
NODE_NO_NEW_HEADS_THRESHOLD="3m"
NODE_POLL_FAILURE_THRESHOLD="5"
NODE_POLL_INTERVAL="10s"
```

## Configuring websocket and HTTP URLs

> 📘 Ideally, every primary node specifies an HTTP URL in addition to the websocket URL.

It is not recommended to configure primary nodes with *only* a websocket URL. Routing all traffic over only a websocket can cause problems. As a best practices, every primary node must have both websocket and HTTP URLs specified. This allows Chainlink to route almost all RPC calls over HTTP, which tends to be more robust and reliable. The websocket URL is used only for subscriptions. Both URLs must point to the same node because they are bundled together and have the same liveness state.

If you enabled HTTP URLs on all your primary nodes, you can increase the values for the following environment variables:

- [ETH_RPC_DEFAULT_BATCH_SIZE](/docs/configuration-variables/#eth_rpc_default_batch_size)
- [BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE](/docs/configuration-variables/#block_history_estimator_batch_size)
- [ETH_LOG_BACKFILL_BATCH_SIZE](/docs/configuration-variables/#eth_log_backfill_batch_size)

By default, these config variables are set conservatively to avoid overflowing websocket frames. In HTTP mode, there are no such limitations. You might be able to improve performance with increased values similar to the following example:

```text
ETH_RPC_DEFAULT_BATCH_SIZE=1000
BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE=100
ETH_LOG_BACKFILL_BATCH_SIZE=1000
```

> 🚧 REMINDER:
>
> Do not modify these values unless *all* primary nodes are configured with HTTP URLs.

## Increasing transaction throughput

By default, Chainlink has conservative limits because it must be compliant with standard out-of-the-box RPC configurations. This limits transaction throughput and the performance of some RPC calls.

Before you make any changes to your Chainlink configuration, you must ensure that *all* of your primary and send-only nodes are configured to handle the increased throughput.

> 📘 The best way to improve transaction throughput is to keep the default configuration and use multiple keys to transmit. Chainlink supports an arbitrary number of keys for any given chain. By default, tasks will round-robin through keys, but you can assign them individually to keys as well. Assigning tasks to keys is the preferred way to improve throughput because increasing the max number of in-flight requests can have complicated effects based on the mempool conmfigurations of other RPC nodes. If you are unable to distribute transmission load across multiple keys, try the following options to increase throughput.

### Increase `ETH_MAX_QUEUED_TRANSACTIONS`

You can increase `ETH_MAX_QUEUED_TRANSACTIONS` if you require high burst throughput. Setting this variable to `0` disables any limit and ensures that no transaction are ever dropped. The default is set automatically based on the chain ID and usually is `250`. Overriding this value does not require any RPC changes and only affects the Chainlink side.

This represents the maximum number of unbroadcast transactions per key that are allowed to be enqueued before jobs start failing and refusing to send further transactions. It acts as a “buffer” for transactions waiting to be sent. If the buffer is exceeded, transactions will be permanently dropped.

Do not set `ETH_MAX_QUEUED_TRANSACTIONS` too high. It acts as a sanity limit and the queue can grow unbounded if you are trying to send transactions consistently faster than they can be confirmed. If you have an issue that must be recovered later, you will have to churn through all the enqueued transactions. As a best practice, set `ETH_MAX_QUEUED_TRANSACTIONS` to the minimum possible value that supports your burst requirements or represents the maximum number of transactions that could be sent in a given 15 minute window.

`ETH_MAX_QUEUED_TRANSACTIONS=10000` might be an example where very high burst throughput is needed.

### Increase `ETH_MAX_IN_FLIGHT_TRANSACTIONS`

`ETH_MAX_IN_FLIGHT_TRANSACTIONS` is another variable that you can increase if you require higher constant transaction throughput. Setting this variable to `0` disables any kind of limit. The default value is `16`.

`ETH_MAX_IN_FLIGHT_TRANSACTIONS` controls how many transactions are allowed to be broadcast but unconfirmed at any one time. This is a form of transaction throttling.

The default is set conservatively at `16` because this is a pessimistic minimum that go-ethereum will hold without evicting local transactions. If your node is falling behind and not able to get transactions in as fast as they are created, you can increase this setting.

> 🚧 If you increase `ETH_MAX_IN_FLIGHT_TRANSACTIONS` you must make sure that your ETH node is configured properly otherwise you can get nonce-gapped and your node will get stuck.

## Optimizing RPC nodes

You can also improve transaction throughput by optimizing RPC nodes. Configure your RPC node to **never** evict local transactions. For example, you can use the following example configurations:

```text Go-Ethereum
[Eth.TxPool]
Locals = ["0xYourNodeAddress1", "0xYourNodeAddress2"]  # Add your node addresses here
NoLocals = false # Disabled by default but might as well make sure
Journal = "transactions.rlp" # Make sure you set a journal file
Rejournal = 3600000000000 # Default 1h, it might make sense to reduce this to e.g. 5m
PriceBump = 10 # Must be set less than or equal to Chainlink's ETH_GAS_BUMP_PERCENT
AccountSlots = 16 # Highly recommended to increase this, must be greater than or equal to Chainlink's ETH_MAX_IN_FLIGHT_TRANSACTIONS setting
GlobalSlots = 4096 # Increase this as necessary
AccountQueue = 64 # Increase this as necessary
GlobalQueue = 1024 # Increase this as necessary
Lifetime = 10800000000000 # Default 3h, this is probably ok, you might even consider reducing it
```

If you are using another RPC node, such as Besu or Nethermind, you must look at the documentation for that node to ensure that it will keep at least as many transactions in the mempool for the Chainlink node keys as you have set in `ETH_MAX_IN_FLIGHT_TRANSACTIONS`.

The recommended way to scale is to use more keys rather than increasing throughput for one key.

## Remove rejections on expensive transactions

By default, go-ethereum rejects transactions that exceed its built-in RPC gas or txfee caps. Chainlink nodes fatally error transactions if this happens. If you ever exceed the caps, your node will miss transactions.

Disable the default RPC gas and txfee caps on your ETH node in the config using the TOML snippet shown below, or by running go-ethereum with the command line arguments: `--rpc.gascap=0 --rpc.txfeecap=0`.

```text
[Eth]
RPCGasCap = 0
RPCTxFeeCap = 0.0
```

## Adjusting minimum outgoing confirmations for high throughput jobs

`ethtx` tasks have a `minConfirmations` label that can be adjusted. You can get a minor performance boost if you set this label to `0`. Use this if you do not need to wait for confirmations on your `ethtx` tasks. For example, if you don't need the receipt or don’t care about failing the task if the transaction reverts on-chain, you can set `minConfirmations` to `0`.

Set the task label similiarly to the following example:

`foo [type=ethtx minConfirmations=0 ...]`

Note that this only affects the presentation of jobs, and whether they are marked as errored or not. It has no effect on inclusion of the transaction, which is handled with separate logic.

> 🚧 Do not confuse `minConfirmations` set on the task with transaction inclusion. The transaction manager always attempts to get every transaction mined up to `EVMFinalityDepth`. `minConfirmations` on the task is a task-specific view of when the transaction that can be considered final, which might be fewer blocks than `EVMFinalityDepth`.

## Increase `ORM_MAX_OPEN_CONNS` and `ORM_MAX_IDLE_CONNS`

Chainlink can be configured to allow more concurrent database connections than the default. This might improve performance, but be careful not to exceed postgres connection limits. These variables have the following default values:

```text
ORM_MAX_OPEN_CONNS=20
ORM_MAX_IDLE_CONNS=10
```

You might increase these values to `ORM_MAX_OPEN_CONNS=50` and `ORM_MAX_IDLE_CONNS=25` if you have a large and powerful database server with high connection count headroom.
