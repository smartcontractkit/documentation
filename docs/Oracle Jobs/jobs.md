---
layout: nodes.liquid
date: Last Modified
title: "Jobs"
permalink: "docs/jobs/"
whatsnext: {"Tasks":"/docs/tasks/"}
---

## What is a Job?

NOTE: This page refers to the latest version of Chainlink jobs (otherwise known as TOML, or V2 jobs). For documentation on the legacy job format, see [V1 job specs](/docs/job-specifications).

Chainlink nodes require jobs to be added to do anything useful, for example, generating verifiable randomness or posting asset price data on-chain. There are various job types, including:

- `cron`
- `directrequest`
- `fluxmonitor`
- `keeper`
- `offchainreporting`
- `randomnesslog`

Jobs are represented by TOML specifications. Examples for each type can be found below.

---

## Job types

### Shared fields

- `name`: the name of the job in the Operator UI.
- `type`: specifies the v2 job type. Can be one of the following:
    - `cron`
    - `directrequest`
    - `fluxmonitor`
    - `keeper`
    - `offchainreporting`
    - `randomnesslog`
- `schemaVersion`: not currently used, but must be present and set to a value of `1`. Will allow us to handle progressive iterations of the job spec format gracefully with backwards-compatibility.
- `observationSource`: the v2 pipeline task DAG. Specified in DOT syntax. See below for information on writing pipeline DAGs.
- `maxTaskDuration`: the default maximum duration that any given task is allowed to run. If the duration is exceeded, the task is errored. This value can be overridden per-task (see subsequent sections).

### Cron

Executes a job on a schedule. Does not rely on any kind of external trigger.

```toml
type            = "cron"
schemaVersion   = 1
schedule        = "0 0 0 1 1 *"
observationSource   = """
ds          [type=http method=GET url="https://chain.link/ETH-USD"];
ds_parse    [type=jsonparse path="data,price"];
ds_multiply [type=multiply times=100];
ds -> ds_parse -> ds_multiply;
"""
```

- `schedule`: the frequency with which the job is to be run, specified in traditional UNIX cron format (but with 6 fields, not 5. The extra field allows for "seconds" granularity). You can also use e.g. `@every 1h` if you just want something executed on a regular interval, but the wall clock time is not important.

