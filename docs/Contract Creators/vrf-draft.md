---
layout: nodes.liquid
date: Last Modified
title: "VRF Draft"
permalink: "docs/vrf-draft/"
hidden: true
---
> 🚧In Development - Do Not Share
>
> You may have received a link to this page for your early feedback. This page is intended for internal and a small number of external participants.


# Background
---

If you are not already familiar with how Chainlink works, data is delivered to smart contracts using a request/response scheme which takes place over two transactions:
  1. Your contract requests data
  2. An oracle responds with data directly to your contract

Usually this request/response scheme plays out over a small number of blocks.

This is enough background to get started implementing random data in your contracts. However, if you would like a deeper introduction into how Chainlink works, please see:
- [Example Walkthrough](../intermediates-tutorial/) 
- [Create a Chainlinked Project](../create-a-chainlinked-project/) 
- [Example Projects](../example-projects/) 


# Code
---

The latest versions of Solidity v0.6 contracts are available on GitHub:
  * <a href="https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/VRF.sol" target="_blank">VRF.sol</a>
  * <a href="https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/VRFConsumerBase.sol">VRFConsumerBase.sol</a>
  * <a href="https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/VRFCoordinator.sol" target="_blank">VRFCoordinator.sol</a>
  * <a href="https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/VRFRequestIDBase.sol" target="_blank">VRFRequestIDBase.sol</a>


# Implementation
---

Let's get right to adding random data to a contract.

We'll start with **VRFConsumerBase**. This is an abstract contract which defines some requirements for your own smart contract. This code will not compile on its own but rather defines behavior that your contract must implement.


## Constructor

Your contracts must inherit from **VRFConsumerBase**. You can pass additional arguments as needed by your contract logic.

There are two required parameters:
  - `_vrfCoordinator` - the address of the deployed VRFCoordinator you wish to interact with
  - `_link` - the address of the LINK token used for payment

```javascript Solidity v0.6
contract VRFConsumer {
  constructor(<other arguments>, address _vrfCoordinator, address _link)
    VRFConsumerBase(_vrfCoordinator, _link) public {
        // <initialization with other arguments goes here>
    }
}
```

> 📌Ropsten Details
> 
> _vrfCoordinator `0xf720CF1B963e0e7bE9F58fd471EFa67e7bF00cfb`
> _link: `0x20fE562d797A42Dcb3399062AE9546cd06f63280`

See [LINK Token Contracts](../link-token-contracts/) for Ropsten faucet and token details.


## Request

In order to make a request, your contract must hold a balance of LINK to pay for each request. You will also provide some details, including a seed. The seed should be hard for others to anticipate. See "Choosing a Seed", below.

There are three parameters:
  - `_keyHash` - Provided by the oracle (its public key against which randomness is generated)
  - `_fee` - Provided by the oracle
  - `_seed` - Provided by you. This is the seed from which output randomness is determined.

The function returns a `requestId` which is useful to handle concurrent requests. It is passed as the first parameter in the Response (see next section).

```javascript Solidity v0.6
function requestRandomness(bytes32 _keyHash, uint256 _fee, uint256 _seed)
  public returns (bytes32 requestId)
{
  LINK.transferAndCall(vrfCoordinator, _fee, abi.encode(_keyHash, _seed));
  // This is the seed actually passed to the VRF in VRFCoordinator
  uint256 vRFSeed  = makeVRFInputSeed(_keyHash, _seed, address(this), nonces[_keyHash]);
  // nonces[_keyHash] must stay in sync with
  // VRFCoordinator.nonces[_keyHash][this], which was incremented by the above
  // successful LINK.transferAndCall (in VRFCoordinator.randomnessRequest)
  nonces[_keyHash] = nonces[_keyHash].add(1); 
  return makeRequestId(_keyHash, vRFSeed);
}
```

> 📌Ropsten Details
>
> _keyHash `0xced103054e349b8dfb51352f0f8fa9b5d20dde3d06f9f43cb2b85bc64b238205`
> _fee `1 LINK`

> 👍Example request
>
> See [Ropsten tx](https://ropsten.etherscan.io/tx/0x756f416eb14718f55585fc6269dbf9db6d19a509b369bf0501a95d9196afd68d/#eventlog) where the **VRFCoordinator** receives a request and emits event `RandomnessRequest`


## Response

Once a request is received, an oracle prepares a response. The response includes randomness and a proof at how the randomness was generated. The response is sent to the **VRFCoordinator**.

The **VRFCoordinator** validates the oracle's response to your request. After the response is validated, it calls your contract's `fulfillRandomness` method. Your contract must implement this method.

This is where your application puts the random data it receives to use!

There are two parameters:
  - `requestId` - The ID returned by the request (useful for concurrent requests)
  - `randomness` - The VRF output

```javascript Solidity v0.6
function fulfillRandomness(bytes32 requestId, uint256 randomness) external {
    // Do something with randomness
}
```

> 👍Example fulfilment
>
> See [Ropsten tx](https://ropsten.etherscan.io/tx/0x0afaf0d5ae46f27f07bf9b73f90c62a4e3c37ac3196ee2906ee506331874867c) where a node calls **VRFCoordinator** method `fullfillRandomnessEvent`. The **VRFCoordinator** subsequently calls the **Example Consumer** method `fullfillRandomness` and returns a random uint256 of `b141fd05f9358e84c44c6b03e6d36dc4814c50b1b04af3c7f0254dda4abbf01e`


# Choosing a Seed

The source of your seeds should be hard for anyone to influence or predict. Any party who can influence them could in principle collude with the oracle (who can instantly compute the VRF output for any given seed) to bias the outcomes from your contract in their favor.

For example, the block hash is a natural choice of seed for many applications, but miners in control of a substantial fraction of hashing power and with access to VRF outputs could check the result of prospective block hashes as they are mined, and decide not to publish a block if they don't like the outcome it will lead to.

On the other hand, using block hashes as the seed makes it particularly easy to estimate the economic cost to a miner for this kind of cheating (namely, the block reward and transaction fees they forgo by refraining from publishing a block.)


# Reference


## Job details
---

Send a job to the **VRFCoordinator** with these details:
  * VRFCoordinator Address: <a href="https://ropsten.etherscan.io/address/0xf720CF1B963e0e7bE9F58fd471EFa67e7bF00cfb" target="_blank">`0xf720CF1B963e0e7bE9F58fd471EFa67e7bF00cfb`</a>
  * JobID: `f1887d5b8b33494982689a7cebdca166`
  * VRF Key Hash: `0xced103054e349b8dfb51352f0f8fa9b5d20dde3d06f9f43cb2b85bc64b238205`

## Ropsten Contracts

See [LINK Token Contracts](../link-token-contracts/) for Ropsten faucet and token details.

|Name|Address|
|:---|:---|
|**VRFCoordinator**|<a href="https://ropsten.etherscan.io/address/0xf720CF1B963e0e7bE9F58fd471EFa67e7bF00cfb" target="_blank">`0xf720CF1B963e0e7bE9F58fd471EFa67e7bF00cfb`</a>|
|**Example Consumer**|<a href="https://ropsten.etherscan.io/address/0xB8173C6f42EB1EC14fd4c0CFF37f5508dE26d6FA" target="_blank">`0xB8173C6f42EB1EC14fd4c0CFF37f5508dE26d6FA`</a>|