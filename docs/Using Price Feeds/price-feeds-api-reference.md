---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Data Feeds API Reference"
permalink: "docs/price-feeds-api-reference/"
metadata:
  description: "API reference for using Chainlink Data Feeds in smart contracts."
---

When you use data feeds, retrieve the feeds through the `AggregatorV3Interface` and the proxy address. Optionally, you can call variables and functions in the `AccessControlledOffchainAggregator` contract to get information about the aggregator behind the proxy.

**Topics**

+ [AggregatorV3Interface contract](#aggregatorv3interface)
+ [AccessControlledOffchainAggregator contract](#accesscontrolledoffchainaggregator)

## AggregatorV3Interface

Import this interface to your contract and use it to run functions in the proxy contract. Create the interface object by pointing to the proxy address. For example, on Rinkeby you could create the interface object in the constructor of your contract using the following example:

```solidity Solidity
/**
 * Network: Rinkeby
 * Data Feed: BTC/USD
 * Address: 0xECe365B379E1dD183B20fc5f022230C044d51404
 */
constructor() {
    priceFeed = AggregatorV3Interface(0xECe365B379E1dD183B20fc5f022230C044d51404);
}
```

To see examples for how to use this interface, read the [Using Data Feeds](/docs/get-the-latest-price/) guide.

You can see the code for the [`AggregatorV3Interface` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol) on GitHub.

### Functions in AggregatorV3Interface

|Name|Description|
|---|---|
|[decimals](#decimals)|The number of decimals in the response.|
|[description](#description)|The description of the aggregator that the proxy points to.|
|[getRoundData](#getrounddata)|Get data from a specific round.|
|[latestRoundData](#latestrounddata)|Get data from the latest round.|
|[version](#version)|The version representing the type of aggregator the proxy points to.|

#### decimals

Get the number of decimals present in the response value.

```solidity Solidity
function decimals() external view returns (uint8);
```

* `RETURN`: The number of decimals.

#### description

Get the description of the underlying aggregator that the proxy points to.

```solidity Solidity
function description() external view returns (string memory);
```

* `RETURN`: The description of the underlying aggregator.

#### getRoundData

Get data about a specific round, using the `roundId`.

```solidity Solidity
function getRoundData(uint80 _roundId)
  external
  view
  returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  );
```

**Parameters:**

* `_roundId`: The round ID

**Return values:**

* `roundId`: The round ID
* `answer`: The answer for this round
* `startedAt`: Timestamp of when the round started
* `updatedAt`: Timestamp of when the round was updated
* `answeredInRound`: The round ID in which the answer was computed

#### latestRoundData

Get the price from the latest round.

```solidity Solidity
function latestRoundData() external view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
```

**Return values:**

* `roundId`: The round ID.
* `answer`: The price.
* `startedAt`: Timestamp of when the round started.
* `updatedAt`: Timestamp of when the round was updated.
* `answeredInRound`: The round ID of the round in which the answer was computed.

#### version

The version representing the type of aggregator the proxy points to.

```solidity Solidity
function version() external view returns (uint256)
```

* `RETURN`: The version number.

## AccessControlledOffchainAggregator

This is the contract for the aggregator. You can call functions on the aggregator directly, but it is a best practice to use the [AggregatorV3Interface](#aggregatorv3interface) to run functions on the proxy instead so that changes to the aggregator do not affect your application. Read the aggregator contract only if you need functions that are not available in the proxy.

The aggregator contract has several variables and functions that might be useful for your application. Although aggregator contracts are similar for each data feed, some aggregators have different variables. Use the `typeAndVersion()` function on the aggregator to identify what type of aggregator it is and what version it is running.

Always check the contract source code and configuration to understand how specific data feeds operate. For example, the [aggregator contract for BTC/USD on Arbitrum](https://arbiscan.io/address/0x942d00008d658dbb40745bbec89a93c253f9b882#code) is different from the aggregators on other networks.

For examples of the contracts that are typically used in aggregator deployments, see the [libocr repository](https://github.com/smartcontractkit/libocr/blob/master/contract/) on GitHub.

### Variables and functions in AccessControlledOffchainAggregator

This contract imports `OffchainAggregator` and `SimpleReadAccessController`, which also include their own imports. The variables and functions lists include the publicly accessible items from these imported contracts.

A simple way to read the variables or functions is to get the ABI from a blockchain explorer and point the ABI to the aggregator address. To do this in Remix, follow the [Using the ABI with AtAddress](https://remix-ide.readthedocs.io/en/latest/run.html#using-the-abi-with-ataddress) guide in the Remix documentation. As an example, you can find the ABI for the BTC/USD aggregator by viewing the [contract code in Etherscan](https://etherscan.io/address/0xae74faa92cb67a95ebcab07358bc222e33a34da7#code).

**Variables:**

|Name|Description|
|---|---|
|LINK|The address for the LINK token contract on a specific network.|
|billingAccessController|The address for the billingAccessController, which limits access to the [billing configuration](https://github.com/smartcontractkit/libocr/blob/master/contract/OffchainAggregatorBilling.sol) for the aggregator.|
|checkEnabled|A boolean that indicates if access is limited to addresses on the internal access list.|
|maxAnswer|The highest median answer that the aggregator will accept. This prevents the aggregator from accepting extreme erroneous values.|
|minAnswer|The lowest median answer that the aggregator will accept. This prevents the aggregator from accepting extreme erroneous values.|
|owner|The address that owns this aggregator contract. This controls which address can execute specific functions.|

**Functions:**

|Name|Description|
|---|---|
|[decimals](#decimals-1)|Return the number of digits of precision for the stored answer. Answers are stored in fixed-point format.|
|[description](#description-1)|Return a description for this data feed. Usually this is an asset pair for a price feed.|
|[getAnswer](#getanswer)|Get an answer from a specific aggregator round. Use this to get historical data.|
|[getBilling](#getbilling)|Retrieve the current billing configuration.|
|[getRoundData](#getrounddata-1)|Get the full information for a specific aggregator round including the answer and update timestamps. Use this to get the full historical data for a round.|
|[getTimestamp](#gettimestamp)|Get the block timestamp from a specific aggregator round.|
|[hasAccess](#hasaccess)|Check if an address has internal access.|
|[latestAnswer](#latestanswer)|Return the most recent answer accepted by the aggregator.|
|[latestConfigDetails](#latestconfigdetails)|Return information about the current off-chain reporting protocol configuration.|
|[latestRound](#latestround)|Return the `roundID` for the most recent aggregator round.|
|[latestRoundData](#latestrounddata-1)|Get the full information for the most recent round including the answer and update timestamps.|
|[latestTimestamp](#latesttimestamp)|Get the block timestamp when the last answer was accepted.|
|[latestTransmissionDetails](#latesttransmissiondetails)|Get information about the most recent answer.|
|[linkAvailableForPayment](#linkavailableforpayment)|Get the amount of LINK on this contract that is available to make payments to oracles. This value can be negative if there are outstanding payment obligations.|
|[oracleObservationCount](#oracleobservationcount)|Returns the number of observations that oracle is due to be reimbursed for.|
|[owedPayment](#owedpayment)|Returns how much LINK an oracle is owed for its observations.|
|[requesterAccessController](#requesteraccesscontroller)|Returns the address for the access controller contract.|
|[transmitters](#transmitters)|The oracle addresses that can report answers to this aggregator.|
|[typeAndVersion](#typeandversion)|Returns the aggregator type and version. Many aggregators are `AccessControlledOffchainAggregator 3.0.0`, but there are other variants in production. The version is for the type of aggregator, and different from the contract `version`.|
|[validatorConfig](#validatorconfig)|Returns the address and the gas limit for the validator contract.|
|[version](#version-1)|Returns the contract version. This is different from the `typeAndVersion` for the aggregator.|

#### decimals

Return the number of digits of precision for the stored answer. Answers are stored in fixed-point format.

```solidity Solidity
function decimals() external view returns (uint8 decimalPlaces);
```

#### description

Return a description for this data feed. Usually this is an asset pair for a price feed.

```solidity Solidity
function description()
  public
  override
  view
  checkAccess()
  returns (string memory)
{
  return super.description();
}
```

#### getAnswer

Get an answer from a specific aggregator round. Use this to get historical data.

```solidity Solidity
function getAnswer(uint256 _roundId)
  public
  override
  view
  checkAccess()
  returns (int256)
{
  return super.getAnswer(_roundId);
}
```

#### getBilling

Retrieve the current billing configuration.

```solidity Solidity
function getBilling()
  external
  view
  returns (
    uint32 maximumGasPrice,
    uint32 reasonableGasPrice,
    uint32 microLinkPerEth,
    uint32 linkGweiPerObservation,
    uint32 linkGweiPerTransmission
  )
{
  Billing memory billing = s_billing;
  return (
    billing.maximumGasPrice,
    billing.reasonableGasPrice,
    billing.microLinkPerEth,
    billing.linkGweiPerObservation,
    billing.linkGweiPerTransmission
  );
}
```

#### getRoundData

Get the full information for a specific aggregator round including the answer and update timestamps. Use this to get the full historical data for a round.

```solidity Solidity
function getRoundData(uint80 _roundId)
  public
  override
  view
  checkAccess()
  returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  )
{
  return super.getRoundData(_roundId);
}
```

#### getTimestamp

Get the block timestamp from a specific aggregator round.

```solidity Solidity
function getTimestamp(uint256 _roundId)
  public
  override
  view
  checkAccess()
  returns (uint256)
{
  return super.getTimestamp(_roundId);
}
```

#### hasAccess

Check if an address has internal access.

```solidity Solidity
function hasAccess(
  address _user,
  bytes memory _calldata
)
  public
  view
  virtual
  override
  returns (bool)
{
  return super.hasAccess(_user, _calldata) || _user == tx.origin;
}
```

#### latestAnswer

Return the most recent answer accepted by the aggregator.

```solidity Solidity
function latestAnswer()
  public
  override
  view
  checkAccess()
  returns (int256)
{
  return super.latestAnswer();
}
```

#### latestConfigDetails

Return information about the current off-chain reporting protocol configuration.

```solidity Solidity
function latestConfigDetails()
  external
  view
  returns (
    uint32 configCount,
    uint32 blockNumber,
    bytes16 configDigest
  )
{
  return (s_configCount, s_latestConfigBlockNumber, s_hotVars.latestConfigDigest);
}
```

#### latestRound

Return the `roundID` for the most recent aggregator round.

```solidity Solidity
function latestRound()
  public
  override
  view
  checkAccess()
  returns (uint256)
{
  return super.latestRound();
}
```

#### latestRoundData

Get the full information for the most recent round including the answer and update timestamps.

```solidity Solidity
function latestRoundData()
  public
  override
  view
  checkAccess()
  returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  )
{
  return super.latestRoundData();
}
```

#### latestTimestamp

Get the block timestamp when the last answer was accepted.

```solidity Solidity
function latestTimestamp()
  public
  override
  view
  checkAccess()
  returns (uint256)
{
  return super.latestTimestamp();
}
```

#### latestTransmissionDetails

Get information about the most recent answer.

```solidity Solidity
function latestTransmissionDetails()
  external
  view
  returns (
    bytes16 configDigest,
    uint32 epoch,
    uint8 round,
    int192 latestAnswer,
    uint64 latestTimestamp
  )
{
  require(msg.sender == tx.origin, "Only callable by EOA");
  return (
    s_hotVars.latestConfigDigest,
    uint32(s_hotVars.latestEpochAndRound >> 8),
    uint8(s_hotVars.latestEpochAndRound),
    s_transmissions[s_hotVars.latestAggregatorRoundId].answer,
    s_transmissions[s_hotVars.latestAggregatorRoundId].timestamp
  );
}
```

#### linkAvailableForPayment

Get the amount of LINK on this contract that is available to make payments to oracles. This value can be negative if there are outstanding payment obligations.

```solidity Solidity
function linkAvailableForPayment()
  external
  view
  returns (int256 availableBalance)
{
  // there are at most one billion LINK, so this cast is safe
  int256 balance = int256(LINK.balanceOf(address(this)));
  // according to the argument in the definition of totalLINKDue,
  // totalLINKDue is never greater than 2**172, so this cast is safe
  int256 due = int256(totalLINKDue());
  // safe from overflow according to above sizes
  return int256(balance) - int256(due);
}
```

#### oracleObservationCount

Returns the number of observations that oracle is due to be reimbursed for.

```solidity Solidity
function oracleObservationCount(address _signerOrTransmitter)
  external
  view
  returns (uint16)
{
  Oracle memory oracle = s_oracles[_signerOrTransmitter];
  if (oracle.role == Role.Unset) { return 0; }
  return s_oracleObservationsCounts[oracle.index] - 1;
}
```

#### owedPayment

Returns how much LINK an oracle is owed for its observations.

```solidity Solidity
function owedPayment(address _transmitter)
  public
  view
  returns (uint256)
{
  Oracle memory oracle = s_oracles[_transmitter];
  if (oracle.role == Role.Unset) { return 0; }
  Billing memory billing = s_billing;
  uint256 linkWeiAmount =
    uint256(s_oracleObservationsCounts[oracle.index] - 1) *
    uint256(billing.linkGweiPerObservation) *
    (1 gwei);
  linkWeiAmount += s_gasReimbursementsLinkWei[oracle.index] - 1;
  return linkWeiAmount;
}
```

#### requesterAccessController

Returns the address for the access controller contract.

```solidity Solidity
function requesterAccessController()
  external
  view
  returns (AccessControllerInterface)
{
  return s_requesterAccessController;
}
```

#### transmitters

The oracle addresses that can report answers to this aggregator.

```solidity Solidity
function transmitters()
  external
  view
  returns(address[] memory)
{
    return s_transmitters;
}
```

#### typeAndVersion

Returns the aggregator type and version. Many aggregators are `AccessControlledOffchainAggregator 2.0.0`, but there are other variants in production. The version is for the type of aggregator, and different from the contract `version`.

```solidity Solidity
function typeAndVersion()
  external
  override
  pure
  virtual
  returns (string memory)
{
  return "AccessControlledOffchainAggregator 2.0.0";
}
```

#### validatorConfig

Returns the address and the gas limit for the validator contract.

```solidity Solidity
function validatorConfig()
  external
  view
  returns (AggregatorValidatorInterface validator, uint32 gasLimit)
{
  ValidatorConfig memory vc = s_validatorConfig;
  return (vc.validator, vc.gasLimit);
}
```

#### version

Returns the contract version. This is different from the `typeAndVersion` for the aggregator.

```solidity Solidity
function version() external view returns (uint256);
```
