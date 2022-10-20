---
layout: ../layouts/MainLayout.astro
section: gettingStarted
date: Last Modified
title: README
excerpt: "Smart Contracts and Chainlink"
whatsnext:
  {
    "Deploy Your First Smart Contract": "/getting-started/deploy-your-first-contract/",
    "Consuming Data Feeds": "/getting-started/consuming-data-feeds/",
  }
metadata:
  title: "Conceptual Overview"
  description: "Learn the basic concepts about what smart contracts are and, how to write them, and how Chainlink oracles work with smart contracts."
  image:
    0: "/files/1a63254-link.png"
setup: |
  import { variables } from "@variables"
  import { Tabs } from "@components/Tabs"
  import { NetworkTabs, PackageManagerTabs, ClickToZoom } from "@components"
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

## Using variables

You can use variables by importing the variables object into the current page

<Tabs client:visible>
<Fragment slot="tab.1">Usage in .md</Fragment>
<Fragment slot="tab.2">Usage in .mdx</Fragment>
<Fragment slot="panel.1">
```
setup: |
  import { variables } from "@variables"
```
</Fragment>
<Fragment slot="panel.2">
```
import { variables } from "@variables"
```
</Fragment>
</Tabs>

### Usage

{variables.GOERLI_LINK_TOKEN}

```
{variables.GOERLI_LINK_TOKEN}
```

## Click-to-zoom

We can enable click-to-zoom functionality on some large images. To do this we can make use of the `<ClickToZoom />` component. This will open the image on a popup in tablets and larger screens.

<ClickToZoom src="/files/8c35025-Request__Receive_Data.png" />

```jsx
<ClickToZoom src="/files/8c35025-Request__Receive_Data.png" />
```

## Code Tabs

Codetabs use nanostores to sync up throughout the page.

Ideally we will create components such as the `<CodeTabs />` component or the `<NetworkTabs />` component, which use a `sharedStore` to change all tabs to the same value throughout the page.

<Tabs client:visible>
  <Fragment slot="tab.1">Usage in .md</Fragment>
  <Fragment slot="tab.2">Usage in .mdx</Fragment>
  <Fragment slot="panel.1">
  ```markdown
  setup: |
    import { Tabs } from "@components/Tabs/Tabs"
    import { NetworkTabs, PackageManagerTabs } from "@components"
    ```
  </Fragment>
  <Fragment slot="panel.2">
  ```markdown
  import { Tabs } from "../../components/tabs/Tabs"
  import { NetworkTabs, PackageManagerTabs } from "@components"
  ```
  </Fragment>
</Tabs>

### Network Tab

Create a local directory to persist the data:

<NetworkTabs>
  <Fragment slot="Goerli">
  ```shell Goerli
  mkdir ~/.geth-goerli
  ```
  </Fragment>
  <Fragment slot="Mainnet">
  ```shell Mainnet
  mkdir ~/.geth
  ```
  </Fragment>
</NetworkTabs>

Run the container:

<NetworkTabs>
  <Fragment slot="Goerli">
  ```shell Goerli
  docker run --name eth -p 8546:8546 -v ~/.geth-goerli:/geth -it \
          ethereum/client-go --goerli --ws --ipcdisable \
          --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
  ```
  </Fragment>
  <Fragment slot="Mainnet">
  ```shell Mainnet
  docker run --name eth -p 8546:8546 -v ~/.geth:/geth -it \
          ethereum/client-go --ws --ipcdisable \
          --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
  ```
  </Fragment>
</NetworkTabs>

#### Usage

````
Create a local directory to persist the data:

<NetworkTabs>
  <Fragment slot="Goerli">
  ```shell Goerli
  mkdir ~/.geth-goerli
  ```
  </Fragment>
  <Fragment slot="Mainnet">
  ```shell Mainnet
  mkdir ~/.geth
  ```
  </Fragment>
</NetworkTabs>

Run the container:

<NetworkTabs>
  <Fragment slot="Goerli">
  ```shell Goerli
  docker run --name eth -p 8546:8546 -v ~/.geth-goerli:/geth -it \
          ethereum/client-go --goerli --ws --ipcdisable \
          --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
  ```
  </Fragment>
  <Fragment slot="Mainnet">
  ```shell Mainnet
  docker run --name eth -p 8546:8546 -v ~/.geth:/geth -it \
          ethereum/client-go --ws --ipcdisable \
          --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
  ```
  </Fragment>
</NetworkTabs>
````

### Package Manager Tabs

<PackageManagerTabs>
  <Fragment slot="npm">
  ```
  npm i -g @chainlink/solana-sdk
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```
  yarn add @chainlink/solana-sdk
  ```
  </Fragment>
</PackageManagerTabs>

#### Usage

````
<PackageManagerTabs>
  <Fragment slot="npm">
  ```
  npm i -g @chainlink/solana-sdk
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```
  yarn add @chainlink/solana-sdk
  ```
  </Fragment>
</PackageManagerTabs>
````

### Custom tabs

We can still use the tabs without creating an Astro component or without the sharedStore property.

:::note
To create a custom tab we _MUST_ import it relatively from the current file `import { Tabs } from "../../components/tabs/Tabs"` and not from `@components`
:::

```
// whithout shared store
<Tabs client:visible>
  <Fragment slot="tab.1">Tab 1</Fragment>
  <Fragment slot="tab.2">Tab 2</Fragment>
  <Fragment slot="panel.1">Content 1</Fragment>
  <Fragment slot="panel.2">Content 2</Fragment>
</Tabs>

// with sharedStore (syncs up all tabs in the page)
<Tabs sharedStore="networks" client:visible>
  <Fragment slot="tab.1">Tab 1</Fragment>
  <Fragment slot="tab.2">Tab 2</Fragment>
  <Fragment slot="panel.1">Content 1</Fragment>
  <Fragment slot="panel.2">Content 2</Fragment>
</Tabs>

```
