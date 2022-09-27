# Contributing to the Chainlink Documentation

PRs are welcome! We try to keep a clean commit history, so we'll follow a standard process:

- Create a PR
  - If your PR contains multiple commits, we'll ask you to squash them
  - If your PR has conflicts with `main`, we'll ask you to rebase it
- Someone will review your PR
- Your PR will be merged, amended, closed, or you'll be asked for changes

## Standards

- Commit messages
  - Start with a present tense verb
  - Keep your commit headline short but sufficient to understand the scope and focus of the change.
  - Changes are often formatted like `add doc X`, `fix page Y`, `improve docs for Z`.
  - Example: "`update contract addresses for BSC`".
- If you touch any infrastructure, make sure it builds with `yarn build`
- Trust the autoformatter (prettier)
- Make sure images are optimized and compressed
- Keep images < 20kb whenever possible to keep the site fast and the repo small (try [trimage](https://trimage.org/))

## How to rebase a PR

```shell
git fetch
git rebase origin/main
# resolve conflicts
git push -f
```

It's okay to force push over your own PR branch. In fact, that's what we want so that the commits are clean.

## How to squash a PR

To squash multiple commits, use the following steps:

### 1. Rebase multiple commits into one

When squashing commits, you should always rebase from the main branch of the repo: `git rebase -i origin/main`.

After rebasing, you can squash the commits by changing `pick` into `squash` for all of your commits except the recent one:

```shell
pick 686e386 add doc structure
squash ee2eed7 add main content
squash 3eccd39 fix typos

# Rebase 287bc79..3eccd39 onto 287bc79 (3 commands)
# …
```

### 2. Fix your commit message

Next, comment or remove all of your commit messages and leave the one that describes your PR.

### 3. Force push to your branch

Lastly, force push the changes to your branch to have a clean history:

```shell
git push -f
```

Here's a [complete example](https://twitter.com/stephenfluin/status/1009904095073718275) of git squashing.

It's easier to use `git --amend` while working on your PR first. Avoiding multiple commits is much cleaner and easier than fixing them.

## Adding a new chain feed

Feed data for various chains comes from a private GitHub repository, processed regularly on the server via `process-feeds.yml` and published as JSON. This JSON is loaded by each of the `feed.liquid` based pages.

To test a new feed locally, get access to the private repo, then clone it into `data-source`, and then run `yarn process`.

## Checking Links

To check the site for broken links, [install `linkcheck`](https://github.com/filiph/linkcheck/), serve the site locally and point to the executable in the command below and run:

```
./path-to-link-check.exe :4200
```

## Adding or updating code samples

The main code samples are stored in `/_includes/samples` directory. If you need to edit or add new code samples, do it in the corresponding nested folder. If Chainlink introduces a new product or feature, create a new folder and place your code sample there.

To embed a code sample in the documentation, use the following format:

```solidity
{% include 'samples/APIRequests/APIConsumer.sol' %}
```

Note, you have to include only samples that represent the main Chainlink products. The following code shoudn't be included in `/_includes/samples` directory:

- JSON or TOML descriptions and outputs
- API functions
- Code samples that are broken down into smaller pieces
- Shell, bash, or text commands
- Tables, blocks, or similar markdown structures

## Adding Link token addresses for new EVM chains

When Chainlink is deployed on a new EVM chain, the link token address must be added to [link-token-contract page](./docs/Developer%20Reference/link-token-contracts.md).
To allow the users to directly add the link contract to their metamask wallet, please follow this structure when adding a hyperlink containing a link token address:

```html
<a class="erc-token-address" id="<chainId>_<link_token_address>" href="<block_explorer_url>">`<link_token_address>`</a>
<!--
Example for EThereum mainnet : chainid=1 ; link_token_address=0x514910771AF9Ca656af840dff83E8264EcF986CA ; block_explorer_url=https://etherscan.io/token/0x514910771AF9Ca656af840dff83E8264EcF986CA
<a class="erc-token-address" id="1_0x514910771AF9Ca656af840dff83E8264EcF986CA" href="https://etherscan.io/token/0x514910771AF9Ca656af840dff83E8264EcF986CA">`0x514910771AF9Ca656af840dff83E8264EcF986CA`</a>
-->

```

In addition:

- Check that the `chainId` is defined in [chains.json](./_src/reference/chains.json). If it doesn't exist then:
  - Go to [chainid.network](https://chainid.network/chains.json) and look for the chainId. E.g. on mainnet, look for _"chainId":1,_. Note that [chainid.network](https://chainid.network/chains.json) is maintained under this [repo](https://github.com/ethereum-lists/chains).
  - Copy only the nested object you are looking for. E.g. on mainnet , you will copy `{"name":"Ethereum Mainnet","chain":"ETH","icon":"ethereum","rpc":["https://mainnet.infura.io/v3/${INFURA_API_KEY}","wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}","https://api.mycryptoapi.com/eth","https://cloudflare-eth.com"],"faucets":[],"nativeCurrency":{"name":"Ether","symbol":"ETH","decimals":18},"infoURL":"https://ethereum.org","shortName":"eth","chainId":1,"networkId":1,"slip44":60,"ens":{"registry":"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"},"explorers":[{"name":"etherscan","url":"https://etherscan.io","standard":"EIP3091"}]}`
  - Append the copied value to the array in [chains.json](./_src/reference/chains.json).
- Complete [linkNameSymbol.json](./_src/reference/linkNameSymbol.json). It contains a simple mapping chainId --> {name,symbol} and that is used to interact with the link contract on the right chain, fetch the name and the symbol and compare it with the expected values; mitigating the risk of typo when adding the link contract address. To do so:
  - Go to the block explorer on the right chain. E.g. on mainnet, [Etherscan Chainlink Token](https://etherscan.io/token/0x514910771AF9Ca656af840dff83E8264EcF986CA).
  - Click on _Contract_ then _Read Contract_.
  - Click on _name_ and _symbol_. Copy the values returned. E.g. on mainnet, you will get respectively _ChainLink Token_ and _LINK_.
  - Append the info (chainId,name,symbol) to the array in [linkNameSymbol.json](./_src/reference/linkNameSymbol.json). E.g. for mainnet, you would append `"1": { "name": "ChainLink Token", "symbol": "LINK" }`

## Style Guide

- **Bold** key terms or any terms the user must absolutely know when reading a doc.
- _Italicize_ terms for emphasis but only when necessary.
- When referring to dropdown menus or a sequence of dropdown events, bold the relevant entities. Example: Go to **Menu Name** > **Option**. Do not use quotes.
- Use markdown over HTML wherever possible.
- When writing an additional note, start it with **Note:**.
- Use color highlighting when you add warnings, requirements, notes of deprecation/service removal. For guidance on using color highlighting, see https://rdmd.readme.io/docs/callouts.
- For a comprehensive guide on how to write tutorials, use our [template guide](/TEMPLATE.md).
- Use a consistent voice. When writing documentation, avoid first person plural (we) and opt for second person singular (you). Avoid passive voice.
