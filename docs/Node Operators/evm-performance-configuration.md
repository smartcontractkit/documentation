---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'EVM Performance Configuration'
permalink: 'docs/evm-performance-configuration/'
metadata:
  title: 'Chainlink Node Operators: EVM Performance Configuration'
  description: 'Configure your Chainlink and EVM nodes for high throughput and reliability'
---

This guide explains how to configure Chainlink and your EVM nodes for high reliability and throughput.

For simple, small workloads with a handful of jobs that are rarely executed, the standard configuration is often enough. The most basic deployment of Chainlink has one primary node with a websocket URL and uses default configuration for everything.

However, as we scale up to hundreds of jobs and throughput moving into thousands of transactions per hour, we have to do things a bit differently. Large performance and reliability improvements are possible by configuring your Chainlink and RPC nodes correctly.

The first thing to understand is this: **go-ethereum has bugs (as do its clones, they are all basically the same thing)**

As an infra/devops person you will know that 90% of effort is spent on working around other people’s bugs. Working with go-ethereum and clones is no different. Much of the work done in core and specified here is done in order to mitigate and work around bugs in various different RPC implementations.

## Using multiple nodes


>💡 Providing multiple primary nodes can improve performance and reliability


As of 1.3.x and up, Chainlink supports multiple primary and sendonly nodes with automatic liveness detection and failover.

It is no longer necessary to run a load balancing failover RPC proxy between Chainlink and it’s EVM RPC nodes.

If you are using a failover proxy transparently (e.g. in the case of commercial node provider services) then it should continue to work properly as long as the RPC you are talking to acts just like a standard RPC node.

You can have as many primary nodes as you want. Requests are evenly distributed across all nodes so performance increase should be linear as you add more. If any particular node goes bad (e.g. no heads for X minutes, liveness checks fail) then it will be removed from the live pool and all requests gracefully routed over to one of the live nodes. If no live nodes are available it picks one of the dead ones at random.

You may also specify as many sendonly nodes as you want. Sendonly nodes are *only* used for broadcasting transactions and not for regular RPC calls. Specifying additional sendonly nodes uses a minimum of RPC calls and can help your transactions get included faster, they also act as backup in case your primary starts blackholing transactions (this behaviour has been observed in the wild many times).


>💡 Transaction broadcast is always sent to every single primary and sendonly node, therefore it is redundant and has no effect to try to specify the same URL for a sendonly node as an existing primary node

Here is an example of how this can look:

```
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

### Sendonly nodes

A quick node about sendonly nodes.

Sendonly nodes are used for broadcasting transactions only. They *must* support at a bare minimum, the following RPC calls:

```
eth_chainId (should return the chain ID)
eth_sendRawTransaction (both regular and batched)
web3_clientVersion (can return any arbitrary string)
```

## Automatic load balancing and failover

As of 1.3.x and up Chainlink has built in failover and load balancing for primary nodes.

Chainlink will always round-robin requests across all primary nodes.

In addition, Chainlink will try to detect if a node goes dead and stop routing requests to it. If you don’t want to use Chainlink’s built-in failover for any reason, or you want to use an external proxy instead, you can disable failover completely like so:

```
NODE_NO_NEW_HEADS_THRESHOLD=0
NODE_POLL_FAILURE_THRESHOLD=0
NODE_POLL_INTERVAL=0
```

You can also tweak these settings. `NODE_NO_NEW_HEADS_THRESHOLD` controls how long to wait receiving no new heads before marking a node dead. `NODE_POLL_FAILURE_THRESHOLD` controls how many consecutive poll failures will disable a node while `NODE_POLL_INTERVAL` controls how often the node will be polled.

Defaults are:

```
NODE_NO_NEW_HEADS_THRESHOLD="3m"
NODE_POLL_FAILURE_THRESHOLD="5"
NODE_POLL_INTERVAL="10s"
```

## Websocket issues and HTTP urls


>💡 Ideally, every primary node would specify an HTTP url in addition to websocket URL.

While it is possible to configure primary nodes with *only* a websocket URL, this is not recommended. Routing all traffic over websocket has been observed to cause problems. It is best to give both websocket and HTTP urls for all primary nodes. Note that both URLs must point to *the same node*, since they are bundled together and have the same liveness state applied to both.

So, every primary node ideally has both websocket and HTTP url specified. This allows Chainlink to route almost all RPC calls over HTTP which tends to be more robust and reliable, and websocket is only used for subscriptions.

**If** you have enabled HTTP urls on all your primaries, then congratulations, you have unlocked an additional performance tweak!

You increase the values for the following:

```
ETH_RPC_DEFAULT_BATCH_SIZE
BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE
ETH_LOG_BACKFILL_BATCH_SIZE
```

These config variables are set conservatively by default to avoid overflowing websocket frames. In HTTP mode there are no such limitations. Some possible increased values that might result in improved performance:

```
ETH_RPC_DEFAULT_BATCH_SIZE=1000
BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE=100
ETH_LOG_BACKFILL_BATCH_SIZE=1000
```

**REMINDER: Do not modify these values unless *all* primary nodes are configured with HTTP urls!**

## Increasing transaction throughput

Chainlink by default has conservative limits because it has to be compliant with standard out-of-the-box RPC configurations. This limits transaction throughput and performance of some RPC calls.

Before you make any changes to your Chainlink configuration, you must ensure that *all* your primary and sendonly nodes are configured to handle the increased throughput.


>💡 NOTE: The best way to improve transaction throughput is to keep the default configuration and use multiple keys to transmit. Chainlink supports an arbitrary number of keys for any given chain. By default, tasks will round-robin through keys, but can be pegged individually to keys as well. This is the preferable way to improve throughput, since increasing the max number of in-flight requests can have complicated effects based on how other RPC nodes in the network have their mempool configured. If you are unable to distribute transmission load across multiple keys for whatever reason, you can try the steps below to increase throughput.

### Configuring Chainlink

`ETH_MAX_QUEUED_TRANSACTIONS` can be increased if high burst throughput is required. Setting to `0` disables any kind of limit whatsoever and ensures that no transaction will ever be dropped. The default is `250` or so. This does not require any RPC changes and only affects the Chainlink side.

This represents the maximum number of unbroadcast transactions per key that are allowed to be enqueued before jobs will start failing and rejecting to send any further transactions. It acts as a “buffer” for transactions waiting to be sent. If the buffer is exceeded then transactions will be permanently dropped.

WARNING: Be careful about increasing this too high because it acts as a sanity limit and the queue can grow unbounded e.g. if you are trying to send transactions consistently faster than they can be confirmed, or you have some issue that needs to be recovered later then you will have to churn through all the enqueued transactions. So it’s best to set this to the minimum possible that supports your burst requirements. This should probably be set to a value that represents roughly the maximum number of transactions that could be sent in, say, a given 15 minute window.

`ETH_MAX_QUEUED_TRANSACTIONS=10000` might be a possible example where very high burst throughput is needed.

`ETH_MAX_IN_FLIGHT_TRANSACTIONS` is another variable that can be increased if higher constant transaction throughput is required. Setting to `0` disables any kind of limit whatsoever. Default is `16`.

This controls how many transactions are allowed to be "in-flight" i.e. broadcast but unconfirmed at any one time. You can consider this a form of transaction throttling.

The default is set conservatively at 16 because this is a pessimistic minimum that both geth and parity will hold without evicting local transactions. If your node is falling behind and not able to get transactions in as fast as they are created, you can increase this setting.


>💡 If you increase ETH_MAX_IN_FLIGHT_TRANSACTIONS you *must* make sure that your ETH node is configured properly otherwise you can get nonce gapped and your node will get stuck.

### Configuring the RPC nodes

**Never evict local transactions**

Most people (and providers) leave their EVM RPC nodes at the default configuration. Unfortunately this is not optimal for peak performance and can lead to problems.

You will need to configure your RPC node, as far as humanly possible, to **never** evict local transactions.

You can do so with the following config:

**go-ethereum and clones**

```
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

