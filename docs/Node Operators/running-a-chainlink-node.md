---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Running a Chainlink Node"
permalink: "docs/running-a-chainlink-node/"
whatsnext: {"Fulfilling Requests":"/docs/fulfilling-requests/", "Performing System Maintenance":"/docs/performing-system-maintenance/", "Miscellaneous":"/docs/miscellaneous/", "Security and Operation Best Practices":"/docs/best-security-practices/"}
metadata:
  title: "Running a Chainlink Node"
  description: "Run your own Chainlink node using this guide which explains the requirements and basics for getting started."
  image:
    0: "/files/OpenGraph_V3.png"
---

In this section, we'll explain the requirements and basics for running your own Chainlink node.

It's important to note that nodes can fulfill requests for open APIs out-of-the-box using our [Tasks](/docs/tasks/) without needing any additional configuration.

If you would like to provide data from an authenticated API, you can add an [external adapter](../external-adapters/) to enable connectivity through the Chainlink node.

![Chainlink Node Diagram](/files/ab5762f-end-to-end-diagram.png)

## Requirements

### LINK requirements

You can run a Chainlink node with 0 LINK, but the node will not be able to participate in requests that require a deposit until it has earned some LINK first.

Requesters can specify an amount of LINK that all nodes must deposit as a penalty fee in the event that the node doesn’t fulfill the request. However, since penalty fees are optional, not all requests will require it.

### Chainlink Node Requirements

Your Chainlink node should be run on a server that has a public IP address, and meets the following CPU and memory requirements:

- Minimum: To get started running a Chainlink node, you will need a machine with at least **2 cores** and **4 GB of RAM**.
- Recommended: The requirements for running a Chainlink node scale as the number of jobs your node services also scales. For nodes with over 100 jobs, you will need at least **4 cores** and **8GB of RAM**.  

### PostgreSQL Database Requirements

In addition to running a Chainlink node, must also run a PostgreSQL database version 11 or newer on a system that meets the following CPU, memory, and storage requirements:

- Minimum: At least **2 cores**, **4GB of RAM**, and **100 GB of storage**.
- Recommended: To support more than 100 jobs, your database server will need at least **4 cores**, **16 GB of RAM**, and **100 GB of storage**.

Make sure that your DB host provides access to logs.

