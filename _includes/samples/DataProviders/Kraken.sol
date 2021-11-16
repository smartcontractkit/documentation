// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

contract KrakenChainlink is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    
    uint256 oraclePayment;
    uint256 public currentPrice;
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           ...
     *      Listing URL:    ...
     *      Address:        0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
     * Job: 
     *      Name:           Kraken Rates
     *      Listing URL:    ...
     *      ID:             8f4eeda1a8724077a0560ee84eb006b4
     *      Fee:            1 LINK
     */
    constructor(uint256 _oraclePayment) ConfirmedOwner(msg.sender) {
      setPublicChainlinkToken();
      oraclePayment = _oraclePayment;
    }

    function requestPrice
    (
      address _oracle,
      bytes32 _jobId,
      string memory _index
    )
      public
      onlyOwner
    {
      Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
      req.add("index", _index);
      req.addInt("times", 100);
      sendChainlinkRequestTo(_oracle, req, oraclePayment);
    }

    function fulfill(bytes32 _requestId, uint256 _price)
      public
      recordChainlinkFulfillment(_requestId)
    {
      currentPrice = _price;
    }
}