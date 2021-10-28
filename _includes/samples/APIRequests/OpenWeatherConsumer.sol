// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */
contract OpenWeatherConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    uint256 public result;
    
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           Alpha Chain - Kovan
     *      Listing URL:    https://market.link/nodes/ef076e87-49f4-486b-9878-c4806781c7a0?start=1614168653&end=1614773453
     *      Address:        0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b
     * Job: 
     *      Name:           OpenWeather Data
     *      Listing URL:    https://market.link/jobs/e10388e6-1a8a-4ff5-bad6-dd930049a65f
     *      ID:             235f8b1eeb364efc83c26d0bef2d0c01
     *      Fee:            0.1 LINK
     */
    constructor() {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "235f8b1eeb364efc83c26d0bef2d0c01";
        fee = 0.1 * 10 ** 18; // (Varies by network and job)
    }
    
    /**
     * Initial request
     */
    function requestWeatherTemperature(string memory _city) public {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillWeatherTemperature.selector);
        req.add("city", _city);
        sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**
     * Callback function
     */
    function fulfillWeatherTemperature(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        result = _result;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}