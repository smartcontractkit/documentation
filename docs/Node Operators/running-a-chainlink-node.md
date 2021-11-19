---
layout: nodes.liquid
date: Last Modified
title: "Running a Chainlink Node"
permalink: "docs/running-a-chainlink-node/"
whatsnext: {"Fulfilling Requests":"/docs/fulfilling-requests/", "Performing System Maintenance":"/docs/performing-system-maintenance/", "Miscellaneous":"/docs/miscellaneous/", "Best Security and Operating Practices":"/docs/best-security-practices/"}
metadata:
  title: "Running a Chainlink Node"
  description: "Run your own Chainlink node using this guide which explains the requirements and basics for getting started."
  image:
    0: "/files/OpenGraph_V3.png"
---

This guide shows you how to run the Chainlink node in [Docker](https://www.docker.com/). Tagged Docker images are available from the [Chainlink Docker Hub](https://hub.docker.com/r/smartcontract/chainlink/tags). If you run Chainlink nodes in Docker, you don't need to configure a complete development environment to run your node.

If you need to run a Chainlink node from source, use the [install instructions](https://github.com/smartcontractkit/chainlink#install) in the Chainlink GitHub repository.

Nodes can fulfill requests for open APIs out-of-the-box using [Tasks](/docs/tasks/) without needing any additional configuration. If you need to provide data from an authenticated API, add an [external adapter](../external-adapters/) to enable connectivity through the Chainlink node.

![Chainlink Node Diagram](/files/ab5762f-end-to-end-diagram.png)

## Requirements

- A Linux system or VM: The hardware requirements are light. The most demanding component of this tutorial is the Ethereum client connection. If you [use an external service](../run-an-ethereum-client/#external-services), you can use a machine with as little as 10GB of storage and 2GB of RAM to run your Chainlink node.
- [Docker](https://docs.docker.com/install/): This guide uses Docker containers to simplify dependencies and application deployment.
- Ethereum client: A fully synced Ethereum client with websockets enabled
- Database: You must connect your Chainlink node to a database such as PostgreSQL
- Network: Use Mainnet or a [supported testnet](../link-token-contracts/). Not all testnets work with Chainlink. For example, Ganache is a mock testnet, and it doesn't work with Chainlink because of that. See the [LINK Token Contracts](../link-token-contracts/) page for a full list of supported environments.

## Configure Docker

Configure [Docker](https://docs.docker.com/install/) on the system where you plan to run your Chainlink node. Use the quick instructions for setting up Docker below:

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

## Start an Ethereum Client

Start a fully synced Ethereum client with websockets enabled. Either run this on the same system as your Chainlink node or use an external service. Client specific instructions are at the following links:
  - [Run Geth](../run-an-ethereum-client/#geth) with Rinkeby or Mainnet.
  - [Run OpenEthereum](../run-an-ethereum-client/#parity) with Kovan or Mainnet.
  - [Use an external service](../run-an-ethereum-client/#external-services). You must have a valid URL and port number to connect your Chainlink node to an external service.

Be sure that your client is fully synced before you start your Chainlink node.

## Start a Database

Start a database that your Chainlink node can use to store data about the node and its processes. Either run the database on the same system as your Chainlink node, or connect your node to a remote database. To learn how to deploy and run PostgreSQL, use one of the following guides:

- [Run PostgreSQL locally in Docker](https://hub.docker.com/_/postgres/)
- [Run PostgreSQL locally without Docker](https://www.postgresql.org/docs/current/server-start.html)
- [Connect to a remote database](../connecting-to-a-remote-database/)

After you start the database, use the default `postgres` user and `postgres` database or create a separate user and database for the Chainlink node. Record the username, the user password, and the database name that you configure. You'll provide this information in your Chainlink node's `.env` configuration file later.

## Configure the Chainlink Node

Create a new directory and an `.env` file with variables that tell your Chainlink node how to connect to your Ethereum client and your database.

1. [Create a directory](#create-a-directory)
1. [Create an Environment File](#create-an-environment-file)
1. [Set the Ethereum Client URL and Port](#set-the-ethereum-client-url-and-port)
1. [Set the Remote Database URL and Credentials](#set-the-remote-database-url-and-credentials)

### Create a directory

Create a local directory to hold the Chainlink node configuration. This guide creates a different directory depending on what network you plan to run:

```shell Rinkeby
mkdir ~/.chainlink-rinkeby && cd ~/.chainlink-rinkeby/
```
```shell Kovan
mkdir ~/.chainlink-kovan && cd ~/.chainlink-kovan/
```
```shell Mainnet
mkdir ~/.chainlink  && cd ~/.chainlink/
```

> ℹ️ Other Supported Networks:
>
> Chainlink is blockchain agnostic technology. The [LINK Token Contracts](../link-token-contracts/) page details networks which support the LINK token. You can setup your node to provide data to any of these blockchains.

### Create an Environment File

Use `echo` to create an `.env` environment file with the required variables for your specific network:

```shell Rinkeby
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=4
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS=0x01BE23585060835E02B77ef475b0Cc51aA1e0709
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
GAS_UPDATER_ENABLED=true
ALLOW_ORIGINS=*
ETH_URL=[PROTOCOL]://[CLIENT_ADDRESS]:[CLIENT_PORT]
DATABASE_URL=postgresql://[USERNAME]:[PASSWORD]@[SERVER]:[PORT]/[DB_NAME]?sslmode=[SSL_MODE]
#DATABASE_TIMEOUT=0" > ~/.chainlink-rinkeby/.env
```
```shell Kovan
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=42
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS=0xa36085F69e2889c224210F603D836748e7dC0088
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
GAS_UPDATER_ENABLED=true
ALLOW_ORIGINS=*
ETH_URL=[PROTOCOL]://[CLIENT_ADDRESS]:[CLIENT_PORT]
DATABASE_URL=postgresql://[USERNAME]:[PASSWORD]@[SERVER]:[PORT]/[DB_NAME]?sslmode=[SSL_MODE]
#DATABASE_TIMEOUT=0" > ~/.chainlink-kovan/.env
```
```shell Mainnet
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=1
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
GAS_UPDATER_ENABLED=true
ALLOW_ORIGINS=*
ETH_URL=[PROTOCOL]://[CLIENT_ADDRESS]:[CLIENT_PORT]
DATABASE_URL=postgresql://[USERNAME]:[PASSWORD]@[SERVER]:[PORT]/[DB_NAME]?sslmode=[SSL_MODE]
#DATABASE_TIMEOUT=0" > ~/.chainlink/.env
```

If you need a complete list of available configuration variables for the node, see the [configuration variables](../configuration-variables/) page.

### Set the Ethereum Client URL and Port

Construct the URL for your Ethereum client and configure it in the `.env` file.

1. Find the hostname or IP address for your Ethereum client using one of the following methods:

    - If you are running the Ethereum client in a local Docker container, use the `docker inspect` command to find the IP address for that container:
      ```shell
      docker inspect --format '{{ "{{ .NetworkSettings.IPAddress " }}}}' $(docker ps -f name=eth -q)
      ```
    - If you are running the Ethereum client outside of a Docker container on your local system, use `localhost` as your address.
    - If you are running the Ethereum client on another server or from an external provider, find the DNS hostname or IP address for that system.

1. Find the port for your Ethereum client. The guide to [Run an Ethereum Client](../run-an-ethereum-client) sets `8546` as the port, but this number might be different depending on how you configured the client.

1. Open the `.env` file in a text editor.

1. In the editor, configure the `ETH_URL` variable with the address and port for your Ethereum client. The URL has the following structure:

    ```
    [PROTOCOL]://[CLIENT_ADDRESS]:[CLIENT_PORT]
    ```

    - `[PROTOCOL]`: For local test clients, specify `ws` to use the unencrypted WebSocket protocol. For production clients and external providers, specify `wss` to use an SSL-encrypted WebSocket protocol. If you configure your own client and need `wss`, you might need to create an encrypted reverse proxy.
    - `[CLIENT_ADDRESS]`: The IP address or hostname that you obtained for your Ethereum client
    - `[CLIENT_PORT]`: The port for your Ethereum client

1. Save the `.env` file.

### Set the Remote Database URL and Credentials

Construct the address and credentials for your database and configure them in the `.env` file.

1. Find the address for your database using one of the following methods:

    - If you are running PostgreSQL in a local Docker container, use the `docker inspect` command to find the IP address for that container:

      ```shell
      docker inspect --format '{{ "{{ .NetworkSettings.IPAddress " }}}}' $(docker ps -f name=some-postgres -q)
      ```
    - If you are running PostgreSQL outside of a Docker container on your local system, use `localhost` as your address.
    - If you are running PostgreSQL on another server, find the DNS hostname or IP address for that system.

1. Find the port for your database. The guide to [Run PostgreSQL locally in Docker](https://hub.docker.com/_/postgres/) sets the default `5432` port, but this number might be different depending on how you configured the database.

1. Open the `.env` file in a text editor.

1. In the editor, configure the `DATABASE_URL` variable with the URL and credentials for your database. For PostgreSQL, the URL has the following structure:

    ```
    postgresql://[USERNAME]:[PASSWORD]@[SERVER]:[PORT]/[DB_NAME]?sslmode=[SSL_MODE]
    ```

    - `[USERNAME]`: The username for the database owner.
    - `[PASSWORD]`: The password for the database owner username.
    - `[SERVER]`: The hostname or IP address of the database server.
    - `[PORT]`: The port that the database is listening on. The default port is `5432`.
    - `[DB_NAME]`: The name of the database to use for the Chainlink node.
    - `[SSL_MODE]`: If you are testing on a database that does not have SSL enabled, specify `disable` so that you don't need to go through the process of configuring SSL on your database. On a production node, set this value to `require` or `verify-full` to require an encrypted connection between your Chainlink node and the database. See the [PostgreSQL documentation](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-PROTECTION) to learn about the available SSL modes.

1. Optionally, uncomment and set the `DATABASE_TIMEOUT` variable. For a primary/secondary Chainlink node architecture, set `DATABASE_TIMEOUT=0` to allow a secondary node to wait indefinitely for the lock to be released on the database.

1. Save the `.env` file.

## Start the Chainlink Node

After you configure the `.env` file, run the Docker image for the Chainlink node. Replace `$VERSION` with your desired node version. Tag versions are available in the [Chainlink docker hub](https://hub.docker.com/r/smartcontract/chainlink/tags). For example, `0.10.10` is an acceptable version to run. The `latest` version tag does not work.

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:[VERSION] local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink:[VERSION] local n
```
```shell Mainnet
cd ~/.chainlink && docker run -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink:[VERSION] local n
```

> 📘 Local Database
>
> If you are running a local database, you might need to add the `--network host` flag to the command above.

The first time running the image, it will ask you for a password and confirmation. This will be your wallet password that you use to unlock the keystore file generated for you. Then, you are prompted to enter an API Email and Password. This will be used to expose the API for the GUI interface, and will be used every time you log into your node. When you run the node again, add the `-p` option with a path to a text file containing the wallet key password and also add the `-a` option pointing to a text file containing the API email and password. Instructions on how to do that are [here](../miscellaneous/#use-password-and-api-files-on-startup).

> 📘 Important
> You will need to send some ETH to your node's address so it can fulfill requests. You can view your node's ETH address when the node starts up or on the Keys page of the GUI.

Connect to your Chainlink node's UI interface by navigating to [http://localhost:6688](http://localhost:6688). If your node is on a remote server, create an [SSH tunnel](https://www.howtogeek.com/168145/how-to-use-ssh-tunneling/) to your node for `6688:localhost:6688` to enable connectivity to the GUI. For example, you can run `ssh -i $KEY $USER@$REMOTE-IP -L 6688:localhost:6688 -N` to map your local port to the same port on the remote server. An SSH tunnel is preferred because it does not publicly expose ports for the Chainlink node. See the [Best Security and Operating Practices](../best-security-practices/) page for more details on how to secure your node.