**parity/openethereum and clones**

```
tx_queue_locals = ["0xYourNodeAddress1", "0xYourNodeAddress2"] # Add your node addresses here
tx_queue_size = 8192 # Increase this as necessary
tx_queue_per_sender = 16 # Highly recommended to increase this, must be greater than or equal to Chainlink's ETH_MAX_IN_FLIGHT_TRANSACTIONS setting
tx_queue_mem_limit = 4 # In MB. Highly recommended to increase this or set to 0 to disable the mem limit entirely
tx_queue_no_early_reject = true # Recommended to set this
tx_queue_no_unfamiliar_locals = false # This is disabled by default but might as well make sure
```

If you are using another RPC node (besu, nethermind etc) you will need to look at the documentation for that node to ensure that it will keep at least `ETH_MAX_IN_FLIGHT_TRANSACTIONS` transactions in the mempool for the Chainlink node keys.

Remember that the recommended way to scale is to use more keys rather than increasing throughput for one key.

**Never reject transactions for being too expensive**

By default, go-ethereum will reject transactions that exceed it's built-in RPC gas or txfee caps. Chainlink nodes will fatally error transactions if this happens which means if you ever exceed the caps your node will miss transactions.

You **should** disable the default RPC gas and txfee caps on your ETH node. This can be done in the config as the TOML snippet shown below, or by running go-ethereum with the command line arguments: `--rpc.gascap=0 --rpc.txfeecap=0`.

```
[Eth]
RPCGasCap = 0
RPCTxFeeCap = 0.0
```

## Adjusting Minimum Outgoing Confirmations for high throughput jobs

`ethtx` tasks have a `minConfirmations` label which can be adjusted. If you don’t care about waiting for confirmations on your `ethtx` tasks, e.g. you don’t need the receipt or you don’t care about failing the task if the transaction reverts on-chain, you can set this to `0` for a minor performance boost.

Set like so:

`foo [type=ethtx minConfirmations=0 ...]`

Note that this only affects the presentation of jobs, and whether they are marked errored or not. It has no effect on inclusion of the transaction, which is handled with separate logic.


>💡 Be careful not to confuse `minConfirmations` set on the task with transaction inclusion. The transaction manager will always strive to get every single transaction mined up to `EVMFinalityDepth`. `minConfirmations` on the task is a task-specific view of when the transaction can be considered final, which may be fewer blocks than `EVMFinalityDepth`.

## Misc

Chainlink can be configured to allow more concurrent database connections than the default. In some cases this might improve performance, but be careful not to exceed postgres connection limits.

```
ORM_MAX_OPEN_CONNS=20
ORM_MAX_IDLE_CONNS=10
```

You might consider increasing this to e.g. `ORM_MAX_OPEN_CONNS=50` `ORM_MAX_IDLE_CONNS=25` if you have a large and powerful database server and a high connection count headroom.
