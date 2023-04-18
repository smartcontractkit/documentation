---
layout: ../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Miscellaneous"
whatsnext: { "Security and Operation Best Practices": "/chainlink-nodes/resources/best-security-practices/" }
setup: |
  import { Tabs } from "@components/Tabs"
---

## Execute Commands Running Docker

In order to interact with the node's CLI commands, you need to be authenticated. This means that you need to access a shell within the Chainlink node's running container first. You can obtain the running container's `NAME` by running:

```shell
docker ps
```

The output will look similar to:

```
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS                              NAMES
436882efd51d        smartcontract/chainlink   "./chainlink-launche…"   33 minutes ago      Up 21 minutes       6688/tcp, 0.0.0.0:6688->6688/tcp   chainlink
```

The last item, `chainlink`, is the name of the running container (using `--name chainlink` in your `docker run` command will give you a common name). Accessing a shell for this container is accomplished by running:

```shell
docker exec -it chainlink /bin/bash
```

This changes the prompt to something similar to:

```shell
root@436882efd51d:~#
```

You can now log in by running:

```shell
chainlink admin login
```

You will be prompted to enter your API Email and Password, and if successful, the prompt will simply appear again. You can check that you are authenticated by running:

```shell
chainlink jobs list
```

If no jobs have been added, you will receive the following output, otherwise, the list of added jobs will be returned:

```
╔ Jobs
╬════╬════════════╬════════════╬═══════╬
║ ID ║ CREATED AT ║ INITIATORS ║ TASKS ║
╬════╬════════════╬════════════╬═══════╬
```

## Transfer funds from node wallet.

:::note[Note for Docker]
If using Docker, you will first need to follow the [Execute Commands Running Docker](#execute-commands-running-docker) guide to enter the running container.
:::

To transfer funds from the node wallet to another address, use the following CLI command:

```shell
chainlink txs create <amount> <your-cl-node-address> <send-to-address>
```

This method is the preferred way to interact with your node wallet. Using other methods to manually interact with the node wallet can cause nonce issues.

## Change your API password

:::note[Note for Docker]
If using Docker, you will first need to follow the [Execute Commands Running Docker](#execute-commands-running-docker) guide to enter the running container.
:::

In order to change your password, you first need to log into the CLI by running:

```shell
chainlink admin login
```

Use your API email and old password in order to authenticate.

Then run the following in order to update the password:

```shell
chainlink admin chpass
```

It will ask for your old password first, then ask for the new password and a confirmation.

Once complete, you should see a message "Password updated."

## Multi-user and Role Based Access Control (RBAC)

See the [Roles and Access Control](/chainlink-nodes/v1/roles-and-access) page.

## Importing a Keystore

If you haven't run the node before and want to import a key you can use the following command, where `./keystore.json` is the path to the keystore file of your account.

```shell import
chainlink local import ./keystore.json
```

If there is already a key in your database and you want to import another key, you will need to make sure that the same password unlocks all accounts.

## Full example in detached mode

```shell
cd ~/.chainlink-sepolia && docker run --restart=always  -p 6688:6688 -d --name sepolia-primary -v ~/.chainlink-sepolia:/chainlink -it --env-file=.env smartcontract/chainlink:1.0.0 node start -p /chainlink/.password
```