If you run your node on AWS, use an instance type with dedicated core time. [Burstable Performance Instances](https://aws.amazon.com/ec2/instance-types/#Burstable_Performance_Instances) have a limited number of [CPU credits](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-credits-baseline-concepts.html), so you should not use them to run Chainlink nodes that require consistent performance.

### Ethereum Client

Connectivity to an Ethereum client is also required for communication with the blockchain. If you decide to run your own Ethereum client, you will want to run that on a separate machine. Hardware requirements of Ethereum clients can change over time. You can also use a [third-party service](../run-an-ethereum-client/#external-services) as your Ethereum client.

## Running From Source

To run a Chainlink node from source, use the [following instructions](https://github.com/smartcontractkit/chainlink#install).

## Using Docker

It's recommended to run the Chainlink node with [Docker](https://www.docker.com/). This is because we continuously build and deploy the code from our [repository on Github](https://github.com/smartcontractkit/chainlink), which means you don't need a complete development environment to run a node.

### Requirements

- [Docker-CE](https://docs.docker.com/install/). Quick instructions for setting up Docker are below:

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

- A fully synced Ethereum client with websockets enabled. Client specific instructions can be found below:
  - [Run Geth](../run-an-ethereum-client/#geth)
  - [Run OpenEthereum](../run-an-ethereum-client/#parity)
  - [Use an external service](../run-an-ethereum-client/#external-services)

#### Create a directory

Once you have your Ethereum client running and fully synced, you're ready to run the Chainlink node.

Create a local directory to hold the Chainlink data:

```shell Rinkeby
mkdir ~/.chainlink-rinkeby
```
```shell Kovan
mkdir ~/.chainlink-kovan
```
```shell Mainnet
mkdir ~/.chainlink
```

> **_Other Supported Networks:_**  Chainlink is blockchain agnostic technology. The [LINK Token Contracts](../link-token-contracts/) page details networks which support the LINK token. You can setup your node to provide data to any of these blockchains.

#### Create an Environment File

Run the following as a command to create an environment file and populate with variables specific to the network you're running on. For a full list of available configuration variables, click [here](../configuration-variables/).

```shell Rinkeby
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=4
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=*" > ~/.chainlink-rinkeby/.env
```
```shell Kovan
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=42
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=*" > ~/.chainlink-kovan/.env
```
```shell Mainnet
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=1
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=*" > ~/.chainlink/.env
```

#### Set your Ethereum Client URL

> 🚧 Using an external Ethereum client?
>
> If you're using a 3rd party service to connect to the blockchain, skip to the [External Provider](#ethereum-client-as-an-external-provider) section to set the `ETH_URL` environment variable. We provide general guidance, but you will need to obtain the websocket connection string to add to your environment file.

#### Ethereum Client on the Same Machine

Next you need to get the URL for the Ethereum client. The command below will help you obtain the IP address of the container that your Ethereum client is running on. **This will only work if you have started an Ethereum client on the same machine as your Chainlink node.**

```shell Local
ETH_CONTAINER_IP=$(docker inspect --format '{{ "{{ .NetworkSettings.IPAddress " }}}}' $(docker ps -f name=eth -q))
```

Then run the following command to add the Ethereum client's URL to your environment file. If you are using an external Ethereum client, use the External tab below, and update `$ETH_CONTAINER_IP` to the websocket address used for connectivity.

```shell Rinkeby
echo "ETH_URL=ws://$ETH_CONTAINER_IP:8546" >> ~/.chainlink-rinkeby/.env
```
```shell Kovan
echo "ETH_URL=ws://$ETH_CONTAINER_IP:8546" >> ~/.chainlink-kovan/.env
```
```shell Mainnet
echo "ETH_URL=ws://$ETH_CONTAINER_IP:8546" >> ~/.chainlink/.env
```

#### Ethereum Client as an External Provider

If you are using an external provider for connectivity to the Ethereum blockchain or you are running an Ethereum client on a separate instance, you may use the command below for your network. Be sure to update the value for `CHANGEME` to the value given by your provider or the address and port of your separate instance.

```shell Rinkeby
echo "ETH_URL=CHANGEME" >> ~/.chainlink-rinkeby/.env
```
```shell Kovan
echo "ETH_URL=CHANGEME" >> ~/.chainlink-kovan/.env
```
```shell Mainnet
echo "ETH_URL=CHANGEME" >> ~/.chainlink/.env
```

> 🚧 Running Chainlink Node on Ganache
>
> Ganache is a mock testnet and it doesn't work with Chainlink because of that. To use the features of the network, you need to deploy your contract on a real environment: one of the testnets or mainnets. The full list of supported environments can be found [here](../link-token-contracts/).

#### Set the Remote DATABASE_URL Config

You will need to connect your Chainlink node with a remote PostgreSQL database. See the [Connecting to a Remote Database](../connecting-to-a-remote-database/) page for more information. Use the example below to configure your `DATABASE_URL` setting in your environment file, replacing `$VARIABLES` with their actual values.

- `$USERNAME`: The database username (must be owner)
- `$PASSWORD`: The user's password
- `$SERVER`: The server name or IP address of the database server
- `$PORT`: The port that the database is listening on
- `$DATABASE`: The database to use for the Chainlink node (i.e. "postgres")

> 🚧 Important
>
> If you're testing you can add `?sslmode=disable` to the end of your `DATABASE_URL`. However you should *never* do this on a production node.

```shell Rinkeby
echo "DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE" >> ~/.chainlink-rinkeby/.env
```
```shell Kovan
echo "DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE" >> ~/.chainlink-kovan/.env
```
```shell Mainnet
echo "DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE" >> ~/.chainlink/.env
```

#### Start the Chainlink Node

Now you can run the Docker image. Replace `<version>` with your desired version. Tag versions are available in the [Chainlink docker hub](https://hub.docker.com/r/smartcontract/chainlink/tags). *The `latest` version does not work.*

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n
```
```shell Mainnet
cd ~/.chainlink && docker run -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n
```

> 📘 Local Database
>
> If you're running a local database you may need to add the `--network host` flag to the command above.

The first time running the image, it will ask you for a password and confirmation. This will be your wallet password that you can use to unlock the keystore file generated for you. Then, you'll be prompted to enter an API Email and Password. This will be used to expose the API for the GUI interface, and will be used every time you log into your node. When running the node again, you can supply the `-p` option with a path to a text file containing the wallet key password, and a `-a` option, pointing to a text file containing the API email and password. Instructions on how to do that are [here](../miscellaneous/#use-password-and-api-files-on-startup).

> 📘 Important
>
> You will need to send some ETH to your node's address in order for it to fulfill requests. You can view your node's ETH address when the node starts up or on the Configuration page of the GUI.

You can now connect to your Chainlink node's UI interface by navigating to [http://localhost:6688](http://localhost:6688). If using a VPS, you can create a [SSH tunnel](https://www.howtogeek.com/168145/how-to-use-ssh-tunneling/) to your node for `6688:localhost:6688` to enable connectivity to the GUI. Typically this is done with `ssh -i $KEY $USER@$REMOTE-IP -L 6688:localhost:6688 -N`. A SSH tunnel is recommended over opening up ports specific to the Chainlink node to be public facing. See the [Security and Operation Best Practices](../best-security-practices/) page for more details on how to secure your node.
