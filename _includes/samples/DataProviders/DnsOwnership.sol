// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract DnsOwnershipChainlink is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    bytes32 private jobId;
    bool public proof;
    uint256 oraclePayment;

    /**
     * Network: Goerli
     * Oracle:
     *      Name:           LinkPool
     *      Listing URL:    https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb?network=42
     *      Address:        0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd
     * Job:
     *      Name:           DNS Record Check
     *      ID:             d6fad25a95024aef81eb440f0ab0825e
     *      Fee:            0.1 LINK
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xB9756312523826A566e222a34793E414A81c88E1);
        jobId = 'd6fad25a95024aef81eb440f0ab0825e';
        oraclePayment = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    /**
     *  Request proof to check if the address `_record` owns the DNS name `_name`
     *
     */
    function requestProof(string memory _name, string memory _record) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add('name', _name);
        req.add('record', _record);
        sendChainlinkRequest(req, oraclePayment);
    }

    /**
     * Callback function called by the oracle to submit the `_proof` . If true, this means that the address owns the dns name
     *
     */
    function fulfill(bytes32 _requestId, bool _proof) public recordChainlinkFulfillment(_requestId) {
        proof = _proof;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }
}
