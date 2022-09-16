---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Run an Ethereum Client"
permalink: "docs/run-an-ethereum-client/"
whatsnext: {
  "Running a Chainlink Node":"/docs/running-a-chainlink-node/",
  "Optimizing Performance":"/docs/evm-performance-configuration/",
}
---
In order to run a Chainlink node, it must be able to connect to an Ethereum client with an active websocket connection. This is accomplished by running either [Geth](https://geth.ethereum.org/), [Nethermind](https://nethermind.io/), or using a 3rd party connection. The examples below show how to run Geth and Nethermind in their official Docker containers for each network that they support.

We would recommend to use one of the external services for your Ethereum client, since running one on your own managed machine will consume a lot of resources. If you do choose to run either Geth, or Nethermind with their native clients, please be sure to enable the websockets API, since it is required for the Chainlink node to communicate with the Ethereum blockchain.

## Geth

[Geth's Documentation](https://geth.ethereum.org/docs/)

The Geth client can be used for the Goerli test network and the Ethereum main network.

Download the latest version:

```shell
docker pull ethereum/client-go:latest
```

Create a local directory to persist the data:

```shell Goerli
mkdir ~/.geth-goerli
```
```shell Mainnet
mkdir ~/.geth
```

Run the container:

```shell Goerli
docker run --name eth -p 8546:8546 -v ~/.geth-goerli:/geth -it \
           ethereum/client-go --goerli --ws --ipcdisable \
           --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
```
```shell Mainnet
docker run --name eth -p 8546:8546 -v ~/.geth:/geth -it \
           ethereum/client-go --syncmode fast --ws --ipcdisable \
           --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
```

Once the Ethereum client is running, you can use `Ctrl + P, Ctrl + Q` to detach from the container without stopping it. You will need to leave the container running for the Chainlink node to connect to it.

If the container was stopped and you need to run it again, you can simply use the following command:

```shell
docker start -i eth
```

Return to [Running a Chainlink Node](../running-a-chainlink-node/).

## Nethermind

[Nethermind's Documentation](https://docs.nethermind.io/nethermind/)

The Nethermind client can be used for Ethereum Mainnet and test networks. To see a full list of supported networks, see the [Nethermind supported network configurations](https://docs.nethermind.io/nethermind/ethereum-client/docker#available-configurations) page.

Download the latest version:

```shell
docker pull nethermind/nethermind:latest
```

Create a local directory to persist the data:

```shell Goerli
mkdir ~/.nethermind-goerli
```
```shell Mainnet
mkdir ~/.nethermind
```

Run the container:

```shell Goerli
docker run --name eth -p 8545:8545 \
           -v ~/.nethermind-goerli/:/nethermind/data \
           -it nethermind/nethermind:latest --config goerli \
           --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
           --datadir data
```
```shell Mainnet
docker run --name eth -p 8545:8545 \
           -v ~/.nethermind/:/nethermind/data \
           -it nethermind/nethermind:latest --Sync.FastSync true \
           --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
           --datadir data
```

After the Ethereum client is running, you can use `Ctrl + P, Ctrl + Q` to detach from the container without stopping it. You will need to leave the container running for the Chainlink node to connect to it.

If the container was stopped and you need to run it again, use the following command to start it:

```shell
docker start -i eth
```

Return to [Running a Chainlink Node](../running-a-chainlink-node/).

## External Services

The following services offer Ethereum clients with websockets connectivity known to work with the Chainlink node.

## [Alchemy](https://www.alchemyapi.io)

Example connection setting:

```text Goerli
ETH_URL=wss://eth-goerli.alchemyapi.io/v2/YOUR_PROJECT_ID
```
```text Mainnet
ETH_URL=wss://eth-mainnet.alchemyapi.io/v2/YOUR_PROJECT_ID
```

## [Chainstack](https://support.chainstack.com/hc/en-us/articles/900001664463-Setting-up-a-Chainlink-node-with-an-Ethereum-node-provided-by-Chainstack)

Example connection setting:

```text Mainnet
ETH_URL=wss://user-name:pass-word-pass-word-pass-word@ws-nd-123-456-789.p2pify.com
```

## [Fiews](https://docs.fiews.io/docs/getting-started)

Example connection setting:

```text Mainnet
ETH_URL=wss://cl-main.fiews.io/v2/YOUR_API_KEY
```

## [GetBlock](https://getblock.io/)

Example connection setting:

```text Goerli
ETH_URL=wss://eth.getblock.io/goerli/?api_key=YOUR_API_KEY
```
```text Sepolia
ETH_URL=wss://eth.getblock.io/sepolia/?api_key=YOUR_API_KEY
```
```text Mainnet
ETH_URL=wss://eth.getblock.io/mainnet/?api_key=YOUR_API_KEY
```

## [Infura](https://infura.io/docs/ethereum/wss/introduction.md)

Example connection setting. Replace YOUR_PROJECT_ID with the ID Infura provides you on your project settings page.

```text Goerli
ETH_URL=wss://goerli.infura.io/ws/v3/YOUR_PROJECT_ID
```
```text Mainnet
ETH_URL=wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID
```

## [LinkPool](https://docs.linkpool.io/docs/websocket_main)

Example connection setting:

```text Mainnet
ETH_URL=wss://main-rpc.linkpool.io/ws
```

## [QuikNode](https://www.quiknode.io)

Example connection setting:

```text Goerli
ETH_URL=wss://your-node-name.goerli.quiknode.pro/security-hash/
```
```text Mainnet
ETH_URL=wss://your-node-name.quiknode.pro/security-hash/
```

## Configuring your ETH node

> 🚧 Warning
> By default, go-ethereum rejects transactions that exceed the built-in RPC gas/txfee caps. The node will fatally error transactions if this happens. If you ever exceed the caps, the node will miss transactions.

At a minimum, disable the default RPC gas and txfee caps on your ETH node. This can be done in the TOML file as seen below, or by running go-ethereum with the command line arguments: `--rpc.gascap=0 --rpc.txfeecap=0`.

To learn more about configuring ETH nodes, see the [configuration page](/docs/configuration-variables/#configuring-your-eth-node).

## Additional Tools

- [Chainlink ETH Failover Proxy](https://github.com/Fiews/ChainlinkEthFailover)
