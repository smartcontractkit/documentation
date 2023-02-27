---
layout: ../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Running a Chainlink Node on MacOS"
---

This document will walk through the steps to get a Chainlink node running locally using Docker on Mac OS in a few steps.

**Note**: replace any values \[LIKE_THIS\] with the appropriate value

## Create The Docker Environment

1. Create a directory to house the image and settings

   ```bash
   mkdir chainlink-kovan
   cd chainlink-kovan
   ```

   Within this directory you need a few files.

1. Create `.env` -- this will house the docker environment variables for the Chainlink Node

   ```
   ROOT=/chainlink
   LOG_LEVEL=debug
   ETH_CHAIN_ID=42
   MIN_OUTGOING_CONFIRMATIONS=2
   LINK_CONTRACT_ADDRESS=0xa36085F69e2889c224210F603D836748e7dC0088
   CHAINLINK_TLS_PORT=0
   SECURE_COOKIES=false
   GAS_UPDATER_ENABLED=true
   ALLOW_ORIGINS=*
   ETH_URL=wss://eth-kovan.alchemyapi.io/v2/[YOUR_API_KEY]
   DATABASE_URL=postgresql://postgres:[PG_PASSWORD]@[DOCKER_IMAGE]:5432/chainlink?sslmode=disable
   DATABASE_TIMEOUT=0
   ```

   > 📘
   > `[YOUR_API_KEY]` can be found via alchemy

   ![alchemy-key](/images/chainlink-nodes/local-docker/alchemy-key.png)

1. Create `database.env` -- this will house the docker environment variables for the PostgreSQL Node

   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=[PG_PASSWORD]
   POSTGRES_DB=chainlink
   ```

1. Create `docker-compose.yml` -- this will house the configuration for your docker images.

   ```
   version: '3'
   services:
   pg_chainlink:
       image: "postgres"
       ports:
       - "5432:5432"
       env_file:
       - database.env
       volumes:
       - [PATH_TO_POSTGRES_DATA]:/var/lib/postgressql/data/
   chainlink:
       image: "smartcontract/chainlink:[CURRENT_VERSION]"
       env_file: .env
       depends_on:
       - pg_chainlink
       ports:
       - "6688:6688"
       volumes:
       - [PATH_TO_CHAINLINK_VOLUME]:/chainlink/
       command: node start --password /chainlink/password.txt --api /chainlink/apicredentials.txt
   ```

   `[PATH_TO_POSTGRES_DATA]` is the location of the PostgreSQL data directory. For me it is: `/Library/PostgreSQL/14/data`

   `[PATH_TO_CHAINLINK_VOLUME]` should be a directory that will house a few more items. I created it within `chainlink-kovan`

   ```
   mkdir chainlink-volume
   cd chainlink-volume
   pwd
   ```

   Use the results and use that for `[PATH_TO_CHAINLINK_VOLUME]`

1. While still in the chainlink-volume create a few files
   In `password.txt` add, feel free to change the password

   ```
   secret
   ```

   In `apicredentials.txt` add, this will be the username and password for the web UI

   ```
   your-email@address.com
   password
   ```

## Prep Docker

1. Add the PostgreSQL and Chainlink volumes to docker

![docker-volumes](/images/chainlink-nodes/local-docker/docker-file-share.gif)

## Start docker

1. Run `docker compose up`

   You will see the following error

   ![error](/images/chainlink-nodes/local-docker/error1.png)

   This is expected. The database for PostgreSQL has not been created

1. Create the PostgreSQL database for chainlink

   ![docker-shell](/images/chainlink-nodes/local-docker/docker-shell.gif)

1. Stop docker if it's still running `ctrl-c` and re-run `docker compose up`

   You should see a flurry of activity and something like this 👇

   ![success](/images/chainlink-nodes/local-docker/success1.png)

Now that your node is running, open the operator interface.

## Open the operator interface

1. Head to [http://localhost:6688](http://localhost:6688/)

   ![node-success](/images/chainlink-nodes/local-docker/node-success1.png)

1. Login with the credentials you set in `apicredentials.txt`

   ![node-success2](/images/chainlink-nodes/local-docker/node-success2.png)
