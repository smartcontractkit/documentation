---
layout: nodes.liquid
date: Last Modified
title: "Configuration Variables"
permalink: "docs/configuration-variables/"
whatsnext: {"Enabling HTTPS Connections":"/docs/enabling-https-connections/"}
hidden: false
---
## ALLOW_ORIGINS
- Default: "http://localhost:3000,http://localhost:6688"

Specifies the addresses/URLs of allowed connections to the API on `CLIENT_NODE_URL`. Input may be a comma-separated (no spaces) list.

## BLOCK_BACKFILL_DEPTH
- Default: "10"

Specifies the number of blocks before the current HEAD that the log broadcaster will try to re-consume logs from.

## BRIDGE_RESPONSE_URL
- Default: _none_

Represents the URL for bridges to send a response to.

## CHAINLINK_DEV
- Default: "false"

Configures "development" mode. Allows for use of the `/service_agreements` endpoint. Development purposes only. New features will occasionally be placed behind the "dev" flag, which refers to this configuration variable.

## CHAINLINK_PORT
- Default: "6688"

Port used for the [API Reference](../api-reference/) and GUI.

## CHAINLINK_TLS_HOST
- Default: _none_

The hostname configured for TLS to be used by the Chainlink node. This is useful if you've configured a domain name specific for your Chainlink node.

## CHAINLINK_TLS_PORT
- Default: "6689"

The port used for HTTPS connections.

## CHAINLINK_TLS_REDIRECT
- Default: "false"

Forces TLS redirect for unencrypted connections.

## CHAINLINK_TX_ATTEMPT_LIMIT
- Default: "10"

Represents the maximum number of transaction attempts that the Chainlink node should allow to for a transaction.

## CLIENT_NODE_URL
- Default: "http://localhost:6688"

This is the URL that you will use to interact with the node, including the GUI.

## DATABASE_TIMEOUT
- Default: "500ms"

If the database file is already in use, the Chainlink node will wait the specified value (with a given time unit) for the database to become available.

## DATABASE_URL
- Default: _none_

