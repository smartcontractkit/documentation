---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Configuring Chainlink Nodes"
permalink: "docs/configuration-variables/"
---

Recent versions of the Chainlink node use sensible defaults for most configuration variables. You do not need to change much to get a standard deployment working.

Not all environment variables are documented here. Any undocumented environment variable is subject to change in future releases. In almost all cases, you should leave any environment variable not listed here to its default value unless you really understand what you are doing.

To reiterate: _If you have an environment variable set that is not listed here, and you don't know exactly why you have it set, you should remove it!_

The environment variables listed here are explicitly supported and current as of Chainlink node v1.1.0.

## Changes to node configuration in v1.1.0 nodes

As of Chainlink node v1.1.0 and up, the way nodes manage configuration is changing. Previously, environment variables exclusively handled all node configuration. Although this configuration method worked well in the past, it has its limitations. Notably, it doesn't mesh well with chain-specific configuration profiles.

For this reason, Chainlink nodes are moving towards a model where you set variables using the API, CLI, or GUI, and the configuration is saved in the database. We encourage you to become familiar with this model because it is likely that nodes will continue to move away from environment variable configuration in the future.

As of v1.1.0, Chainlink nodes still support environment variables to configure node settings and chain-specific settings. If the environment variable is set, it overrides any chain-specific, job-specific, or database configuration setting. The log displays a warning to indicate when an override happens, so you know when variables lower in the hierarchy are being ignored.

Your node applies configuration settings using following hierarchy:

1. Environment variables
1. Chain-specific variables
1. Job-specific variables

## Table of contents

