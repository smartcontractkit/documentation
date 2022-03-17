---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "v2 Jobs"
permalink: "docs/jobs/"
---

> ✅ NOTE
>
> This page describes v2 Chainlink jobs. In the Operator UI interface, these are called TOML jobs. The v1 jobs are removed in Chainlink nodes versioned 1.0.0 and later. To learn how to migrate your v1 jobs to v2 jobs, see [Migrating to v2 Jobs](../jobs/migration-v1-v2/). If you still need to use v1 jobs on older versions of Chainlink nodes, see the [v1 Jobs](../job-specifications/) documentation.

## What is a Job?

Chainlink nodes require jobs to do anything useful. For example, posting asset price data on-chain requires jobs. Chainlink nodes support the following job types:

- [`cron`](./types/cron/)
- [`directrequest`](./types/direct-request/)
- [`fluxmonitor`](./types/flux-monitor/)
- [`keeper`](./types/keeper/)
- [`offchainreporting`](./types/offchain-reporting/)
- [`webhook`](./types/webhook/)

Jobs are represented by TOML specifications.

## Example v2 job spec

The following is an example `cron` job spec. This is a simple spec that you can add to a node:

```jpv2
type            = "cron"
schemaVersion   = 1
schedule        = "CRON_TZ=UTC 0 0 1 1 *"
# Optional externalJobID: Automatically generated if unspecified
# externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"
observationSource   = """
ds          [type="http" method=GET url="https://chain.link/ETH-USD"];
ds_parse    [type="jsonparse" path="data,price"];
ds_multiply [type="multiply" times=100];
ds -> ds_parse -> ds_multiply;
"""
```

## Shared fields

Every job type supported by a node shares the following TOML fields:

- `name`: The name of the job in the Operator UI
- `type`: Specifies the v2 job type, which can be one of the following:
    - `cron`
    - `directrequest`
    - `fluxmonitor`
    - `keeper`
    - `offchainreporting`
    - `webhook`
- `schemaVersion`: Must be present and set to a value of `1`. This field will handle progressive iterations of the job spec format gracefully with backwards-compatibility.
- `observationSource`: The v2 pipeline task DAG, which is specified in DOT syntax. See below for information on writing pipeline DAGs.
- `maxTaskDuration`: The default maximum duration that any task is allowed to run. If the duration is exceeded, the task is errored. This value can be overridden on a per-task basis using the `timeout` attribute. See the [Shared attributes](../tasks/#shared-attributes) section for details.
- `externalJobID`: An optional way for a user to deterministically provide the ID of a job. The ID must be unique. For example, you can specify an `externalJobID` if you want to run the same `directrequest` job on two different Chainlink nodes with different bridge names. The spec contents differ slightly, but you can use the same `externalJobID` on both jobs, specify that in your on-chain requests, and both nodes will pick it up. If you do not provide an `externalJobID`, the node generates the ID for you.
