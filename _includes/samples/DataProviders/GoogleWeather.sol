// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

contract Weather is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    
    bytes32 public avgTempJobId;
    uint256 public avgTemp;
    bytes32 public totalRainJobId;
    uint256 public totalRain;
    bytes32 public hailJobId;
    uint256 public hail;
    uint256 public fee;
    
    event AvgTemp(uint256 _result);
    event TotalRain(uint256 _result);
    event Hail(uint256 _result);
    
    constructor(
        address _link,
        address _oracle,
        bytes32 _avgTempJobId,
        bytes32 _totalRainJobId,
        bytes32 _hailJobId,
        uint256 _fee
    ) {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        avgTempJobId = _avgTempJobId;
        totalRainJobId = _totalRainJobId;
        hailJobId = _hailJobId;
        fee = _fee;
    }

    function requestAvgTemp(
        string memory _from,
        string memory _to
    ) external {
        Chainlink.Request memory req = buildChainlinkRequest(
            avgTempJobId,
            address(this),
            this.fulfillAvgTemp.selector
        );
        req.add("dateFrom", _from);
        req.add("dateTo", _to);
        req.add("method", "AVG");
        req.add("column", "temp");
        sendChainlinkRequest(req, fee);
    }
    
    function fulfillAvgTemp(
        bytes32 _requestId,
        uint256 _result
    ) external recordChainlinkFulfillment(_requestId) {
        avgTemp = _result;
        emit AvgTemp(_result);
    }
    
    function requestTotalRain(
        string memory _from,
        string memory _to
    ) external {
        Chainlink.Request memory req = buildChainlinkRequest(
            totalRainJobId,
            address(this),
            this.fulfillTotalRain.selector
        );
        req.add("dateFrom", _from);
        req.add("dateTo", _to);
        req.add("method", "SUM");
        req.add("column", "prcp");
        sendChainlinkRequest(req, fee);
    }
    
    function fulfillTotalRain(
        bytes32 _requestId,
        uint256 _result
    ) external recordChainlinkFulfillment(_requestId) {
        totalRain = _result;
        emit TotalRain(_result);
    }
    
    function requestHail(
        string memory _from,
        string memory _to
    ) external {
        Chainlink.Request memory req = buildChainlinkRequest(
            hailJobId,
            address(this),
            this.fulfillHail.selector
        );
        req.add("dateFrom", _from);
        req.add("dateTo", _to);
        req.add("method", "SUM");
        req.add("column", "hail");
        sendChainlinkRequest(req, fee);
    }
    
    function fulfillHail(
        bytes32 _requestId,
        uint256 _result
    ) external recordChainlinkFulfillment(_requestId) {
        hail = _result;
        emit Hail(_result);
    }
}