---
layout: nodes.liquid
date: Last Modified
title: "Flux Monitor Jobs"
permalink: "docs/jobs/types/flux-monitor/"
---

The Flux Monitor job type is for continually-updating data feeds that aggregate responses from multiple oracles. The oracles servicing the feed submit rounds based on several triggers:

- An occasional poll, which must show that there has been sufficient deviation from an off-chain data source before a new result is submitted
- New rounds initiated by other oracles on the feeds. If another oracle notices sufficient deviation, all other oracles will submit their current observations as well.
- A heartbeat, which ensures that even if no deviation occurs, we submit a new result to prove liveness. This can take one of two forms:
    - The "idle timer", which begins counting down each time a round is completed
    - The "drumbeat", which simply ticks at a steady interval, much like a `cron` job

**Spec format**

```toml
type              = "fluxmonitor"
schemaVersion     = 1
name              = "example flux monitor spec"
contractAddress   = "0x3cCad4715152693fE3BC4460591e3D3Fbd071b42"
externalJobID     = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F03"

threshold = 0.5
absoluteThreshold = 0.0 # optional

idleTimerPeriod   = "1s"
idleTimerDisabled = false

pollTimerPeriod   = "1m"
pollTimerDisabled = false

drumbeatEnabled  = true
drumbeatSchedule = "CRON_TZ=UTC * */20 * * * *"

observationSource = """
    // data source 1
    ds1 [type=http method=GET url="https://pricesource1.com"
         requestData=<{"coin": "ETH", "market": "USD"}>]
    ds1_parse [type=jsonparse path="data,result"]

    // data source 2
    ds2 [type=http method=GET url="https://pricesource2.com"
         requestData=<{"coin": "ETH", "market": "USD"}>]
    ds2_parse [type=jsonparse path="data,result"]

    ds1 -> ds1_parse -> medianized_answer
    ds2 -> ds2_parse -> medianized_answer

    medianized_answer [type=median]
"""
```

**Shared fields**
See [shared fields](/docs/jobs/#shared-fields).

**Unique Fields**

- `contractAddress`: the address of the FluxAggregator contract that manages the feed.
- `threshold`: the percentage threshold of deviation from the previous on-chain answer that must be observed before a new set of observations are submitted to the contract.
- `absoluteThreshold`: the absolute numerical deviation that must be observed from the previous on-chain answer before a new set of observations are submitted to the contract. This is primarily useful with data that can legitimately sometimes hit 0, as it's impossible to calculate a percentage deviation from 0.
- `idleTimerPeriod`: the amount of time (after the successful completion of a round) after which a new round will be automatically initiated, regardless of any observed off-chain deviation.
- `idleTimerDisabled`: whether the idle timer is used to trigger new rounds.
- `drumbeatEnabled`: whether the drumbeat is used to trigger new rounds.
- `drumbeatSchedule`: the cron schedule of the drumbeat. This field supports the same syntax as the cron job type (see the [cron library documentation](https://pkg.go.dev/github.com/robfig/cron?utm_source=godoc) for details). CRON_TZ is required.
- `pollTimerPeriod`: the frequency with which the off-chain data source is checked for deviation against the previously submitted on-chain answer.
- `pollTimerDisabled`: whether the occasional deviation check is used to trigger new rounds.
- **Notes:**
    - For duration parameters, the maximum unit of time is `h` (hour). Durations of a day or longer must be expressed in hours.
    - If no time unit is provided, the default unit is nanoseconds, which is almost never what you want.

**Job type specific pipeline variables**

- `$(jobSpec.databaseID)`: the ID of the job spec in the local database. You shouldn't need this in 99% of cases.
- `$(jobSpec.externalJobID)`: the globally-unique job ID for this job. Used to coordinate between node operators in certain cases.
- `$(jobSpec.name)`: the local name of the job.
- `$(jobRun.meta)`: a map of metadata that can be sent to a bridge, etc.
