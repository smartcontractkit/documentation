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

contract sportContract is ChainlinkClient {
    using Chainlink for Chainlink.Request;
  
    bytes32 public data;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           Chainlink DevRel - Kovan
     *      Address:        0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd
     * Job: 
     *      Name:           SportsDataIO
     *      ID:             9abb342e5a1d41c6b72941a3064cf55f
     *      Fee:            0.1 LINK
     */
    constructor() {
        setPublicChainlinkToken();
        oracle = 0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd;
        jobId = "9abb342e5a1d41c6b72941a3064cf55f";
        fee = 0.1 * 10 ** 18; // (Varies by network and job)
    }

    // Initial Request
    function requestData(string memory _date, string memory _team) public returns (bytes32 requestId)  {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("date", _date);
        req.add("teamName", _team);
        return sendChainlinkRequestTo(oracle, req, fee);
    }

    // Callback Function
    function fulfill(bytes32 _requestId, bytes32 _data) public recordChainlinkFulfillment(_requestId) {
        data = _data;
    }
    
    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract


}
