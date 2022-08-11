---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'Direct Request Jobs'
permalink: 'docs/jobs/types/direct-request/'
---

Executes a job upon receipt of an explicit request made by a user. The request is detected via a log emitted by an Oracle or Operator contract. This is similar to the legacy ethlog/runlog style of jobs.

**Topics**

- [Spec format](#spec-format)
  - [Shared fields](#shared-fields)
  - [Unique fields](#unique-fields)
  - [Job type specific pipeline variables](#job-type-specific-pipeline-variables)
- [Examples](#examples)
  - [Get > Uint256 Job](#get--uint256-job)
  - [Get > String Job](#get--string-job)
  - [Get > Bytes Job](#get--bytes-job)
  - [Multi-Word Job](#multi-word-job)
  - [Existing Job](#existing-job)

## Spec format

```jpv2
type                = "directrequest"
schemaVersion       = 1
evmChainID          = 1
name                = "example eth request event spec"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"

# Optional fields:
# requesters        = [
#   "0xaaaa1F8ee20f5565510B84f9353F1E333E753B7a",
#   "0xbbbb70F0e81C6F3430dfdC9fa02fB22BdD818C4e"
# ]
# minContractPaymentLinkJuels = "100000000000000"
# externalJobID = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F02"
# minIncomingConfirmations = 10

observationSource   = """
    ds          [type="http" method=GET url="http://example.com"]
    ds_parse    [type="jsonparse" path="USD"]
    ds_multiply [type="multiply" times=100]

    ds -> ds_parse -> ds_multiply
"""
```

### Shared fields

See [shared fields](/docs/jobs/#shared-fields).

### Unique fields

- `contractAddress`: The Oracle or Operator contract to monitor for requests
- `requesters`: Optional - Allows whitelisting requesters
- `minContractPaymentLinkJuels` Optional - Allows you to specify a job-specific minimum contract payment
- `minIncomingConfirmations` Optional - Allows you to specify a job-specific `MIN_INCOMING_CONFIRMATIONS` value, must be greater than or equal to 1

### Job type specific pipeline variables

- `$(jobSpec.databaseID)`: the ID of the job spec in the local database. You shouldn't need this in 99% of cases.
- `$(jobSpec.externalJobID)`: the globally-unique job ID for this job. Used to coordinate between node operators in certain cases.
- `$(jobSpec.name)`: the local name of the job.
- `$(jobRun.meta)`: a map of metadata that can be sent to a bridge, etc.
- `$(jobRun.logBlockHash)`: the block hash in which the initiating log was received.
- `$(jobRun.logBlockNumber)`: the block number in which the initiating log was received.
- `$(jobRun.logTxHash)`: the transaction hash that generated the initiating log.
- `$(jobRun.logAddress)`: the address of the contract to which the initiating transaction was sent.
- `$(jobRun.logTopics)`: the log's topics (`indexed` fields).
- `$(jobRun.logData)`: the log's data (non-`indexed` fields).
- `$(jobRun.blockReceiptsRoot)` : the root of the receipts trie of the block (hash).
- `$(jobRun.blockTransactionsRoot)` : the root of the transaction trie of the block (hash).
- `$(jobRun.blockStateRoot)` : the root of the final state trie of the block (hash).

## Examples

### Get > Uint256 Job

Let's assume that a user makes a request to an oracle to call a public API, retrieve a number from the response, remove any decimals and return _uint256_.

- The smart contract example can be found [here](/docs/single-word-response/).
- The job spec example can be found [here](/docs/direct-request-get-uint256/).

### Get > Int256 Job

Let's assume that a user makes a request to an oracle to call a public API, retrieve a number from the response, remove any decimals and return _int256_.

- The job spec example can be found [here](/docs/direct-request-get-int256/).

### Get > Bool Job

Let's assume that a user makes a request to an oracle to call a public API, retrieve a boolean from the response and return _bool_.

- The job spec example can be found [here](/docs/direct-request-get-bool/).

### Get > String Job

Let's assume that a user makes a request to an oracle and would like to fetch a _string_ from the response.

- The smart contract example can be found [here](/docs/api-array-response/).
- The job spec example can be found [here](/docs/direct-request-get-string/).

### Get > Bytes Job

Let's assume that a user makes a request to an oracle and would like to fetch _bytes_ from the response (meaning a response that contains an arbitrary-length raw byte data).

- The smart contract example can be found [here](/docs/large-responses/).
- The job spec example can be found [here](/docs/direct-request-get-bytes/).

### Multi-Word Job

Let's assume that a user makes a request to an oracle and would like to fetch multiple words in one single request.

- The smart contract example can be found [here](/docs/multi-variable-responses/).
- The job spec example can be found [here](/docs/direct-request-multi-word/).

### Existing Job

Using an _existing_ Oracle Job makes your smart contract code more succinct. Let's assume that a user makes a request to an oracle that leverages [Etherscan External Adapter](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/sources/etherscan) to retrieve the gas price.

- The smart contract example can be found [here](/docs/existing-job-request/).
- The job spec example can be found [here](/docs/direct-request-existing-job/).
