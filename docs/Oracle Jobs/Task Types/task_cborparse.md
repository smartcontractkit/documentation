---
layout: nodes.liquid
date: Last Modified
title: "CBOR Parse Task"
permalink: "docs/jobs/task-types/cborparse/"
---

CBOR Parse tasks parse a CBOR payload, typically as part of a Direct Request workflow. In Direct Request, a user makes an on-chain request using a `ChainlinkClient` contract, which encodes the request parameters as CBOR. See below for an example.

**Parameters**

- `data`: a byte array containing the CBOR payload.

**Outputs**

A map containing the request parameters. Parameters can be individually accessed using `$(dot.accessors)`.

**Example**

```jpv2
// First, we parse the request log and the CBOR payload inside of it
decode_log  [type="ethabidecodelog"
             data="$(jobRun.logData)"
             topics="$(jobRun.logTopics)"
             abi="SomeContractEvent(bytes32 requestID, bytes cborPayload)"]

decode_cbor [type="cborparse"
             data="$(decode_log.cborPayload)"]

// Then, we use the decoded request parameters to make an HTTP fetch
fetch [type="http" url="$(decode_cbor.fetchURL)" method=GET]
parse [type="jsonparse" path="$(decode_cbor.jsonPath)" data="$(fetch)"]

// ... etc ...
```

See the [Direct Request page](/docs/jobs/types/direct-request/) for a more comprehensive example.
