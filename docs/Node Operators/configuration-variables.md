---
layout: nodes.liquid
date: Last Modified
title: "Configuration Variables"
permalink: "docs/configuration-variables/"
whatsnext: {"Enabling HTTPS Connections":"/docs/enabling-https-connections/"}
---

Recent versions of Chainlink ship with sensible defaults for most configuration variables.

Not all env vars are documented here. Any env var that is undocumented is subject to change in future releases. In almost all cases, you should leave any env var not listed here to its default value unless you really understand what you are doing.

To reiterate: _if you have an env var set that is not listed here, and you don't know exactly why you have it set, you should remove it!_

The env variables listed here are explicitly supported and current as of Chainlink 0.10.8.

- [Essential env vars](#essential-env-vars)
  - [DATABASE_URL](#database_url)
  - [ETH_CHAIN_ID](#eth_chain_id)
  - [ETH_URL](#eth_url)
  - [LINK_CONTRACT_ADDRESS](#link_contract_address)
- [Recommended env vars](#recommended-env-vars)
  - [ETH_HTTP_URL](#eth_http_url)
  - [ETH_SECONDARY_URLS](#eth_secondary_urls)
- [OCR](#ocr)
  - [FEATURE_OFFCHAIN_REPORTING](#feature_offchain_reporting)
  - [P2P_ANNOUNCE_IP](#p2p_announce_ip)
  - [P2P_ANNOUNCE_PORT](#p2p_announce_port)
  - [P2P_BOOTSTRAP_PEERS](#p2p_bootstrap_peers)
  - [P2P_LISTEN_IP](#p2p_listen_ip)
  - [P2P_LISTEN_PORT](#p2p_listen_port)
  - [P2P_PEER_ID](#p2p_peer_id)
- [TLS](#tls)
  - [CHAINLINK_TLS_HOST](#chainlink_tls_host)
  - [CHAINLINK_TLS_PORT](#chainlink_tls_port)
  - [CHAINLINK_TLS_REDIRECT](#chainlink_tls_redirect)
  - [TLS_CERT_PATH](#tls_cert_path)
  - [TLS_KEY_PATH](#tls_key_path)
- [Gas controls](#gas-controls)
  - [ETH_GAS_LIMIT_DEFAULT](#eth-gas-limit-default)
  - [ETH_GAS_LIMIT_TRANSFER](#eth-gas-limit-transfer)
  - [ETH_GAS_BUMP_PERCENT](#eth_gas_bump_percent)
  - [ETH_GAS_BUMP_THRESHOLD](#eth_gas_bump_threshold)
  - [ETH_GAS_BUMP_WEI](#eth_gas_bump_wei)
  - [ETH_GAS_PRICE_DEFAULT](#eth_gas_price_default)
  - [ETH_MAX_GAS_PRICE_WEI](#eth_max_gas_price_wei)
  - [ETH_MIN_GAS_PRICE_WEI](#eth_min_gas_price_wei)
  - [GAS_UPDATER_ENABLED](#gas_updater_enabled)
  - [GAS_UPDATER_TRANSACTION_PERCENTILE](#gas_updater_transaction_percentile)
  - [ETH_GAS_LIMIT_DEFAULT](#eth_gas_limit_default)
  - [ETH_GAS_LIMIT_TRANSFER](#eth_gas_limit_transfer)
- [Other env vars](#other-env-vars)
  - [ADMIN_CREDENTIALS_FILE](#admin_credentials_file)
  - [ALLOW_ORIGINS](#allow_origins)
  - [CHAINLINK_PORT](#chainlink_port)
  - [CLIENT_NODE_URL](#client_node_url)
  - [DATABASE_BACKUP_FREQUENCY](#database_backup_frequency)
  - [DATABASE_BACKUP_MODE](#database_backup_mode)
  - [DATABASE_BACKUP_URL](#database_backup_url)
  - [ETH_DISABLED](#eth_disabled)
  - [EXPLORER_URL](#explorer_url)
  - [EXPLORER_ACCESS_KEY](#explorer_access_key)
  - [EXPLORER_SECRET](#explorer_secret)
  - [JSON_CONSOLE](#json_console)
  - [LOG_LEVEL](#log_level)
  - [LOG_SQL](#log_sql)
  - [LOG_SQL_MIGRATIONS](#log_sql_migrations)
  - [LOG_TO_DISK](#log_to_disk)
  - [MIN_INCOMING_CONFIRMATIONS](#min_incoming_confirmations)
  - [MINIMUM_CONTRACT_PAYMENT_LINK_JUELS](#minimum_contract_payment)
  - [OPERATOR_CONTRACT_ADDRESS](#operator_contract_address)
  - [ORM_MAX_IDLE_CONNS](#orm_max_idle_conns)
  - [ORM_MAX_OPEN_CONNS](#orm_max_open_conns)
  - [ROOT](#root)
  - [SECURE_COOKIES](#secure_cookies)
  - [SESSION_TIMEOUT](#session_timeout)
- [Advanced](#advanced)
  - [ETH_MAX_IN_FLIGHT_TRANSACTIONS](#eth_max_in_flight_transactions)
  - [ETH_MAX_QUEUED_TRANSACTIONS](#eth_max_queued_transactions)
- [Misc notes](#misc-notes)

# Essential env vars

## DATABASE_URL

**Required**

- Default: _none_

The PostgreSQL URI to connect to your database. See the [Running a Chainlink Node](../running-a-chainlink-node/#set-the-remote-database_url-config) for an example.

## ETH_CHAIN_ID

- Default: `"1"` (Ethereum mainnet)

Chainlink currently only supports one chain at a time. This var specifies the chain ID to use for transactions. It must match the chain ID of the connected RPC node.

```
curl -k -X POST -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","method":"eth_chainId","id":1}' http://localhost:8545
```

## ETH_URL

- Default: `"ws://localhost:8546"`

This is the websocket address of the Ethereum client that the Chainlink node will connect to. All interaction with the Ethereum blockchain will occur through this connection.

## LINK_CONTRACT_ADDRESS

- Default: _automatic based on Chain ID_

The address of the LINK token contract. Used for displaying the node account's LINK balance. For supported chains, this is automatically set based on the given chain ID. For unsupported chains, you will need to supply it yourself.

# Recommended env vars

## ETH_HTTP_URL

- Default: _none_

This should be set to the http URL that points to the same eth node as the primary. If set, Chainlink will automatically use HTTP mode for heavy requests, which can improve reliability.

## ETH_SECONDARY_URLS

- Default: _none_

If set, transactions will also be broadcast to this secondary ethereum node. This allows transaction broadcasting to be more robust in the face of primary ethereum node bugs or failures.

It is recommended to set at least one secondary eth node here that is different from your primary.

Multiple URLs can be specified as a comma-separated list e.g.

`ETH_SECONDARY_URLS=https://example.com/1,https://example.text/2,...`

# OCR

This section only applies if you are running offchain reporting jobs.

## FEATURE_OFFCHAIN_REPORTING

- Default: `"false"`

Set to true to enable OCR jobs.

## P2P_ANNOUNCE_IP

- Default: _none_

Should be set as the externally reachable IP address of the chainlink node.

## P2P_ANNOUNCE_PORT

- Default: _none_

Should be set as the externally reachable port of the chainlink node.

## P2P_BOOTSTRAP_PEERS

- Default: _none_

Default set of bootstrap peers.

## P2P_LISTEN_IP

- Default: `"0.0.0.0"`

The default IP address to bind to.

## P2P_LISTEN_PORT

- Default: _none_

The port to listen on. If left blank, chainlink will randomly select a different port each time it boots. It is highly recommended to set this to a static value to avoid network instability.

## P2P_PEER_ID

- Default: _none_

The default peer ID to use for OCR jobs. If unspecified, uses the first available peer ID.

# TLS

This section applies if you want to enable TLS security on your chainlink node.

## CHAINLINK_TLS_HOST

- Default: _none_

The hostname configured for TLS to be used by the Chainlink node. This is useful if you've configured a domain name specific for your Chainlink node.

## CHAINLINK_TLS_PORT

- Default: `"6689"`

The port used for HTTPS connections. Set to 0 to disable HTTPS (disabling HTTPS also relieves Chainlink of the requirement for a TLS certificate).

## CHAINLINK_TLS_REDIRECT

- Default: `"false"`

Forces TLS redirect for unencrypted connections.

## TLS_CERT_PATH

- Default: _none_

Location of the TLS certificate file. Example: `/home/$USER/.chainlink/tls/server.crt`

## TLS_KEY_PATH

- Default: _none_

Location of the TLS private key file. Example: `/home/$USER/.chainlink/tls/server.key`

# Gas controls

Use this section to tune your node's gas limits and pricing. In most cases, leaving these values at their defaults should give good results.

## ETH_GAS_LIMIT_DEFAULT

- Default: 500000

The default gas limit. This should not need to be changed in most cases. Certain applications (e.g. keeper) might override this with application-specific gas limits.

## ETH_GAS_LIMIT_TRANSFER

- Default: 21000

The gas limit to be used for eth->eth transfers.

## ETH_GAS_BUMP_PERCENT

- Default: _automatic based on chain ID_

The percentage by which to bump gas on a transaction that has exceeded `ETH_GAS_BUMP_THRESHOLD`. The larger of `ETH_GAS_BUMP_PERCENT` and `ETH_GAS_BUMP_WEI` is taken for gas bumps.

## ETH_GAS_BUMP_THRESHOLD

- Default: _automatic based on chain ID_

Chainlink can configured to automatically bump gas on transactions that have been stuck waiting in the mempool for at least this many blocks. Set to 0 to disable gas bumping completely.

## ETH_GAS_BUMP_WEI

- Default: _automatic based on chain ID_

The minimum fixed amount of wei by which gas is bumped on each transaction attempt.

## ETH_GAS_PRICE_DEFAULT

- Default: _automatic based on chain ID_

The default gas price to use when submitting transactions to the blockchain. Will be overridden by the in-built GasUpdater, and may be increased if gas bumping is enabled.

Can be used with the `chainlink setgasprice` to be updated while the node is still running.

## ETH_MAX_GAS_PRICE_WEI

- Default: _automatic based on chain ID_

Chainlink will never pay more than this for a transaction. 

## ETH_MIN_GAS_PRICE_WEI

- Default: _automatic based on chain ID_

Chainlink will never pay less than this for a transaction.

It is possible to force chainlink to use a fixed gas price by setting a combination of these, e.g.

```
ETH_MAX_GAS_PRICE_WEI=100
ETH_MIN_GAS_PRICE_WEI=100
ETH_GAS_PRICE_DEFAULT=100
ETH_GAS_BUMP_THRESHOLD=0
GAS_UPDATER_ENABLED=false
```

## GAS_UPDATER_ENABLED

- Default: _automatic based chain ID_

On by default for most chains. When enabled, dynamically adjusts default gas price based on heuristics from mined blocks.

## GAS_UPDATER_TRANSACTION_PERCENTILE

- Default: `"60"`

Must be in range 0-100.

Only has an effect if gas updater is enabled. Specifies percentile gas price to choose. E.g. if the block history contains four transactions with gas prices `[100, 200, 300, 400]` then picking 25 for this number will give a value of 200. If the calculated gas price is higher than `ETH_GAS_PRICE_DEFAULT` then the higher price will be used as the base price for new transactions.

Think of this number as an indicator of how aggressive you want your node to price its transactions.

Setting this number higher will cause Chainlink to select higher gas prices.

Setting it lower will tend to set lower gas prices.

## ETH_GAS_LIMIT_DEFAULT

- Default: _automatically set based on Chain ID, typically 500000_

The default gas limit for outgoing transactions. Some job types (e.g. keeper) may set their own gas limit unrelated to this value.

## ETH_GAS_LIMIT_TRANSFER

- Default: _automatically set based on Chain ID, typically 21000_

The gas limit used for an ordinary eth->eth transfer.

# Other env vars

## ADMIN_CREDENTIALS_FILE

- Default: `$CHAINLINK_ROOT/apicredentials`

ADMIN_CREDENTIALS_FILE optionally points to a text file containing admin credentials for logging in. It is useful for running client CLI commands and has no effect when passed to a running node.

The file should contain two lines, the first line is the username and second line is the password.
e.g.
```
myusername@example.com
mysecurepassw0rd
```

## ALLOW_ORIGINS

- Default: `"http://localhost:3000,http://localhost:6688"`

Specifies the addresses/URLs of allowed connections to the API on `CLIENT_NODE_URL`. Input may be a comma-separated (no spaces) list. You may experience CORS issues if this is not set correctly.

## CHAINLINK_PORT

- Default: `"6688"`

Port used for the [Chainlink Node API Reference](../chainlink-node-api-reference/) and GUI.


## CLIENT_NODE_URL

- Default: `"http://localhost:6688"`

This is the URL that you will use to interact with the node, including the GUI. It only has effect when using the chainlink client to run CLI commands.

## DATABASE_BACKUP_FREQUENCY

- Default: `"0"`

If set to a positive duration and DATABASE_BACKUP_MODE is not `none`, will dump the database at this regular interval.

Example:

`DATABASE_BACKUP_FREQUENCY=1h`

## DATABASE_BACKUP_MODE

- Default: `"none"`

Set the mode for automatic database backups. Can be one of `none`, `lite`, `full`. If enabled, Chainlink will automatically dump database backups at regular intervals.

`none` disables.
`lite` dumps small, essential tables.
`full` dumps the entire database.

## DATABASE_BACKUP_URL

If specified, the automatic database backup will pull from this URL rather than the main `DATABASE_URL`. It is recommended to set this value to a read replica if you have one to avoid excessive load on the main database.

## ETH_DISABLED

- Default: `"false"`

Disable connection to eth node entirely. This can be useful in certain cases, e.g. to spin up a chainlink node and add jobs without having it execute anything.

## EXPLORER_URL

- Default: _none_

The Explorer websocket URL for the node to push stats to.

## EXPLORER_ACCESS_KEY

- Default: _none_

The access key for authenticating with the Explorer.

## EXPLORER_SECRET

- Default: _none_

The secret for authenticating with the Explorer.

## JSON_CONSOLE

- Default: `"false"`

Set to true to enable JSON logging. Otherwise will log in a human-friendly console format.

## LOG_LEVEL

- Default: `"info"`

The `LOG_LEVEL` environment variable determines both what is printed on the screen and what is written to the logfile, located at `$ROOT/log.jsonl`.

The available options are:
- "debug"
- "info"
- "warn"
- "error"
- "panic"

## LOG_SQL

- Default: `"false"`

Tells Chainlink to log all SQL statements made using the default logger.

## LOG_SQL_MIGRATIONS

- Default: `"true"`

Tells Chainlink to log all SQL migrations made using the default logger.

## LOG_TO_DISK

- Default: `"true"`

Enables or disables the node writing to the `$ROOT/log.jsonl` file.

## MIN_INCOMING_CONFIRMATIONS

- Default: `"3"`

The number of block confirmations to wait before kicking off a job run. Setting this to a lower value improves node response time at the expense of occasionally submitting duplicate transactions in the event of chain re-orgs (duplicate transactions are harmless but cost some eth).

NOTE: The lowest value allowed here is 1, since setting to 0 would imply that logs are processed from the mempool before they are even mined into a block, which isn't possible with Chainlink's current architecture.

## MINIMUM_CONTRACT_PAYMENT_LINK_JUELS

NOTE: This was formerly called MINIMUM_CONTRACT_PAYMENT, it will be removed in a future release.

- Default: _automatically set based on Chain ID, typically 100000000000000 (0.0001 LINK) on all chains except mainnet, where it is 1 LINK_

For jobs that use the EthTx adapter, this is the minimum payment amount in order for the node to accept and process the job. Since there are no decimals on the EVM, the value is represented like wei.
[block:callout]
{
  "type": "warning",
  "body": "Keep in mind, the Chainlink node currently responds with a 500,000 gas limit. Under pricing your node could mean it spends more in ETH (on gas) than it earns in LINK."
}
[/block]

## OPERATOR_CONTRACT_ADDRESS

- Default: _none_

The address of the Operator contract. Used to filter the contract addresses the node should listen to for Run Logs.

## ORM_MAX_IDLE_CONNS

- Default: `"10"`

Maximum number of idle database connections to keep open by the ORM. Reducing this can help if you are hitting postgres connection limits, at the expense of poorer chainlink node performance.

## ORM_MAX_OPEN_CONNS

- Default: `"20"`

Maximum number of open database connections from the ORM. Reducing this can help if you are hitting postgres connection limits, at the expense of poorer chainlink node performance.

## ROOT

- Default: `"~/.chainlink"`

This is the directory where the `log.jsonl` file resides. `log.jsonl` is the log as written by the Chainlink node, depending on the `LOG_LEVEL` specified by the environment variable's value.

## SECURE_COOKIES

- Default: `"true"`

Requires the use of secure cookies for authentication. Set to false to enable standard http requests along with `CHAINLINK_TLS_PORT=0`.

## SESSION_TIMEOUT

- Default: `"15m"`

This value determines the amount of idle time to elapse before the GUI signs out users from their sessions.

# Advanced

Caution: only change these if you _really_ know what you are doing. Setting these wrongly can cause your node to get permanently stuck, requiring manual intervention to fix.

## ETH_MAX_IN_FLIGHT_TRANSACTIONS

- Default: 16

Controls how many transactions are allowed to be "in-flight" i.e. broadcast but unconfirmed at any one time. You can consider this a form of transaction throttling.

The default is set conservatively at 16 because this is a pessimistic minimum that both geth and parity will hold without evicting local transactions. If your node is falling behind and you need higher throughput, you can increase this setting, but you must make sure that your eth node is configured properly otherwise you can get nonce gapped.

0 value disables the limit. Use with caution.

## ETH_MAX_QUEUED_TRANSACTIONS

- Default: _automatically set based on Chain ID, typically 250_

The maximum number of unbroadcast transactions per key that are allowed to be enqueued before jobs will start failing and rejecting send of any further transactions. This represents a sanity limit and generally indicates a problem with your eth node (transactions are not getting mined).

Do NOT blindly increase this value thinking it will fix things if you start hitting this limit because transactions are not getting mined, you will instead only make things worse.

In deployments with very high burst rates, or on chains with large re-orgs, you _may_ consider increasing this.

0 value disables any limit on queue size. Use with caution.

# Misc notes

NOTE: Some env vars require a duration. A duration string is a possibly signed sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms", "-1.5h" or "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". Some examples:

`10ms`
`1h15m`
`42m30s`
