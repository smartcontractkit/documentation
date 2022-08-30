---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'Run an Ethereum Client'
permalink: 'docs/run-an-ethereum-client/'
whatsnext:
  {
    'Running a Chainlink Node': '/docs/running-a-chainlink-node/',
    'Optimizing Performance': '/docs/evm-performance-configuration/',
  }
---

In order to run a Chainlink node, it must be able to connect to an Ethereum client with an active websocket connection. This is accomplished by running either [Geth](https://geth.ethereum.org/), [Nethermind](https://nethermind.io/), or using a 3rd party connection. The examples below show how to run Geth and Nethermind in their official Docker containers for each network that they support.

We would recommend to use one of the external services for your Ethereum client, since running one on your own managed machine will consume a lot of resources. If you do choose to run either Geth, or Nethermind with their native clients, please be sure to enable the websockets API, since it is required for the Chainlink node to communicate with the Ethereum blockchain.

## Geth

[Geth's Documentation](https://geth.ethereum.org/docs/)

_The Geth client can be used for the Rinkeby test network, as well as the Ethereum main network._

Download the latest version:

<!-- prettier-ignore -->
```shell
docker pull ethereum/client-go:latest
```

Create a local directory to persist the data:

<!-- prettier-ignore -->
```shell Goerli
mkdir ~/.geth-goerli
```

<!-- prettier-ignore -->
```shell Rinkeby
mkdir ~/.geth-rinkeby
```

<!-- prettier-ignore -->
```shell Mainnet
mkdir ~/.geth
```

Run the container:

<!-- prettier-ignore -->
```shell Goerli
docker run --name eth -p 8546:8546 -v ~/.geth-goerli:/geth -it \
           ethereum/client-go --goerli --ws --ipcdisable \
           --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
```

<!-- prettier-ignore -->
```shell Rinkeby
docker run --name eth -p 8546:8546 -v ~/.geth-rinkeby:/geth -it \
           ethereum/client-go --rinkeby --ws --ipcdisable \
           --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
```

<!-- prettier-ignore -->
```shell Mainnet
docker run --name eth -p 8546:8546 -v ~/.geth:/geth -it \
           ethereum/client-go --syncmode fast --ws --ipcdisable \
           --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
```

Once the Ethereum client is running, you can use `Ctrl + P, Ctrl + Q` to detach from the container without stopping it. You will need to leave the container running for the Chainlink node to connect to it.

If the container was stopped and you need to run it again, you can simply use the following command:

<!-- prettier-ignore -->
```shell
docker start -i eth
```

Return to [Running a Chainlink Node](../running-a-chainlink-node/).

## Nethermind

[Nethermind's Documentation](https://docs.nethermind.io/nethermind/)

The Nethermind client can be used for Ethereum Mainnet and test networks such as Kovan, Rinkeby and Ropsten. To see a full list of supported networks, see the [Nethermind supported network configurations](https://docs.nethermind.io/nethermind/ethereum-client/docker#available-configurations) page.

Download the latest version:

<!-- prettier-ignore -->
```shell
docker pull nethermind/nethermind:latest
```

Create a local directory to persist the data:

<!-- prettier-ignore -->
```shell Goerli
mkdir ~/.nethermind-goerli
```

<!-- prettier-ignore -->
```shell Rinkeby
mkdir ~/.nethermind-rinkeby
```

<!-- prettier-ignore -->
```shell Kovan
mkdir ~/.nethermind-kovan
```

<!-- prettier-ignore -->
```shell Mainnet
mkdir ~/.nethermind
```

Run the container:

<!-- prettier-ignore -->
```shell Goerli
docker run --name eth -p 8545:8545 \
           -v ~/.nethermind-goerli/:/nethermind/data \
           -it nethermind/nethermind:latest --config goerli \
           --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
           --datadir data
```

<!-- prettier-ignore -->
```shell Rinkeby
docker run --name eth -p 8545:8545 \
           -v ~/.nethermind-rinkeby/:/nethermind/data \
           -it nethermind/nethermind:latest --config rinkeby \
           --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
           --datadir data
```

<!-- prettier-ignore -->
```shell Kovan
docker run --name eth -p 8545:8545 \
           -v ~/.nethermind-kovan/:/nethermind/data \
           -it nethermind/nethermind:latest --config kovan \
           --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
           --datadir data
```

<!-- prettier-ignore -->
```shell Mainnet
docker run --name eth -p 8545:8545 \
           -v ~/.nethermind-kovan/:/nethermind/data \
           -it nethermind/nethermind:latest --Sync.FastSync true \
           --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
           --datadir data
```

After the Ethereum client is running, you can use `Ctrl + P, Ctrl + Q` to detach from the container without stopping it. You will need to leave the container running for the Chainlink node to connect to it.

If the container was stopped and you need to run it again, use the following command to start it:

<!-- prettier-ignore -->
```shell
docker start -i eth
```

Return to [Running a Chainlink Node](../running-a-chainlink-node/).

## External Services

The following services offer Ethereum clients with websockets connectivity known to work with the Chainlink node.

## [Alchemy](https://www.alchemyapi.io)

Example connection setting:

<!-- prettier-ignore -->
```text Goerli
ETH_URL=wss://eth-goerli.alchemyapi.io/v2/YOUR_PROJECT_ID
```

<!-- prettier-ignore -->
```text Rinkeby
ETH_URL=wss://eth-rinkeby.alchemyapi.io/v2/YOUR_PROJECT_ID
```

<!-- prettier-ignore -->
```text Kovan
ETH_URL=wss://eth-kovan.alchemyapi.io/v2/YOUR_PROJECT_ID
```

<!-- prettier-ignore -->
```text Mainnet
ETH_URL=wss://eth-mainnet.alchemyapi.io/v2/YOUR_PROJECT_ID
```

## [Chainstack](https://support.chainstack.com/hc/en-us/articles/900001664463-Setting-up-a-Chainlink-node-with-an-Ethereum-node-provided-by-Chainstack)

Example connection setting:

<!-- prettier-ignore -->
```text Mainnet
ETH_URL=wss://user-name:pass-word-pass-word-pass-word@ws-nd-123-456-789.p2pify.com
```

## [Fiews](https://docs.fiews.io/docs/getting-started)

Example connection setting:

<!-- prettier-ignore -->
```text Rinkeby
ETH_URL=wss://cl-rinkeby.fiews.io/v1/YOUR_API_KEY
```

<!-- prettier-ignore -->
```text Mainnet
ETH_URL=wss://cl-main.fiews.io/v1/YOUR_API_KEY
```

## [GetBlock](https://getblock.io/)

Example connection setting:

<!-- prettier-ignore -->
```text Goerli
ETH_URL=wss://eth.getblock.io/goerli/?api_key=YOUR_API_KEY
```

<!-- prettier-ignore -->
```text Rinkeby
ETH_URL=wss://eth.getblock.io/rinkeby/?api_key=YOUR_API_KEY
```

<!-- prettier-ignore -->
```text Kovan
ETH_URL=wss://eth.getblock.io/kovan/?api_key=YOUR_API_KEY
```

<!-- prettier-ignore -->
```text Ropsten
ETH_URL=wss://eth.getblock.io/ropsten/?api_key=YOUR_API_KEY
```

<!-- prettier-ignore -->
```text Sepolia
ETH_URL=wss://eth.getblock.io/sepolia/?api_key=YOUR_API_KEY
```

<!-- prettier-ignore -->
```text Mainnet
ETH_URL=wss://eth.getblock.io/mainnet/?api_key=YOUR_API_KEY
```

## [Infura](https://infura.io/docs/ethereum/wss/introduction.md)

Example connection setting. Replace YOUR_PROJECT_ID with the ID Infura provides you on your project settings page.

<!-- prettier-ignore -->
```text Goerli
ETH_URL=wss://goerli.infura.io/ws/v3/YOUR_PROJECT_ID
```

<!-- prettier-ignore -->
```text Rinkeby
ETH_URL=wss://rinkeby.infura.io/ws/v3/YOUR_PROJECT_ID
```

<!-- prettier-ignore -->
```text Kovan
ETH_URL=wss://kovan.infura.io/ws/v3/YOUR_PROJECT_ID
```

<!-- prettier-ignore -->
```text Mainnet
ETH_URL=wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID
```

## [LinkPool](https://docs.linkpool.io/docs/websocket_main)

Example connection setting:

<!-- prettier-ignore -->
```text Mainnet
ETH_URL=wss://main-rpc.linkpool.io/ws
```

## [QuikNode](https://www.quiknode.io)

Example connection setting:

<!-- prettier-ignore -->
```text Goerli
ETH_URL=wss://your-node-name.goerli.quiknode.pro/security-hash/
```

<!-- prettier-ignore -->
```text Rinkeby
ETH_URL=wss://your-node-name.rinkeby.quiknode.pro/security-hash/
```

<!-- prettier-ignore -->
```text Kovan
ETH_URL=wss://your-node-name.kovan.quiknode.pro/security-hash/
```

<!-- prettier-ignore -->
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
