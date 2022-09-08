---
layout: ../layouts/MainLayout.astro
section: gettingStarted
date: Last Modified
title: README
excerpt: "Smart Contracts and Chainlink"
whatsnext:
  {
    "Deploy Your First Smart Contract": "/docs/deploy-your-first-contract/",
    "Consuming Data Feeds": "/docs/consuming-data-feeds/",
  }
metadata:
  title: "Conceptual Overview"
  description: "Learn the basic concepts about what smart contracts are and, how to write them, and how Chainlink oracles work with smart contracts."
  image:
    0: "/files/1a63254-link.png"
---

## Using Directives

Custom markdown is written using directives. Theres two type of directives, `nodeDirectives` like the ones used in the callouts:

```
// usage
:::directiveName[title]
content
:::

//example
:::tip[did you know?]
tip
:::
```

And `leafDirectives` like the ones used for solidityRemix examples

```
::solidity-remix[/samples/PriceFeeds/PriceConsumerV3.sol]
```

### Callouts

:::tip[did you know?]
tip
:::

:::danger[did you know?]
danger
:::

:::caution[did you know?]
info
:::

:::note[did you know?]
warning
:::

```
:::tip[did you know?]
tip
:::

:::danger[did you know?]
danger
:::

:::caution[did you know?]
info
:::

:::note[did you know?]
warning
:::
```

### Solidity Remix

::solidity-remix[/samples/PriceFeeds/PriceConsumerV3.sol]

```
::solidity-remix[/samples/PriceFeeds/PriceConsumerV3.sol]
```

### Codetabs

````
  ```shell Rinkeby
  cd ~/.chainlink-rinkeby && docker run -p 6687:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
  ```
  ```shell Kovan
  cd ~/.chainlink-kovan && docker run -p 6687:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
  ```
  ```shell Mainnet
  cd ~/.chainlink && docker run -p 6687:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
  ```
````

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6687:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6687:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

```shell Mainnet
cd ~/.chainlink && docker run -p 6687:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
