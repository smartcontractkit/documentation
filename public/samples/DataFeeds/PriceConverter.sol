// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * Network: Sepolia
 * Base: BTC/USD
 * Base Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
 * Quote: EUR/USD
 * Quote Address: 0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910
 * Decimals: 8
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract PriceConverter {
  function getDerivedPrice(
    address _base,
    address _quote,
    uint8 _decimals
  ) public view returns (int256) {
    require(_decimals > uint8(0) && _decimals <= uint8(18), "Invalid _decimals");
    int256 decimals = int256(10 ** uint256(_decimals));
    (, int256 basePrice,,,) = AggregatorV3Interface(_base).latestRoundData();
    uint8 baseDecimals = AggregatorV3Interface(_base).decimals();
    basePrice = scalePrice(basePrice, baseDecimals, _decimals);

    (, int256 quotePrice,,,) = AggregatorV3Interface(_quote).latestRoundData();
    uint8 quoteDecimals = AggregatorV3Interface(_quote).decimals();
    quotePrice = scalePrice(quotePrice, quoteDecimals, _decimals);

    return (basePrice * decimals) / quotePrice;
  }

  function scalePrice(
    int256 _price,
    uint8 _priceDecimals,
    uint8 _decimals
  ) internal pure returns (int256) {
    if (_priceDecimals < _decimals) {
      return _price * int256(10 ** uint256(_decimals - _priceDecimals));
    } else if (_priceDecimals > _decimals) {
      return _price / int256(10 ** uint256(_priceDecimals - _decimals));
    }
    return _price;
  }
}
