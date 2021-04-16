---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "ENS"
permalink: "docs/ens/"
excerpt: "Ethereum Name Service"
hidden: false
metadata: 
  description: "How Chainlink uses the Ethereum Name Service for Price Feed contract addresses."
  image: 
    0: "https://files.readme.io/7c891b4-link.png"
    1: "link.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
Chainlink is moving to the <a href="https://docs.ens.domains/" target="_blank">Ethereum Name Service (ENS)</a> as the source of truth for Price Feed addresses. ENS is a distributed, open, and extensible naming system based on the Ethereum blockchain, which eliminates the need to copy or type long addresses. Instead, addresses can be obtained in deployed contracts or, alternatively,  using off-chain scripts that read the state of the blockchain.

# Try It

Try this Ethereum Mainnet lookup tool
[block:html]
{
  "html": "\n<div class=\"row\">\n  <div class=\"col-xs-12\"><h3>Lookup<h3></div>\n  <div class=\"col-xs-12 col-md-4\">\n    <b>Pair:</b><br>\n  \t<select class=\"cl-select\" onchange=\"getDropdownAddress()\" name=\"pairs\" id=\"pairs\">\n      <option value=\"\">Choose Pair</option>\n<option value=\"aave-eth.data.eth\">AAVE / ETH</option>\n<option value=\"aave-usd.data.eth\">AAVE / USD</option>\n<option value=\"ada-usd.data.eth\">ADA / USD</option>\n<option value=\"adx-usd.data.eth\">ADX / USD</option>\n<option value=\"ant-eth.data.eth\">ANT / ETH</option>\n<option value=\"aud-usd.data.eth\">AUD / USD</option>\n<option value=\"bal-eth.data.eth\">BAL / ETH</option>\n<option value=\"bat-eth.data.eth\">BAT / ETH</option>\n<option value=\"bch-usd.data.eth\">BCH / USD</option>\n<option value=\"bnb-usd.data.eth\">BNB / USD</option>\n<option value=\"bnt-eth-bancor.data.eth\">BNT / ETH (Bancor)</option>\n<option value=\"bnt-eth.data.eth\">BNT / ETH</option>\n<option value=\"bnt-usd.data.eth\">BNT / USD</option>\n<option value=\"brent-usd.data.eth\">BRENT / USD</option>\n<option value=\"btc-ars.data.eth\">BTC / ARS</option>\n<option value=\"btc-difficulty.data.eth\">BTC Difficulty</option>\n<option value=\"btc-eth.data.eth\">BTC / ETH</option>\n<option value=\"btc-usd.data.eth\">BTC / USD</option>\n<option value=\"busd-eth.data.eth\">BUSD / ETH</option>\n<option value=\"bzrx-eth.data.eth\">BZRX / ETH</option>\n<option value=\"chf-usd.data.eth\">CHF / USD</option>\n<option value=\"comp-eth.data.eth\">COMP / ETH</option>\n<option value=\"comp-usd.data.eth\">COMP / USD</option>\n<option value=\"cro-eth.data.eth\">CRO / ETH</option>\n<option value=\"crv-eth.data.eth\">CRV / ETH</option>\n<option value=\"dai-eth.data.eth\">DAI / ETH</option>\n<option value=\"dai-usd.data.eth\">DAI / USD</option>\n<option value=\"dash-usd.data.eth\">DASH / USD</option>\n<option value=\"dmg-eth.data.eth\">DMG / ETH</option>\n<option value=\"dot-usd.data.eth\">DOT / USD</option>\n<option value=\"enj-eth.data.eth\">ENJ / ETH</option>\n<option value=\"eos-usd.data.eth\">EOS / USD</option>\n<option value=\"etc-usd.data.eth\">ETC / USD</option>\n<option value=\"eth-usd.data.eth\">ETH / USD</option>\n<option value=\"eth-xdr.data.eth\">ETH / XDR</option>\n<option value=\"eur-mwh.data.eth\">EUR / MWh</option>\n<option value=\"eur-usd.data.eth\">EUR / USD</option>\n<option value=\"fast-gas-gwei.data.eth\">Fast Gas / Gwei</option>\n<option value=\"fil-usd.data.eth\">FIL / USD</option>\n<option value=\"fnx-usd.data.eth\">FNX / USD</option>\n<option value=\"ftm-eth.data.eth\">FTM / ETH</option>\n<option value=\"ftse-gbp.data.eth\">FTSE / GBP</option>\n<option value=\"gbp-usd.data.eth\">GBP / USD</option>\n<option value=\"jpy-usd.data.eth\">JPY / USD</option>\n<option value=\"knc-eth.data.eth\">KNC / ETH</option>\n<option value=\"knc-usd.data.eth\">KNC / USD</option>\n<option value=\"lend-eth.data.eth\">LEND / ETH</option>\n<option value=\"lend-usd.data.eth\">LEND / USD</option>\n<option value=\"link-eth-bancor.data.eth\">LINK / ETH (Bancor)</option>\n<option value=\"link-eth.data.eth\">LINK / ETH</option>\n<option value=\"link-usd.data.eth\">LINK / USD</option>\n<option value=\"lrc-eth.data.eth\">LRC / ETH</option>\n<option value=\"ltc-usd.data.eth\">LTC / USD</option>\n<option value=\"mana-eth.data.eth\">MANA / ETH</option>\n<option value=\"mkr-eth.data.eth\">MKR / ETH</option>\n<option value=\"mln-eth.data.eth\">MLN / ETH</option>\n<option value=\"n225-jpy.data.eth\">N225 / JPY</option>\n<option value=\"nmr-eth.data.eth\">NMR / ETH</option>\n<option value=\"orchid.data.eth\">Orchid</option>\n<option value=\"oxt-usd.data.eth\">OXT / USD</option>\n<option value=\"rcn-btc.data.eth\">RCN / BTC</option>\n<option value=\"ren-eth-bancor.data.eth\">REN / ETH (Bancor)</option>\n<option value=\"ren-eth.data.eth\">REN / ETH</option>\n<option value=\"ren-usd.data.eth\">REN / USD</option>\n<option value=\"rep-eth.data.eth\">REP / ETH</option>\n<option value=\"rlc-eth.data.eth\">RLC / ETH</option>\n<option value=\"scex-usd.data.eth\">sCEX / USD</option>\n<option value=\"sdefi-usd.data.eth\">sDEFI / USD</option>\n<option value=\"snx-eth.data.eth\">SNX / ETH</option>\n<option value=\"snx-usd.data.eth\">SNX / USD</option>\n<option value=\"susd-eth.data.eth\">SUSD / ETH</option>\n<option value=\"sxp-usd.data.eth\">SXP / USD</option>\n<option value=\"total-marketcap-usd.data.eth\">Total Marketcap / USD</option>\n<option value=\"trx-usd.data.eth\">TRX / USD</option>\n<option value=\"tusd-eth.data.eth\">TUSD / ETH</option>\n<option value=\"tusd-reserves.data.eth\">TUSD Reserves</option>\n<option value=\"tusd-supply.data.eth\">TUSD Supply</option>\n<option value=\"uma-eth.data.eth\">UMA / ETH</option>\n<option value=\"uni-eth.data.eth\">UNI / ETH</option>\n<option value=\"uni-usd.data.eth\">UNI / USD</option>\n<option value=\"usdc-eth.data.eth\">USDC / ETH</option>\n<option value=\"usdk-usd.data.eth\">USDK / USD</option>\n<option value=\"usdt-eth.data.eth\">USDT / ETH</option>\n<option value=\"wnxm-eth.data.eth\">WNXM / ETH</option>\n<option value=\"wom-eth.data.eth\">WOM / ETH</option>\n<option value=\"wti-usd.data.eth\">WTI / USD</option>\n<option value=\"xag-usd.data.eth\">XAG / USD</option>\n<option value=\"xau-usd.data.eth\">XAU / USD</option>\n<option value=\"xhv-usd.data.eth\">XHV / USD</option>\n<option value=\"xmr-usd.data.eth\">XMR / USD</option>\n<option value=\"xrp-usd.data.eth\">XRP / USD</option>\n<option value=\"xtz-usd.data.eth\">XTZ / USD</option>\n<option value=\"yfi-eth.data.eth\">YFI / ETH</option>\n<option value=\"yfi-usd.data.eth\">YFI / USD</option>\n<option value=\"zrx-eth.data.eth\">ZRX / ETH</option>\n    </select>\n  </div>\n  <div class=\"col-xs-12 col-md-8\">\n    <b>Address:</b><br>\n  \t<a id=\"address1-link\" rel=\"noreferrer, noopener\" target=\"_blank\">\n      <code class=\"rdmd-code lang-\" data-lang=\"\" name=\"\">\n        <button class=\"rdmd-code-copy fa\"></button>\n        <div id=\"address1\" class=\"cm-s-neo\">-</div>\n      </code>\n    </a>\n  </div>\n</div>\n\n    <hr>\n    \n<div class=\"row\">\n\t<div class=\"col-xs-12 col-md-12\"><h3>Manual Lookup<h3></div>\n\t<div class=\"col-xs-12 col-md-4\">\n    <input id=\"asset-1\" type=\"text\" value=\"ETH\" size=\"5\"></input>\n  \t<span>/</span>\n    <input id=\"asset-2\" type=\"text\" value=\"USD\" size=\"5\"></input>\n\t</div>\n\t<div class=\"col-xs-12 col-md-8\">\n\t\t<a id=\"get-price-button\" href=\"javascript:getManualAddress();\" class=\"cl-button--ghost cl-button--ghost-sm\">Lookup</a>\n\t</div>\n\t<div class=\"col-xs-12 col-md-4\">\n    <b>ENS Name:</b><br>\n    <a id=\"address2-label-link\" rel=\"noreferrer, noopener\" target=\"_blank\">\n      <code class=\"rdmd-code lang-\" data-lang=\"\" name=\"\">\n        <button class=\"rdmd-code-copy fa\"></button>\n        <div id=\"address2-label\" class=\"cm-s-neo\">-</div>\n      </code>\n    </a>\n\t</div>\n  <div class=\"col-xs-12 col-md-8\">\n    <b>Address:</b><br>\n    <a id=\"address2-link\" rel=\"noreferrer, noopener\" target=\"_blank\">\n      <code class=\"rdmd-code lang-\" data-lang=\"\" name=\"\">\n        <button class=\"rdmd-code-copy fa\"></button>\n        <div id=\"address2\" class=\"cm-s-neo\">-</div>\n      </code>\n    </a>\n\t</div>\n</div>"
}
[/block]
# Naming Structure