The PostgreSQL URI to connect to your database. See the [Running a Chainlink Node](../running-a-chainlink-node/#set-the-remote-database_url-config) for an example.

## DEFAULT_HTTP_LIMIT
- Default: "32768"

Prevents an endpoint from returning a payload larger than 32kb (the default) via the HttpGet and HttpPost core adapters.

## DEFAULT_HTTP_TIMEOUT
- Default: "15s"

Maximum time to wait for a response in the HTTP adapter.

## ENABLE_EXPERIMENTAL_ADAPTERS
- Default: "false"

Setting this to true enables the use of experimental adapters. These are either not production-ready or require further decentralization to use.

## ETH_CHAIN_ID
- Default: "1"

Represents the chain ID to use for transactions. The Ethereum client must support the `eth_chainId` RPC method. Use the following command (with RPC calls enabled) to call your Ethereum client to ensure that it's supported. Geth and Parity's latest versions should support this call.

```
curl -k -X POST -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","method":"eth_chainId","id":1}' http://localhost:8545
```

## ETH_GAS_BUMP_THRESHOLD
- Default: "3"

The number of blocks to wait if the transaction has still not been confirmed before resubmitting the transaction.

## ETH_GAS_BUMP_WEI
- Default: "5000000000"

The amount of wei to increase for the resubmitted transaction.

## ETH_GAS_BUMP_PERCENT
- Default: "20"

The minimum percentage to bump gas. If this is larger than ETH_GAS_BUMP_WEI then this value will be chosen instead when bumping gas.

## ETH_GAS_PRICE_DEFAULT
- Default: "20000000000"

The default gas price to use when submitting transactions to the blockchain. Can be used with the `chainlink setgasprice` to be updated while the node is still running.

## ETH_MAX_GAS_PRICE_WEI
- Default: "1500000000000"

The absolute maximum price to pay for a transaction. Exceeding this will result in an errored job run. The default value is 1500 Gwei.

## GAS_UPDATER_ENABLED
- Default: "false"

Turns on the automatic gas updater if set to true.

## GAS_UPDATER_BLOCK_DELAY
- Default: "3"

Number of blocks that the gas updater trails behind head.

## GAS_UPDATER_BLOCK_HISTORY_SIZE
- Default: "24"

Number of past blocks to keep in memory.

## GAS_UPDATER_TRANSACTION_PERCENTILE
- Default: "60"

Percentile gas price to choose. E.g. if the block history contains four transactions with gas prices `[100, 200, 300, 400]` then picking 25 for this number will give a value of 200. If the calculated gas price is higher than `ETH_GAS_PRICE_DEFAULT` then the higher price will be used as the base price for new transactions. Node operators are encouraged to reach out to us before experimenting with these settings.

## ETH_URL
- Default: "ws://localhost:8546"

This is the websocket address of the Ethereum client that the Chainlink node will connect to. All interaction with the Ethereum blockchain will occur through this connection.

## ETH_SECONDARY_URL
- Default: _none_

If set, transactions will also be broadcast to this secondary ethereum node. This allows transaction broadcasting to be more robust in the face of primary ethereum node bugs or failures.

## EXPLORER_URL
- Default: _none_

The Explorer websocket URL for the node to push stats to.

## EXPLORER_ACCESS_KEY
- Default: _none_

The access key for authenticating with the Explorer.

## EXPLORER_SECRET
- Default: _none_

The secret for authenticating with the Explorer.

## FEATURE_FLUX_MONITOR
- Default: "false"

Flag whether or not to allow for the flux monitor jobs to be active.

## JSON_CONSOLE
- Default: "false"

Flag to print the console output in JSON or in human-friendly output.

## LINK_CONTRACT_ADDRESS
- Default: "0x514910771AF9Ca656af840dff83E8264EcF986CA"

The address of the LINK token contract. Used for displaying the node account's LINK balance.

## LOG_LEVEL                      
- Default: "info"

The `LOG_LEVEL` environment variable determines both what is printed on the screen and what is written to the logfile, located at `$ROOT/log.jsonl`.

The available options are:
- "debug"
- "info"
- "warn"
- "error"
- "panic"

## LOG_SQL
- Default: "false"

Tells Chainlink to log all SQL statements made using the default logger.

## LOG_SQL_MIGRATIONS
- Default: "true"

Tells Chainlink to log all SQL migrations made using the default logger.

## LOG_TO_DISK
- Default: "true"

Enables or disables the node writing to the `$ROOT/log.jsonl` file.

## MAXIMUM_SERVICE_DURATION
- Default: "8760h"

The maximum duration that a service agreement can be valid for. Default is one year.

## MAX_RPC_CALLS_PER_SECOND
- Default: "500"

Maximum numbers of JSON-SPEC calls per second.

## MIN_INCOMING_CONFIRMATIONS
- Default: "3"

The number of block confirmations to wait before beginning a task run.

## MIN_OUTGOING_CONFIRMATIONS
- Default: "12"

The number of block confirmations to wait after a task run has been ran to regard it as "completed" in the node.

## MINIMUM_CONTRACT_PAYMENT
- Default: "1000000000000000000"

For jobs that use the EthTx adapter, this is the minimum payment amount in order for the node to accept and process the job. Since there are no decimals on the EVM, the value is represented like wei. This makes the default value 1 LINK.
[block:callout]
{
  "type": "warning",
  "body": "Keep in mind, the Chainlink node currently responds with a 500,000 gas limit. Under pricing your node could mean it spends more in ETH (on gas) than it earns in LINK."
}
[/block]
## MINIMUM_REQUEST_EXPIRATION
- Default: "300"

Service agreement encumbrance parameter for the request expiration time.

## MINIMUM_SERVICE_DURATION
- Default: "0s"

The minimum duration that a service agreement can be valid for.

## OPERATOR_CONTRACT_ADDRESS
- Default: _none_

The address of the Operator contract. Used to filter the contract addresses the node should listen to for Run Logs.

## REAPER_EXPIRATION
- Default: "240h"

Cleans up stale sessions in the node.

## ROOT
- Default: "~/.chainlink"

This is the directory where the `log.jsonl` file resides. `log.jsonl` is the log as written by the Chainlink node, depending on the `LOG_LEVEL` specified by the environment variable's value.

## SECURE_COOKIES
- Default: "true"

Requires the use of secure cookies for authentication. Set to false to enable standard http requests along with `CHAINLINK_TLS_PORT=0`.

## SESSION_TIMEOUT
- Default: "15m"

This value determines the amount of idle time to elapse before the GUI signs out users from their sessions.

## TLS_CERT_PATH
- Default: _none_

Location of the TLS certificate file. Example: `/home/$USER/.chainlink/tls/server.crt`

## TLS_KEY_PATH
- Default: _none_

Location of the TLS private key file. Example: `/home/$USER/.chainlink/tls/server.key`