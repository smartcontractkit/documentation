// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract KrakenChainlink is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 oraclePayment;
    uint256 public currentPrice;

    /**
     * Network: Rinkeby
     * Oracle:
     *      Name:           ...
     *      Listing URL:    ...
     *      Address:        0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
     * Job:
     *      Name:           Kraken Rates
     *      Listing URL:    ...
     *      ID:             49ea116156cd44be997e7670a5dde80d
     *      Fee:            1 LINK
     */
    constructor(uint256 _oraclePayment) ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);
        oraclePayment = _oraclePayment;
    }

    function requestPrice(
        address _oracle,
        bytes32 _jobId,
        string memory _index
    ) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
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
