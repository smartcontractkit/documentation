// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/interfaces/FlagsInterface.sol";

contract ArbitrumPriceConsumer {
	// Identifier of the Sequencer offline flag on the Flags contract 
    address constant private FLAG_ARBITRUM_SEQ_OFFLINE = address(bytes20(bytes32(uint256(keccak256("chainlink.flags.arbitrum-seq-offline")) - 1)));
    AggregatorV3Interface internal priceFeed;
    FlagsInterface internal chainlinkFlags;
    
    /**
     * Network: Arbitrum Rinkeby
     * Aggregator: ETH/USD
     * Agg Address: 0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8
     * Flags Address: 0x491B1dDA0A8fa069bbC1125133A975BF4e85a91b
     */
    constructor() public {
        priceFeed = AggregatorV3Interface(0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8);
        chainlinkFlags = FlagsInterface(0x491B1dDA0A8fa069bbC1125133A975BF4e85a91b);
    }
    
    /**
     * Returns the latest price
     */
    function getThePrice() public view returns (int) {
        bool isRaised = chainlinkFlags.getFlag(FLAG_ARBITRUM_SEQ_OFFLINE);
        if (isRaised) {
		        // If flag is raised we shouldn't perform any critical operations
            revert("Chainlink feeds are not being updated");
        }
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
}