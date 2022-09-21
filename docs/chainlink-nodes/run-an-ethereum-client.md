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

Chainlink nodes must be able to connect to an Ethereum client with an active websocket connection. This is accomplished by running both an execution client and a consensus client. You can run these clients yourself, but running Ethereum clients requires significant storage and network resources. Optionally, you can use [External Services](#external-services) that manage these clients for you.

> 📘 If you run these clients yourself, you must enable the websockets API. The websockets API is required for the Chainlink node to communicate with the Ethereum blockchain.

## Install Docker

On the system where you plan to run your Ethereum nodes, [install Docker](https://docs.docker.com/install/). For example, you can use the following commands:

```shell Amazon Linux 2
sudo amazon-linux-extras install -y docker
sudo systemctl start docker
sudo gpasswd -a $USER docker
exit
# log in again
```
```shell CentOS
curl -sSL https://get.docker.com/ | sh
sudo systemctl start docker
sudo usermod -aG docker $USER
exit
# log in again
```
```shell Debian
curl -sSL https://get.docker.com/ | sh
sudo usermod -aG docker $USER
exit
# log in again
```
```shell Fedora
curl -sSL https://get.docker.com/ | sh
sudo systemctl start docker
sudo usermod -aG docker $USER
exit
# log in again
```
```shell Ubuntu
curl -sSL https://get.docker.com/ | sh
sudo usermod -aG docker $USER
exit
# log in again
```

## Execution clients

### Geth

You can use the [Geth client](https://geth.ethereum.org/docs/) for the Goerli testnet and the Ethereum Mainnet. See the [Geth Documentation](https://geth.ethereum.org/docs/interface/peer-to-peer/) for a list of supported networks.

Download the `stable` image of Geth:

```shell
docker pull ethereum/client-go:stable
```

Ensure that your system has sufficient capacity to store the data as the blockchain grows. The default syncmode for Geth is `--syncmode=snap`, which requires nearly 1 TiB of data. The consensus client requires an additional 200 GiB of data. About 2 TiB of capacity is sufficient at this time.

```
df -h
```

Create a local directory to persist the data. For this example, the data is in the home directory:

```shell Goerli
mkdir ~/.geth-goerli
```
```shell Mainnet
mkdir ~/.geth
```

Run the execution client with a websocket that the Chainlink node can connect to and the `authrpc` flags to allow the consensus client to connect. In this example, consensus clients on the `172.17.0.0/24` default Docker network are allowed to connect to this container.

```shell Goerli
docker run --name geth-goerli -p 8546:8546 -p 8551:8551 -v ~/.geth-goerli:/geth:/geth -it \
    ethereum/client-go --goerli --ws --ipcdisable \
    --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth \
    --authrpc.addr 0.0.0.0 --authrpc.port 8551 --authrpc.vhosts 172.17.0.0/24
```
```shell Mainnet
docker run --name geth-goerli -p 8546:8546 -p 8551:8551 -v ~/.geth-goerli:/geth:/geth -it \
    ethereum/client-go --ws --ipcdisable \
    --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth \
    --authrpc.addr 0.0.0.0 --authrpc.port 8551 --authrpc.vhosts 172.17.0.0/24
```

Once the Ethereum client is running, you can use `Ctrl + P, Ctrl + Q` to detach from the container without stopping it. You will need to leave the container running for the Chainlink node to connect to it.

If the container stops and you need to run it again, start it using the following command:

```shell Goerli
docker start -i geth-goerli
```
```shell Mainnet
docker start -i geth
```

Start a consensus client For more information, read Geth's instructions for [Connecting to Consensus Clients](https://geth.ethereum.org/docs/interface/consensus-clients).

Return to [Running a Chainlink Node](../running-a-chainlink-node/).

### Nethermind

You can use the [Nethermind client](https://docs.nethermind.io/nethermind/) for the Goerli testnet and the Ethereum Mainnet. See the [Nethermind supported network configurations](https://docs.nethermind.io/nethermind/ethereum-client/docker#available-configurations) page for a list of supported networks.

Download the `latest` image of Nethermind:

```shell
docker pull nethermind/nethermind:latest
```

Ensure that your system has sufficient capacity to store the data as the blockchain grows. By default, Nethermind requires nearly 1 TiB of data. The consensus client requires an additional 200 GiB of data. About 2 TiB of capacity is sufficient at this time.

```
df -h
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
docker run --name nethermind-goerli -p 8545:8545 \
    -v ~/.nethermind-goerli/:/nethermind/data \
    -it nethermind/nethermind:latest --config goerli \
    --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
    --datadir data
```
```shell Mainnet
docker run --name nethermind -p 8545:8545 \
    -v ~/.nethermind/:/nethermind/data \
    -it nethermind/nethermind:latest --Sync.FastSync true \
    --Init.WebSocketsEnabled true --JsonRpc.Enabled true --JsonRpc.Host 0.0.0.0 --NoCategory.CorsOrigins * \
    --datadir data
```

After the Ethereum client is running, you can use `Ctrl + P, Ctrl + Q` to detach from the container without stopping it. You will need to leave the container running for the Chainlink node to connect to it.

If the container was stopped and you need to run it again, use the following command to start it:

```shell Goerli
docker start -i nethermind-goerli
```
```shell Mainnet
docker start -i nethermind
```

Follow Nethermind's instructions for [Installing and configuring the Consensus Client](https://docs.nethermind.io/nethermind/guides-and-helpers/validator-setup/eth2-validator#setup). This will require some additional configuration settings for the Docker command that runs Nethermind.

Return to [Running a Chainlink Node](../running-a-chainlink-node/).

## Consensus clients

### Lighthouse

Create a local directory to persist the data. For this example, the data is in the home directory:

```shell Goerli
mkdir ~/.lighthouse-goerli
```
```shell Mainnet
mkdir ~/.lighthouse
```

Use the `docker inspect` command to find the IP address of the execution client container:

```shell Goerli
docker inspect --format '{{ "{{ .NetworkSettings.IPAddress " }}}}' geth-goerli
```
```shell Mainnet
docker inspect --format '{{ "{{ .NetworkSettings.IPAddress " }}}}' geth
```

Download the `latest` image of Lighthouse:

```shell
docker pull sigp/lighthouse:latest
```

Run the consensus client and point it at the execution client. The `--execution-endpoint` flag identifies the address of the execution client container. The `jwtsecret` file is required to authenticate with the execution client. The `-v ~/.geth-goerli/geth/jwtsecret:/jwtsecret` volume mount makes the `jwtsecret` file from the Geth container available inside the consensus container. Point this to the JWT for your specific execution client. 

```shell Goerli
docker run --name lighthouse-goerli -p 9000:9000/tcp -p 9000:9000/udp \
    -v ~/.lighthouse-goerli:/root/.lighthouse -v ~/.geth-goerli/geth/jwtsecret:/jwtsecret
    sigp/lighthouse lighthouse --network goerli beacon --http --http-address 0.0.0.0 \
    --execution-endpoint http://172.17.0.2:8551 --execution-jwt /jwtsecret
```
```shell Mainnet
docker run --name lighthouse-goerli -p 9000:9000/tcp -p 9000:9000/udp \
    -v ~/.lighthouse-goerli:/root/.lighthouse -v ~/.geth-goerli/geth/jwtsecret:/jwtsecret
    sigp/lighthouse lighthouse --network mainnet beacon --http --http-address 0.0.0.0 \
    --execution-endpoint http://172.17.0.2:8551 --execution-jwt /jwtsecret
```

## External Services

The following services offer Ethereum clients with websockets connectivity known to work with Chainlink nodes. These services also manage the consensus client for you.

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

## [Infura](https://infura.io/docs/ethereum/wss/introduction.md)

Example connection setting. Note to replace YOUR_PROJECT_ID with the ID Infura provides you on your project settings page

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
