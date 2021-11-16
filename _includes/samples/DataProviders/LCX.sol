// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

contract LCXChainlink is ChainlinkClient, ConfirmedOwner {
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
     *      Name:           LCX
     *      Listing URL:    ...
     *      ID:             81c63592d97a4485b1d1339b3578e07f
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
      string memory _coin,
      string memory _market
    )
      public
      onlyOwner
    {
      Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
      req.add("coin", _coin);
      req.add("market", _market);
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
