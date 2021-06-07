---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Making Keeper Compatible Contracts'
permalink: 'docs/chainlink-keepers/compatible-contracts/'
whatsnext:
  {
    'Register for Upkeep': '/docs/chainlink-keepers/register-upkeep/',
  }
---
{% include keepers-beta %}

For a contract to be compatible with Chainlink Keepers, it must implement `checkUpkeep` and `performUpkeep` from the `KeeperCompatibleInterface`.

You can read about the interface you need to implement, or jump directly to an example.

1. [The Interface](#keepercompatibleinterface)
1. [Example Contract](#example-contract)


# `KeeperCompatibleInterface`

## Functions

| Name                            | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [checkUpkeep](#checkupkeep)     | Checks if the contract requires work to be done.                     |
| [performUpkeep](#performupkeep) | Performs the work on the contract, if instructed by `checkUpkeep()`. |

### `checkUpkeep`

Checks if the contract requires work to be done.

This method does not actually need to be executable, and since it is only ever simulated by the Keeper node, it is acceptable to consume lots of gas. The data returned by the `checkUpkeep` simulation will be passed into this the `performUpkeep` as described later. To ensure that it is never called, you may want to add the [`cannotExecute`](#cannotexecute) modifier from `KeeperBase` to your implementation of this method.

> ⚠️ NOTE
> Since `checkUpkeep` is only ever performed off-chain in simulation, for most cases it is best to treat this as a `view` function and not modify any state.

```solidity
  function checkUpkeep(
    bytes calldata checkData
  )
    external
    returns (
        bool upkeepNeeded,
        bytes memory performData
    );
```

#### Parameters

- `checkData`: Data passed to the contract when checking for Upkeep. Specified in the Upkeep registration so it is always the same for a registered Upkeep.

#### Return Values

- `upkeepNeeded`: Indicates whether the Keeper should call `performUpkeep` or not.
- `performData`: Bytes that the Keeper should call `performUpkeep` with, if Upkeep is needed. If you would like to encode data to decode later, try `abi.encode`.

### `performUpkeep`

Performs work on the contract. Executed by a Keeper, via the registry. The data returned by the `checkUpkeep` simulation will be passed into this method to actually be executed.

```solidity
  function performUpkeep(
    bytes calldata performData
  ) external;
```

#### Parameters

- `performData`: Data which was passed back from the `checkData` simulation. If it is encoded, it can easily be decoded into other types by calling `abi.decode`. This data should always be validated against the contract's current state.

## Modifiers

| Name                            | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| [cannotExecute](#cannotexecute) | Checks if the contract requires work to be done. |

### cannotExecute

In most cases your `checkUpkeep` function should be marked as `view`, but sometimes it might not be possible if you want to use more advanced Solidity features like `DelegateCall` or assembly in your `checkUpkeep` function. Note that these functions cannot be the target of real transaction or state changes.

# Example Contract
The example below represents a simple counter contract. Each time `performUpkeep` is called, it increments its counter by one.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#version=soljson-v0.6.6+commit.6c089d02.js&optimize=false&evmVersion=null&gist=62587a7f0885c4cbdbd587ca0dc74a12" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../../deploy-your-first-contract/" title="">What is Remix?</a>
</div>


```solidity
pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

contract Counter is KeeperCompatibleInterface {
    /**
    * Public counter variable
    */
    uint public counter;


    /**
    * Use an interval in seconds and a timestamp to slow execution of Upkeep
    */
    uint public immutable interval;
    uint public lastTimeStamp;

    
    constructor(uint updateInterval) public {
      interval = updateInterval;
      lastTimeStamp = block.timestamp;

      counter = 0;
    }


    function checkUpkeep(bytes calldata checkData) external override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;

        // We don't use the checkData in this example
        // checkData was defined when the Upkeep was registered
        performData = checkData;
    }

    function performUpkeep(bytes calldata performData) external override {
        lastTimeStamp = block.timestamp;
        counter = counter + 1;

        // We don't use the performData in this example
        // performData is generated by the Keeper's call to your `checkUpkeep` function
        performData;
        
    }
    
}
    
```

> ❗️ WARNING
> DO NOT attempt to send LINK to your contract like you may be used to with [VRF](../../get-a-random-number/). With Chainlink Keepers, contracts are funded via the registry rather than within your contract

Once deployed, your contract doesn't automatically start to receive Upkeep after deployment, it must be registered. See [Register for Upkeep](../register-upkeep/) for more details.
