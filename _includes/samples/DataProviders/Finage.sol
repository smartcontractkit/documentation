// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FinageChainlink is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 oraclePayment;
    int256 public data;

    /**
     * Network: Kovan
     * Oracle:
     *      Name:           LinkPool
     *      Listing URL:    https://market.link/nodes/Finage/integrations
     *      Address:        0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd
     * Job:
     *      Name:           Finage
     *      ID:             31d801e2db3743798144ab4f63e3d983
     *      Fee:            0.1 LINK (100000000000000000)
     */
    constructor(uint256 _oraclePayment) ConfirmedOwner(msg.sender) {
        setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
        oraclePayment = _oraclePayment;
    }

    function requestData(
        address _oracle,
        bytes32 _jobId,
        string memory _symbol
    ) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add("symbol", _symbol);
        sendChainlinkRequestTo(_oracle, req, oraclePayment);
    }

    function fulfill(bytes32 _requestId, int256 _data)
        public
        recordChainlinkFulfillment(_requestId)
    {
        data = _data;
    }
}
