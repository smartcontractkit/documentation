// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

contract DnsOwnershipChainlink is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    
    uint256 oraclePayment;
    address private oracle;
    bytes32 private jobId;
    bool public proof;
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           LinkPool
     *      Listing URL:    https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb?network=42
     *      Address:        0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd
     * Job: 
     *      Name:           DNS Record Check
     *      Listing URL:    https://market.link/jobs/bf1a410f-ce93-497d-83ac-e63fed9d83bd?network=42
     *      ID:             791bd73c8a1349859f09b1cb87304f71
     *      Fee:            0.1 LINK
     */
    constructor() ConfirmedOwner(msg.sender) {
      setPublicChainlinkToken();
      oracle = 0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd;
      jobId = "791bd73c8a1349859f09b1cb87304f71";
      oraclePayment = 0.1 * 10 ** 18; // (Varies by network and job)
    }
    
    /**
    *  Request proof to check if the address `_record` owns the DNS name `_name`
    *
    */
    function requestProof
    (
      string memory _name,
      string memory _record
    ) 
      public 
      onlyOwner 
    {
      Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
      req.add("name", _name);
      req.add("record", _record);
      sendChainlinkRequestTo(oracle, req, oraclePayment);
    }
    /**
    * Callback function called by the oracle to submit the `_proof` . If true, this means that the address owns the dns name
    *
    */
    function fulfill(bytes32 _requestId, bool _proof)
      public
      recordChainlinkFulfillment(_requestId)
    {
      proof = _proof;
    }
}
