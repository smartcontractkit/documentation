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

contract GetGasPrice is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public gasPriceFast;
    uint256 public gasPriceAverage;
    uint256 public gasPriceSafe;

    bytes32 private jobId;
    uint256 private fee;

    event RequestGasPrice(
        bytes32 indexed requestId,
        uint256 gasPriceFast,
        uint256 gasPriceAverage,
        uint256 gasPriceSafe
    );

    /**
     * @notice Initialize the link token and target oracle
     *
     * Goerli Testnet details:
     * Link Token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Oracle: 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7 (Chainlink DevRel)
     * jobId: 7223acbd01654282865b678924126013
     *
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xCC79157eb46F5624204f47AB42b3906cAA40eaB7);
        jobId = "7223acbd01654282865b678924126013";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    /**
     * Create a Chainlink request the gas price from Etherscan
     */
    function requestGasPrice() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        // No need extra parameters for this job. Send the request
        return sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the responses in the form of uint256
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _gasPriceFast,
        uint256 _gasPriceAverage,
        uint256 _gasPriceSafe
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestGasPrice(
            _requestId,
            _gasPriceFast,
            _gasPriceAverage,
            _gasPriceSafe
        );
        gasPriceFast = _gasPriceFast;
        gasPriceAverage = _gasPriceAverage;
        gasPriceSafe = _gasPriceSafe;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
