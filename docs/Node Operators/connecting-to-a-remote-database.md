---
layout: nodes.liquid
date: Last Modified
title: "Connecting to a Remote Database"
permalink: "docs/connecting-to-a-remote-database/"
hidden: false
---
This page will serve as a basic, vendor-neutral guide for setting up a PostgreSQL database and connecting your Chainlink node to it.

PostgreSQL is a popular and secure database available on a variety of platforms. This guide will not show you how to create and set up a PostgreSQL database, however, some common guides can be found below:
- <a href="https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/" target="_blank">Amazon AWS</a>
- <a href="https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-server-database-portal" target="_blank">Azure</a>
- <a href="https://docs.docker.com/samples/library/postgres/" target="_blank">Docker</a>
- <a href="https://cloud.google.com/community/tutorials/setting-up-postgres" target="_blank">Google Cloud</a>

[block:api-header]
{
  "title": "Obtain Information About Your Database"
}
[/block]
In order to connect to a remote database, you will need to obtain information about the database and server. Take note of the database's:
- Server or IP
- Port
- Username
- Password
- Database name

The user must be the owner of the desired database. On first run, the migrations will create the tables necessary for the Chainlink node.
[block:api-header]
{
  "title": "Set Your  DATABASE_URL Environment Variable"
}
[/block]
Below is an example for setting the `DATABASE_URL` environment variable:
[block:code]
{
  "codes": [
    {
      "code": "DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE",
      "language": "text",
      "name": "DATABASE_URL"
    }
  ]
}
[/block]
You will need to change the following placeholders to their real values:
- `$USERNAME`: The database username (must be owner)
- `$PASSWORD`: The user's password
- `$SERVER`: The server name or IP address of the database server
- `$PORT`: The port that the database is listening on
- `$DATABASE`: The database to use for the Chainlink node