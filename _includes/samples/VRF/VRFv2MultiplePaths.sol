// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
// It shows how to setup multiple execution paths for handling a response.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract VRFv2MultiplePaths is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // Goerli coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf/v2/supported-networks/#configurations
    address vrfCoordinator = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/supported-networks/#configurations
    bytes32 keyHash =
        0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;

    uint32 callbackGasLimit = 100_000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 1 random value in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;

    enum Variable {
        A,
        B,
        C
    }

    uint256 public variableA;
    uint256 public variableB;
    uint256 public variableC;

    mapping(uint256 => Variable) public requests;

    // events
    event FulfilledA(uint256 requestId, uint256 value);
    event FulfilledB(uint256 requestId, uint256 value);
    event FulfilledC(uint256 requestId, uint256 value);

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }

    function updateVariable(uint256 input) public {
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        if (input % 2 == 0) {
            requests[requestId] = Variable.A;
        } else if (input % 3 == 0) {
            requests[requestId] = Variable.B;
        } else {
            requests[requestId] = Variable.C;
        }
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        Variable variable = requests[requestId];
        if (variable == Variable.A) {
            fulfillA(requestId, randomWords[0]);
        } else if (variable == Variable.B) {
            fulfillB(requestId, randomWords[0]);
        } else if (variable == Variable.C) {
            fulfillC(requestId, randomWords[0]);
        }
    }

    function fulfillA(uint256 requestId, uint256 randomWord) private {
        // execution path A
        variableA = randomWord;
        emit FulfilledA(requestId, randomWord);
    }

    function fulfillB(uint256 requestId, uint256 randomWord) private {
        // execution path B
        variableB = randomWord;
        emit FulfilledB(requestId, randomWord);
    }

    function fulfillC(uint256 requestId, uint256 randomWord) private {
        // execution path C
        variableC = randomWord;
        emit FulfilledC(requestId, randomWord);
    }
}
