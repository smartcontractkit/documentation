// SPDX-License-Identifier: MIT
// Example of a single consumer contract which owns the subscription.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol";

/**
 * @notice Simplified example with hardcoded addresses requesting
 * randomness using the VRF V2 API.
 * Production code _should not_ hardcode values such as the VRF coordinator
 * and LINK contract addresses because it could lead to a loss of funds on different
 * networks.
*/
contract VRFSingleConsumerExample is VRFConsumerBaseV2 {
  // COORDINATOR is a reference to the VRFCoordinatorV2 deployed contract.
  VRFCoordinatorV2Interface COORDINATOR;
  // LINKTOKEN is a reference to the LINK token contract.
  LinkTokenInterface LINKTOKEN;

  struct RequestConfig {
    uint64 subId;
    uint32 callbackGasLimit;
    uint16 requestConfirmations;
    uint32 numWords;
    bytes32 keyHash;
  }
  RequestConfig public s_requestConfig;
  uint256[] public s_randomWords;
  uint256 public s_requestId;
  address s_owner;

  constructor()
  VRFConsumerBaseV2(0x6168499c0cFfCaCD319c818142124B7A15E857ab)  // NOTE: Rinkeby coordinator - see docs for other networks
  {
    COORDINATOR = VRFCoordinatorV2Interface(0x6168499c0cFfCaCD319c818142124B7A15E857ab); // NOTE: Rinkeby coordinator - see docs for other networks
    LINKTOKEN = LinkTokenInterface(0x01BE23585060835E02B77ef475b0Cc51aA1e0709); // NOTE: Rinkeby coordinator - see docs for other networks
    s_owner = msg.sender;
    s_requestConfig = RequestConfig({
      // Unset initially - will be set by subscribe() call
      subId: 0,

      // Reasonable default - could be different across different chains.
      callbackGasLimit: 1000000,

      // Reasonable default. Note that this should be set to at least
      // the minimumRequestConfirmations that is returned from VRFCoordinatorV2.getConfig()
      requestConfirmations: 3,

      // The amount of words to request. Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
      numWords: 1,

      // The "gas lane" to use. See docs for available gas lanes. This one is
      // for Rinkeby.
      keyHash: 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc
    });

    // Subscribe upon construction to set the subscription ID defined above.
    subscribe();
  }

  function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
  ) internal override {
    s_randomWords = randomWords;
  }

  // Assumes the subscription is funded sufficiently.
  function requestRandomWords() external onlyOwner {
    RequestConfig memory rc = s_requestConfig;
    // Will revert if subscription is not set and funded.
    s_requestId = COORDINATOR.requestRandomWords(
      rc.keyHash,
      rc.subId,
      rc.requestConfirmations,
      rc.callbackGasLimit,
      rc.numWords
    );
  }

  // Assumes this contract owns LINK
  // This method is analogous to VRFv1, except the amount
  // should be selected based on the keyHash (each keyHash functions like a "gas lane"
  // with different LINK costs).
  function fundAndRequestRandomWords(uint256 amount) external onlyOwner {
    RequestConfig memory rc = s_requestConfig;
    LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(s_requestConfig.subId));
    // Will revert if subscription is not set and funded.
    s_requestId = COORDINATOR.requestRandomWords(
      rc.keyHash,
      rc.subId,
      rc.requestConfirmations,
      rc.callbackGasLimit,
      rc.numWords
    );
  }

  // Assumes this contract owns link
  // NOTE: The value provided is in Juels, NOT in LINK. 1 LINK = 1e18 Juels.
  function topUpSubscription(uint256 amount) external onlyOwner {
    LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(s_requestConfig.subId));
  }

  function withdraw(uint256 amount, address to) external onlyOwner {
    LINKTOKEN.transfer(to, amount);
  }

  function unsubscribe(address to) external onlyOwner {
    // Returns funds to this address
    COORDINATOR.cancelSubscription(s_requestConfig.subId, to);
    s_requestConfig.subId = 0;
  }

  // Keep this separate incase the contract want to unsubscribe and then
  // resubscribe.
  function subscribe() public onlyOwner {
    // Create a subscription, current subId
    address[] memory consumers = new address[](1);
    consumers[0] = address(this);
    s_requestConfig.subId = COORDINATOR.createSubscription();
    COORDINATOR.addConsumer(s_requestConfig.subId, consumers[0]);
  }

  modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }
}