Chainlink price feeds fall under the `data.eth` naming suffix. To obtain a specific feed address, prefix this with the assets in the feed, separated by a dash (-).

|Pair|ENS Domain Name|
|:---|:---|
|ETH / USD|`eth-usd.data.eth`|
|BTC / USD|`btc-usd.data.eth`|
|...|`...`|

## Subdomains

By default, the base name structure (`eth-usd.data.eth`) returns the proxy address for that feed. However, subdomains enable callers to retrieve other associated contract addresses, as shown in the following table.

|Contract Addresses|Subdomain Prefix|Example|
|:-----------|:------------------|:---------|
|Proxy|`proxy`|`proxy.eth-usd.data.eth`|
|Underlying aggregator|`aggregator`|`aggregator.eth-usd.data.eth`|
|Proposed aggregator|`proposed`|`proposed.eth-usd.data.eth`|

# Architecture

## Resolver

For each network, there is a single Chainlink resolver, which does not change. Its address can be obtained using the `data.eth` domain. This resolver manages the subdomains associated with `data.eth`.

|Network|Resolver Address|
|:-----------|:------------------|
|Ethereum Mainnet|<a href="https://app.ens.domains/address/0x122eb74f9d0F1a5ed587F43D120C1c2BbDb9360B/" target="_blank">`0x122eb74f9d0F1a5ed587F43D120C1c2BbDb9360B`</a>|

