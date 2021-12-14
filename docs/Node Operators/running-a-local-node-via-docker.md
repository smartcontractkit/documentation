## This document will walk through the steps to get a chainlink node running locally using Docker on Mac OS

For this example, I'll be using the Kovan Network

## Create a home for docker

Create a directory to house the image and settings

## Setup Environment

⚠️

Note, replace any values \[LIKE\_THIS\] with the appropriate value

`.env` will house the docker environment variables for the Chainlink Node

`[YOUR_API_KEY]` can be found via alchemy

![alchemy-key](/files/images/node-operators/local-docker/alchemy-key.png)

`database.env` will house the docker environment variables for the PostgreSQL Node

`docker-compose.yml` will house the configuration for your docker images.

`[PATH_TO_POSTGRES_DATA]` is the location of the PostgreSQL data directory. For me it is: `/Library/PostgreSQL/14/data`

`[PATH_TO_CHAINLINK_VOLUME]` should be a directory that will house a few more items. I created it within `chainlink-kovan`

take the results and use that for `[PATH_TO_CHAINLINK_VOLUME]`

While still in the chainlink-volume create a few files

In `password.txt` add, feel free to change the password

In `apicredentials.txt` add, this will be the username and password for the web UI

## Prep Docker

Add the PostgreSQL and Chainlink volumes to docker

![docker-volumes](/files/images/node-operators/local-docker/docker-file-share.gif)

### Start docker

`docker compose up`

You will see the following error

![error](/files/images/node-operators/local-docker/error1.png)

This is expected. The database for PostgreSQL has not been created

Create the PostgreSQL database for chainlink

![docker-shell](/files/images/node-operators/local-docker/docker-shell.gif)

Stop docker if it's still running and re-run `docker compose up`

You should see a flurry of activity and something like this 👇

![success](/files/images/node-operators/local-docker/success1.png)

## YOUR NODE IS UP AND RUNNING!

Head to [http://localhost:6688](http://localhost:6688/)

![node-success](/files/images/node-operators/local-docker/node-success1.png)

Login with the credentials you set in `apicredentials.txt`

![node-success2](/files/images/node-operators/local-docker/node-success2.png)