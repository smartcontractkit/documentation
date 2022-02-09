---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Connecting to a Remote Database"
permalink: "docs/connecting-to-a-remote-database/"
whatsnext: {"Configuring Chainlink":"/docs/configuration-variables/"}
---
This page will serve as a basic, vendor-neutral guide for setting up a PostgreSQL database and connecting your Chainlink node to it.

PostgreSQL is a popular and secure database available on a variety of platforms. This guide will not show you how to create and set up a PostgreSQL database, however, some common guides can be found below:
- [Amazon AWS](https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/)
- [Azure](https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-server-database-portal)
- [Docker](https://docs.docker.com/samples/library/postgres/)
- [Google Cloud](https://cloud.google.com/community/tutorials/setting-up-postgres)

## Obtain Information About Your Database

In order to connect to a remote database, you will need to obtain information about the database and server. Take note of the database's:
- Server or IP
- Port
- Username
- Password
- Database name

The user must be the owner of the desired database. On first run, the migrations will create the tables necessary for the Chainlink node.

## Set Your  DATABASE_URL Environment Variable

Below is an example for setting the `DATABASE_URL` environment variable:

```text DATABASE_URL
DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE
```

You will need to change the following placeholders to their real values:
- `$USERNAME`: The database username (must be owner)
- `$PASSWORD`: The user's password
- `$SERVER`: The server name or IP address of the database server
- `$PORT`: The port that the database is listening on
- `$DATABASE`: The database to use for the Chainlink node
