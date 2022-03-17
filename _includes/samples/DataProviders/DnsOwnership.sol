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
    bool public proof;
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           LinkPool
     *      Listing URL:    https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb?network=42
     *      Address:        0x56dd6586DB0D08c6Ce7B2f2805af28616E082455
     * Job: 
     *      Name:           DNS Record Check
     *      Listing URL:    https://market.link/jobs/bf1a410f-ce93-497d-83ac-e63fed9d83bd?network=42
     *      ID:             791bd73c8a1349859f09b1cb87304f71
     *      Fee:            0.1 LINK
     */
    constructor(uint256 _oraclePayment) ConfirmedOwner(msg.sender) {
      setPublicChainlinkToken();
      oraclePayment = _oraclePayment;
    }

    function requestProof
    (
      address _oracle,
      bytes32 _jobId,
      string memory _txt,
      string memory _name,
      string memory _record
    ) 
      public 
      onlyOwner 
    {
      Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
      req.add("type", _txt);
      req.add("name", _name);
      req.add("record", _record);
      sendChainlinkRequestTo(_oracle, req, oraclePayment);
    }

    function fulfill(bytes32 _requestId, bool _proof)
      public
      recordChainlinkFulfillment(_requestId)
    {
      proof = _proof;
    }
}
