---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "ChainlinkClient API Reference"
permalink: "docs/chainlink-framework/"
---
API reference for [`ChainlinkClient`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/ChainlinkClient.sol).

# Index

##  Methods

| Name                                                                                 | Description                                                                               |
|:------------------------------------------------------------------------------------ |:----------------------------------------------------------------------------------------- |
| [setChainlinkOracle](#setchainlinkoracle)                     | Sets the stored address for the oracle contract                                           |
| [setChainlinkToken](#setchainlinktoken)                       | Sets the stored address for the LINK token                                                |
| [setPublicChainlinkToken](#setpublicchainlinktoken)           | Sets the LINK token address for the detected public network                               |
| [buildChainlinkRequest](#buildchainlinkrequest)               | Instantiates a Request object with the required parameters                                |
| [sendChainlinkRequest](#sendchainlinkrequest)                 | Sends the request payload to the stored address stored as chainlinkOracleAddress          |
| [sendChainlinkRequestTo](#sendchainlinkrequestto)             | Sends a request to the oracle address specified                                           |
| [validateChainlinkCallback](#validatechainlinkcallback)       | Secures the fulfillment callback to make sure it is only called by permissioned senders   |
| [addChainlinkExternalRequest](#addchainlinkexternalrequest)   | Allows a Chainlinked contract to track unfulfilled requests that it hasn't created itself |
| [cancelChainlinkRequest](#cancelchainlinkrequest)             | Cancels Chainlink requests attempting to contact an unresponsive node                     |
| [useChainlinkWithENS](#usechainlinkwithens)                   | Looks up the addresses of the LINK token and Oracle contract through ENS                  |
| [updateChainlinkOracleWithENS](#updatechainlinkoraclewithens) | Updates the stored oracle address with the latest address resolved through ENS            |
| [chainlinkTokenAddress](#chainlinktokenaddress)               | Returns the stored address of the LINK token                                              |
| [chainlinkOracleAddress](#chainlinkoracleaddress)             | Returns the stored address of the oracle contract                                         |

## Events

| Name                                                             | Description                                                                  |
|:---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [ChainlinkRequested](#chainlinkrequested) | Emitted from a Chainlinked contract when a request is sent to an oracle      |
| [ChainlinkFulfilled](#chainlinkfulfilled) | Emitted from a Chainlinked contract when a request is fulfilled by an oracle |
| [ChainlinkCancelled](#chainlinkcancelled) | Emitted from a Chainlinked contract when a request is cancelled              |

## Modifiers

| Name                                                                             | Description                                                                                                                                              |
|:-------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [recordChainlinkFulfillment](#recordchainlinkfulfillment) | Used on fulfillment callbacks to ensure that the caller and requestId are valid. This is the modifier equivalent of the method validateChainlinkCallback |

## Constants

> 🚧 Namechange Between Versions
>
> From Solidity v0.7 onwards, this constant is renamed to `LINK_DIVISIBILITY`.


| Name                                 | Description                                                                       |
|:------------------------------------ | --------------------------------------------------------------------------------- |
| [LINK](#link) | Helper uint256 to represent the divisibility of a LINK token. Equivalent to 10^18 |

## Structs

| Name                                                          | Description                                                          |
|:------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Chainlink.Request](#chainlinkrequest) | All of the parameters that can be passed over in a Chainlink request |

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

```javascript example
constructor(address _oracle)
  public
{
  setChainlinkOracle(_oracle);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);

    // record an oracle in storage for convenience
    //   so that you don't have to specify it on every request
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

## setChainlinkToken

```javascript
setChainlinkToken(
  address _link
)
```

Sets the stored address for the LINK token which is used to send requests to Oracles. There are different token addresses on different network. See [LINK Token Contracts](../link-token-contracts/) for the address of the LINK token on the network you're deploying to.

```javascript example
constructor(address _link)
  public
{
  setChainlinkToken(_link);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    // set the address of the Chainlink token
    //   because it is different on different networks
    setChainlinkToken(_link);

    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

## setPublicChainlinkToken

```javascript
setPublicChainlinkToken()
```

Sets the stored address for the LINK token based on the public network that the contract is deployed on. This method will only set the LINK token address if the calling contract is on a public network.

```javascript example
constructor(address _link)
  public
{
  if(_link == address(0)) {
    setPublicChainlinkToken();
  } else {
    setChainlinkToken(_link);
  }
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    // If the address passed in for _link is zero
    if(_link == address(0)) {
      // Detect what public network the contract is on
      setPublicChainlinkToken();
    } else {
      // Otherwise set the address to what was passed in
      setChainlinkToken(_link);
    }

    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

## buildChainlinkRequest

```javascript
function buildChainlinkRequest(
    bytes32 _jobId,
    address _callbackAddress,
    bytes4 _callbackFunctionSignature
) returns (Chainlink.Request memory request)
```

Instantiates a Request from the Chainlink contract. A [Request](#chainlinkrequest) is a struct which contains the necessary parameters to be sent to the oracle contract. The `buildChainlinkRequest` function takes an ID, which can be a [Job ID](../jobs/), a callback address to receive the resulting data, and a callback function signature to call on the callback address.

```javascript example
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
    this,
    selector);

  uint256 paymentAmount = 1 * LINK;
  sendChainlinkRequest(request, paymentAmount);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    // build a request that calls the myCallback function defined
    //   below by specifying the address of this contract and the function
    //   selector of the myCallback
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

    // send the request you just built
    sendChainlinkRequest(req, PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

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

```javascript example
function requestPrice()
  public
{
  Chainlink.Request memory request = buildChainlinkRequest(jobId, this, this.callback.selector);
  uint256 paymentAmount = 1 * LINK;

  // send the request that you just built
  sendChainlinkRequest(request, paymentAmount);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  bytes32 latestRequestId;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

    // send the request you just built
    // optionally, save the request ID if you need to differentiate
    //   between different requests that you've made
    latestRequestId = sendChainlinkRequest(req, PAYMENT);
  }


  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks

    if (_requestId == latestRequestId) { // use the saved request ID
      latestPrice = _price;
    }
  }
}
```

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

```javascript example
function requestPriceFrom(address _oracle)
  public
{
  Chainlink.Request memory request = buildChainlinkRequest(jobId, this, this.callback.callbackSelector);
  uint256 paymentAmount = 1 * LINK;

  // send the request that you just built to a specified oracle
  sendChainlinkRequestTo(_oracle, request, paymentAmount);
}
```
```javascript in context
contract MyContract is ChainlinkClient, RateCalculator {
  uint256 constant PAYMENT = 1 * LINK;
  address[3] public oracles = [
    0xc99B3D447826532722E41bc36e644ba3479E4365,
    0x1948C20CC492539968BB9b041F96D6556B4b7001,
    0x83F00b902cbf06E316C95F51cbEeD9D2572a349a
  ];
  bytes32[3] public jobIds = [
    bytes32("493610cff14346f786f88ed791ab7704"),
    bytes32("80fecd06d2e14c67a22cee5f9728e067"),
    bytes32("c179a8180e034cf5a341488406c32827")
  ];
  uint256[3] public latestPriceAverage;

  constructor(address _link) {
    setChainlinkToken(_link);
  }

  function requestPrice() public {
    Chainlink.Request memory req;
    for (uint i = 0; i < oracles.length; i++) {
      req = buildChainlinkRequest(jobIds[i], this, this.myCallback.selector);

      // request a rate from each oracle in the list
      sendChainlinkRequestTo(oracles[i], req, PAYMENT);
    }
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks

    // calculateRate is an example method introduced by the RateCalculator
    //   contract which calculates an average and then returns it to be
    //   stored as latestPriceAverage
    latestPriceAverage = calculateRate(_price);
  }
}
```

## validateChainlinkCallback

```javascript
function validateChainlinkCallback(
    bytes32 _requestId
)
```

Used on fulfillment callbacks to ensure that the caller and `requestId` are valid. They protect ChainlinkClient callbacks from being called by malicious callers. `validateChainlinkCallback` allows for a request to be called

This is the method equivalent of the modifier `recordChainlinkFulfillment`. Either `validateChainlinkCallback` or `recordChainlinkFulfillment` should be used on all fulfillment functions to ensure that the caller and `requestId` are valid. Use the modifier or the method, not both.

`validateChainlinkCallback` emits a [ChainlinkFulfilled](#chainlinkfulfilled) event.

```javascript example
function myCallback(bytes32 _requestId, uint256 _price)
  public
{
  validateChainlinkCallback(_requestId);
  currentPrice = _price;
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    // validateChainlinkCallback should always be called in the callback of a
    //   Chainlink request, this authenticates the caller and ensures
    //   a response has not already been received
    validateChainlinkCallback(_requestId);

    latestPrice = _price;
  }
}
```

> 🚧 Do not call multiple times
>
> Do not call `validateChainlinkCallback` multiple times. The nature of validating the callback is to ensure the response is only received once and not replayed. Calling a second time with the same method ID will trigger a revert. Similarly, your callback should validate using either `validateChainlinkCallback` or `recordChainlinkFulfillment`, not both.

## addChainlinkExternalRequest

```javascript
function addChainlinkExternalRequest(
  address _oracle,
  bytes32 _requestId
)
```

`addChainlinkExternalRequest` allows a Chainlink contract to track unfulfilled requests that it hasn't created itself. For example, contract A creates a request and sets the callback for contract B. Contract B needs to know about the request created by contract A so that it can validate the callback when it is executed.

```javascript example
function expectResponseFor(bytes32 _requestId)
  public
{
  addChainlinkExternalRequest(chainlinkOracleAddress(), _requestId);
}
```
```javascript in context
contract MyContract is ChainlinkClient, Ownable {
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function expectResponseFor(bytes32 _requestId)
    public
    onlyOwner // see caution above about who is permissioned to add requests
  {
    addChainlinkExternalRequest(chainlinkOracleAddress(), _requestId);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    // validation only passes if the request was previoulsy added
    //   through expectResponseFor
    validateChainlinkCallback(_requestId); // always validate callbacks

    latestPrice = _price;
  }
}
```

> 🚧 Be careful adding external requests
>
> Being able to change a request means that you can change the data fed into a contract. Permissioning someone to make external requests can allow them to change the outcome of your contract. You should be sure to make sure that they are a trusted to do so. If they are not trusted to do so, you should put the request making logic on-chain where it is auditable and tamperproof.

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

```javascript example
function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunc,
    uint256 _expiration
) public {
  cancelChainlinkRequest(_requestId, _payment, _callbackFunc, _expiration);
}
```
```javascript in context
contract MyContract is ChainlinkClient, Ownable {
  uint256 constant PAYMENT = 1 * LINK;
  bytes32 jobId;
  uint256 expiration;
  uint256 latestPrice;

  constructor(address _link, address _oracle, bytes32 _jobId) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
    jobId = _jobId;
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(jobId, this, this.myCallback.selector), PAYMENT);
    expiration = block.timestamp + 5 minutes;
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    // validation only passes if the request was previoulsy added
    //   through expectResponseFor
    validateChainlinkCallback(_requestId); // always validate callbacks

    latestPrice = _price;
  }

  function myCancelationMethod(bytes32 _requestId, bytes4 _callbackFunc) public {
    // cancellation must be called from the callback address specified in the request
    cancelChainlinkRequest(_requestId, PAYMENT, _callbackFunc, expiration);
    // the LINK paid for the request is transfered back to the cancelling address
  }

  // You may want a way to handle the LINK returned when a request is cancelled.
  //   withdrawLINK is an example of a method that allows the owner to withdraw the LINK.
  function withdrawLINK() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }
}
```

## useChainlinkWithENS

```javascript
function useChainlinkWithENS(
  address _ens,
  bytes32 _node
)
```

Allows a Chainlink contract to store the addresses of the LINK token and oracle contract addresses without supplying the addresses themselves. We use ENS where available to resolve these addresses. It requires the address of the ENS contract and the node (which is a hash) for the domain.

If your Oracle provider supports using ENS for rolling upgrades to their oracle contract, once you've pointed your Chainlinked contract to the ENS records then you can update the records using [updateChainlinkOracleWithENS](#updatechainlinkoraclewithens).

```javascript example
address constant ROPSTEN_ENS = 0x112234455C3a32FD11230C42E7Bccd4A84e02010;
bytes32 constant ROPSTEN_CHAINLINK_ENS = 0xead9c0180f6d685e43522fcfe277c2f0465fe930fb32b5b415826eacf9803727;

constructor() public {
  useChainlinkWithENS(ROPSTEN_ENS, ROPSTEN_CHAINLINK_ENS);
}
```
```javascript in context
contract MyContract is ChainlinkClient, Ownable {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _ens, bytes32 _node) public {
    // setting the Oracle and LINK token address via ENS records
    //   allows them to be updated later to addresses
    //   that the oracle provider chooses
    useChainlinkWithENS(_ens, _node);
  }

  function updateOracleAddressToLatest()
    public
    onlyOwner
  {
    // this method is protected by the onlyOwner modifier
    //   because there can be risks with updating
    //
    //   see "Updating oracle address" to see if the tradeoff is
    //   right for your use case
    updateChainlinkOracleWithENS();
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

> 🚧 Updating oracle addresses
>
> If an oracle provider supports listing their oracle on ENS, that provides the added security of being able to update any issues that may arise. The tradeoff here is that by using their ENS record, you are allowing whoever controls that record and the corresponding code it points to. If your contract does this, you must either audit the updated code and make sure it matches [Oracle.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/Oracle.sol) or trust whoever can update the records.

## updateChainlinkOracleWithENS

```javascript
function updateChainlinkOracleWithENS()
```

Updates the stored oracle contract address with the latest address resolved through the ENS contract. This requires the oracle provider to support listing their address on ENS.

This method only works after [useChainlinkWithENS](#usechainlinkwithens) has been called on the contract.

```javascript example
function updateOracleAddressToLatest() public {
  updateChainlinkOracleWithENS();
}
```
```javascript in context
contract MyContract is ChainlinkClient, Ownable {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _ens, bytes32 _node) public {
    // setting the Oracle and LINK token address via ENS records
    //   allows them to be updated later to addresses
    //   that the oracle provider chooses
    useChainlinkWithENS(_ens, _node);
  }

  function updateOracleAddressToLatest()
    public
    onlyOwner
  {
    // this method is protected by the onlyOwner modifier
    //   because there can be risks with updating
    //
    //   see "Updating oracle address" to see if the tradeoff is
    //   right for your use case
    updateChainlinkOracleWithENS();
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

> 🚧 Updating oracle addresses
>
> If an oracle provider supports listing their oracle on ENS, that provides the added security of being able to update any issues that may arise. The tradeoff here is that by using their ENS record, you are allowing whoever controls that record and the corresponding code it points to. If your contract does this, you must either audit the updated code and make sure it matches [Oracle.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/Oracle.sol) or trust whoever can update the records.

## chainlinkTokenAddress

```javascript
function chainlinkTokenAddress() returns (address)
```

The `chainlinkTokenAddress` function is a helper used to return the stored address of the Chainlink token. This variable is protected and so only made available through getters and setters.

```javascript example
function withdrawLink() public {
  LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());

  require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
}
```
```javascript in context
contract MyContract is ChainlinkClient, Ownable {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    // validateChainlinkCallback should always be called in the callback of a
    //   Chainlink request, this authenticates the caller and ensures
    //   a response has not already been received
    validateChainlinkCallback(_requestId);

    latestPrice = _price;
  }

  // You may want a way to handle the LINK returned when a request is cancelled.
  //   withdrawLINK is an example of a method that allows the owner to withdraw the LINK.
  function withdrawLINK() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }
}
```

## chainlinkOracleAddress

The `chainlinkOracleAddress` function is a helper used to return the stored address of the oracle contract.

```javascript example
function getOracle() public view returns (address) {
  return chainlinkOracleAddress();
}

```
```javascript in context
contract MyContract is ChainlinkClient, Ownable {
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function expectResponseFor(bytes32 _requestId) public onlyOwner {
    // use oracle address getter to avoid having to pass in the address
    addChainlinkExternalRequest(chainlinkOracleAddress(), _requestId);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

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

> 🚧 Namechange Between Versions
>
> From Solidity v0.7 onwards, this constant is renamed to `LINK_DIVISIBILITY`.

`LINK` is a uint256 constant to represent one whole unit of the LINK token (1000000000000000000). It can be used with another value to specify payment in an easy-to-read format, instead of hardcoding magic numbers.

```javascript example
uint256 constant private ORACLE_PAYMENT = 100 * LINK;
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = "493610cff14346f786f88ed791ab7704";

  // PAYMENT is made to be explicitly 0.1 LINK by dividing by 10
  uint256 constant PAYMENT = LINK / 10;

  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

# Modifiers

## recordChainlinkFulfillment

`recordChainlinkFulfillment` is used on fulfillment callbacks to ensure that the caller and `requestId` are valid. This is the method equivalent of the method `validateChainlinkCallback`.

Either `validateChainlinkCallback` or `recordChainlinkFulfillment` should be used on all Chainlink callback functions to ensure that the sender and `requestId` are valid. They protect ChainlinkClient callbacks from being called by malicious callers. Do not call both of them, or your callback may revert before you can record the reported response.

```javascript example
function myCallback(bytes32 _requestId, uint256 _price)
  public
  recordChainlinkFulfillment(_requestId) // always validate callbacks
{
  currentPrice = _price;
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    sendChainlinkRequest(buildChainlinkRequest(JOB_ID, this, this.myCallback.selector), PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price)
    public
    // validates request in a modifier if that's your preferred style
    recordChainlinkFulfillment(_requestId)
  {
    latestPrice = _price;
  }
}
```

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

> 🚧 Intended for memory
>
> The Request object was intended to be stored in memory. If you have a reason to persist the struct in storage, it is recommended that you do so by copying each attribute over and explicitly copying the bytes in the buffer.

## Attributes
| Name               | Description                                                                                             |
| ------------------ |:------------------------------------------------------------------------------------------------------- |
| id                 | Identifier for the request                                                                              |
| callbackAddress    | Address that the response will be sent to upon fulfillment                                              |
| callbackFunctionId | Selector of the function on the callbackAddress that will be invoked with the response upon fulfillment |
| nonce              | Used to generate the request ID                                                                         |
| buf                | Buffer that stores additional user defined parameters as CBOR                                           |

## Methods

| Name                                                     | Description                                                      |
|:-------------------------------------------------------- | ---------------------------------------------------------------- |
| [add](#add)                       | Add a string value to the run request parameters                 |
| [addBytes](#addbytes)             | Add a bytes value to the run request parameters                  |
| [addInt](#addint)                 | Add an integer value to the run request parameters               |
| [addUint](#adduint)               | Add an unsigned integer to the run request parameters            |
| [addStringArray](#addstringarray) | Add an array of strings as a value in the run request parameters |
| [setBuffer](#setbuffer)           | Directly set the CBOR of the run request parameters              |

### add

```javascript
function add(
  Request memory self,
  string _key,
  string _value
)
```

Add a string value to the run request parameters. Commonly used for `get` with jobs using `httpGet` tasks.

```javascript example
function requestEthereumPrice()
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY");

  sendChainlinkRequest(req, LINK * 1);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

    // specify templated fields in a job specification
    req.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY");

    sendChainlinkRequest(req, PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

### addBytes

```javascript
function addBytes(
  Request memory self,
  string _key,
  bytes _value
)
```

Add a CBOR bytes type value to the run request parameters.

```javascript example
function requestEmojiPopularity(bytes _unicode)
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.addBytes("emojiUnicode", _unicode);

  sendChainlinkRequest(req, LINK * 1);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPlace;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestEmojiPopularity(bytes _unicode) public {
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

    // specify templated fields in a job specification       
    req.addBytes("emojiUnicode", _unicode);

    sendChainlinkRequest(req, PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _place) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPlace = _place;
  }
}
```

### addInt

```javascript
function addInt(
  Request memory self,
  string _key,
  int256 _value
)
```

Add a CBOR signed integer type value to the run request parameters. Commonly used with the `times` parameter of any job using a `multiply` task.

```javascript example
function requestPrice()
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.addInt("times", 100);

  sendChainlinkRequest(req, LINK * 1);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

    // specify templated fields in a job specification
    req.addInt("times", 100);

    sendChainlinkRequest(req, PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

### addUint

```javascript
function addUint(
  Request memory self,
  string _key,
  uint256 _value
)
```

Add a CBOR unsigned integer type value to the run request parameters. Commonly used with the `times` parameter of any job using a `multiply` task.

```javascript example
function requestPrice()
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);

  req.addUint("times", 100);

  sendChainlinkRequest(req, LINK * 1);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice() public {
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

    // specify templated fields in a job specification
    req.addUint("times", 100);

    sendChainlinkRequest(req, PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

### addStringArray

```javascript
function addStringArray(
  Request memory self,
  string _key,
  string[] memory _values
)
```

Add a CBOR array of strings to the run request parameters. Commonly used with the `path` parameter for any job including a `jsonParse` task.

```javascript example
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
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice(string _currency) public {
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);
    string[] memory path = new string[](2);
    path[0] = _currency;
    path[1] = "recent";

    // specify templated fields in a job specification
    req.addStringArray("path", path);

    sendChainlinkRequest(req, PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

### setBuffer

```javascript
function setBuffer(
  Request memory self,
  bytes _data
)
```

Set the CBOR payload directly on the request object, avoiding the cost of encoding the parameters in CBOR. This can be helpful when reading the bytes from storage or having them passed in from off-chain where they were pre-encoded.

```javascript example
function requestPrice(bytes _cbor)
  public
{
  Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

  req.setBuffer(_cbor);

  sendChainlinkRequest(req, PAYMENT);
}
```
```javascript in context
contract MyContract is ChainlinkClient {
  bytes32 constant JOB_ID = bytes32("493610cff14346f786f88ed791ab7704");
  uint256 constant PAYMENT = 1 * LINK;
  uint256 latestPrice;

  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestPrice(bytes _cbor) public {
    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.myCallback.selector);

    // send a request payload that was encoded off-chain then sent on-chain
    req.setBuffer(_cbor);

    sendChainlinkRequest(req, PAYMENT);
  }

  function myCallback(bytes32 _requestId, uint256 _price) public {
    validateChainlinkCallback(_requestId); // always validate callbacks
    latestPrice = _price;
  }
}
```

> 🚧 Be careful setting the request buffer directly
>
> Moving the CBOR encoding logic off-chain can save some gas, but it also opens up the opportunity for people to encode parameters that not all parties agreed to. Be sure that whoever is permissioned to call `setBuffer` is trusted or auditable.
