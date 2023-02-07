---
layout: ../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "ChainlinkClient API Reference"
permalink: "docs/any-api/api-reference/"
---

:::note[ API reference for `ChainlinkClient` [contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol).]

`ChainlinkClient` contracts can communicate with legacy `Oracle` [contracts](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/Oracle.sol) or `Operator` [contracts](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).

:::

## Index

### Methods

| Name                                                          | Description                                                                                                                                                                                                                        |
| :------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [setChainlinkOracle](#setchainlinkoracle)                     | Sets the stored address for the oracle contract                                                                                                                                                                                    |
| [setChainlinkToken](#setchainlinktoken)                       | Sets the stored address for the LINK token                                                                                                                                                                                         |
| [buildChainlinkRequest](#buildchainlinkrequest)               | Instantiates a Request object with the required parameters                                                                                                                                                                         |
| [buildOperatorRequest](#buildoperatorrequest)                 | Instantiates a Request object with the required parameters. **Note** the oracle must be an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol)                       |
| [sendChainlinkRequest](#sendchainlinkrequest)                 | Sends the request payload to the stored address stored as chainlinkOracleAddress                                                                                                                                                   |
| [sendChainlinkRequestTo](#sendchainlinkrequestto)             | Sends a request to the oracle address specified                                                                                                                                                                                    |
| [sendOperatorRequest](#sendoperatorrequest)                   | Sends the request payload to the stored address stored as chainlinkOracleAddress. **Note** the oracle must be an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol) |
| [sendOperatorRequestTo](#sendoperatorrequestto)               | Sends a request to the oracle address specified. **Note** the oracle must be an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol)                                  |
| [validateChainlinkCallback](#validatechainlinkcallback)       | Secures the fulfillment callback to make sure it is only called by permissioned senders                                                                                                                                            |
| [addChainlinkExternalRequest](#addchainlinkexternalrequest)   | Allows a Chainlinked contract to track unfulfilled requests that it hasn't created itself                                                                                                                                          |
| [cancelChainlinkRequest](#cancelchainlinkrequest)             | Cancels Chainlink requests attempting to contact an unresponsive node                                                                                                                                                              |
| [useChainlinkWithENS](#usechainlinkwithens)                   | Looks up the addresses of the LINK token and Oracle contract through ENS                                                                                                                                                           |
| [updateChainlinkOracleWithENS](#updatechainlinkoraclewithens) | Updates the stored oracle address with the latest address resolved through ENS                                                                                                                                                     |
| [chainlinkTokenAddress](#chainlinktokenaddress)               | Returns the stored address of the LINK token                                                                                                                                                                                       |
| [chainlinkOracleAddress](#chainlinkoracleaddress)             | Returns the stored address of the oracle contract                                                                                                                                                                                  |

### Events

| Name                                      | Description                                                                  |
| :---------------------------------------- | ---------------------------------------------------------------------------- |
| [ChainlinkRequested](#chainlinkrequested) | Emitted from a Chainlinked contract when a request is sent to an oracle      |
| [ChainlinkFulfilled](#chainlinkfulfilled) | Emitted from a Chainlinked contract when a request is fulfilled by an oracle |
| [ChainlinkCancelled](#chainlinkcancelled) | Emitted from a Chainlinked contract when a request is cancelled              |

### Modifiers

| Name                                                      | Description                                                                                                                                              |
| :-------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [recordChainlinkFulfillment](#recordchainlinkfulfillment) | Used on fulfillment callbacks to ensure that the caller and requestId are valid. This is the modifier equivalent of the method validateChainlinkCallback |

### Constants

| Name                                    | Description                                                                       |
| :-------------------------------------- | --------------------------------------------------------------------------------- |
| [LINK_DIVISIBILITY](#link_divisibility) | Helper uint256 to represent the divisibility of a LINK token. Equivalent to 10^18 |

### Structs

| Name                                   | Description                                                          |
| :------------------------------------- | -------------------------------------------------------------------- |
| [Chainlink.Request](#chainlinkrequest) | All of the parameters that can be passed over in a Chainlink request |

## Methods

Below you'll find each helper explained in greater detail alongside respective implementation examples to help you leverage these methods once you start building your own Chainlinked contract.

After the function signature and a short description, two code examples are provided, one focusing on the exact usage of the method and one where the helper is presented in the context of a full contract.

### setChainlinkOracle

<!-- prettier-ignore -->
```solidity
function setChainlinkOracle(
  address _oracle
)
```

Sets a private storage variable provided for convenience if your contract only needs to talk to one oracle and you do not want to specify it on every request. Once an oracle is set with `setChainlinkOracle` that is the address used with [sendChainlinkRequest](#sendchainlinkrequest).

Retrieve the oracle address using [chainlinkOracleAddress](#chainlinkoracleaddress). These getters and setters are provided to enforce that changes to the oracle are explicitly made in the code.

<!-- prettier-ignore -->
```solidity
constructor(address _oracle)
{
  setChainlinkOracle(_oracle);
}
```

### setChainlinkToken

<!-- prettier-ignore -->
```solidity
setChainlinkToken(
  address _link
)
```

Sets the stored address for the LINK token which is used to send requests to Oracles. There are different token addresses on different network. See [LINK Token Contracts](/resources/link-token-contracts/) for the address of the LINK token on the network you're deploying to.

<!-- prettier-ignore -->
```solidity
constructor(address _link)
  public
{
  setChainlinkToken(_link);
}
```

### buildChainlinkRequest

:::note[ Use `buildOperatorRequest` [function](#buildoperatorrequest) if the oracle is an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).]

:::

<!-- prettier-ignore -->
```solidity
function buildChainlinkRequest(
    bytes32 _jobId,
    address _callbackAddress,
    bytes4 _callbackFunctionSignature
) returns (Chainlink.Request memory request)
```

Instantiates a Request from the Chainlink contract. A [Request](#chainlinkrequest) is a struct which contains the necessary parameters to be sent to the oracle contract. The `buildChainlinkRequest` function takes an ID, which can be a [Job ID](/chainlink-nodes/oracle-jobs/jobs/), a callback address to receive the resulting data, and a callback function signature to call on the callback address.

<!-- prettier-ignore -->
```solidity
function requestPrice()
  public
{
  bytes32 jobId = "493610cff14346f786f88ed791ab7704";
  bytes4 selector = this.myCallback.selector;
  // build a request that calls the myCallback function defined
  //   below by specifying the address of this contract and the function
  //   selector of the myCallback
  Chainlink.Request memory request = buildChainlinkRequest(
    jobId,
    address(this),
    selector);
}
```

### buildOperatorRequest

:::note[ This function is similar to `buildChainlinkRequest`[function](#buildchainlinkrequest). One major difference is that `buildOperatorRequest` does not allow setting up the address of the callback. The callback address is set to the address of the calling contract.]
It is recommended to use `buildOperatorRequest` but make sure the oracle you are contacting is an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).

:::

<!-- prettier-ignore -->
```solidity
function buildOperatorRequest(
    bytes32 _jobId,
    bytes4 _callbackFunctionSignature
) returns (Chainlink.Request memory request)
```

Instantiates a _Request_ from the Chainlink contract. A [Request](#chainlinkrequest) is a struct that contains the necessary parameters to be sent to the oracle contract. The `buildOperatorRequest` function takes an ID, which can be a [Job ID](/chainlink-nodes/oracle-jobs/jobs/), and a callback function signature to call on the calling contract address.

<!-- prettier-ignore -->
```solidity
function requestPrice()
  public
{
  bytes32 jobId = "493610cff14346f786f88ed791ab7704";
  bytes4 selector = this.myCallback.selector;
  // build a request that calls the myCallback function defined
  //   below by specifying the function selector of myCallback
  Chainlink.Request memory request = buildOperatorRequest(
    jobId,
    selector);
}
```

### sendChainlinkRequest

:::note[ Use `sendOperatorRequest` [function](#sendoperatorrequest) if the oracle is an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).]

:::

<!-- prettier-ignore -->
```solidity
function sendChainlinkRequest(
    Chainlink.Request memory _req,
    uint256 _payment
) returns (bytes32 requestId)
```

Sends the request payload to the stored oracle address. It takes a [Chainlink.Request](#chainlinkrequest) and the amount of LINK to send amount as parameters. The request is serialized and calls `oracleRequest` on the address stored in `chainlinkOracleAddress` via the LINK token's `transferAndCall` method.

`sendChainlinkRequest` returns the ID of the request. If your application needs to, your contract can store that ID, but you don't need to. The ChainlinkClient helpers will store the ID under the hood, along with the oracle address, and use them when you call `recordChainlinkFulfillment` in your callback function to make sure only that the address you want can call your Chainlink callback function.

`sendChainlinkRequest` emits a [ChainlinkRequested](#chainlinkrequested) event containing the request ID, if you would like to use it in your Web3 application.

<!-- prettier-ignore -->
```solidity
function requestPrice()
  public
{
  Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.callback.selector);
  uint256 paymentAmount = 1 * LINK_DIVISIBILITY / 10; // Equivalent to 0.1 LINK

  // send the request that you just built
  sendChainlinkRequest(request, paymentAmount);
}
```

### sendChainlinkRequestTo

:::note[ Use `sendOperatorRequestTo` [function](#sendoperatorrequestto) if the oracle is an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).]

:::

<!-- prettier-ignore -->
```solidity
function sendChainlinkRequestTo(
  address _oracle,
  Chainlink.Request memory _req,
  uint256 _payment
) returns (bytes32 requestId)
```

Similar to [sendChainlinkRequest](#sendchainlinkrequest), `sendChainlinkRequestTo` sends a [Request](#chainlinkrequest) but allows the target oracle to be specified. It requires an address, a Request, and an amount, and returns the `requestId`. This allows a requesting contract to create and track requests sent to multiple oracle contract addresses.

`sendChainlinkRequestTo` emits a [ChainlinkRequested](#chainlinkrequested) event containing the request ID, if you would like to use it in your Web3 application.

<!-- prettier-ignore -->
```solidity
function requestPriceFrom(address _oracle)
  public
{
  Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.callback.callbackSelector);
  uint256 paymentAmount = 1 * LINK_DIVISIBILITY; // = 1 LINK

  // send the request that you just built to a specified oracle
  sendChainlinkRequestTo(_oracle, request, paymentAmount);
}
```

### sendOperatorRequest

:::note[ This function is similar to `sendChainlinkRequest`[function](#sendchainlinkrequest).]
It is recommended to use `sendOperatorRequest` but make sure the oracle you are contacting is an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).

:::

<!-- prettier-ignore -->
```solidity
function sendOperatorRequest(
    Chainlink.Request memory _req,
    uint256 _payment
) returns (bytes32 requestId)
```

The `sendOperatorRequest` function sends the request payload to the stored oracle address. It takes a [Chainlink.Request](#chainlinkrequest) and the amount of LINK to send amount as parameters. The request is serialized and calls `operatorRequest` on the address stored in `chainlinkOracleAddress` using the LINK token's `transferAndCall` method.

`sendOperatorRequest` returns the ID of the request. Optionally, your contract can store the ID if your application needs it. The `ChainlinkClient` helpers store the ID and the oracle address and use them when you call `recordChainlinkFulfillment` in your callback function. This ensures that only the specified address can call your Chainlink callback function.

`sendOperatorRequest` emits a [ChainlinkRequested](#chainlinkrequested) event containing the request ID that you can use in your Web3 application.

<!-- prettier-ignore -->
```solidity
function requestPrice()
  public
{
  Chainlink.Request memory request = buildOperatorRequest(jobId, this.callback.selector);
  uint256 paymentAmount = 1 * LINK_DIVISIBILITY / 10; // Equivalent to 0.1 LINK

  // send the request that you just built
  sendOperatorRequest(request, paymentAmount);
}
```

### sendOperatorRequestTo

:::note[ This function is similar to `sendChainlinkRequestTo`[function](#sendchainlinkrequestto).]
It is recommended to use `sendOperatorRequestTo`, but make sure the oracle you are contacting is an `Operator` [contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).

:::

<!-- prettier-ignore -->
```solidity
function sendChainlinkRequestTo(
  address _oracle,
  Chainlink.Request memory _req,
  uint256 _payment
) returns (bytes32 requestId)
```

Similar to [sendOperatorRequest](#sendoperatorrequest), `sendOperatorRequestTo` sends a [Request](#chainlinkrequest) but allows the target oracle to be specified. It requires an address, a Request, and an amount, and returns the `requestId`. This allows a requesting contract to create and track requests sent to multiple oracle contract addresses.

`sendOperatorRequestTo` emits a [ChainlinkRequested](#chainlinkrequested) event containing a request ID that you can use in your Web3 application.

<!-- prettier-ignore -->
```solidity
function requestPriceFrom(address _oracle)
  public
{
  Chainlink.Request memory request = buildOperatorRequest(jobId, this.callback.callbackSelector);
  uint256 paymentAmount = 1 * LINK_DIVISIBILITY; // = 1 LINK

  // send the request that you just built to a specified oracle
  sendOperatorRequestTo(_oracle, request, paymentAmount);
}
```

### validateChainlinkCallback

<!-- prettier-ignore -->
```solidity
function validateChainlinkCallback(
    bytes32 _requestId
)
```

Used on fulfillment callbacks to ensure that the caller and `requestId` are valid. They protect ChainlinkClient callbacks from being called by malicious callers. `validateChainlinkCallback` allows for a request to be called

This is the method equivalent of the modifier `recordChainlinkFulfillment`. Either `validateChainlinkCallback` or `recordChainlinkFulfillment` should be used on all fulfillment functions to ensure that the caller and `requestId` are valid. Use the modifier or the method, not both.

`validateChainlinkCallback` emits a [ChainlinkFulfilled](#chainlinkfulfilled) event.

<!-- prettier-ignore -->
```solidity
function myCallback(bytes32 _requestId, uint256 _price)
  public
{
  validateChainlinkCallback(_requestId);
  currentPrice = _price;
}
```

:::caution[ Do not call multiple times]

Do not call `validateChainlinkCallback` multiple times. The nature of validating the callback is to ensure the response is only received once and not replayed. Calling a second time with the same method ID will trigger a revert. Similarly, your callback should validate using either `validateChainlinkCallback` or `recordChainlinkFulfillment`, not both.

:::

### addChainlinkExternalRequest

<!-- prettier-ignore -->
```solidity
function addChainlinkExternalRequest(
  address _oracle,
  bytes32 _requestId
)
```

`addChainlinkExternalRequest` allows a Chainlink contract to track unfulfilled requests that it hasn't created itself. For example, contract A creates a request and sets the callback for contract B. Contract B needs to know about the request created by contract A so that it can validate the callback when it is executed.

<!-- prettier-ignore -->
```solidity
function expectResponseFor(bytes32 _requestId)
  public
{
  addChainlinkExternalRequest(chainlinkOracleAddress(), _requestId);
}
```

:::caution[ Be careful adding external requests]

Being able to change a request means that you can change the data fed into a contract. Permissioning someone to make external requests can allow them to change the outcome of your contract. You should be sure to make sure that they are a trusted to do so. If they are not trusted to do so, you should put the request making logic on-chain where it is auditable and tamperproof.

:::

### cancelChainlinkRequest

<!-- prettier-ignore -->
```solidity
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

<!-- prettier-ignore -->
```solidity
function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunc,
    uint256 _expiration
) public {
  cancelChainlinkRequest(_requestId, _payment, _callbackFunc, _expiration);
}
```

### useChainlinkWithENS

<!-- prettier-ignore -->
```solidity
function useChainlinkWithENS(
  address _ens,
  bytes32 _node
)
```

Allows a Chainlink contract to store the addresses of the LINK token and oracle contract addresses without supplying the addresses themselves. We use ENS where available to resolve these addresses. It requires the address of the ENS contract and the node (which is a hash) for the domain.

If your Oracle provider supports using ENS for rolling upgrades to their oracle contract, once you've pointed your Chainlinked contract to the ENS records then you can update the records using [updateChainlinkOracleWithENS](#updatechainlinkoraclewithens).

<!-- prettier-ignore -->
```solidity
address constant ROPSTEN_ENS = 0x112234455C3a32FD11230C42E7Bccd4A84e02010;
bytes32 constant ROPSTEN_CHAINLINK_ENS = 0xead9c0180f6d685e43522fcfe277c2f0465fe930fb32b5b415826eacf9803727;

constructor(){
  useChainlinkWithENS(ROPSTEN_ENS, ROPSTEN_CHAINLINK_ENS);
}
```

:::caution[ Updating oracle addresses]

If an oracle provider supports listing their oracle on ENS, that provides the added security of being able to update any issues that may arise. The tradeoff here is that by using their ENS record, you are allowing whoever controls that record and the corresponding code it points to. If your contract does this, you must either audit the updated code and make sure it matches [Oracle.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/Oracle.sol) or trust whoever can update the records.

:::

### updateChainlinkOracleWithENS

<!-- prettier-ignore -->
```solidity
function updateChainlinkOracleWithENS()
```

Updates the stored oracle contract address with the latest address resolved through the ENS contract. This requires the oracle provider to support listing their address on ENS.

This method only works after [useChainlinkWithENS](#usechainlinkwithens) has been called on the contract.

<!-- prettier-ignore -->
```solidity
function updateOracleAddressToLatest() public {
  updateChainlinkOracleWithENS();
}
```

:::caution[ Updating oracle addresses]

If an oracle provider supports listing their oracle on ENS, that provides the added security of being able to update any issues that may arise. The tradeoff here is that by using their ENS record, you are allowing whoever controls that record and the corresponding code it points to. If your contract does this, you must either audit the updated code and make sure it matches [Oracle.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/Oracle.sol) or trust whoever can update the records.

:::

### chainlinkTokenAddress

<!-- prettier-ignore -->
```solidity
function chainlinkTokenAddress() returns (address)
```

The `chainlinkTokenAddress` function is a helper used to return the stored address of the Chainlink token. This variable is protected and so only made available through getters and setters.

<!-- prettier-ignore -->
```solidity
function withdrawLink() public {
  LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());

  require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
}
```

### chainlinkOracleAddress

The `chainlinkOracleAddress` function is a helper used to return the stored address of the oracle contract.

<!-- prettier-ignore -->
```solidity
function getOracle() public view returns (address) {
  return chainlinkOracleAddress();
}

```

## Events

### ChainlinkRequested

<!-- prettier-ignore -->
```solidity
event ChainlinkRequested(
  bytes32 indexed id
)
```

Emitted when [sendChainlinkRequest](#sendchainlinkrequest) and [sendChainlinkRequestTo](#sendchainlinkrequestto) are called. Includes the request ID as an event topic.

### ChainlinkFulfilled

<!-- prettier-ignore -->
```solidity
event ChainlinkFulfilled(
  bytes32 indexed id
)
```

Emitted when [validateChainlinkCallback](#validatechainlinkcallback) or [recordChainlinkFulfillment](#recordchainlinkfulfillment) are called. Includes the request ID as an event topic.

### ChainlinkCancelled

<!-- prettier-ignore -->
```solidity
event ChainlinkCancelled(
  bytes32 indexed id
)
```

Emitted when [cancelChainlinkRequest](#cancelchainlinkrequest) is called. Includes the request ID as an event topic.

## Constants

### LINK_DIVISIBILITY

`LINK_DIVISIBILITY` is a uint256 constant to represent one whole unit of the LINK token (1000000000000000000). It can be used with another value to specify payment in an easy-to-read format, instead of hardcoding magic numbers.

<!-- prettier-ignore -->
```solidity
uint256 constant private ORACLE_PAYMENT = 100 * LINK_DIVISIBILITY; // = 100 LINK
```

## Modifiers

### recordChainlinkFulfillment

`recordChainlinkFulfillment` is used on fulfillment callbacks to ensure that the caller and `requestId` are valid. This is the method equivalent of the method `validateChainlinkCallback`.

Either `validateChainlinkCallback` or `recordChainlinkFulfillment` should be used on all Chainlink callback functions to ensure that the sender and `requestId` are valid. They protect ChainlinkClient callbacks from being called by malicious callers. Do not call both of them, or your callback may revert before you can record the reported response.

<!-- prettier-ignore -->
```solidity
function myCallback(bytes32 _requestId, uint256 _price)
  public
  recordChainlinkFulfillment(_requestId) // always validate callbacks
{
  currentPrice = _price;
}
```

## Chainlink.Request

<!-- prettier-ignore -->
```solidity
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

:::caution[ Intended for memory]

The Request object was intended to be stored in memory. If you have a reason to persist the struct in storage, it is recommended that you do so by copying each attribute over and explicitly copying the bytes in the buffer.

:::

### Attributes

| Name               | Description                                                                                             |
| ------------------ | :------------------------------------------------------------------------------------------------------ |
| id                 | Identifier for the request                                                                              |
| callbackAddress    | Address that the response will be sent to upon fulfillment                                              |
| callbackFunctionId | Selector of the function on the callbackAddress that will be invoked with the response upon fulfillment |
| nonce              | Used to generate the request ID                                                                         |
| buf                | Buffer that stores additional user defined parameters as CBOR                                           |

### Methods

| Name                              | Description                                                      |
| :-------------------------------- | ---------------------------------------------------------------- |
| [add](#add)                       | Add a string value to the run request parameters                 |
| [addBytes](#addbytes)             | Add a bytes value to the run request parameters                  |
| [addInt](#addint)                 | Add an integer value to the run request parameters               |
| [addUint](#adduint)               | Add an unsigned integer to the run request parameters            |
| [addStringArray](#addstringarray) | Add an array of strings as a value in the run request parameters |
| [setBuffer](#setbuffer)           | Directly set the CBOR of the run request parameters              |

#### add

<!-- prettier-ignore -->
```solidity
function add(
  Request memory self,
  string _key,
  string _value
)
```

Add a string value to the run request parameters. Commonly used for `get` with jobs using `httpGet` tasks.

<!-- prettier-ignore -->
```solidity
function requestEthereumPrice()
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY");

  sendChainlinkRequest(req, 1 * LINK_DIVISIBILITY); // =1 LINK
}
```

#### addBytes

<!-- prettier-ignore -->
```solidity
function addBytes(
  Request memory self,
  string _key,
  bytes _value
)
```

Add a CBOR bytes type value to the run request parameters.

<!-- prettier-ignore -->
```solidity
function requestEmojiPopularity(bytes _unicode)
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.addBytes("emojiUnicode", _unicode);

  sendChainlinkRequest(req, LINK_DIVISIBILITY * 1);
}
```

Note that this can also be used as a workaround to pass other data types like arrays or addresses. For instance, to add an _address_, one would first encode it using `abi.encode` then pass the result to `addBytes`:

<!-- prettier-ignore -->
```solidity
Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

req.addBytes("address", abi.encode(msg.sender)); // msg.sender used in this example. Replace it with your address

```

#### addInt

<!-- prettier-ignore -->
```solidity
function addInt(
  Request memory self,
  string _key,
  int256 _value
)
```

Add a CBOR signed integer type value to the run request parameters. Commonly used with the `times` parameter of any job using a `multiply` task.

<!-- prettier-ignore -->
```solidity
function requestPrice()
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.addInt("times", 100);

  sendChainlinkRequest(req, LINK_DIVISIBILITY * 1);
}
```

#### addUint

<!-- prettier-ignore -->
```solidity
function addUint(
  Request memory self,
  string _key,
  uint256 _value
)
```

Add a CBOR unsigned integer type value to the run request parameters. Commonly used with the `times` parameter of any job using a `multiply` task.

<!-- prettier-ignore -->
```solidity
function requestPrice()
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.addUint("times", 100);

  sendChainlinkRequest(req, LINK_DIVISIBILITY * 1);
}
```

#### addStringArray

<!-- prettier-ignore -->
```solidity
function addStringArray(
  Request memory self,
  string _key,
  string[] memory _values
)
```

Add a CBOR array of strings to the run request parameters. Commonly used with the `path` parameter for any job including a `jsonParse` task.

<!-- prettier-ignore -->
```solidity
function requestPrice(string _currency)
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);
  string[] memory path = new string[](2);
  path[0] = _currency;
  path[1] = "recent";

  // specify templated fields in a job specification
  req.addStringArray("path", path);

  sendChainlinkRequest(req, PAYMENT);
}
```

#### setBuffer

<!-- prettier-ignore -->
```solidity
function setBuffer(
  Request memory self,
  bytes _data
)
```

Set the CBOR payload directly on the request object, avoiding the cost of encoding the parameters in CBOR. This can be helpful when reading the bytes from storage or having them passed in from off-chain where they were pre-encoded.

<!-- prettier-ignore -->
```solidity
function requestPrice(bytes _cbor)
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

  req.setBuffer(_cbor);

  sendChainlinkRequest(req, PAYMENT);
}
```

:::caution[ Be careful setting the request buffer directly]

Moving the CBOR encoding logic off-chain can save some gas, but it also opens up the opportunity for people to encode parameters that not all parties agreed to. Be sure that whoever is permissioned to call `setBuffer` is trusted or auditable.

:::
