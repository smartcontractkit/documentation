---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "API Reference"
permalink: "docs/chainlink-framework/"
---
API reference for <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.6/ChainlinkClient.sol" target="_blank">`ChainlinkClient`</a>.

# Index

##  Methods
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "4-0": "**<a href=\"#sendchainlinkrequest\">sendChainlinkRequest</a>**",
    "4-1": "Sends the request payload to the stored address stored as `chainlinkOracleAddress`",
    "6-0": "**<a href=\"#validatechainlinkcallback\">validateChainlinkCallback</a>**",
    "6-1": "Secures the fulfillment callback to make sure it is only called by permissioned senders",
    "9-1": "Looks up the addresses of the LINK token and Oracle contract through ENS",
    "9-0": "**<a href=\"#usechainlinkwithens\">useChainlinkWithENS</a>**",
    "10-1": "Updates the stored oracle address with the latest address resolved through ENS",
    "10-0": "**<a href=\"#updatechainlinkoraclewithens\">updateChainlinkOracleWithENS</a>**",
    "1-0": "**<a href=\"#setchainlinktoken\">setChainlinkToken</a>**",
    "3-0": "**<a href=\"#buildchainlinkrequest\">buildChainlinkRequest</a>**",
    "3-1": "Instantiates a Request object with the required parameters",
    "1-1": "Sets the stored address for the LINK token",
    "0-0": "**<a href=\"#setchainlinkoracle\">setChainlinkOracle</a>**",
    "0-1": "Sets the stored address for the oracle contract",
    "5-0": "**<a href=\"#sendchainlinkrequestto\">sendChainlinkRequestTo</a>**",
    "5-1": "Sends a request to the oracle address specified",
    "8-0": "**<a href=\"#cancelchainlinkrequest\">cancelChainlinkRequest</a>**",
    "8-1": "Cancels Chainlink requests attempting to contact an unresponsive node",
    "11-0": "**<a href=\"#chainlinktokenaddress\">chainlinkTokenAddress</a>**",
    "11-1": "Returns the stored address of the LINK token",
    "12-0": "**<a href=\"#chainlinkoracleaddress\">chainlinkOracleAddress</a>**",
    "12-1": "Returns the stored address of the oracle contract",
    "7-0": "**<a href=\"#addchainlinkexternalrequest\">addChainlinkExternalRequest</a>**",
    "7-1": "Allows a Chainlinked contract to track unfulfilled requests that it hasn't created itself",
    "2-0": "**<a href=\"#setpublicchainlinktoken\">setPublicChainlinkToken</a>**",
    "2-1": "Sets the LINK token address for the detected public network"
  },
  "cols": 2,
  "rows": 13
}
[/block]

## Events

[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "**<a href=\"#chainlinkrequested\">ChainlinkRequested</a>**",
    "1-0": "**<a href=\"#chainlinkfulfilled\">ChainlinkFulfilled</a>**",
    "2-0": "**<a href=\"#chainlinkcancelled\">ChainlinkCancelled</a>**",
    "0-1": "Emitted from a Chainlinked contract when a request is sent to an oracle",
    "1-1": "Emitted from a Chainlinked contract when a request is fulfilled by an oracle",
    "2-1": "Emitted from a Chainlinked contract when a request is cancelled"
  },
  "cols": 2,
  "rows": 3
}
[/block]

## Modifiers

[block:parameters]
{
  "data": {
    "0-0": "**<a href=\"#recordchainlinkfulfillment\">recordChainlinkFulfillment</a>**",
    "0-1": "Used on fulfillment callbacks to ensure that the caller and `requestId` are valid. This is the modifier equivalent of the method `validateChainlinkCallback`",
    "h-0": "Name",
    "h-1": "Description"
  },
  "cols": 2,
  "rows": 1
}
[/block]

## Constants
[block:callout]
{
  "type": "warning",
  "title": "Namechange Between Versions",
  "body": "From Solidity v0.7 onwards, this constant is renamed to `LINK_DIVISIBILITY`."
}
[/block]

