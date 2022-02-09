---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Direct Request Jobs"
permalink: "docs/jobs/types/direct-request/"
---

Executes a job upon receipt of an explicit request made by a user. The request is detected via a log emitted by an Oracle or Operator contract. This is similar to the legacy ethlog/runlog style of jobs.

**Spec format**

```jpv2
type                = "directrequest"
schemaVersion       = 1
name                = "example eth request event spec"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
# Optional externalJobID: Automatically generated if unspecified
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F02"
observationSource   = """
    ds          [type="http" method=GET url="http://example.com"]
    ds_parse    [type="jsonparse" path="USD"]
    ds_multiply [type="multiply" times=100]

    ds -> ds_parse -> ds_multiply
"""
```

**Shared fields**
See [shared fields](/docs/jobs/#shared-fields).

**Unique fields**

- `contractAddress`: the Oracle or Operator contract to monitor for requests.

**Job type specific pipeline variables**

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

**Single-Word Example**

First, let's assume that a user makes a request to the oracle using the following contract:

```solidity
contract MyClient is ChainlinkClient {
    function doRequest(uint256 _payment) public {
        Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.fulfill.selector);
        req.add("fetchURL", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        req.add("jsonPath", "USD");
        sendChainlinkRequest(req, _payment);
    }

    function fulfill(bytes32 requestID, uint256 answer) public {
        // ...
    }
}
```

This is a single-word response because aside from the `requestID`, the fulfill callback receives only a single-word argument in the `uint256 answer`. You can fulfill this request with a direct request job using the following pipeline:

```jpv2
// First, we parse the request log and the CBOR payload inside of it
decode_log  [type="ethabidecodelog"
             data="$(jobRun.logData)"
             topics="$(jobRun.logTopics)"
             abi="SomeContractEvent(bytes32 requestID, bytes cborPayload)"]

decode_cbor [type="cborparse"
             data="$(decode_log.cborPayload)"]

// Then, we use the decoded request parameters to make an HTTP fetch
fetch [type="http" method=GET url="$(decode_cbor.fetchURL)"]
parse [type="jsonparse" path="$(decode_cbor.jsonPath)" data="$(fetch)"]

// Finally, we send a response on-chain.
// Note that single-word responses automatically populate
// the requestId.
encode_response [type="ethabiencode"
                 abi="(uint256 data)"
                 data="{\\"data\\": $(parse) }"]

encode_tx       [type="ethabiencode"
                 abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                 data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_response)}"
                 ]

submit_tx  [type="ethtx" to="0x613a38AC1659769640aaE063C651F48E0250454C" data="$(encode_tx)"]

decode_log -> decode_cbor -> fetch -> parse -> encode_response -> encode_tx -> submit_tx
```

**Multi-Word Example**

Assume that a user wants to obtain the ETH price quoted against three different currencies. If they use only a single-word DR job, it would require three different requests. To make that more efficient, they can use multi-word responses to do it all in a single request as shown in the following example:

```solidity
contract MyClient is ChainlinkClient {
    function doRequest(uint256 _payment) public {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32("4b77c08653fa4350bdb22914bf5af04a"), address(this), this.fulfillMultipleParameters.selector);
        req.add("urlBTC", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC");
        req.add("pathBTC", "BTC");
        req.add("urlUSD", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        req.add("pathUSD", "USD");
        req.add("urlEUR", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR");
        req.add("pathEUR", "EUR");
        sendChainlinkRequest(req, 100000000000000000); // MWR API.
    }

    function fulfill(bytes32 requestID, uint256 usd, uint256 eur, uint256 jpy) public {
        // ...
    }
}
```

```jpv2
type                = "directrequest"
schemaVersion       = 1
name                = "example eth request event spec"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47"
observationSource   = """
       decode_log   [type="ethabidecodelog"
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]
    decode_cbor  [type="cborparse" data="$(decode_log.data)"]
    decode_log -> decode_cbor
    decode_cbor -> btc
    decode_cbor -> usd
    decode_cbor -> eur
    btc          [type="http" method=GET url="$(decode_cbor.urlBTC)" allowunrestrictednetworkaccess="true"]
    btc_parse    [type="jsonparse" path="$(decode_cbor.pathBTC)" data="$(btc)"]
    btc_multiply [type="multiply" input="$(btc_parse)", times="100000"]
    btc -> btc_parse -> btc_multiply
    usd          [type="http" method=GET url="$(decode_cbor.urlUSD)" allowunrestrictednetworkaccess="true"]
    usd_parse    [type="jsonparse" path="$(decode_cbor.pathUSD)" data="$(usd)"]
    usd_multiply [type="multiply" input="$(usd_parse)", times="100000"]
    usd -> usd_parse -> usd_multiply
    eur          [type="http" method=GET url="$(decode_cbor.urlEUR)" allowunrestrictednetworkaccess="true"]
    eur_parse    [type="jsonparse" path="$(decode_cbor.pathEUR)" data="$(eur)"]
    eurs_multiply [type="multiply" input="$(eur_parse)", times="100000"]
    eur -> eur_parse -> eurs_multiply
    btc_multiply -> encode_mwr
    usd_multiply -> encode_mwr
    eurs_multiply -> encode_mwr
    // MWR API does NOT auto populate the requestID.
    encode_mwr [type="ethabiencode"
                abi="(bytes32 requestId, uint256 _btc, uint256 _usd, uint256 _eurs)"
                data="{\\"requestId\\": $(decode_log.requestId), \\"_btc\\": $(btc_multiply), \\"_usd\\": $(usd_multiply), \\"_eurs\\": $(eurs_multiply)}"
                ]
    encode_tx  [type="ethabiencode"
                abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\":   $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_mwr)}"
                ]
    submit_tx  [type="ethtx" to="0x1C9AE012eC6aA5D2acDF20A57A887b4E8B6d5da4" data="$(encode_tx)" minConfirmations="2"]
    encode_mwr -> encode_tx -> submit_tx
"""
```

Multi-word response jobs like this, and also large response jobs need to use the [Operator contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol) as the on-chain contract that coordinates things between the consuming contract and the Chainlink node, as opposed to the legacy [Oracle contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/Oracle.sol).