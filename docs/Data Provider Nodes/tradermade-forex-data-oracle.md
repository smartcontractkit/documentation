---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Tradermade Forex Data Oracle"
permalink: "docs/tradermade-forex-data-oracle/"
---

TraderMade is a market-leading vendor of fintech solutions, supported by a first-rate customer service team. TraderMade’s Forex API provides rates for over 40+ fiat currencies, cryptocurrencies, precious metals, commodities and equity indices. It features over 1,700 currency trading pairs, live FX rates (Bid, Ask, and Mid rate), historical currency rates (Open, High, Low, and Close), live streaming data updated to the millisecond, historical FX rates that go back to 1990, proprietary aggregated feeds, Tier 1 bank rates, and more. 

This oracle will initially provide real time prices for a set of indices and equities.

## Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/) 
- Call your [request method](./#chainlink-examples)

## Network Details

#### Ethereum Mainnet

Payment Amount: 1.0 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}`  
Oracle Address: `0xf36C03f22c9Da20174797d6239a4D26526358440`  
JobID: `240c13892be44e9784505184cc5d32ce`  

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK  
LINK Token Address: `{{variables.BINANCE_MAINNET_LINK_TOKEN}}`  
Oracle Address: `0xC9cbDFdBaBEf098AA1F193e09ed389A7f6859901`  
JobID: `e85b3646b9b648c8aa4e676fc7342d08`  

#### Ethereum Kovan Testnet

Payment Amount: 0.1 LINK  
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}` 
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`  
JobID: `dae6c2fe44a24d62b33005ee542aa0b8`  

## Tasks
* <a href="https://market.link/adapters/21d74022-7679-465d-8367-576c42f0f6b3" target="_blank">TraderMade</a>
* [Copy](../adapters/#copy)
* [Multiply](../adapters/#multiply)
* [EthUint256](../adapters/#ethuint256)
* [EthTx](../adapters/#ethtx)

## Request Parameters
### `base`, `from`, or `coin`
- The symbol to query.

#### Solidity Example
`req.add("base", "FRA40");`

### Asset List
- #### `Asset Name` - `Input to Pass`
- `DAX 30` - `GER30`
- `CAC 40` - `FRA40`
- `IBEX35` - `ESP35`
- `Nasdaq` - `NAS100`
- `DOW 30` - `USA30`
- `Hang Seng` - `HKG33`
- `ASX200` - `AUS200`
- `Copper` - `COPPER`
- `Natural GAS` - `NATGAS`
- `Alibaba` - `BABA`
- `Twitter` - `TWTR`
- `Bank of America` - `BAC`
- `Baidu` - `BIDU`

### Outputs
Returns an positive integer.

## Support

- For support reach out to <a href="mailto:support@tradermade.com" target="_blank">support@tradermade.com</a>