[block:parameters]
{
  "data": {
    "0-0": "**<a href=\"#LINK\">LINK</a>**",
    "0-1": "Helper uint256 to represent the divisibility of a LINK token. Equivalent to 10^18",
    "h-0": "Name",
    "h-1": "Description"
  },
  "cols": 2,
  "rows": 1
}
[/block]

## Structs

[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "**<a href=\"#chainlinkrequest\">Chainlink.Request</a>**",
    "0-1": "All of the parameters that can be passed over in a Chainlink request"
  },
  "cols": 2,
  "rows": 1
}
[/block]

# Methods


Below you'll find each helper explained in greater detail alongside respective implementation examples to help you leverage these methods once you start building your own Chainlinked contract.

After the function signature and a short description, two code examples are provided, one focusing on the exact usage of the method and one where the helper is presented in the context of a full contract.

## setChainlinkOracle

```javascript
function setChainlinkOracle(
  address _oracle
)
```

Sets a private storage variable provided for convenience if your contract only needs to talk to one oracle and you do not want to specify it on every request. Once an oracle is set with `setChainlinkOracle` that is the address used with [sendChainlinkRequest](#sendchainlinkrequest).

Retrieve the oracle address using [chainlinkOracleAddress](#chainlinkoracleaddress). These getters and setters are provided to enforce that changes to the oracle are explicitly made in the code.
[block:code]
{
  "codes": [
    {
      "code": "constructor(address _oracle)\n  public\n{\n  setChainlinkOracle(_oracle);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    \n    // record an oracle in storage for convenience\n    //   so that you don't have to specify it on every request\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

## setChainlinkToken

```javascript
setChainlinkToken(
  address _link
)
```

Sets the stored address for the LINK token which is used to send requests to Oracles. There are different token addresses on different network. See [Addresses & Job IDs](../addresses-and-job-ids/) for the address of the LINK token on the network you're deploying to.
[block:code]
{
  "codes": [
    {
      "code": "constructor(address _link)\n  public\n{\n  setChainlinkToken(_link);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    // set the address of the Chainlink token\n    //   because it is different on different networks\n    setChainlinkToken(_link);\n    \n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

## setPublicChainlinkToken

```javascript
setPublicChainlinkToken()
```

Sets the stored address for the LINK token based on the public network that the contract is deployed on. This method will only set the LINK token address if the calling contract is on a public network.
[block:code]
{
  "codes": [
    {
      "code": "constructor(address _link)\n  public\n{\n  if(_link == address(0)) {\n    setPublicChainlinkToken();\n  } else {\n    setChainlinkToken(_link);\n  }\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    // If the address passed in for _link is zero\n    if(_link == address(0)) {\n      // Detect what public network the contract is on\n      setPublicChainlinkToken();\n    } else {\n      // Otherwise set the address to what was passed in\n      setChainlinkToken(_link);\n    }\n    \n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

## buildChainlinkRequest

```javascript
function buildChainlinkRequest(
    bytes32 _jobId,
    address _callbackAddress,
    bytes4 _callbackFunctionSignature
) returns (Chainlink.Request memory request)
```

Instantiates a Request from the Chainlink contract. A [Request](#chainlinkrequest) is a struct which contains the necessary parameters to be sent to the oracle contract. The `buildChainlinkRequest` function takes an ID, which can be a [Job ID](../job-specifications/), a callback address to receive the resulting data, and a callback function signature to call on the callback address.
[block:code]
{
  "codes": [
    {
      "code": "function requestPrice()\n  public\n{\n  bytes32 jobId = \"493610cff14346f786f88ed791ab7704\";\n  bytes4 selector = this.myCallback.selector;\n  // build a request that calls the myCallback function defined\n  //   below by specifying the address of this contract and the function\n  //   selector of the myCallback\n  Chainlink.Request memory request = buildChainlinkRequest(\n    jobId,\n    this,\n    selector);\n\n  uint256 paymentAmount = 1 * LINK;\n  sendChainlinkRequest(request, paymentAmount);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    // build a request that calls the myCallback function defined\n    //   below by specifying the address of this contract and the function\n    //   selector of the myCallback\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n    // send the request you just built\n    sendChainlinkRequest(req, PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

## sendChainlinkRequest

```javascript
function sendChainlinkRequest(
    Chainlink.Request memory _req,
    uint256 _payment
) returns (bytes32 requestId)
```

Sends the request payload to the stored oracle address. It takes a [Chainlink.Request](#chainlinkrequest) and the amount of LINK to send amount as parameters. The request is serialized and calls `oracleRequest` on the address stored in `chainlinkOracleAddress` via the LINK token's `transferAndCall` method.

`sendChainlinkRequest` returns the ID of the request. If your application needs to, your contract can store that ID, but you don't need to. The ChainlinkClient helpers will store the ID under the hood, along with the oracle address, and use them when you call `recordChainlinkFulfillment` in your callback function to make sure only that the address you want can call your Chainlink callback function.

`sendChainlinkRequest` emits a [ChainlinkRequested](#chainlinkrequested) event containing the request ID, if you would like to use it in your Web3 application.
[block:code]
{
  "codes": [
    {
      "code": "function requestPrice()\n  public\n{\n  Chainlink.Request memory request = buildChainlinkRequest(jobId, this, this.callback.selector);\n  uint256 paymentAmount = 1 * LINK;\n\n  // send the request that you just built\n  sendChainlinkRequest(request, paymentAmount);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  bytes32 latestRequestId;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n    // send the request you just built\n    // optionally, save the request ID if you need to differentiate\n    //   between different requests that you've made\n    latestRequestId = sendChainlinkRequest(req, PAYMENT);\n  }\n\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n\n    if (_requestId == latestRequestId) { // use the saved request ID \n      latestPrice = _price;\n    }\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

## sendChainlinkRequestTo

```javascript
function sendChainlinkRequestTo(
  address _oracle,
  Chainlink.Request memory _req,
  uint256 _payment
) returns (bytes32 requestId)
```

Similar to [sendChainlinkRequest](#sendchainlinkrequest), `sendChainlinkRequestTo` sends a [Request](#chainlinkrequest) but allows the target oracle to be specified. It requires an address, a Request, and an amount, and returns the `requestId`. This allows a requesting contract to create and track requests sent to multiple oracle contract addresses.

`sendChainlinkRequestTo` emits a [ChainlinkRequested](#chainlinkrequested) event containing the request ID, if you would like to use it in your Web3 application.
[block:code]
{
  "codes": [
    {
      "code": "function requestPriceFrom(address _oracle)\n  public\n{\n  Chainlink.Request memory request = buildChainlinkRequest(jobId, this, this.callback.callbackSelector);\n  uint256 paymentAmount = 1 * LINK;\n\n  // send the request that you just built to a specified oracle\n  sendChainlinkRequestTo(_oracle, request, paymentAmount);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient, RateCalculator {\n  uint256 constant PAYMENT = 1 * LINK;\n  address[3] public oracles = [\n    0xc99B3D447826532722E41bc36e644ba3479E4365,\n    0x1948C20CC492539968BB9b041F96D6556B4b7001,\n    0x83F00b902cbf06E316C95F51cbEeD9D2572a349a\n  ];\n  bytes32[3] public jobIds = [\n    bytes32(\"493610cff14346f786f88ed791ab7704\"),\n    bytes32(\"80fecd06d2e14c67a22cee5f9728e067\"),\n    bytes32(\"c179a8180e034cf5a341488406c32827\")\n  ];\n  uint256[3] public latestPriceAverage;\n  \n  constructor(address _link) {\n    setChainlinkToken(_link);\n  }\n  \n  function requestPrice() public {\n    Chainlink.Request memory req;\n    for (uint i = 0; i < oracles.length; i++) {\n      req = buildChainlinkRequest(jobIds[i], this, this.myCallback.selector);\n      \n      // request a rate from each oracle in the list\n      sendChainlinkRequestTo(oracles[i], req, PAYMENT);\n    }\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n\n    // calculateRate is an example method introduced by the RateCalculator\n    //   contract which calculates an average and then returns it to be\n    //   stored as latestPriceAverage\n    latestPriceAverage = calculateRate(_price);\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]
## validateChainlinkCallback

```javascript
function validateChainlinkCallback(
    bytes32 _requestId
)
```

Used on fulfillment callbacks to ensure that the caller and `requestId` are valid. They protect ChainlinkClient callbacks from being called by malicious callers. `validateChainlinkCallback` allows for a request to be called

This is the method equivalent of the modifier `recordChainlinkFulfillment`. Either `validateChainlinkCallback` or `recordChainlinkFulfillment` should be used on all fulfillment functions to ensure that the caller and `requestId` are valid. Use the modifier or the method, not both.

`validateChainlinkCallback` emits a [ChainlinkFulfilled](#chainlinkfulfilled) event.
[block:code]
{
  "codes": [
    {
      "code": "function myCallback(bytes32 _requestId, uint256 _price)\n  public\n{\n  validateChainlinkCallback(_requestId);\n  currentPrice = _price;\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    // validateChainlinkCallback should always be called in the callback of a\n    //   Chainlink request, this authenticates the caller and ensures\n    //   a response has not already been received\n    validateChainlinkCallback(_requestId);\n    \n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "Do not call `validateChainlinkCallback` multiple times. The nature of validating the callback is to ensure the response is only received once and not replayed. Calling a second time with the same method ID will trigger a revert. Similarly, your callback should validate using either `validateChainlinkCallback` or `recordChainlinkFulfillment`, not both.",
  "title": "Do not call multiple times"
}
[/block]
## addChainlinkExternalRequest

```javascript
function addChainlinkExternalRequest(
  address _oracle,
  bytes32 _requestId
)
```

`addChainlinkExternalRequest` allows a Chainlink contract to track unfulfilled requests that it hasn't created itself. For example, contract A creates a request and sets the callback for contract B. Contract B needs to know about the request created by contract A so that it can validate the callback when it is executed.

[block:code]
{
  "codes": [
    {
      "code": "function expectResponseFor(bytes32 _requestId)\n  public\n{\n  addChainlinkExternalRequest(chainlinkOracleAddress(), _requestId);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient, Ownable {\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function expectResponseFor(bytes32 _requestId)\n    public\n    onlyOwner // see caution above about who is permissioned to add requests\n  {\n    addChainlinkExternalRequest(chainlinkOracleAddress(), _requestId);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    // validation only passes if the request was previoulsy added\n    //   through expectResponseFor\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    \n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Be careful adding external requests",
  "body": "Being able to change a request means that you can change the data fed into a contract. Permissioning someone to make external requests can allow them to change the outcome of your contract. You should be sure to make sure that they are a trusted to do so. If they are not trusted to do so, you should put the request making logic on-chain where it is auditable and tamperproof."
}
[/block]

## cancelChainlinkRequest

```javascript  
function cancelChainlinkRequest(bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunc,
    uint256 _expiration
)
```

In case an oracle node does not respond, it may be necessary to retrieve the LINK used to pay for the unfulfilled request. The `cancelChainlinkRequest` will send the cancel request to the address used for the request, which transfers the amount of LINK back to the requesting contract, and delete it from the tracked requests.

The default expiration for a request is five minutes, after which it can be cancelled. The cancellation must be sent by the address which was specified as the callback location of the contract.

For the sake of efficient gas usage, only a hash of the request's parameters are stored on-chain. In order to validate the terms of the request and that it can be calculated, the request parameters must be provided. Additionally, cancellation must be called by the address which the callback would otherwise have been called on.

`cancelChainlinkRequest` emits a [ChainlinkCancelled](#chainlinkcancelled) event.

[block:code]
{
  "codes": [
    {
      "code": "function cancelRequest(\n    bytes32 _requestId,\n    uint256 _payment,\n    bytes4 _callbackFunc,\n    uint256 _expiration\n) public {\n  cancelChainlinkRequest(_requestId, _payment, _callbackFunc, _expiration);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient, Ownable {\n  uint256 constant PAYMENT = 1 * LINK;\n  bytes32 jobId;\n  uint256 expiration;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle, bytes32 _jobId) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n    jobId = _jobId;\n  }\n  \n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(jobId, this, this.myCallback.selector), PAYMENT);\n    expiration = block.timestamp + 5 minutes;\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    // validation only passes if the request was previoulsy added\n    //   through expectResponseFor\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    \n    latestPrice = _price;\n  }\n  \n  function myCancelationMethod(bytes32 _requestId, bytes4 _callbackFunc) public {\n    // cancellation must be called from the callback address specified in the request\n    cancelChainlinkRequest(_requestId, PAYMENT, _callbackFunc, expiration);\n    // the LINK paid for the request is transfered back to the cancelling address\n  }\n  \n  // You may want a way to handle the LINK returned when a request is cancelled.\n  //   withdrawLINK is an example of a method that allows the owner to withdraw the LINK.\n  function withdrawLINK() public onlyOwner {\n    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());\n    require(link.transfer(msg.sender, link.balanceOf(address(this))), \"Unable to transfer\");\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

## useChainlinkWithENS

```javascript
function useChainlinkWithENS(
  address _ens,
  bytes32 _node
)
```

Allows a Chainlink contract to store the addresses of the LINK token and oracle contract addresses without supplying the addresses themselves. We use ENS where available to resolve these addresses. It requires the address of the ENS contract and the node (which is a hash) for the domain.

If your Oracle provider supports using ENS for rolling upgrades to their oracle contract, once you've pointed your Chainlinked contract to the ENS records then you can update the records using [updateChainlinkOracleWithENS](#updatechainlinkoraclewithens).
[block:code]
{
  "codes": [
    {
      "code": "address constant ROPSTEN_ENS = 0x112234455C3a32FD11230C42E7Bccd4A84e02010;\nbytes32 constant ROPSTEN_CHAINLINK_ENS = 0xead9c0180f6d685e43522fcfe277c2f0465fe930fb32b5b415826eacf9803727;\n\nconstructor() public {\n  useChainlinkWithENS(ROPSTEN_ENS, ROPSTEN_CHAINLINK_ENS);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient, Ownable {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _ens, bytes32 _node) public {\n    // setting the Oracle and LINK token address via ENS records\n    //   allows them to be updated later to addresses\n    //   that the oracle provider chooses\n    useChainlinkWithENS(_ens, _node);\n  }\n  \n  function updateOracleAddressToLatest()\n    public\n    onlyOwner\n  {\n    // this method is protected by the onlyOwner modifier\n    //   because there can be risks with updating\n    //\n    //   see \"Updating oracle address\" to see if the tradeoff is\n    //   right for your use case\n    updateChainlinkOracleWithENS();\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Updating oracle addresses",
  "body": "If an oracle provider supports listing their oracle on ENS, that provides the added security of being able to update any issues that may arise. The tradeoff here is that by using their ENS record, you are allowing whoever controls that record and the corresponding code it points to. If your contract does this, you must either audit the updated code and make sure it matches <a href=\"https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/Oracle.sol\" target=\"_blank\" rel=\"noreferrer, noopener\">Oracle.sol</a> or trust whoever can update the records."
}
[/block]

## updateChainlinkOracleWithENS

```javascript
function updateChainlinkOracleWithENS()
```

Updates the stored oracle contract address with the latest address resolved through the ENS contract. This requires the oracle provider to support listing their address on ENS.

This method only works after [useChainlinkWithENS](#usechainlinkwithens) has been called on the contract.
[block:code]
{
  "codes": [
    {
      "code": "function updateOracleAddressToLatest() public {\n  updateChainlinkOracleWithENS();\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient, Ownable {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _ens, bytes32 _node) public {\n    // setting the Oracle and LINK token address via ENS records\n    //   allows them to be updated later to addresses\n    //   that the oracle provider chooses\n    useChainlinkWithENS(_ens, _node);\n  }\n  \n  function updateOracleAddressToLatest()\n    public\n    onlyOwner\n  {\n    // this method is protected by the onlyOwner modifier\n    //   because there can be risks with updating\n    //\n    //   see \"Updating oracle address\" to see if the tradeoff is\n    //   right for your use case\n    updateChainlinkOracleWithENS();\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "If an oracle provider supports listing their oracle on ENS, that provides the added security of being able to update any issues that may arise. The tradeoff here is that by using their ENS record, you are allowing whoever controls that record and the corresponding code it points to. If your contract does this, you must either audit the updated code and make sure it matches <a href=\"https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/Oracle.sol\" target=\"_blank\" rel=\"noreferrer, noopener\">Oracle.sol</a> or trust whoever can update the records.",
  "title": "Updating oracle addresses"
}
[/block]

## chainlinkTokenAddress

```javascript
function chainlinkTokenAddress() returns (address)
```

The `chainlinkTokenAddress` function is a helper used to return the stored address of the Chainlink token. This variable is protected and so only made available through getters and setters.
[block:code]
{
  "codes": [
    {
      "code": "function withdrawLink() public {\n  LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());\n  \n  require(link.transfer(msg.sender, link.balanceOf(address(this))), \"Unable to transfer\");\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient, Ownable {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    // validateChainlinkCallback should always be called in the callback of a\n    //   Chainlink request, this authenticates the caller and ensures\n    //   a response has not already been received\n    validateChainlinkCallback(_requestId);\n    \n    latestPrice = _price;\n  }\n  \n  // You may want a way to handle the LINK returned when a request is cancelled.\n  //   withdrawLINK is an example of a method that allows the owner to withdraw the LINK.\n  function withdrawLINK() public onlyOwner {\n    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());\n    require(link.transfer(msg.sender, link.balanceOf(address(this))), \"Unable to transfer\");\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

## chainlinkOracleAddress

The `chainlinkOracleAddress` function is a helper used to return the stored address of the oracle contract.
[block:code]
{
  "codes": [
    {
      "code": "function getOracle() public view returns (address) {\n  return chainlinkOracleAddress();\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient, Ownable {\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function expectResponseFor(bytes32 _requestId) public onlyOwner {\n    // use oracle address getter to avoid having to pass in the address\n    addChainlinkExternalRequest(chainlinkOracleAddress(), _requestId);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]
# Events

## ChainlinkRequested

```javascript
event ChainlinkRequested(
  bytes32 indexed id
)
```

Emitted when [sendChainlinkRequest](#sendchainlinkrequest) and [sendChainlinkRequestTo](#sendchainlinkrequestto) are called. Includes the request ID as an event topic.

## ChainlinkFulfilled

```javascript
event ChainlinkFulfilled(
  bytes32 indexed id
)
```

Emitted when [validateChainlinkCallback](#validatechainlinkcallback) or  [recordChainlinkFulfillment](#recordchainlinkfulfillment) are called. Includes the request ID as an event topic.

## ChainlinkCancelled

```javascript
event ChainlinkCancelled(
  bytes32 indexed id
)
```

Emitted when [cancelChainlinkRequest](#cancelchainlinkrequest) is called. Includes the request ID as an event topic.

# Constants

## LINK
[block:callout]
{
  "type": "warning",
  "title": "Namechange Between Versions",
  "body": "From Solidity v0.7 onwards, this constant is renamed to `LINK_DIVISIBILITY`."
}
[/block]
`LINK` is a uint256 constant to represent one whole unit of the LINK token (1000000000000000000). It can be used with another value to specify payment in an easy-to-read format, instead of hardcoding magic numbers.
[block:code]
{
  "codes": [
    {
      "code": "uint256 constant private ORACLE_PAYMENT = 100 * LINK;",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = \"493610cff14346f786f88ed791ab7704\";\n  \n  // PAYMENT is made to be explicitly 0.1 LINK by dividing by 10\n  uint256 constant PAYMENT = LINK / 10;\n  \n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]
# Modifiers

## recordChainlinkFulfillment

`recordChainlinkFulfillment` is used on fulfillment callbacks to ensure that the caller and `requestId` are valid. This is the method equivalent of the method `validateChainlinkCallback`.

Either `validateChainlinkCallback` or `recordChainlinkFulfillment` should be used on all Chainlink callback functions to ensure that the sender and `requestId` are valid. They protect ChainlinkClient callbacks from being called by malicious callers. Do not call both of them, or your callback may revert before you can record the reported response.
[block:code]
{
  "codes": [
    {
      "code": "function myCallback(bytes32 _requestId, uint256 _price)\n  public\n  recordChainlinkFulfillment(_requestId) // always validate callbacks\n{\n  currentPrice = _price;\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price)\n    public\n    // validates request in a modifier if that's your preferred style\n    recordChainlinkFulfillment(_requestId)\n  {\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

# Chainlink.Request

```javascript
library Chainlink {
  struct Request {
    bytes32 id;
    address callbackAddress;
    bytes4 callbackFunctionId;
    uint256 nonce;
    Buffer.buffer buf;
  }
}
```

The Chainlink Request struct encapsulates all of the fields needed for a Chainlink request and its corresponding response callback.

The Chainlink protocol aims to be flexible and not restrict application developers. The Solidity Chainlink Request model is a great example of that. It is exceptionally flexible, given the limitations of Solidity. The request can contain an arbitrary amount of keys and values to be passed off-chain to the oracles for each request. It does so by converting the parameters into CBOR, and then storing them in a buffer. This allows for any number of parameters all of different types to be encoded on-chain.

The request's ID is generated by hashing the sender's address and the request's nonce. This scheme ensures that only the requester can generate their request ID, and no other contract can trigger a response from an oracle with that ID. New requests whose IDs match an unfulfilled request ID will not be accepted by the oracle.
[block:callout]
{
  "type": "warning",
  "title": "Intended for memory",
  "body": "The Request object was intended to be stored in memory. If you have a reason to persist the struct in storage, it is recommended that you do so by copying each attribute over and explicitly copying the bytes in the buffer."
}
[/block]
## Attributes
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "4-0": "buf",
    "4-1": "Buffer that stores additional user defined parameters as CBOR",
    "0-0": "id",
    "1-0": "callbackAddress",
    "2-0": "callbackFunctionId",
    "3-0": "nonce",
    "0-1": "Identifier for the request",
    "1-1": "Address that the response will be sent to upon fulfillment",
    "2-1": "Selector of the function on the callbackAddress that will be invoked with the response upon fulfillment",
    "3-1": "Used to generate the request ID"
  },
  "cols": 2,
  "rows": 5
}
[/block]

## Methods
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "**<a href=\"#add\">add</a>**",
    "1-0": "**<a href=\"#addbytes\">addBytes</a>**",
    "2-0": "**<a href=\"#addint\">addInt</a>**",
    "3-0": "**<a href=\"#adduint\">addUint</a>**",
    "4-0": "**<a href=\"#addstringarray\">addStringArray</a>**",
    "0-1": "Add a string value to the run request parameters",
    "1-1": "Add a bytes value to the run request parameters",
    "2-1": "Add an integer value to the run request parameters",
    "3-1": "Add an unsigned integer to the run request parameters",
    "4-1": "Add an array of strings as a value in the run request parameters",
    "5-0": "**<a href=\"#setbuffer\">setBuffer</a>**",
    "5-1": "Directly set the CBOR of the run request parameters"
  },
  "cols": 2,
  "rows": 6
}
[/block]

### add

```javascript
function add(
  Request memory self,
  string _key,
  string _value
)
```

Add a string value to the run request parameters. Commonly used for `get` with jobs using `httpGet` tasks.
[block:code]
{
  "codes": [
    {
      "code": "function requestEthereumPrice()\n  public\n{\n  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);\n  \n  req.add(\"get\", \"https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY\");\n  \n  sendChainlinkRequest(req, LINK * 1);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n    // specify templated fields in a job specification\n    req.add(\"get\", \"https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY\");\n\n    sendChainlinkRequest(req, PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

### addBytes

```javascript
function addBytes(
  Request memory self,
  string _key,
  bytes _value
)
```

Add a CBOR bytes type value to the run request parameters.
[block:code]
{
  "codes": [
    {
      "code": "function requestEmojiPopularity(bytes _unicode)\n  public\n{\n  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);\n  \n  req.addBytes(\"emojiUnicode\", _unicode);\n  \n  sendChainlinkRequest(req, LINK * 1);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPlace;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestEmojiPopularity(bytes _unicode) public {\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n    // specify templated fields in a job specification       \n    req.addBytes(\"emojiUnicode\", _unicode);\n\n    sendChainlinkRequest(req, PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _place) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPlace = _place;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

### addInt

```javascript
function addInt(
  Request memory self,
  string _key,
  int256 _value
)
```

Add a CBOR signed integer type value to the run request parameters. Commonly used with the `times` parameter of any job using a `multiply` task.
[block:code]
{
  "codes": [
    {
      "code": "function requestPrice()\n  public\n{\n  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);\n  \n  req.addInt(\"times\", 100);\n  \n  sendChainlinkRequest(req, LINK * 1);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n    // specify templated fields in a job specification\n    req.addInt(\"times\", 100);\n\n    sendChainlinkRequest(req, PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

### addUint

```javascript
function addUint(
  Request memory self,
  string _key,
  uint256 _value
)
```

Add a CBOR unsigned integer type value to the run request parameters. Commonly used with the `times` parameter of any job using a `multiply` task.
[block:code]
{
  "codes": [
    {
      "code": "function requestPrice()\n  public\n{\n  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);\n  \n  req.addUint(\"times\", 100);\n  \n  sendChainlinkRequest(req, LINK * 1);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice() public {\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n    // specify templated fields in a job specification\n    req.addUint(\"times\", 100);\n\n    sendChainlinkRequest(req, PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

### addStringArray

```javascript
function addStringArray(
  Request memory self,
  string _key,
  string[] memory _values
)
```

Add a CBOR array of strings to the run request parameters. Commonly used with the `path` parameter for any job including a `jsonParse` task.
[block:code]
{
  "codes": [
    {
      "code": "function requestPrice(string _currency)\n  public\n{\n  Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n  string[] memory path = new string[](2);\n  path[0] = _currency;\n  path[1] = \"recent\";\n    \n  // specify templated fields in a job specification\n  req.addStringArray(\"path\", path);\n\n  sendChainlinkRequest(req, PAYMENT);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice(string _currency) public {\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    string[] memory path = new string[](2);\n    path[0] = _currency;\n    path[1] = \"recent\";\n    \n    // specify templated fields in a job specification\n    req.addStringArray(\"path\", path);\n\n    sendChainlinkRequest(req, PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

### setBuffer

```javascript
function setBuffer(
  Request memory self,
  bytes _data
)
```

Set the CBOR payload directly on the request object, avoiding the cost of encoding the parameters in CBOR. This can be helpful when reading the bytes from storage or having them passed in from off-chain where they were pre-encoded.
[block:code]
{
  "codes": [
    {
      "code": "function requestPrice(bytes _cbor)\n  public\n{\n  Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n  req.setBuffer(_cbor);\n\n  sendChainlinkRequest(req, PAYMENT);\n}",
      "language": "javascript",
      "name": "example"
    },
    {
      "code": "contract MyContract is ChainlinkClient {\n  bytes32 constant JOB_ID = bytes32(\"493610cff14346f786f88ed791ab7704\");\n  uint256 constant PAYMENT = 1 * LINK;\n  uint256 latestPrice;\n  \n  constructor(address _link, address _oracle) public {\n    setChainlinkToken(_link);\n    setChainlinkOracle(_oracle);\n  }\n\n  function requestPrice(bytes _cbor) public {\n    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);\n    \n    // send a request payload that was encoded off-chain then sent on-chain\n    req.setBuffer(_cbor);\n\n    sendChainlinkRequest(req, PAYMENT);\n  }\n  \n  function myCallback(bytes32 _requestId, uint256 _price) public {\n    validateChainlinkCallback(_requestId); // always validate callbacks\n    latestPrice = _price;\n  }\n}",
      "language": "javascript",
      "name": "in context"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Be careful setting the request buffer directly",
  "body": "Moving the CBOR encoding logic off-chain can save some gas, but it also opens up the opportunity for people to encode parameters that not all parties agreed to. Be sure that whoever is permissioned to call `setBuffer` is trusted or auditable."
}
[/block]