For all supported schedules, please refer to the [cron library documentation](https://pkg.go.dev/github.com/robfig/cron?utm_source=godoc).

### Direct request (eth log)

Executes a job upon receipt of an explicit request made by a user. The request is detected via a log emitted by an Oracle or Operator contract. This is similar to the legacy ethlog/runlog style of jobs.

```toml
type                = "directrequest"
schemaVersion       = 1
name                = "example eth request event spec"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
jobID               = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"
observationSource   = """
    ds1          [type=http method=GET url="http://example.com"]; 
    ds1_parse    [type=jsonparse path="USD"];
    ds1_multiply [type=multiply times=100];
    ds1 -> ds1_parse -> ds1_multiply;
"""
```

- `contractAddress`: the Oracle or Operator contract to monitor for requests.
- `jobID`: the unique, global ID of the job.

### Flux Monitor

The Flux Monitor job type is for continually-updating data feeds that aggregate responses from multiple oracles. The oracles servicing the feed submit rounds based on several triggers:

- An occasional poll, which must show that there has been sufficient deviation from an off-chain data source before a new result is submitted
- A heartbeat (the "idle timer"), which ensures that even if no deviation occurs, we submit a new result to prove liveness.
- New rounds initiated by other oracles on the feeds. If another oracle notices sufficient deviation, all other oracles will submit their current observations as well.

```toml
type              = "fluxmonitor"
schemaVersion     = 1
name              = "example flux monitor spec"
contractAddress   = "0x3cCad4715152693fE3BC4460591e3D3Fbd071b42"

precision = 2
threshold = 0.5
absoluteThreshold = 0.0 # optional

idleTimerPeriod = "1s"
idleTimerDisabled = false

pollTimerPeriod = "1m"
pollTimerDisabled = false

observationSource = """
// data source 1
ds1 [type=http method=GET url="https://pricesource1.com" requestData="{\\"coin\\": \\"ETH\\", \\"market\\": \\"USD\\"}"];
ds1_parse [type=jsonparse path="latest"];

// data source 2
ds2 [type=http method=GET url="https://pricesource1.com" requestData="{\\"coin\\": \\"ETH\\", \\"market\\": \\"USD\\"}"];
ds2_parse [type=jsonparse path="latest"];

ds1 -> ds1_parse -> answer1;
ds2 -> ds2_parse -> answer1;

answer1 [type=median index=0];
"""
```

- `contractAddress`: the address of the FluxAggregator contract that manages the feed.
- `precision`: the number of decimal places to be associated the integer value submitted on-chain.
- `threshold`: the percentage threshold of deviation from the previous on-chain answer that must be observed before a new set of observations are submitted to the contract.
- `absoluteThreshold`: the absolute numerical deviation that must be observed from the previous on-chain answer before a new set of observations are submitted to the contract. This is primarily useful with data that can legitimately sometimes hit 0, as it's impossible to calculate a percentage deviation from 0.
- `idleTimerPeriod`: the amount of time (after the successful completion of a round) after which a new round will be automatically initiated, regardless of any observed off-chain deviation.
- `idleTimerDisabled`: whether the heartbeat/idle timer is used to trigger new rounds.
- `pollTimerPeriod`: the frequency with which the off-chain data source is checked for deviation against the previously submitted on-chain answer.
- `pollTimerDisabled`: whether the occasional deviation check is used to trigger new rounds.
- **Notes:**
    - For duration parameters, the maximum unit of time is `h` (hour). Durations of a day or longer must be expressed in hours.
    - If no time unit is provided, the default unit is nanoseconds, which is almost never what you want.

### Keeper

Keeper jobs occasionally poll a smart contract method that expresses whether something in the contract is ready for some on-chain action to be performed. When it's ready, the job executes that on-chain action. Examples:

- Liquidations
- Rebalancing portfolios

```toml
type            = "keeper"
schemaVersion   = 1
name            = "example keeper spec"
contractAddress = "0x9E40733cC9df84636505f4e6Db28DCa0dC5D1bba"
fromAddress     = "0xa8037A20989AFcBC51798de9762b351D63ff462e"
```

- `contractAddress`: the address of the contract to poll and update.
- `fromAddress`: the address from which to send updates.

### Off-chain Reporting

OCR jobs are currently used very similarly to Flux Monitor jobs: they update price feeds with aggregated data from many Chainlink oracle nodes. However, they do this aggregation using a cryptographically-secure off-chain protocol that makes it possible for only a single node to submit all answers from all participating nodes during each round (with proofs that the other nodes' answers were legitimately provided by those nodes), which saves a significant amount of gas.

#### Bootstrap node

Every OCR cluster requires at least one bootstrap node as a kind of "rallying point" that enables the other nodes to find one another. Bootstrap nodes do not participate in the aggregation protocol and do not submit answers to the feed.

```toml
type               = "offchainreporting"
schemaVersion      = 1
contractAddress    = "0x27548a32b9aD5D64c5945EaE9Da5337bc3169D15"
p2pBootstrapPeers  = [
    "/dns4/chain.link/tcp/1234/p2p/16Uiu2HAm58SP7UL8zsnpeuwHfytLocaqgnyaYKP8wu7qRdrixLju",
]
isBootstrapPeer = true
```

- `p2pBootstrapPeers`: a list of libp2p dial addresses of the other bootstrap nodes helping oracle nodes find one another on the network.

#### Oracle node

Oracle nodes, on the other hand, are responsible for submitting answers. 

```toml
type               = "offchainreporting"
schemaVersion      = 1
name               = "web oracle spec"
contractAddress    = "0x613a38AC1659769640aaE063C651F48E0250454C"
p2pPeerID          = "12D3KooWApUJaQB2saFjyEUfq6BmysnsSnhLnY5CF9tURYVKgoXK"
p2pBootstrapPeers  = [
    "/dns4/chain.link/tcp/1234/p2p/16Uiu2HAm58SP7UL8zsnpeuwHfytLocaqgnyaYKP8wu7qRdrixLju",
]
isBootstrapPeer    = false
keyBundleID        = "7f993fb701b3410b1f6e8d4d93a7462754d24609b9b31a4fe64a0cb475a4d934"
monitoringEndpoint = "chain.link:4321"
transmitterAddress = "0xF67D0290337bca0847005C7ffD1BC75BA9AAE6e4"
observationTimeout = "10s"
blockchainTimeout  = "20s"
contractConfigTrackerSubscribeInterval = "2m"
contractConfigTrackerPollInterval = "1m"
contractConfigConfirmations = 3
observationSource = """
    // data source 1
    ds1          [type=bridge name=voter_turnout];
    ds1_parse    [type=jsonparse path="one,two"];
    ds1_multiply [type=multiply times=1.23];

    // data source 2
    ds2          [type=http method=GET url="https://chain.link/voter_turnout/USA-2020" requestData="{\\"hi\\": \\"hello\\"}"];
    ds2_parse    [type=jsonparse path="three,four"];
    ds2_multiply [type=multiply times=4.56];

    ds1 -> ds1_parse -> ds1_multiply -> answer1;
    ds2 -> ds2_parse -> ds2_multiply -> answer1;

    answer1 [type=median                      index=0];
    answer2 [type=bridge name=election_winner index=1];
"""
```

- `p2pPeerId`: the base58-encoded libp2p public key of this node.
- `p2pBootstrapPeers`: a list of libp2p dial addresses of the other bootstrap nodes helping oracle nodes find one another on the network.
- `keyBundleID`: the hash of the OCR key bundle to be used by this node (the Chainlink node keystore manages these key bundles — use the subcommands under `chainlink keys ocr` to interact with them or use the Operator UI).
- `monitoringEndpoint`: the URL of the telemetry endpoint to send OCR metrics to.
- `transmitterAddress`: the Ethereum address from which to send aggregated submissions to the OCR contract.
- `observationTimeout`: the maximum duration to wait before an off-chain request for data is considered to be failed/unfulfillable.
- `blockchainTimeout`: the maximum duration to wait before an on-chain request for data is considered to be failed/unfulfillable.
- `contractConfigTrackerSubscribeInterval`: the interval at which to retry subscribing to on-chain config changes if a subscription has not yet successfully been made.
- `contractConfigTrackerPollInterval`: the interval at which to proactively poll the on-chain config for changes.
- `contractConfigConfirmations`: the number of blocks to wait after an on-chain config change before considering it worthy of acting upon.

### VRF

```toml
uuid = "123e4567-e89b-12d3-a456-426655440000"
type = "randomnesslog"
schemaVersion = 1
name = "vrf-primary"
coordinatorAddress = "0xaba5edc1a551e55b1a570c0e1f1055e5be11eca7"
confirmations = 6
publicKey = "0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F8179800"
observationSource="""
getrandomvalue [type=vrf];
"""
```

- `uuid`: the globally-unique ID of the job. User-specified or randomly-generated.
- `coordinatorAddress`: the address of the VRFCoordinator contract coordinating requests and responses for randomness.
- `confirmations`: the number of blocks to wait before a request is considered final enough to be worth responding to.
- `publicKey`: the public key of the VRF keypair securing the randomness response.

---

## Writing pipelines

Pipelines are composed of tasks arranged in a DAG (directed acyclic graph) expressed in DOT syntax:

[DOT (graph description language) - Wikipedia](https://en.wikipedia.org/wiki/DOT_%28graph_description_language%29#Directed_graphs)

Each node in the graph is a task, and has both a user-specified ID as well as a set of configuration parameters/attributes:

```dot
my_fetch_task [type="http" method="get" url="https://chain.link/eth_usd"]
```

The edges between tasks define how data flows from one task to the next. Some tasks can have multiple inputs (such as `median`), while others are limited to 0 (`http`) or 1 (`jsonparse`).

```dot
data_source_1  [type="http" method="get" url="https://chain.link/eth_usd"]
data_source_2  [type="http" method="get" url="https://coingecko.com/eth_usd"]
medianize_data [type="median"]
submit_to_ea   [type="bridge" name="my_bridge"]

data_source_1 -> medianize_data
data_source_2 -> medianize_data
medianize_data -> submit_to_ea
```

![DAG Example](dag_example.png)
