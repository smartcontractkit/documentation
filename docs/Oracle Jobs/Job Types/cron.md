---
layout: nodes.liquid
date: Last Modified
title: "Cron Jobs"
permalink: "docs/jobs/types/cron/"
---

Executes a job on a schedule. Does not rely on any kind of external trigger.

**Spec format**

```jpv2
type            = "cron"
schemaVersion   = 1
schedule        = "CRON_TZ=UTC * */20 * * * *"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F01"
observationSource   = """
    fetch    [type="http" method=GET url="https://chain.link/ETH-USD"]
    parse    [type="jsonparse" path="data,price"]
    multiply [type="multiply" times=100]

    fetch -> parse -> multiply
"""
```

**Shared fields**
See [shared fields](/docs/jobs/#shared-fields).

**Unique fields**

- `schedule`: the frequency with which the job is to be run. There are two ways to specify this:
    - Traditional UNIX cron format, but with 6 fields, not 5. The extra field allows for "seconds" granularity. **Note:** you _must_ specify the `CRON_TZ=...` parameter if you use this format.
    - `@` shorthand, e.g. `@every 1h`. This shorthand does not take account of the node's timezone, rather, it simply begins counting down the moment that the job is added to the node (or the node is rebooted). As such, no `CRON_TZ` parameter is needed.

For all supported schedules, please refer to the [cron library documentation](https://pkg.go.dev/github.com/robfig/cron?utm_source=godoc).

**Job type specific pipeline variables**

- `$(jobSpec.databaseID)`: the ID of the job spec in the local database. You shouldn't need this in 99% of cases.
- `$(jobSpec.externalJobID)`: the globally-unique job ID for this job. Used to coordinate between node operators in certain cases.
- `$(jobSpec.name)`: the local name of the job.
- `$(jobRun.meta)`: a map of metadata that can be sent to a bridge, etc.
