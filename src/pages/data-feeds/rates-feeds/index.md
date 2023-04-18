---
layout: ../../../layouts/MainLayout.astro
section: dataFeeds
date: Last Modified
title: "Rate and Volatility Feeds"
isIndex: true
permalink: "docs/data-feeds/nft-floor-price/"
whatsnext:
  {
    "Learn how to read answers from Data Feeds": "/data-feeds/price-feeds/",
    "Learn how to get Historical Price Data": "/data-feeds/historical-data/",
    "Find contract addresses for Rate and Volatility  Feeds": "/data-feeds/rates-feeds/addresses/",
    "Data Feeds API Reference": "/data-feeds/api-reference/",
  }
---

Several feeds provide data for interest rates, interest rate curves, and asset volatility. You can read these feeds the same way that you read other Data Feeds. Specify the [Rate or Volatility Feed Address](/data-feeds/rates-feeds/addresses/) that you want to read instead of specifying a Price Feed address. See the [Using Data Feeds](/data-feeds/using-data-feeds/) page to learn more.

The following data types are available:

- [Bitcoin Interest Rate Curve](#bitcoin-interest-rate-curve)
- [ETH Staking APR](#eth-staking-apr)
- [Realized Volatility](#realized-volatility)

## Bitcoin Interest Rate Curve

Lenders and borrowers use base rates to evaluate interest rate risk for lending and borrowing contracts, asset valuation for derivatives contracts, and an underlying rate for interest rate swap contracts. Bitcoin Interest Rate Curve Data Feeds provide a base rate to assist with market decisions and quantify the risks of using certain protocols and products based on current and predicted baseline interest rates. The curve’s normalized methodology and daily rates introduce more consistency and predictability to the ebb and flow of digital asset markets. Bitcoin Interest Rate Curve Feeds incorporate a wide range of data sources such as OTC lending desks, DeFi lending pools, and perpetual futures markets.

To learn more about the use of these interest rate curves in the industry, read the [Bitcoin Interest Rate Curve (CF BIRC)](https://blog.chain.link/cf-bitcoin-interest-rate-curve-cf-birc/) blog post.

See the [Rate and Volatility Feed Addresses](/data-feeds/rates-feeds/addresses) page to find the Bitcoin Interest Rate Curve feeds that are currently available.

## ETH Staking APR

ETH Staking APR feeds provide the estimated returns for staking ETH as a validator to secure the Ethereum network. The data reflects the rate of return historically over 30-day and 90-day periods. Data providers use off-chain computation to calculate the rate of return from staking, reach consensus on the APR, and write the results on-chain to be used by decentralized protocols and Web 3 applications.

See the [Rate and Volatility Feed Addresses](/data-feeds/rates-feeds/addresses) page to find the ETH Staking APR feeds that are currently available.

## Realized Volatility

Realized volatility measures how much an asset price has changed in the past. This value is expressed as a percent of the asset price. The more an asset price changes over time, the higher the realized volatility is for that asset. Prices are measured at regular intervals to track the change in an asset's price. Realized volatility is not the same as implied volatility, which is a measure of the market’s expectation about future volatility.

Each data feed reflects the volatility of an asset over a specific time period. For example, there are data feeds that provide volatility data for 24-hour, 7-day, and 30-day rolling windows. You can compare these windows across these windows to determine if there is rising or falling volatility for an asset. For example, if realized volatility for the 24-hour window is higher than the 7-day window, this indicates that there is increasing volatility.

Data providers refresh measures every 10 minutes and on-chain values are refreshed when the feed heartbeat or deviation threshold are met. See the [Rate and Volatility Feed Addresses](/data-feeds/rates-feeds/addresses) page to find heartbeat and deviation information for each feed.
