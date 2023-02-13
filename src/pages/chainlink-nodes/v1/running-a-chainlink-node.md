---
layout: ../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Running a Chainlink Node"
permalink: "docs/running-a-chainlink-node/"
whatsnext:
  {
    "Fulfilling Requests": "/chainlink-nodes/v1/fulfilling-requests/",
    "Requirements": "/chainlink-nodes/resources/requirements/",
    "Optimizing EVM Performance": "/chainlink-nodes/resources/evm-performance-configuration/",
    "Performing System Maintenance": "/chainlink-nodes/resources/performing-system-maintenance/",
    "Miscellaneous": "/chainlink-nodes/resources/miscellaneous/",
    "Security and Operation Best Practices": "/chainlink-nodes/resources/best-security-practices/",
  }
metadata:
  title: "Running a Chainlink Node locally"
  description: "Run your own Chainlink node using this guide which explains the requirements and basics for getting started."
setup: |
  import { Tabs } from "@components/Tabs"
---

This guide will teach you how to run a Chainlink node locally using [Docker](#using-docker). The Chainlink node will be configured to connect to Ethereum Goerli testnet.

:::note[Running from source]
To run a Chainlink node from source, use the [following instructions](https://github.com/smartcontractkit/chainlink#install). However, It’s recommended to run the Chainlink node with Docker. This is because we continuously build and deploy the code from our repository on Github, which means you don’t need a complete development environment to run a node.
:::

:::note[Other Supported Networks]
Chainlink is blockchain agnostic technology. The [LINK Token Contracts](/resources/link-token-contracts/) page details networks which support the LINK token. You can setup your node to provide data to any of these blockchains.
:::

:::note[Running Chainlink Node on Ganache]
Ganache is a mock testnet. Although you can run nodes on Ganache, it is not officially supported. Most node operators should use one of the supported [testnets](/resources/link-token-contracts/) for development and testing.
:::

## Requirements

- As explained in the [requirements page](/chainlink-nodes/resources/requirements/), make sure there are enough resources to run a Chainlink node and a PostgreSQL database.
- Install [Docker Desktop](https://docs.docker.com/get-docker/). You will run the Chainlink node and PostgreSQL in Docker containers.
- Chainlink nodes must be able to connect to an Ethereum client with an active websocket connection. See [Running an Ethereum Client](/chainlink-nodes/resources/run-an-ethereum-client/) for details. In this tutorial, you can [use an external service](/chainlink-nodes/resources/run-an-ethereum-client/#external-services) as your client.

## Using Docker

### Run PostgreSQL

1. Run PostgreSQL in a Docker container. You can replace `mysecretpassword` with your own password.

   ```shell
   docker run --name cl-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
   ```

1. Check the container is running (Status `Up`). Note the `5432` port is [published](https://docs.docker.com/config/containers/container-networking/#published-ports) `0.0.0.0:5432->5432/tcp` and therefore accessible outside of Docker.

   ```shell
   docker ps -a -f name=cl-postgres

   CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS         PORTS                    NAMES
   dc08cfad2a16   postgres   "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:5432->5432/tcp   cl-postgres

   ```

### Run Chainlink node

#### Configure your node

1. Create a local directory to hold the Chainlink data:

   ```shell Goerli
   mkdir ~/.chainlink-goerli
   ```

1. Run the following as a command to create an environment file and populate with variables specific to the network you're running on. For a full list of available configuration variables, click [here](/chainlink-nodes/v1/configuration/).
   Be sure to update the value for `CHANGEME` to the value given by your [external Ethereum provider](/chainlink-nodes/resources/run-an-ethereum-client/#external-services). Update the value for `mysecretpassword` to the chosen password in [Run PostgreSQL](#run-postgresql).

   ```shell Goerli
   echo "LOG_LEVEL=debug
   ETH_CHAIN_ID=5
   CHAINLINK_TLS_PORT=0
   SECURE_COOKIES=false
   ALLOW_ORIGINS=*
   ETH_URL=CHANGEME
   DATABASE_URL=postgresql://postgres:mysecretpassword@host.docker.internal:5432/postgres?sslmode=disable" > ~/.chainlink-goerli/.env
   ```

   :::tip[Important]
   Because you are testing locally, add `?sslmode=disable` to the end of your
   `DATABASE_URL`. However you should _never_ do this on a production node.
   :::

1. Start the Chainlink Node. Now you can run the Docker image. Replace `<version>` with your desired version. Tag versions are available in the [Chainlink docker hub](https://hub.docker.com/r/smartcontract/chainlink/tags). _The `latest` version does not work._

   ```shell Goerli
   cd ~/.chainlink-goerli && docker run --name chainlink  -v ~/.chainlink-goerli:/chainlink -it --env-file=.env -p 6688:6688 --add-host=host.docker.internal:host-gateway smartcontract/chainlink:<version> local n
   ```

   The first time running the image, it will ask you for a password and confirmation. This will be your wallet password that you can use to unlock the keystore file generated for you. Then, you'll be prompted to enter an API Email and Password. This will be used to expose the API for the GUI interface, and will be used every time you log into your node. When running the node again, you can supply the `-p` option with a path to a text file containing the wallet key password, and a `-a` option, pointing to a text file containing the API email and password. Instructions on how to do that are [here](/chainlink-nodes/resources/miscellaneous/#use-password-and-api-files-on-startup).

1. Check the container is running (Status `Up`). Note the `6688` port is [published](https://docs.docker.com/config/containers/container-networking/#published-ports) `0.0.0.0:6688->6688/tcp` and therefore accessible outside of Docker.

   ```shell
   docker ps -a -f name=chainlink

   CONTAINER ID   IMAGE                            COMMAND               CREATED         STATUS                   PORTS                    NAMES
   feff39f340d6   smartcontract/chainlink:1.10.0   "chainlink local n"   4 minutes ago   Up 4 minutes (healthy)   0.0.0.0:6688->6688/tcp   chainlink
   ```

1. You can now connect to your Chainlink node's UI interface by navigating to [http://localhost:6688](http://localhost:6688). If using a VPS, you can create a [SSH tunnel](https://www.howtogeek.com/168145/how-to-use-ssh-tunneling/) to your node for `6688:localhost:6688` to enable connectivity to the GUI. Typically this is done with `ssh -i $KEY $USER@$REMOTE-IP -L 6688:localhost:6688 -N`. A SSH tunnel is recommended over opening up ports specific to the Chainlink node to be public facing. See the [Security and Operation Best Practices](/chainlink-nodes/resources/best-security-practices/) page for more details on how to secure your node.
