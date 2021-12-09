---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Google Weather Oracle"
permalink: "docs/google-weather/"
---


You can use Chainlink to digest weather information using [Google Cloud Public Datasets](https://cloud.google.com/public-datasets). We have a sample brownie repo showing how to interact with the contracts available in our [gcp-weather brownie repo](https://github.com/PatrickAlphaC/gcp-weather). More information on this oracle can be found in the following [Google Cloud article](https://medium.com/google-cloud/hedging-against-bad-weather-with-cloud-datasets-and-blockchain-oracles-7ba3e0150304).

## Parameters and External Adapters Details

These jobs are using a custom external adapter. Please see the [Google weather external adapter](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/composites/google-weather) to see information about parameters that can be used with these jobs.

# Chainlink Network Details

You will need to use the following LINK token address, oracle address, and JobSpec IDs in order to create the Chainlink request to this oracle.

### Kovan

| Parameter                 | Value                                                                                                                       |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID`            | `42`                                                                                                                        |
| ChainLink Token Address   | [0xa36085F69e2889c224210F603D836748e7dC0088]("https://kovan.etherscan.io/token/0xa36085F69e2889c224210F603D836748e7dC0088") |
| Oracle                    | `0xbe79b86e93d09d6dda636352a06491ec8e7bdf12`                                                                                |
| Rain JobID                | `3c7838a5810c4aeea140134d10a6d0c3`                                                                                          |
| Hail JobID                | `7633f5d84840486a961ee281f96378f7`                                                                                          |
| Average Temperature JobID | `93b72982721945268cf3ba75894f773e`                                                                                          |
| Generic JobID             | `c414aab46673419697cad866b33c7921`                                                                                          |
| Fee                       | `100000000000000000` (0.1 LINK)                                                                                             |
| Node Operator             | `0x4ABabAA8Cb1f340443d90CbAd98faBe394D1Cf24`                                                                                |

### Mainnet

| Parameter                 | Value                                                                                                                 |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID`            | `1`                                                                                                                   |
| ChainLink Token Address   | [0x514910771af9ca656af840dff83e8264ecf986ca]("https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca") |
| Oracle                    | `0x92c08A635C7525505123F0F8e327C6Fa66E09a18`                                                                          |
| Rain JobID                | `e9c41111b74f454695abd471806d9c6f`                                                                                    |
| Hail JobID                | `941cb4bdd6e746cd933a37c8e92f2f98`                                                                                    |
| Average Temperature JobID | `c6f853860b4f479fbda0910350d695b6`                                                                                    |
| Generic JobID             | `0606a7c2811e4dbab659be400ecd41f9`                                                                                    |
| Fee                       | `1000000000000000000` (1 LINK)                                                                                        |
| Node Operator             | `0x6767eDa1C1d0070cEbdFE1CB3a55e4B63FA02C3E`                                                                          |


# Steps For Using This Oracle

- Write and deploy your contract using the network details above.
- Fund it with [LINK](../link-token-contracts/)
- Call your request method


# Create your Chainlinked contract

Import `ChainlinkClient.sol` into your contract so you can inherit the `ChainlinkClient` behavior. Below is a sample that can call the hail, rain, and average temperature jobs to fetch weather data from Bergen, Norway.

```solidity
{% include samples/DataProviders/GoogleWeather.sol %}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/DataProviders/GoogleWeather.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>


# Jobs

## Rain (Bergen, Norway)

### Tasks

1. `gcp-weather`: Makes a call to the google weather dataset
   1. Parameters:
```json
{
  "geoJson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            5.325622558593749,
            60.3887552979679
          ]
        },
        "properties": {
        }
      }
    ]
  }
}
```
2. `multiply`: Multiples the output - set to `1000000000000000000`
3. `ethuint256`: Turns the result into a `uint256`
4. `ethTx`: Sends the TX to the blockchain

## Hail (Bergen, Norway)

### Tasks

1. `gcp-weather`: Makes a call to the google weather dataset
   1. Parameters
```json
{
  "geoJson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            {
              "0": [
                5.2796173095703125,
                60.40673218057448
              ],
              "1": [
                5.164947509765625,
                60.383665698324926
              ],
              "2": [
                5.17730712890625,
                60.211509994185604
              ],
              "3": [
                5.401153564453124,
                60.27694067255946
              ],
              "4": [
                5.6188201904296875,
                60.436558668419984
              ],
              "5": [
                5.526123046875,
                60.42842688461354
              ],
              "6": [
                5.3002166748046875,
                60.5387098888639
              ],
              "7": [
                5.238418579101562,
                60.4951151199491
              ],
              "8": [
                5.2796173095703125,
                60.40673218057448
              ]
            }
          ]
        },
        "properties": {
        }
      }
    ]
  }
}
```
2. `ethuint256`: Turns the result into a `uint256`
3. `ethTx`: Sends the TX to the blockchain

## Average Temperature (Bergen, Norway)

### Tasks

1. `gcp-weather`: Makes a call to the google weather dataset
   1. Parameters:
```json
{
  "geoJson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            {
              "0": [
                5.2796173095703125,
                60.40673218057448
              ],
              "1": [
                5.164947509765625,
                60.383665698324926
              ],
              "2": [
                5.17730712890625,
                60.211509994185604
              ],
              "3": [
                5.401153564453124,
                60.27694067255946
              ],
              "4": [
                5.6188201904296875,
                60.436558668419984
              ],
              "5": [
                5.526123046875,
                60.42842688461354
              ],
              "6": [
                5.3002166748046875,
                60.5387098888639
              ],
              "7": [
                5.238418579101562,
                60.4951151199491
              ],
              "8": [
                5.2796173095703125,
                60.40673218057448
              ]
            }
          ]
        },
        "properties": {
        }
      }
    ]
  }
}
```
2. `multiply`: Multiples the output - set to `1000000000000000000`
3. `ethuint256`: Turns the result into a `uint256`
4. `ethTx`: Sends the TX to the blockchain

## Generic (Any Location)

### Tasks

1. `gcp-weather`: Makes a call to the google weather dataset
2. `multiply`: Multiples the output
3. `ethuint256`: Turns the result into a `uint256`
4. `ethTx`: Sends the TX to the blockchain

# Input Parameters


| Required? |    Name    |                                                                                    Description                                                                                     |                                                                  Options                                                                  | Defaults to |
| :-------: | :--------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :---------: |
|     ✅     | `geoJson`  |                                                                A GeoJSON object containing the geographies to query                                                                |                                                                                                                                           |             |
|     ✅     | `dateFrom` |                                                             The date to query data from (inclusive) in ISO 8601 format                                                             |                                                                                                                                           |             |
|     ✅     |  `dateTo`  |                                                              The date to query data to (inclusive) in ISO 8601 format                                                              |                                                                                                                                           |             |
|     ✅     |  `method`  |                                                                      Which method to use to aggregate data in                                                                      |                                                        `AVG`, `SUM`, `MIN`, `MAX`                                                         |             |
|     ✅     |  `field`   |                                                                          Which column to fetch data from                                                                           | [Data available](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/composites/google-weather#data-available) |             |
|           |  `units`   | What unit system to return the result in ([conversions](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/composites/google-weather#unit-conversion)) |                                                           `imperial`, `metric`                                                            | `imperial`  |

Please see the [Google weather external adapter](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/composites/google-weather) to see information about parameters that can be used with these jobs.
