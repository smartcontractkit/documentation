# SPDX-License-Identifier: MIT
# @version ^0.3.3
import interfaces.VRFCoordinatorV2 as VRFCoordinatorV2

NUM_WORDS: constant(uint32) = 1
MAX_ARRAY_SIZE: constant(uint256) = 10
REQUEST_CONFIRMATIONS: constant(uint16) = 3
CALLBACK_GAS_LIMIT: constant(uint32) = 100000

vrf_coordinator: public(VRFCoordinatorV2)
subscription_id: uint64
key_hash: bytes32
random_words: public(uint256[NUM_WORDS])

event ReturnedRandomness:
    random_words: uint256[NUM_WORDS]

@external
def __init__(_subscription_id: uint64, _vrf_coordinator_address: address, _key_hash: bytes32):
    self.vrf_coordinator = VRFCoordinatorV2(_vrf_coordinator_address)
    self.subscription_id = _subscription_id
    self.key_hash = _key_hash

@external
def request_random_words():
    self.vrf_coordinator.requestRandomWords(
        self.key_hash,
        self.subscription_id,
        REQUEST_CONFIRMATIONS,
        CALLBACK_GAS_LIMIT,
        NUM_WORDS
    )

@internal
def fulfillRandomWords(request_id: uint256, _random_words: DynArray[uint256, MAX_ARRAY_SIZE]):
    self.random_words = [_random_words[0]]
    log ReturnedRandomness(self.random_words)

# In solidity, this is the equivalent of inheriting the VRFConsumerBaseV2
# Vyper doesn't have inheritance, so we just add the function here
# Also, we need to use `DynArray` so our function selector is the same as the one Chainlink VRF is looking for:
# Function Signature: rawFulfillRandomWords(uint256,uint256[])
# Function selector: 0x1fe543e3
@external
def rawFulfillRandomWords(requestId: uint256, randomWords: DynArray[uint256, MAX_ARRAY_SIZE]):
    assert msg.sender == self.vrf_coordinator.address, "Only coordinator can fulfill!"
    self.fulfillRandomWords(requestId, randomWords)

