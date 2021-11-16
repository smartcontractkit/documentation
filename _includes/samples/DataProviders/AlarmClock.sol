/** This example code is designed to quickly deploy an example contract using Remix.
 *  If you have never used Remix, try our example walkthrough: https://docs.chain.link/docs/example-walkthrough
 */

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */
 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract AlarmClockSample is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    
    bool public alarmDone;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    /**
     * Network: Kovan
     * Oracle: Chainlink - 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b
     * Job ID: Chainlink - 982105d690504c5d9ce374d040c08654
     * Fee: 0.1 LINK
     */
    constructor() {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "982105d690504c5d9ce374d040c08654";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        alarmDone = false;
    }
    
    /**
     * Create a Chainlink request to start an alarm and after
     * the time in seconds is up, return throught the fulfillAlarm
     * function
     */
    function requestAlarmClock(uint256 durationInSeconds) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfillAlarm.selector);
        // This will return in 90 seconds
        request.addUint("until", block.timestamp + durationInSeconds);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfillAlarm(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        alarmDone = true;
    }
    
    /**
     * Withdraw LINK from this contract
     * 
     * NOTE: DO NOT USE THIS IN PRODUCTION AS IT CAN BE CALLED BY ANY ADDRESS.
     * THIS IS PURELY FOR EXAMPLE PURPOSES ONLY.
     */
    function withdrawLink() external {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
}