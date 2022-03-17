---
layout: nodes.liquid
date: Last Modified
title: "On-Chain Warning Flag"
permalink: "docs/on-chain-warning-flag/"
hidden: true
---
> 🚧In Development - Do Not Share
>
> You may have received a link to this page for your early feedback. This page is intended for internal and a small number of external participants.


# Background
---

Data feed consumers need strong monitoring around the Chainlink reference contracts they’re using. The goal of this feature is to provide the ability for smart contracts to check the state of a reference contract and depending on the result, the user could decide to disable (even automatically) functionality such as exchange or liquidations at the smart contract level for their respective DApp. 

A smart contract has been deployed containing a mapping of every data feed mapped to a state. The state will be a boolean marking whether a reference contract address is in a warning state depending on the behavior of the data feed. This state will initially be set by the Chainlink team which benefits from a strong monitoring capability and 24/7 coverage. Later on, it’s intended to decentralize this process in order to allow for automation as well as governance to take over the setting of the flag. 

# Code
---

The latest versions of Solidity v0.6 contracts are available on GitHub:
  * <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/Flags.sol" target="_blank">Flags.sol</a>


# Live contracts
---

Mainnet: <a href="https://etherscan.io/address/0x4A5b9B4aD08616D11F3A402FF7cBEAcB732a76C6" target="_blank">0x4A5b9B4aD08616D11F3A402FF7cBEAcB732a76C6</a>
Kovan: <a href="https://kovan.etherscan.io/address/0x6292aa9a6650ae14fbf974e5029f36f95a1848fd" target="_blank">0x6292aa9a6650ae14fbf974e5029f36f95a1848fd</a>


# Implementation
---

Using the warning flag is pretty straight forward in your contract. Simply set a reference to the Flags contract. Then check if a flag is raised for the desired feed.


## Constructor

A reference to the warning flag contract needs to be set.

```javascript Solidity v0.6
import "@chainlink/contracts/src/v0.6/Flags.sol"

contract FeedConsumer {
  Flags internal warningFlags;
  constructor(<other arguments>, address _warningFlags)
    warningFlags = Flags(_warningFlags);
}
```


## Check flag

In order to check the flag on a specific feed, call the `.getFlag(address)` method on the Flags contract.

The function takes one parameter:
  - `address` - The contract address for the feed you want to check

The function below checks that the flag for the feed at `0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F` has not been raised, before it continues execution of the critical section.

```javascript Solidity v0.6
function doSomethingCritical() public returns (bool) {
  // check that flag is not raised
  require(!warningFlags.getFlag("0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F"));

  // add your critical logic here that uses the
  // feed at 0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F
  return true;
}
```