## Listening for Address Changes

When a new aggregator is deployed for a specific feed, it is first proposed, and when accepted becomes the aggregator for that feed. During this process, the `proposed` and `aggregator` subdomains for that feed will change. With each change, the resolver emits an `AddrChanged` event, using the feed subdomain (for example: `eth-usd.data.eth`) as the indexed parameter.

**Example**: If you want to listen for when the aggregator of the ETH / USD feed changes, set up a listener to track the `AddrChanged` event on the resolver, using a filter like this: `ethers.utils.namehash('aggregator.eth-usd.data.eth')`.

# Obtaining Addresses

> 🚧 Reverse Lookup
> 
> Reverse lookup is not supported.

## Javascript

The example below uses Javascript Web3 library to interact with ENS. See the <a href="https://docs.ens.domains/dapp-developer-guide/resolving-names" target="_blank">ENS documentation</a> for the full list of languages and libraries libraries that support ENS.

This example logs the address of the ETH / USD price feed on the Ethereum mainnet.

```javascript
const Web3 = require("web3");

const web3 = new Web3("https://mainnet.infura.io/v3/<api_key>");
web3.eth.ens.getAddress('eth-usd.data.eth')
  .then((address) => {
    console.log(address)
  })
```

## Solidity

In Solidity, the address of the ENS registry must be known. According to <a href="https://docs.ens.domains/ens-deployments" target="_blank">ENS documentation</a>, this address is the same across Mainnet, Ropsten, Rinkeby and Goerli networks:

ENS registry address: <a href="https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" target="_blank">`0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`</a>.

Also, instead of using readable string names like `eth-usd.data.eth`, resolvers accept bytes32 hash IDs for names. Hash IDs can currently be retrieved from <a href="https://thegraph.com/explorer/subgraph/ensdomains/ens" target="_blank">this subgraph</a>.

"ETH / USD" hash: `0xf599f4cd075a34b92169cf57271da65a7a936c35e3f31e854447fbb3e7eb736d`

```javascript
pragma solidity ^0.6.0;

// ENS Registry Contract
interface ENS {
    function resolver(bytes32 node) external view returns (Resolver);
}

// Chainlink Resolver
interface Resolver {
    function addr(bytes32 node) external view returns (address);
}

// Consumer contract
contract ENSConsumer {
    ENS ens;

    // ENS registry address: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
    constructor(address ensAddress) public {
        ens = ENS(ensAddress);
    }
    
    // Use ID Hash instead of readable name
    // ETH / USD hash: 0xf599f4cd075a34b92169cf57271da65a7a936c35e3f31e854447fbb3e7eb736d
    function resolve(bytes32 node) public view returns(address) {
        Resolver resolver = ens.resolver(node);
        return resolver.addr(node);
    }
}
```