- [Essential environment variables](#essential-environment-variables)
  - [DATABASE_URL](#database_url)
- [General Node Configuration](#general-node-configuration)
  - [CHAIN_TYPE](#chain_type)
  - [CHAINLINK_DEV](#chainlink_dev)
  - [EXPLORER_ACCESS_KEY](#explorer_access_key)
  - [EXPLORER_SECRET](#explorer_secret)
  - [EXPLORER_URL](#explorer_url)
  - [ROOT](#root)
  - [TELEMETRY_INGRESS_LOGGING](#telemetry_ingress_logging)
  - [TELEMETRY_INGRESS_URL](#telemetry_ingress_url)
  - [TELEMETRY_INGRESS_SERVER_PUB_KEY](#telemetry_ingress_server_pub_key)
- [Database Settings](#database-settings)
  - [MIGRATE_DATABASE](#migrate_database)
  - [ORM_MAX_IDLE_CONNS](#orm_max_idle_conns)
  - [ORM_MAX_OPEN_CONNS](#orm_max_open_conns)
- [Database Global Lock](#database-global-lock)
  - [DATABASE_LOCKING_MODE](#database_locking_mode)
    - [Technical details](#technical-details)
  - [ADVISORY_LOCK_CHECK_INTERVAL](#advisory_lock_check_interval)
  - [ADVISORY_LOCK_ID](#advisory_lock_id)
  - [LEASE_LOCK_DURATION](#lease_lock_duration)
  - [LEASE_LOCK_REFRESH_INTERVAL](#lease_lock_refresh_interval)
- [Database Automatic Backups](#database-automatic-backups)
  - [DATABASE_BACKUP_FREQUENCY](#database_backup_frequency)
  - [DATABASE_BACKUP_MODE](#database_backup_mode)
  - [DATABASE_BACKUP_URL](#database_backup_url)
  - [DATABASE_BACKUP_DIR](#database_backup_dir)
- [Logging](#logging)
  - [JSON_CONSOLE](#json_console)
  - [LOG_FILE_DIR](#log_file_dir)
  - [LOG_LEVEL](#log_level)
  - [LOG_SQL](#log_sql)
  - [LOG_TO_DISK](#log_to_disk)
  - [LOG_UNIX_TS](#log_unix_ts)
- [Chainlink Web Server](#chainlink-web-server)
  - [ALLOW_ORIGINS](#allow_origins)
  - [AUTHENTICATED_RATE_LIMIT](#authenticated_rate_limit)
  - [AUTHENTICATED_RATE_LIMIT_PERIOD](#authenticated_rate_limit_period)
  - [BRIDGE_RESPONSE_URL](#bridge_response_url)
  - [HTTP_SERVER_WRITE_TIMEOUT](#http_server_write_timeout)
  - [CHAINLINK_PORT](#chainlink_port)
  - [SECURE_COOKIES](#secure_cookies)
  - [SESSION_TIMEOUT](#session_timeout)
  - [UNAUTHENTICATED_RATE_LIMIT](#unauthenticated_rate_limit)
  - [UNAUTHENTICATED_RATE_LIMIT_PERIOD](#unauthenticated_rate_limit_period)
- [Web Server MFA](#web-server-mfa)
  - [MFA_RPID](#mfa_rpid)
  - [MFA_RPORIGIN](#mfa_rporigin)
- [Web Server TLS](#web-server-tls)
  - [CHAINLINK_TLS_HOST](#chainlink_tls_host)
  - [CHAINLINK_TLS_PORT](#chainlink_tls_port)
  - [CHAINLINK_TLS_REDIRECT](#chainlink_tls_redirect)
  - [TLS_CERT_PATH](#tls_cert_path)
  - [TLS_KEY_PATH](#tls_key_path)
- [EVM/Ethereum Legacy Environment Variables](#evmethereum-legacy-environment-variables)
  - [ETH_URL](#eth_url)
  - [ETH_HTTP_URL](#eth_http_url)
  - [ETH_SECONDARY_URLS](#eth_secondary_urls)
- [EVM/Ethereum Global Settings](#evmethereum-global-settings)
  - [ETH_CHAIN_ID](#eth_chain_id)
  - [EVM_DISABLED](#evm_disabled)
  - [ETH_DISABLED](#eth_disabled)
- [EVM/Ethereum Chain-specific Overrides](#evmethereum-chain-specific-overrides)
  - [BALANCE_MONITOR_ENABLED](#balance_monitor_enabled)
  - [BLOCK_BACKFILL_DEPTH](#block_backfill_depth)
  - [BLOCK_BACKFILL_SKIP](#block_backfill_skip)
  - [ETH_TX_REAPER_INTERVAL](#eth_tx_reaper_interval)
  - [ETH_TX_REAPER_THRESHOLD](#eth_tx_reaper_threshold)
  - [ETH_TX_RESEND_AFTER_THRESHOLD](#eth_tx_resend_after_threshold)
  - [ETH_FINALITY_DEPTH](#eth_finality_depth)
  - [ETH_HEAD_TRACKER_HISTORY_DEPTH](#eth_head_tracker_history_depth)
  - [ETH_HEAD_TRACKER_MAX_BUFFER_SIZE](#eth_head_tracker_max_buffer_size)
  - [ETH_HEAD_TRACKER_SAMPLING_INTERVAL](#eth_head_tracker_sampling_interval)
  - [ETH_LOG_BACKFILL_BATCH_SIZE](#eth_log_backfill_batch_size)
  - [ETH_RPC_DEFAULT_BATCH_SIZE](#eth_rpc_default_batch_size)
  - [LINK_CONTRACT_ADDRESS](#link_contract_address)
  - [MIN_INCOMING_CONFIRMATIONS](#min_incoming_confirmations)
  - [MIN_OUTGOING_CONFIRMATIONS](#min_outgoing_confirmations)
  - [MINIMUM_CONTRACT_PAYMENT_LINK_JUELS](#minimum_contract_payment_link_juels)
- [EVM Gas Controls](#evm-gas-controls)
  - [Configuring your ETH node](#configuring-your-eth-node)
    - [go-ethereum](#go-ethereum)
    - [parity/openethereum](#parityopenethereum)
  - [EVM_EIP1559_DYNAMIC_FEES](#evm_eip1559_dynamic_fees)
    - [Technical details](#technical-details-1)
  - [ETH_GAS_BUMP_PERCENT](#eth_gas_bump_percent)
  - [ETH_GAS_BUMP_THRESHOLD](#eth_gas_bump_threshold)
  - [ETH_GAS_BUMP_TX_DEPTH](#eth_gas_bump_tx_depth)
  - [ETH_GAS_BUMP_WEI](#eth_gas_bump_wei)
  - [ETH_GAS_LIMIT_DEFAULT](#eth_gas_limit_default)
  - [ETH_GAS_LIMIT_MULTIPLIER](#eth_gas_limit_multiplier)
  - [ETH_GAS_LIMIT_TRANSFER](#eth_gas_limit_transfer)
  - [ETH_GAS_PRICE_DEFAULT](#eth_gas_price_default)
  - [EVM_GAS_TIP_CAP_DEFAULT](#evm_gas_tip_cap_default)
  - [EVM_GAS_TIP_CAP_MINIMUM](#evm_gas_tip_cap_minimum)
  - [ETH_MAX_GAS_PRICE_WEI](#eth_max_gas_price_wei)
  - [ETH_MAX_IN_FLIGHT_TRANSACTIONS](#eth_max_in_flight_transactions)
  - [ETH_MAX_QUEUED_TRANSACTIONS](#eth_max_queued_transactions)
  - [ETH_MIN_GAS_PRICE_WEI](#eth_min_gas_price_wei)
  - [ETH_NONCE_AUTO_SYNC](#eth_nonce_auto_sync)
- [EVM/Ethereum Gas Price Estimation](#evmethereum-gas-price-estimation)
  - [GAS_ESTIMATOR_MODE](#gas_estimator_mode)
  - [BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE](#block_history_estimator_batch_size)
  - [BLOCK_HISTORY_ESTIMATOR_BLOCK_HISTORY_SIZE](#block_history_estimator_block_history_size)
  - [BLOCK_HISTORY_ESTIMATOR_BLOCK_DELAY](#block_history_estimator_block_delay)
  - [BLOCK_HISTORY_ESTIMATOR_TRANSACTION_PERCENTILE](#block_history_estimator_transaction_percentile)
- [EVM/Ethereum Transaction Simulation](#evmethereum-transaction-simulation)
    - [FM_SIMULATE_TRANSACTIONS](#fm_simulate_transactions)
    - [OCR_SIMULATE_TRANSACTIONS](#ocr_simulate_transactions)
- [Job Pipeline and tasks](#job-pipeline-and-tasks)
  - [DEFAULT_HTTP_ALLOW_UNRESTRICTED_NETWORK_ACCESS](#default_http_allow_unrestricted_network_access)
  - [DEFAULT_HTTP_LIMIT](#default_http_limit)
  - [DEFAULT_HTTP_TIMEOUT](#default_http_timeout)
  - [FEATURE_EXTERNAL_INITIATORS](#feature_external_initiators)
  - [JOB_PIPELINE_MAX_RUN_DURATION](#job_pipeline_max_run_duration)
  - [JOB_PIPELINE_REAPER_INTERVAL](#job_pipeline_reaper_interval)
  - [JOB_PIPELINE_REAPER_THRESHOLD](#job_pipeline_reaper_threshold)
  - [JOB_PIPELINE_RESULT_WRITE_QUEUE_DEPTH](#job_pipeline_result_write_queue_depth)
- [OCR](#ocr)
  - [FEATURE_OFFCHAIN_REPORTING](#feature_offchain_reporting)
  - [OCR_KEY_BUNDLE_ID](#ocr_key_bundle_id)
  - [OCR_MONITORING_ENDPOINT](#ocr_monitoring_endpoint)
  - [OCR_TRANSMITTER_ADDRESS](#ocr_transmitter_address)
  - [P2P_NETWORKING_STACK](#p2p_networking_stack)
  - [Networking Stack V1](#networking-stack-v1)
    - [P2P_ANNOUNCE_IP](#p2p_announce_ip)
    - [P2P_ANNOUNCE_PORT](#p2p_announce_port)
    - [P2P_BOOTSTRAP_PEERS](#p2p_bootstrap_peers)
    - [P2P_LISTEN_IP](#p2p_listen_ip)
    - [P2P_LISTEN_PORT](#p2p_listen_port)
    - [P2P_PEER_ID](#p2p_peer_id)
  - [Networking Stack V2](#networking-stack-v2)
    - [P2PV2_ANNOUNCE_ADDRESSES](#p2pv2_announce_addresses)
    - [P2PV2_BOOTSTRAPPERS](#p2pv2_bootstrappers)
    - [P2PV2_LISTEN_ADDRESSES](#p2pv2_listen_addresses)
- [Keeper](#keeper)
  - [KEEPER_GAS_PRICE_BUFFER_PERCENT](#keeper_gas_price_buffer_percent)
  - [KEEPER_GAS_TIP_CAP_BUFFER_PERCENT](#keeper_gas_tip_cap_buffer_percent)
  - [KEEPER_MAXIMUM_GRACE_PERIOD](#keeper_maximum_grace_period)
  - [KEEPER_REGISTRY_CHECK_GAS_OVERHEAD](#keeper_registry_check_gas_overhead)
  - [KEEPER_REGISTRY_PERFORM_GAS_OVERHEAD](#keeper_registry_perform_gas_overhead)
  - [KEEPER_REGISTRY_SYNC_INTERVAL](#keeper_registry_sync_interval)
  - [KEEPER_REGISTRY_SYNC_UPKEEP_QUEUE_SIZE](#keeper_registry_sync_upkeep_queue_size)
- [CLI Client](#cli-client)
  - [ADMIN_CREDENTIALS_FILE](#admin_credentials_file)
  - [CLIENT_NODE_URL](#client_node_url)
  - [INSECURE_SKIP_VERIFY](#insecure_skip_verify)
- [Notes on setting environment variables](#notes-on-setting-environment-variables)

## Essential environment variables

These are the only environment variables that are _required_ for a Chainlink node to run.

### DATABASE_URL

**Required**

- Default: _none_

The PostgreSQL URI to connect to your database. Chainlink nodes require Postgres versions >= 11. See the [Running a Chainlink Node](../running-a-chainlink-node/#set-the-remote-database_url-config) for an example.

## General Node Configuration

### CHAIN_TYPE

- Default: _none_

CHAIN_TYPE overrides all chains and forces them to act as a particular chain type. An up-to-date list of chain types is given in [`chaintype.go`](https://github.com/smartcontractkit/chainlink/blob/v1.1.0/core/chains/chaintype.go).

This variable enables some chain-specific hacks and optimizations. It is recommended not to use this environment variable and set the chain-type on a per-chain basis instead.

### CHAINLINK_DEV

- Default: `"false"`

Setting `CHAINLINK_DEV` to `true` enables development mode. This setting is not recommended for production deployments. It can be useful for enabling experimental features and collecting debug information.

### EXPLORER_ACCESS_KEY

- Default: _none_

The access key for authenticating with the Explorer.

### EXPLORER_SECRET

- Default: _none_

The secret for authenticating with the Explorer.

### EXPLORER_URL

- Default: _none_

The Explorer websocket URL for the node to push stats to.

### ROOT

- Default: `"~/.chainlink"`

The Chainlink node's root directory. This is the default directory for logging, database backups, cookies, and other misc Chainlink node files. Chainlink nodes will always ensure this directory has `700` permissions because it might contain sensitive data.

### TELEMETRY_INGRESS_LOGGING

- Default: `"false"`

Toggles verbose logging of the raw telemetry messages being sent.

### TELEMETRY_INGRESS_URL

- Default: _none_

The URL to connect to for sending telemetry.

### TELEMETRY_INGRESS_SERVER_PUB_KEY

- Default: _none_

The public key of the telemetry server.

## Database Settings

### MIGRATE_DATABASE

- Default: `"true"`

This variable controls whether a Chainlink node will attempt to automatically migrate the database on boot. If you want more control over your database migration process, set this variable to `false` and manually migrate the database using the CLI `migrate` command instead.

### ORM_MAX_IDLE_CONNS

- Default: `"10"`

This setting configures the maximum number of idle database connections that the Chainlink node will keep open. Think of this as the baseline number of database connections per Chainlink node instance. Increasing this number can help to improve performance under database-heavy workloads.

Postgres has connection limits, so you must use cation when increasing this value. If you are running several instances of a Chainlink node or another application on a single database server, you might run out of Postgres connection slots if you raise this value too high.

### ORM_MAX_OPEN_CONNS

- Default: `"20"`

This setting configures the maximum number of database connections that a Chainlink node will have open at any one time. Think of this as the maximum burst upper bound limit of database connections per Chainlink node instance. Increasing this number can help to improve performance under database-heavy workloads.

Postgres has connection limits, so you must use cation when increasing this value. If you are running several instances of a Chainlink node or another application on a single database server, you might run out of Postgres connection slots if you raise this value too high.

## Database Global Lock

Chainlink nodes use a database lock to ensure that only one Chainlink node instance can be run on the database at a time. If you run multiple instances of a Chainlink node that share a single database at the same time, the node will encounter strange errors and data integrity failures. Do not allow multiple nodes to write data to the database at the same time.

### DATABASE_LOCKING_MODE

- Default: `"advisorylock"`

The `DATABASE_LOCKING_MODE` variable can be set to 'advisorylock', 'lease', 'dual', or 'none'. It controls which mode to use to enforce that only one Chainlink node can use the database.

- `advisorylock` - The default: Advisory lock only
- `lease` - Lease lock only
- `dual` - Uses both locking types for both backward and forward compatibility
- _none_ - No locking at all: This option useful for advanced deployment environments when you are sure that only one instance of a Chainlink node will ever be running.

#### Technical details

Ideally, you should use a container orchestration system like [Kubernetes](https://kubernetes.io/) to ensure that only one Chainlink node instance can ever use a specific Postgres database. However, some node operators do not have the technical capacity to do this. Common use cases run multiple Chainlink node instances in failover mode as recommended by our official documentation. The first instance takes a lock on the database and subsequent instances will wait trying to take this lock in case the first instance fails.

By default, Chainlink nodes use an advisory lock to manage this. However, advisory locks come with several problems:
- If your nodes or applications hold locks open for several hours or days, Postgres is unable to complete internal cleanup tasks. The Postgres maintainers explicitly discourage holding locks open for long periods of time.
- Advisory locks can silently disappear when you upgrade Postgres, so a new Chainlink node instance can take over even while the old node is still running.
- Advisory locks do not work well with pooling tools such as [pgbouncer](https://www.pgbouncer.org/).
- If the Chainlink node crashes, an advisory lock can hang around for up to several hours, which might require you to manually remove it so another instance of the Chainlink node will allow itself to boot.

Because of the complications with advisory locks, Chainlink nodes with v1.1.0 and later support a new `lease` locking mode. This mode might become the default in future. The `lease` locking mode works using the following process:
- Node A creates one row in the database with the client ID and updates it once per second.
- Node B spinlocks and checks periodically to see if the client ID is too old. If the client ID is not updated after a period of time, node B assumes that node A failed and takes over. Node B becomes the owner of the row and updates the client ID once per second.
- If node A comes back, it attempts to take out a lease, realizes that the database has been leased to another process, and exits the entire application immediately.

The default is set to `advisorylock`.

### ADVISORY_LOCK_CHECK_INTERVAL

ADVANCED - DEV ONLY, not released
Do not change this setting unless you know what you are doing.

This setting applies only if `DATABASE_LOCKING_MODE` is set to enable advisory locking.

- Default: `"1s"`

`ADVISORY_LOCK_CHECK_INTERVAL` controls how often the Chainlink node checks to make sure it still holds the advisory lock when advisory locking is enabled. If a node no longer holds the lock, it will try to re-acquire it. If the node cannot re-acquire the lock, the application will exit.

### ADVISORY_LOCK_ID

ADVANCED - DEV ONLY, not released
Do not change this setting unless you know what you are doing.

This setting applies only if `DATABASE_LOCKING_MODE` is set to enable advisory locking.

- Default: `"1027321974924625846"`

`ADVISORY_LOCK_ID` is the application advisory lock ID. This must match all other Chainlink nodes that might access this database. It is unlikely you will ever need to change this from the default.

### LEASE_LOCK_DURATION

**ADVANCED**

It is not recommended to change this setting unless you know what you are doing.

This setting applies only if `DATABASE_LOCKING_MODE` is set to enable lease locking.

- Default: `"30s"`

How long the lease lock will last before expiring.

### LEASE_LOCK_REFRESH_INTERVAL

**ADVANCED**

It is not recommended to change this setting unless you know what you are doing.

This setting applies only if `DATABASE_LOCKING_MODE` is set to enable lease locking.

- Default: `"1s"`

How often to refresh the lease lock. Also controls how often a standby node will check to see if it can grab the lease.

## Database Automatic Backups

As a best practice, take regular database backups in case of accidental data loss. This best practice is especially important when you upgrade your Chainlink node to a new version. Chainlink nodes support automated database backups to make this process easier.

NOTE: Dumps can cause high load and massive database latencies, which will negatively impact the normal functioning of the Chainlink node. For this reason, it is recommended to set a DATABASE_BACKUP_URL and point it to a read replica if you enable automatic backups.

### DATABASE_BACKUP_FREQUENCY

- Default: `"1h"`

If this variable is set to a positive duration and `DATABASE_BACKUP_MODE` is not _none_, the node will dump the database at this regular interval.

Set to `0` to disable periodic backups.

### DATABASE_BACKUP_MODE

- Default: `"none"`

Set the mode for automatic database backups, which can be one of _none_, `lite`, or `full`. If enabled, the Chainlink node will always dump a backup on every boot before running migrations. Additionally, it will automatically take database backups that overwrite the backup file for the given version at regular intervals if `DATABASE_BACKUP_FREQUENCY` is set to a non-zero interval.

_none_ - Disables backups.
`lite` - Dumps small tables including configuration and keys that are essential for the node to function, which excludes historical data like job runs, transaction history, etc.
`full` - Dumps the entire database.

It will write to a file like `$ROOT/backup/cl_backup_<VERSION>.dump`. There is one backup dump file per version of the Chainlink node. If you upgrade the node, it will keep the backup taken right before the upgrade migration so you can restore to an older version if necessary.

### DATABASE_BACKUP_URL

If specified, the automatic database backup will pull from this URL rather than the main `DATABASE_URL`. It is recommended to set this value to a read replica if you have one to avoid excessive load on the main database.

### DATABASE_BACKUP_DIR

This variable sets the directory to use for saving the backup file. Use this if you want to save the backup file in a directory other than the default ROOT directory.

## Logging

### JSON_CONSOLE

- Default: `"false"`

Set this to true to enable JSON logging. Otherwise, the log is saved in a human-friendly console format.

### LOG_FILE_DIR
DEV ONLY - not released

- Default: `"$ROOT"`

By default, Chainlink nodes write log data to `$ROOT/log.jsonl`. The log directory can be changed by setting this var. For example, `LOG_FILE_DIR=/my/log/directory`.

### LOG_LEVEL

- Default: `"info"`

The `LOG_LEVEL` environment variable determines both what is printed on the screen and what is written to the log file.

The available options are:
- `"debug"`: Useful for forensic debugging of issues.
- `"info"`: High level informational messages.
- `"warn"`: Something unexpected happened that might need non-urgent action. Node operators should check these once in a while to see whether anything stands out (e.g. deprecation warnings).
- `"error"`: Something bad happened. Node operators might need to take urgent action based on this error.
- `"panic"`: Something very bad happened. Node operators should take immediate action to fix this.
- `"fatal"`: An unrecoverable problem was encountered and the node had to exit.

### LOG_SQL

- Default: `"false"`

This setting tells the Chainlink node to log SQL statements made using the default logger. SQL statements will be logged at `debug` level. Not all statements can be logged. The best way to get a true log of all SQL statements is to enable SQL statement logging on Postgres.

### LOG_TO_DISK

- Default: `"true"`

Enables or disables the node writing to the `$LOG_FILE_DIR/log.jsonl` file

### LOG_UNIX_TS

- Default: `"false"`

Previous versions of Chainlink nodes wrote JSON logs with a unix timestamp. As of v1.1.0 and up, the default has changed to use ISO8601 timestamps for better readability. Setting `LOG_UNIX_TS=true` will enable the old behavior.

## Chainlink Web Server

### ALLOW_ORIGINS

- Default: `"http://localhost:3000,http://localhost:6688"`

Controls the URLs Chainlink nodes emit in the `Allow-Origins` header of its API responses. The setting can be a comma-separated list with no spaces. You might experience CORS issues if this is not set correctly.

You should set this to the external URL that you use to access the Chainlink UI.

You can set `ALLOW_ORIGINS=*` to allow the UI to work from any URL, but it is recommended for security reasons to make it explicit instead.

### AUTHENTICATED_RATE_LIMIT

- Default: `"1000"`

`AUTHENTICATED_RATE_LIMIT` defines the threshold to which authenticated requests get limited. More than this many authenticated requests per `AUTHENTICATED_RATE_LIMIT_PERIOD` will be rejected.

### AUTHENTICATED_RATE_LIMIT_PERIOD

- Default: `"1m"`

`AUTHENTICATED_RATE_LIMIT_PERIOD` defines the period to which authenticated requests get limited.

### BRIDGE_RESPONSE_URL

- Default: _none_

`BRIDGE_RESPONSE_URL` defines the URL for bridges to send a response to. This _must_ be set when using async external adapters.

Usually this will be the same as the URL/IP and port you use to connect to the Chainlink UI, such as `https://my-chainlink-node.example.com:6688`.

### HTTP_SERVER_WRITE_TIMEOUT
ADVANCED
It is not recommended to change this unless you know what you are doing.

- Default: `"10s"`

`HTTP_SERVER_WRITE_TIMEOUT` controls how long the Chainlink node's API server can hold a socket open for writing a response to an HTTP request. Sometimes, this must be increased for pprof.

### CHAINLINK_PORT

- Default: `"6688"`

Port used for the [Chainlink Node API](../chainlink-node-api-reference/) and GUI.

### SECURE_COOKIES

- Default: `"true"`

Requires the use of secure cookies for authentication. Set to false to enable standard HTTP requests along with `CHAINLINK_TLS_PORT=0`.

### SESSION_TIMEOUT

- Default: `"15m"`

This value determines the amount of idle time to elapse before session cookies expire. This signs out GUI users from their sessions.

### UNAUTHENTICATED_RATE_LIMIT

- Default: `"5"`

`UNAUTHENTICATED_RATE_LIMIT` defines the threshold to which authenticated requests get limited. More than this many unauthenticated requests per `UNAUTHENTICATED_RATE_LIMIT_PERIOD` will be rejected.

### UNAUTHENTICATED_RATE_LIMIT_PERIOD

- Default: `"20s"`

`UNAUTHENTICATED_RATE_LIMIT_PERIOD` defines the period to which unauthenticated requests get limited.

## Web Server MFA

The Operator UI frontend now supports enabling Multi Factor Authentication via Webauthn per account. When enabled, logging in will require the account password and a hardware or OS security key such as Yubikey. To enroll, log in to the operator UI and click the circle purple profile button at the top right and then click **Register MFA Token**. Tap your hardware security key or use the OS public key management feature to enroll a key. Next time you log in, this key will be required to authenticate.

This feature must be enabled by setting the following environment variables: `MFA_RPID` and `MFA_RPORIGIN`.

### MFA_RPID

- Default: _none_

The `MFA_RPID` value should be the FQDN of where the Operator UI is served. When serving locally, the value should be `localhost`.

### MFA_RPORIGIN

- Default: _none_

The `MFA_RPORIGIN` value should be the origin URL where WebAuthn requests initiate, including scheme and port. When serving locally, the value should be `http://localhost:6688/`.

## Web Server TLS

The TLS settings below apply only if you want to enable TLS security on your Chainlink node.

### CHAINLINK_TLS_HOST

- Default: _none_

The hostname configured for TLS to be used by the Chainlink node. This is useful if you configured a domain name specific for your Chainlink node.

### CHAINLINK_TLS_PORT

- Default: `"6689"`

The port used for HTTPS connections. Set this to `0` to disable HTTPS. Disabling HTTPS also relieves Chainlink nodes of the requirement for a TLS certificate.

### CHAINLINK_TLS_REDIRECT

- Default: `"false"`

Forces TLS redirect for unencrypted connections.

### TLS_CERT_PATH

- Default: _none_

The location of the TLS certificate file. Example: `/home/$USER/.chainlink/tls/server.crt`

### TLS_KEY_PATH

- Default: _none_

The location of the TLS private key file. Example: `/home/$USER/.chainlink/tls/server.key`

## EVM/Ethereum Legacy Environment Variables

Previous Chainlink node versions supported only one chain. From v1.1.0 and up, Chainlink nodes support multiple EVM and non-EVM chains, so the way that chains and nodes are configured has changed.

The preferred way of configuring Chainlink nodes as of v1.1.0 and up is to use the API, CLI, or UI to set chain-specific configuration and create nodes.

The old way of specifying chains using environment variables is still supported, but discouraged. It works as follows:

If you set any value for `ETH_URL`, the values of `ETH_CHAIN_ID`, `ETH_URL`, `ETH_HTTP_URL` and `ETH_SECONDARY_URLS` will be used to create and update chains and nodes representing these values in the database. If an existing chain or node is found, it will be overwritten. This mode is used mainly to ease the process of upgrading. On subsequent runs (once your old settings have been written to the database) it is recommended to unset `ETH_URL` and use the API commands exclusively to administer chains and nodes.

In the future, support for the `ETH_URL` and associated environment variables might be removed, so it is recommended to use the API, CLI, or GUI instead to setup chains and nodes.

### ETH_URL

(Setting this will enable "legacy eth ENV" mode which is not compatible with multichain, prefer to configure in the CLI/API/GUI instead)

- Default: _none_

This is the websocket address of the Ethereum client that the Chainlink node will connect to. All interaction with the Ethereum blockchain will occur through this connection.

NOTE: It is also required to set `ETH_CHAIN_ID` if you set ETH_URL.

### ETH_HTTP_URL

(Only has effect if `ETH_URL` set to something, otherwise can be set in the CLI/API/GUI)

- Default: _none_

This should be set to the HTTP URL that points to the same ETH node as the primary. If set, the Chainlink node will automatically use HTTP mode for heavy requests, which can improve reliability.

### ETH_SECONDARY_URLS

(Only has effect if `ETH_URL` set to something, otherwise can be set in the CLI/API/GUI)

- Default: _none_

If set, transactions will also be broadcast to this secondary Ethereum node. This allows transaction broadcasting to be more robust in the face of primary Ethereum node bugs or failures.

It is recommended to set at least one secondary ETH node here that is different from your primary.

Multiple URLs can be specified as a comma-separated list e.g.

`ETH_SECONDARY_URLS=https://example.com/1,https://example.text/2,...`

## EVM/Ethereum Global Settings

This configuration is specific to EVM/Ethereum chains.

### ETH_CHAIN_ID

- Default: _none_

This environment variable specifies the default chain ID. Any job spec that has not explicitly set `EVMChainID` will connect to this default chain. If you do not have a chain in the database matching this value, any jobs that try to use it will throw an error.

### EVM_DISABLED

- Default: `"false"`

Disable EVM entirely. No services related to EVM chains will be spun up at all. This can be useful in some cases e.g. on a node that only runs Cron jobs that post to an HTTP API, or for node that don't use any EVM chains.

### ETH_DISABLED

- Default: `"false"`

Disable connecting to any ETH nodes. This can be useful in certain cases, e.g. to spin up a Chainlink node and add jobs without having it execute anything.

## EVM/Ethereum Chain-specific Overrides

These configuration options act as an override, setting the value for _all_ chains.

This often doesn't make sense, e.g. `ETH_FINALITY_DEPTH` on Avalanche could be quite different from `ETH_FINALITY_DEPTH` on Ethereum mainnet.

We recommend setting this on a per-chain basis using the API, CLI, or GUI instead.

In general, Chainlink nodes contain built-in defaults for most of these settings that should work out of the box on all officially supported chains, so it is unlikely you must make any changes here.

### BALANCE_MONITOR_ENABLED

- Default: `"true"`

Enables Balance Monitor feature. This is required to track balances of keys locally and warn if it drops too low. It also enables displaying balance in the Chainlink UI and API.

### BLOCK_BACKFILL_DEPTH

- Default: `"10"`

This variable specifies the number of blocks before the current head that the log broadcaster will try to re-consume logs from, e.g. after adding a new job.

### BLOCK_BACKFILL_SKIP

- Default: `"false"`

This variable enables skipping of very long log backfills. For example, this happens in a situation when the node is started after being offline for a long time.
This might be useful on fast chains and if only recent chain events are relevant


### ETH_TX_REAPER_INTERVAL

NOTE: This overrides the setting for _all_ chains, you might want to set this on a per-chain basis using the API, CLI, or GUI instead.

- Default: `"1h"`

Controls how often the ETH transaction reaper should run, used to delete old confirmed or fatally_errored transaction records from the database. Setting to `0` disables the reaper.

### ETH_TX_REAPER_THRESHOLD

- Default: `"24h"`

Represents how long any confirmed or fatally_errored `eth_tx` transactions will hang around in the database.
If the `eth_tx` is confirmed but still below `ETH_FINALITY_DEPTH`, it will not be deleted even if it was created at a time older than this value.

EXAMPLE:
With: `EthTxReaperThreshold=1h` and `EthFinalityDepth=50`
If current head is 142, any `eth_tx` confirmed in block 91 or below will be reaped as long as its `created_at` value is older than the value set for `EthTxReaperThreshold`.

Setting to `0` disables the reaper.

### ETH_TX_RESEND_AFTER_THRESHOLD

NOTE: This overrides the setting for _all_ chains, you might want to set this on a per-chain basis using the API, CLI, or GUI instead.

- Default: _automatically set based on Chain ID, typically 1m_

Controls how long the `ethResender` will wait before re-sending the latest `eth_tx_attempt`. This is designed a as a fallback to protect against the ETH nodes dropping transactions (which has been anecdotally observed to happen), networking issues, or transactions being ejected from the mempool.

Setting to `0` disables the resender.

### ETH_FINALITY_DEPTH

- Default: _automatically set based on Chain ID, typically 50_

The number of blocks after which an Ethereum transaction is considered "final".

`ETH_FINALITY_DEPTH` determines how deeply we look back to ensure that transactions are confirmed onto the longest chain. There is not a large performance penalty to setting this relatively high (on the order of hundreds).

It is practically limited by the number of heads we store in the database (`HEAD_TRACKER_HISTORY_DEPTH`) and should be less than this with a comfortable margin.
If a transaction is mined in a block more than this many blocks ago, and is reorged out, we will NOT retransmit this transaction and undefined behavior can occur including gaps in the nonce sequence that require manual intervention to fix. Therefore, this number represents a number of blocks we consider large enough that no re-org this deep will ever feasibly happen.

### ETH_HEAD_TRACKER_HISTORY_DEPTH

- Default: _automatically set based on Chain ID, typically 100_

Tracks the top N block numbers to keep in the `heads` database table. Note that this can easily result in MORE than N total records since in the case of re-orgs we keep multiple heads for a particular block height, and it is also scoped per chain. This number should be at least as large as `ETH_FINALITY_DEPTH`. There might be a small performance penalty to setting this to something very large (10,000+)

### ETH_HEAD_TRACKER_MAX_BUFFER_SIZE

- Default: `"3"`

The maximum number of heads that can be buffered in front of the head tracker before older heads start to be dropped. Think this setting as the maximum permitted "lag" for the head tracker before the Chainlink node starts dropping heads to keep up.

### ETH_HEAD_TRACKER_SAMPLING_INTERVAL

- Default: _automatically set based on Chain ID, typically 1s_

Head tracker sampling was introduced to handle chains with very high throughput. If this is set, the head tracker will "gap" heads and deliver a maximum of 1 head per this period.

Set to `0` to disable head tracker sampling.

### ETH_LOG_BACKFILL_BATCH_SIZE

- Default: _automatic based on Chain ID, typically 100_

Controls the batch size for calling FilterLogs when backfilling missing or recent logs.

### ETH_RPC_DEFAULT_BATCH_SIZE

- Default: _automatic based on chain ID_

Chainlink nodes use batch mode for certain RPC calls to increase efficiency of communication with the remote ETH node. In some cases, trying to request too many items in a single batch will result in an error (e.g. due to bugs in go-ethereum, third-party provider limitations, limits inherent to the websocket channel etc). This setting controls the maximum number of items that can be requested in a single batch. Chainlink nodes use built-in conservative defaults for different chains that should work out of the box.

If you have enabled HTTP URLs for all of your ETH nodes, you can safely increase this to a larger value e.g. 100 and see significant RPC performance improvements.

### LINK_CONTRACT_ADDRESS

- Default: _automatic based on Chain ID_

The address of the LINK token contract. It is not essential to provide this, but if given, it is used for displaying the node account's LINK balance. For supported chains, this is automatically set based on the given chain ID. For unsupported chains, you must supply it yourself.

This environment variable is a global override. It is recommended instead to set this on a per-chain basis.

### MIN_INCOMING_CONFIRMATIONS

- Default: _automatic based on chain ID, typically 3_

The number of block confirmations to wait before kicking off a job run or proceeding with a task that listens to blockchain and log events. Setting this to a lower value improves node response time at the expense of occasionally submitting duplicate transactions in the event of chain re-orgs (duplicate transactions are harmless but cost some ETH).

You can override this on a per-job basis.

`MIN_INCOMING_CONFIRMATIONS=1` would kick off a job after seeing the transaction in just one block.

> ⚠️ NOTE
> The lowest value allowed here is 1, since setting to 0 would imply that logs are processed from the mempool before they are even mined into a block, which isn't possible with Chainlink's current architecture.

### MIN_OUTGOING_CONFIRMATIONS

- Default: _automatic based on chain ID, typically 12_

The default minimum number of block confirmations that need to be recorded on an outgoing `ethtx` task before the run can move onto the next task.

This can be overridden on a per-task basis by setting the `MinRequiredOutgoingConfirmations` parameter.

`MIN_OUTGOING_CONFIRMATIONS=1` considers a transaction as "done" once it has been mined into one block.
`MIN_OUTGOING_CONFIRMATIONS=0` would consider a transaction as "done" even before it has been mined.

### MINIMUM_CONTRACT_PAYMENT_LINK_JUELS

> ⚠️ NOTE
> This has replaced the formerly used MINIMUM_CONTRACT_PAYMENT

- Default: _automatically set based on Chain ID, typically 10000000000000 (0.00001 LINK) on all chains except mainnet, where it is 0.1 LINK_

For jobs that use the `EthTx` adapter, this is the minimum payment amount in order for the node to accept and process the job. Since there are no decimals on the EVM, the value is represented like wei.

> 🚧 Note
>
> Keep in mind, the Chainlink node currently responds with a 500,000 gas limit. Under pricing your node could mean it spends more in ETH (on gas) than it earns in LINK.

## EVM Gas Controls

These settings allow you to tune your node's gas limits and pricing. In most cases, leaving these values at their defaults should give good results.

As of Chainlink node v1.1.0, it is recommended to use the API, CLI, or GUI to configure gas controls because you might want to use different settings for different chains. Setting the environment variable typically overrides the setting for all chains.

### Configuring your ETH node

Your ETH node might need some configuration tweaks to make it fully compatible with Chainlink nodes depending on your configuration.

#### go-ethereum

WARNING: By default, go-ethereum will reject transactions that exceed it's built-in RPC gas or txfee caps. Chainlink nodes will fatally error transactions if this happens which means if you ever exceed the caps your node will miss transactions.

You should at a bare minimum disable the default RPC gas and txfee caps on your ETH node. This can be done in the TOML file as seen below, or by running go-ethereum with the command line arguments: `--rpc.gascap=0 --rpc.txfeecap=0`.

It is also recommended to configure go-ethereum properly before increasing `ETH_MAX_IN_FLIGHT_TRANSACTIONS` to ensure all in-flight transactions are maintained in the mempool.

Relevant settings for geth and forks (such as BSC).

```toml
[Eth]
RPCGasCap = 0 # it is recommended to disable both gas and txfee cap
RPCTxFeeCap = 0.0
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

#### parity/openethereum

Relevant settings for parity and openethereum (and forks such as xDai)

```toml
tx_queue_locals = ["0xYourNodeAddress1", "0xYourNodeAddress2"] # Add your node addresses here
tx_queue_size = 8192 # Increase this as necessary
tx_queue_per_sender = 16 # Highly recommended to increase this, must be greater than or equal to Chainlink's ETH_MAX_IN_FLIGHT_TRANSACTIONS setting
tx_queue_mem_limit = 4 # In MB. Highly recommended to increase this or set to 0 to disable the mem limit entirely
tx_queue_no_early_reject = true # Recommended to set this
tx_queue_no_unfamiliar_locals = false # This is disabled by default but might as well make sure
```

### EVM_EIP1559_DYNAMIC_FEES

- Default: _automatic based on chain ID_

Forces EIP-1559 transaction mode for all chains. Enabling EIP-1559 mode can help reduce gas costs on chains that support it.

#### Technical details

Chainlink nodes include experimental support for submitting transactions using type 0x2 (EIP-1559) envelope.

EIP-1559 mode is off by default but can be enabled on a per-chain basis or globally.

This might help to save gas on spikes. Chainlink nodes should react faster on the upleg and avoid overpaying on the downleg. It might also be possible to set `BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE` to a smaller value such as 12 or even 6 because tip cap should be a more consistent indicator of inclusion time than total gas price. This would make Chainlink nodes more responsive and should reduce response time variance. Some experimentation is required to find optimum settings.

To enable globally, set `EVM_EIP1559_DYNAMIC_FEES=true`. Set with caution, if you set this on a chain that does not actually support EIP-1559 your node will be broken.

In EIP-1559 mode, the total price for the transaction is the minimum of base fee + tip cap and fee cap. More information can be found on the [official EIP](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md).

Chainlink's implementation of this is to set a large fee cap and modify the tip cap to control confirmation speed of transactions. When in EIP-1559 mode, the tip cap takes the place of gas price roughly speaking, with the varying base price remaining a constant (we always pay it).

A quick note on terminology - Chainlink nodes use the same terms used internally by go-ethereum source code to describe various prices. This is not the same as the externally used terms. For reference:

- Base Fee Per Gas = BaseFeePerGas
- Max Fee Per Gas = FeeCap
- Max Priority Fee Per Gas = TipCap

In EIP-1559 mode, the following changes occur to how configuration works:

- All new transactions will be sent as type 0x2 transactions specifying a TipCap and FeeCap. Be aware that existing pending legacy transactions will continue to be gas bumped in legacy mode.
- `BlockHistoryEstimator` will apply its calculations (gas percentile etc) to the TipCap and this value will be used for new transactions (GasPrice will be ignored)
- `FixedPriceEstimator` will use `EVM_GAS_TIP_CAP_DEFAULT` instead of `ETH_GAS_PRICE_DEFAULT`
- `ETH_GAS_PRICE_DEFAULT` is ignored for new transactions and `EVM_GAS_TIP_CAP_DEFAULT` is used instead (default 20GWei)
- `ETH_MIN_GAS_PRICE_WEI` is ignored for new transactions and `EVM_GAS_TIP_CAP_MINIMUM` is used instead (default 0)
- `ETH_MAX_GAS_PRICE_WEI` controls the FeeCap
- `KEEPER_GAS_PRICE_BUFFER_PERCENT` is ignored in EIP-1559 mode and `KEEPER_TIP_CAP_BUFFER_PERCENT` is used instead

The default tip cap is configurable per-chain but can be specified for all chains using `EVM_GAS_TIP_CAP_DEFAULT`. The fee cap is derived from `ETH_MAX_GAS_PRICE_WEI`.

When using the `FixedPriceEstimator`, the default gas tip will be used for all transactions.

When using the `BlockHistoryEstimator`, Chainlink nodes calculate the tip cap based on transactions already included in the same way that they calculate gas price in legacy mode.

Enabling EIP-1559 mode might lead to marginally faster transaction inclusion and make the node more responsive to sharp rises/falls in gas price, keeping response times more consistent.

In addition, `ethcall` tasks now accept `gasTipCap` and `gasFeeCap` parameters in addition to `gasPrice`. This is required for Keeper jobs, i.e.:

```
check_upkeep_tx          [type=ethcall
                          failEarly=true
                          extractRevertReason=true
                          contract="$(jobSpec.contractAddress)"
                          gas="$(jobSpec.checkUpkeepGasLimit)"
                          gasPrice="$(jobSpec.gasPrice)"
                          gasTipCap="$(jobSpec.gasTipCap)"
                          gasFeeCap="$(jobSpec.gasFeeCap)"
                          data="$(encode_check_upkeep_tx)"]
```
### ETH_GAS_BUMP_PERCENT

- Default: _automatic based on chain ID_

The percentage by which to bump gas on a transaction that has exceeded `ETH_GAS_BUMP_THRESHOLD`. The larger of `ETH_GAS_BUMP_PERCENT` and `ETH_GAS_BUMP_WEI` is taken for gas bumps.

### ETH_GAS_BUMP_THRESHOLD

- Default: _automatic based on chain ID_

Chainlink nodes can be configured to automatically bump gas on transactions that have been stuck waiting in the mempool for at least this many blocks. Set to 0 to disable gas bumping completely.

### ETH_GAS_BUMP_TX_DEPTH

- Default: `"10"`

The number of transactions to gas bump starting from oldest. Set to 0 for no limit (i.e. bump all).

### ETH_GAS_BUMP_WEI

- Default: _automatic based on chain ID_

The minimum fixed amount of wei by which gas is bumped on each transaction attempt.

### ETH_GAS_LIMIT_DEFAULT

- Default: _automatically set based on Chain ID, typically 500000_

The default gas limit for outgoing transactions. This should not need to be changed in most cases.
Some job types, such as Keeper jobs, might set their own gas limit unrelated to this value.

### ETH_GAS_LIMIT_MULTIPLIER

- Default: `"1.0"`

A factor by which a transaction's GasLimit is multiplied before transmission. So if the value is 1.1, and the GasLimit for a transaction is 10, 10% will be added before transmission.

This factor is always applied, so includes Optimism L2 transactions which uses a default gas limit of 1 and is also applied to EthGasLimitDefault.

### ETH_GAS_LIMIT_TRANSFER

- Default: _automatically set based on Chain ID, typically 21000_

The gas limit used for an ordinary ETH transfer.

### ETH_GAS_PRICE_DEFAULT

(Only applies to legacy transactions)

- Default: _automatic based on chain ID_

The default gas price to use when submitting transactions to the blockchain. Will be overridden by the built-in `BlockHistoryEstimator` if enabled, and might be increased if gas bumping is enabled.

Can be used with the `chainlink setgasprice` to be updated while the node is still running.

### EVM_GAS_TIP_CAP_DEFAULT

(Only applies to EIP-1559 transactions)

- Default: _automatic based on chain ID_

The default gas tip to use when submitting transactions to the blockchain. Will be overridden by the built-in `BlockHistoryEstimator` if enabled, and might be increased if gas bumping is enabled.

### EVM_GAS_TIP_CAP_MINIMUM

(Only applies to EIP-1559 transactions)

- Default: _automatic based on chain ID_

The minimum gas tip to use when submitting transactions to the blockchain.

### ETH_MAX_GAS_PRICE_WEI

- Default: _automatic based on chain ID_

Chainlink nodes will never pay more than this for a transaction.

### ETH_MAX_IN_FLIGHT_TRANSACTIONS

- Default: `"16"`

Controls how many transactions are allowed to be "in-flight" i.e. broadcast but unconfirmed at any one time. You can consider this a form of transaction throttling.

The default is set conservatively at 16 because this is a pessimistic minimum that both geth and parity will hold without evicting local transactions. If your node is falling behind and you need higher throughput, you can increase this setting, but you MUST make sure that your ETH node is configured properly otherwise you can get nonce gapped and your node will get stuck.

0 value disables the limit. Use with caution.

### ETH_MAX_QUEUED_TRANSACTIONS

- Default: _automatically set based on Chain ID, typically 250_

The maximum number of unbroadcast transactions per key that are allowed to be enqueued before jobs will start failing and rejecting send of any further transactions. This represents a sanity limit and generally indicates a problem with your ETH node (transactions are not getting mined).

Do NOT blindly increase this value thinking it will fix things if you start hitting this limit because transactions are not getting mined, you will instead only make things worse.

In deployments with very high burst rates, or on chains with large re-orgs, you _may_ consider increasing this.

0 value disables any limit on queue size. Use with caution.

### ETH_MIN_GAS_PRICE_WEI

(Only applies to legacy transactions)

- Default: _automatic based on chain ID_

Chainlink nodes will never pay less than this for a transaction.

It is possible to force the Chainlink node to use a fixed gas price by setting a combination of these, e.g.

```
EVM_EIP1559_DYNAMIC_FEES=false
ETH_MAX_GAS_PRICE_WEI=100
ETH_MIN_GAS_PRICE_WEI=100
ETH_GAS_PRICE_DEFAULT=100
ETH_GAS_BUMP_THRESHOLD=0
GAS_ESTIMATOR_MODE="FixedPrice"
```

### ETH_NONCE_AUTO_SYNC

- Default: `"true"`

Chainlink nodes will automatically try to sync its local nonce with the remote chain on startup and fast forward if necessary. This is almost always safe but can be disabled in exceptional cases by setting this value to false.

## EVM/Ethereum Gas Price Estimation

These settings allow you to configure how your node calculates gas prices. In most cases, leaving these values at their defaults should give good results.

As of Chainlink node v1.1.0, it is recommended to use the API, CLI, or GUI to configure gas controls because you might want to use different settings for different chains. Setting the environment variable typically overrides the setting for all chains.

Chainlink nodes decide what gas price to use using an `Estimator`. It ships with several simple and battle-hardened built-in estimators that should work well for almost all use-cases. Note that estimators will change their behaviour slightly depending on if you are in EIP-1559 mode or not.

You can also use your own estimator for gas price by selecting the `FixedPrice` estimator and using the exposed API to set the price.

An important point to note is that the Chainlink node does _not_ ship with built-in support for go-ethereum's `estimateGas` call. This is for several reasons, including security and reliability. We have found empirically that it is not generally safe to rely on the remote ETH node's idea of what gas price should be.

### GAS_ESTIMATOR_MODE

- Default: _automatic, based on chain ID_

Controls what type of gas estimator is used.

- `FixedPrice` uses static configured values for gas price (can be set via API call).
- `BlockHistory` dynamically adjusts default gas price based on heuristics from mined blocks.
- `Optimism` is a special mode only for use with older versions of the Optimism blockchain.
- `Optimism2` is a special mode only for use with current versions of the Optimism blockchain.

### BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE

- Default: _automatic, based on chain ID, typically 4_

Sets the maximum number of blocks to fetch in one batch in the block history estimator.
If the `BLOCK_HISTORY_ESTIMATOR_BATCH_SIZE` environment variable is set to 0, it defaults to ETH_RPC_DEFAULT_BATCH_SIZE.

### BLOCK_HISTORY_ESTIMATOR_BLOCK_HISTORY_SIZE

- Default: _automatic, based on chain ID_

Controls the number of past blocks to keep in memory to use as a basis for calculating a percentile gas price.

### BLOCK_HISTORY_ESTIMATOR_BLOCK_DELAY

- Default: _automatic, based on chain ID_

Controls the number of blocks that the block history estimator trails behind head.
For example, if this is set to 3, and we receive block 10, block history estimator will fetch block 7.

CAUTION: You might be tempted to set this to 0 to use the latest possible
block, but it is possible to receive a head BEFORE that block is actually
available from the connected node via RPC, due to race conditions in the code of the remote ETH node. In this case you will get false
"zero" blocks that are missing transactions.

### BLOCK_HISTORY_ESTIMATOR_TRANSACTION_PERCENTILE

- Default: `"60"`

Must be in range 0-100.

Only has an effect if gas updater is enabled. Specifies percentile gas price to choose. E.g. if the block history contains four transactions with gas prices `[100, 200, 300, 400]` then picking 25 for this number will give a value of 200. If the calculated gas price is higher than `ETH_GAS_PRICE_DEFAULT` then the higher price will be used as the base price for new transactions.

Think of this number as an indicator of how aggressive you want your node to price its transactions.

Setting this number higher will cause the Chainlink node to select higher gas prices.

Setting it lower will tend to set lower gas prices.

## EVM/Ethereum Transaction Simulation

Chainlink nodes support transaction simulation for certain types of job. When this is enabled, transactions will be simulated using `eth_call` before initial send. If the transaction would revert, the transaction is marked as an error without being broadcast, potentially avoiding an expensive on-chain revert.

This can add a tiny bit of latency with an upper bound of 2s, but generally much shorter under good conditions. This will add marginally more load to the ETH client, because it adds an extra call for every transaction sent. However, it might help to save gas in some cases especially during periods of high demand by avoiding unnecessary reverts due to outdated round etc.

This option is EXPERIMENTAL and disabled by default.

To enable for FM or OCR:

`FM_SIMULATE_TRANSACTIONs=true`
`OCR_SIMULATE_TRANSACTIONS=true`

To enable in the pipeline, use the `simulate=true` option like so:

```
submit [type=ethtx to="0xDeadDeadDeadDeadDeadDeadDeadDead" data="0xDead" simulate=true]
```

Use at your own risk.

#### FM_SIMULATE_TRANSACTIONS

NOTE: This overrides the setting for _all_ chains, it is not currently possible to configure this on a per-chain basis.

- Default: `"false"`

`FM_SIMULATE_TRANSACTIONS` allows to enable transaction simulation for Flux Monitor.

#### OCR_SIMULATE_TRANSACTIONS

NOTE: This overrides the setting for _all_ chains, it is not currently possible to configure this on a per-chain basis.

- Default: `"false"`

`OCR_SIMULATE_TRANSACTIONS` allows to enable transaction simulation for OCR.

## Job Pipeline and tasks

### DEFAULT_HTTP_ALLOW_UNRESTRICTED_NETWORK_ACCESS

- Default: `"false"`

By default, Chainlink nodes do not allow the `http` adapter to connect to local IP addresses for security reasons (because the URL can come from on-chain, which is an untrusted source). This can be overridden on a per-task basis by setting the `AllowUnrestrictedNetworkAccess` key, or globally by setting the environment variable `DEFAULT_HTTP_ALLOW_UNRESTRICTED_NETWORK_ACCESS=true`.

It is recommended that this be left disabled.

NOTE: In older versions of Chainlink, it was required to set this in order to allow connections to bridges/external adapters on the local network. This requirement has been lifted and this environment variable now applies ONLY to `http` tasks. `bridge` tasks are always allows to connect to the local network.

### DEFAULT_HTTP_LIMIT

- Default: `"32768"`

`DEFAULT_HTTP_LIMIT` defines the maximum number of bytes for HTTP requests and responses made by `http` and `bridge` adapters.

### DEFAULT_HTTP_TIMEOUT

- Default: `"15s"`

`DEFAULT_HTTP_TIMEOUT` defines the default timeout for HTTP requests made by `http` and `bridge` adapters.

### FEATURE_EXTERNAL_INITIATORS

- Default: `"false"`

Enables the External Initiator feature. If disabled, `webhook` jobs can ONLY be initiated by a logged-in user. If enabled, `webhook` jobs can be initiated by a whitelisted external initiator.

### JOB_PIPELINE_MAX_RUN_DURATION

- Default: `"10m"`

`JOB_PIPELINE_MAX_RUN_DURATION` is the maximum time that a single job run might take. If it takes longer, it will exit early and be marked errored. If set to zero, disables the time limit completely.

### JOB_PIPELINE_REAPER_INTERVAL

- Default: `"1h"`

In order to keep database size manageable, Chainlink nodes will run a reaper that deletes completed job runs older than a certain threshold age. `JOB_PIPELINE_REAPER_INTERVAL` controls how often the job pipeline reaper will run.

Set to `0` to disable the periodic reaper.

### JOB_PIPELINE_REAPER_THRESHOLD

- Default: `"24h"`

`JOB_PIPELINE_REAPER_THRESHOLD` determines the age limit for job runs. Completed job runs older than this will be automatically purged from the database.

### JOB_PIPELINE_RESULT_WRITE_QUEUE_DEPTH

- Default: `"100"`

Some jobs write their results asynchronously for performance reasons such as OCR. `JOB_PIPELINE_RESULT_WRITE_QUEUE_DEPTH` controls how many writes will be buffered before subsequent writes are dropped.

It is not recommended to change this setting unless you know what you are doing.

## OCR

This section applies only if you are running off-chain reporting jobs.

### FEATURE_OFFCHAIN_REPORTING

- Default: `"false"`

Set to `true` to enable OCR jobs.

### OCR_KEY_BUNDLE_ID

- Default: _none_

`OCR_KEY_BUNDLE_ID` is the default key bundle ID to use for OCR jobs. If you have an OCR job that does not explicitly specify a key bundle ID, it will fall back to this value.

### OCR_MONITORING_ENDPOINT

- Default: _none_

Optional URL of OCR monitoring endpoint.

### OCR_TRANSMITTER_ADDRESS

- Default: _none_

`OCR_TRANSMITTER_ADDRESS` is the default sending address to use for OCR. If you have an OCR job that does not explicitly specify a transmitter address, it will fall back to this value.

### P2P_NETWORKING_STACK

- Default: `"V1"`

OCR supports multiple networking stacks. `P2P_NETWORKING_STACK` chooses which stack to use. Possible values are:

- `V1`
- `V1V2` - Runs both stacks simultaneously and tries V2 first before falling back to V1. This is useful for migrating networks without downtime.
- `V2`

All nodes in the OCR network should share the same networking stack.

### Networking Stack V1

#### P2P_ANNOUNCE_IP

- Default: _none_

Should be set as the externally reachable IP address of the Chainlink node.

#### P2P_ANNOUNCE_PORT

- Default: _none_

Should be set as the externally reachable port of the Chainlink node.

#### P2P_BOOTSTRAP_PEERS

- Default: _none_

Default set of bootstrap peers.

#### P2P_LISTEN_IP

- Default: `"0.0.0.0"`

The default IP address to bind to.

#### P2P_LISTEN_PORT

- Default: _none_

The port to listen on. If left blank, the node randomly selects a different port each time it boots. It is highly recommended to set this to a static value to avoid network instability.

#### P2P_PEER_ID

- Default: _none_

The default peer ID to use for OCR jobs. If unspecified, uses the first available peer ID.

### Networking Stack V2

#### P2PV2_ANNOUNCE_ADDRESSES

- Default: _none_

`P2PV2_ANNOUNCE_ADDRESSES` contains the addresses the peer will advertise on the network in host:port form as accepted by net.Dial. The addresses should be reachable by peers of interest.

#### P2PV2_BOOTSTRAPPERS

- Default: _none_

`P2PV2_BOOTSTRAPPERS` returns the default bootstrapper peers for libocr's v2 networking stack.

#### P2PV2_LISTEN_ADDRESSES

- Default: _none_

`P2PV2_LISTEN_ADDRESSES` contains the addresses the peer will listen to on the network in host:port form as accepted by net.Listen, but host and port must be fully specified and cannot be empty.

## Keeper

### KEEPER_GAS_PRICE_BUFFER_PERCENT

- Default: `"20"`

`KEEPER_GAS_PRICE_BUFFER_PERCENT` adds the specified percentage to the gas price used for checking whether to perform an upkeep. Only applies in legacy mode (EIP-1559 off).

### KEEPER_GAS_TIP_CAP_BUFFER_PERCENT

- Default: `"20"`

`KEEPER_GAS_TIP_CAP_BUFFER_PERCENT` adds the specified percentage to the gas price used for checking whether to perform an upkeep. Only applies in EIP-1559 mode.

### KEEPER_MAXIMUM_GRACE_PERIOD
ADVANCED
It is not recommended to change this setting unless you know what you are doing.

- Default: `"100"`

The maximum number of blocks that a keeper will wait after performing an upkeep before it resumes checking that upkeep

### KEEPER_REGISTRY_CHECK_GAS_OVERHEAD
ADVANCED
It is not recommended to change this setting unless you know what you are doing.

- Default: `"200000"`

The amount of extra gas to provide checkUpkeep() calls to account for the gas consumed by the keeper registry.

### KEEPER_REGISTRY_PERFORM_GAS_OVERHEAD
ADVANCED
It is not recommended to change this setting unless you know what you are doing.

- Default: `"150000"`

The amount of extra gas to provide performUpkeep() calls to account for the gas consumed by the keeper registry

### KEEPER_REGISTRY_SYNC_INTERVAL
ADVANCED
It is not recommended to change this setting unless you know what you are doing.

- Default: `"30m"`

The interval in which the RegistrySynchronizer performs a full sync of the keeper registry contract it is tracking.

### KEEPER_REGISTRY_SYNC_UPKEEP_QUEUE_SIZE
ADVANCED
It is not recommended to change this setting unless you know what you are doing.

- Default: `"10"`

`KEEPER_REGISTRY_SYNC_UPKEEP_QUEUE_SIZE` represents the maximum number of upkeeps that can be synced in parallel.

## CLI Client

The environment variables in this section apply only when running CLI commands that connect to a remote running instance of a Chainlink node.

### ADMIN_CREDENTIALS_FILE

- Default: `$ROOT/apicredentials`

`ADMIN_CREDENTIALS_FILE` optionally points to a text file containing admin credentials for logging in. It is useful for running client CLI commands and has no effect when passed to a running node.

The file should contain two lines, the first line is the username and second line is the password.
e.g.
```
myusername@example.com
mysecurepassw0rd
```

### CLIENT_NODE_URL

- Default: `"http://localhost:6688"`

This is the URL that you will use to interact with the node, including the GUI. Use this URL to connect to the GUI or to run commands remotely using the Chainlink CLI.

### INSECURE_SKIP_VERIFY

- Default: `"false"`

`INSECURE_SKIP_VERIFY` disables SSL certificate verification when connection to a Chainlink node using the remote client. For example, when executing most remote commands in the CLI. This is mostly useful for people who want to use TLS on localhost.

It is not recommended to change this unless you know what you are doing.

## Notes on setting environment variables

> ⚠️ NOTE
> Some environment variables require a duration. A duration string is a possibly signed sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms", "-1.5h" or "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". Some examples:

`10ms`
`1h15m`
`42m30s`
