---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Miscellaneous"
permalink: "docs/miscellaneous/"
whatsnext: {"Security and Operation Best Practices":"/docs/best-security-practices/"}
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

> 🚧 If using Docker, you will first need to follow the [Execute Commands Running Docker](#execute-commands-running-docker) guide to enter the running container.

To transfer funds from the node wallet to another address, use the following CLI command:

```shell
chainlink txs create <amount> <your-cl-node-address> <send-to-address>
```

This method is the preferred way to interact with your node wallet. Using other methods to manually interact with the node wallet can cause nonce issues.

## Change your API password

> 🚧 If using Docker, you will first need to follow the [Execute Commands Running Docker](#execute-commands-running-docker) guide to enter the running container.

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

Chainlink Nodes allow the root admin CLI user and any additional admin users to create and assign tiers of role-based access to new users. These new API users can able to log in to the Operator UI independently.

Each user has a specific role assigned to their account. There are four roles: `admin`, `edit`, `run`, and `view`.

If there are multiple users who need specific access to manage the Chainlink Node instance, permissions and level of access can be set here.

User management is configured through the use of the admin `chainlink admin users` command. Run `chainlink admin login` before you set user roles for other accounts. For example, a read-only user can be created with the following command:

```shell
chainlink admin users create --email=operator-ui-read-only@test.com --role=view
```

Specific actions are enabled to check role-based access before they execute. The following table lists the actions that have role-based access and the role that is required to run that action:

| Action | Read | Run | Edit | Admin |
|:--- | :---: | :---: | :---: | :---: |
| Update password  | X | X | X | X |
| Create self API token  | X | X | X | X |
| Delete self API token  | X | X | X | X |
| List external initiators  | X | X | X | X |
| Create external initiator  |   |   | X | X |
| Delete external initiator  |   |   | X | X |
| List bridges  | X | X | X | X |
| View bridge  | X | X | X | X |
| Create bridge  |   |   | X | X |
| Edit bridge  |   |   | X | X |
| Delete bridge  |   |   | X | X |
| View config  | X | X | X | X |
| Update config  |   |   |   | X |
| Dump env/config  |   |   |   | X |
| View transaction attempts  | X | X | X | X |
| View transaction attempts EVM  | X | X | X | X |
| View transactions  | X | X | X | X |
| Replay a specific block number  |  | X | X | X |
| List keys (CSA,ETH,OCR(2),P2P,Solana,Terra)  | X | X | X | X |
| Create keys (CSA,ETH,OCR(2),P2P,Solana,Terra)  |   |   | X | X |
| Delete keys (CSA,ETH,OCR(2),P2P,Solana,Terra)  |   |   |   | X |
| Import keys (CSA,ETH,OCR(2),P2P,Solana,Terra)  |   |   |   | X |
| Export keys (CSA,ETH,OCR(2),P2P,Solana,Terra)  |   |   |   | X |
| List jobs | X | X | X | X |
| View job | X | X | X | X |
| Create job |  |  | X | X |
| Delete job |  |   | X | X |
| List pipeline runs | X | X | X | X |
| View job runs | X | X | X | X |
| Delete job spec errors |  |  | X | X |
| View features | X | X | X | X |
| View log | X | X | X | X |
| Update log |   |   |   | X |
| List chains | X | X | X | X |
| View chain | X | X | X | X |
| Create chain |   |   | X | X |
| Update chain |   |   | X | X |
| Delete chain |   |   | X | X |
| View nodes | X | X | X | X |
| Create node |  |  | X | X |
| Update node |  |  | X | X |
| Delete node |  |  | X | X |
| View forwarders | X | X | X | X |
| Create forwarder |   |   | X | X |
| Delete forwarder |   |   | X | X |
| Create job run |   | X | X | X |
| Create Transfer EVM  |   |   |   | X |
| Create Transfer Terra  |   |   |   | X |
| Create Transfer Solana  |   |   |   | X |
| Create user  |   |   |   | X |
| Delete user  |   |   |   | X |
| Edit user  |   |   |   | X |
| List users  |   |   |   | X |

The run command allows for minimal interaction and only enables the ability to replay a specific block number and kick off a job run.

## Use Named Chainlink Container

Instead of allowing Docker to generate a name for your running container for you, you can provide a name with the `--name` option in your run command. For example, without the `--name` option, `docker ps` could reveal a name like:

```
... NAMES
... cocky_austin
```

However, if we add `--name chainlink` to our run command, `docker ps` gives us:

```
... NAMES
... chainlink
```

This can be easily accomplished by using the following example run command:

```shell Goerli
cd ~/.chainlink-goerli && docker run --name chainlink -p 6688:6688 -v ~/.chainlink-goerli:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Mainnet
cd ~/.chainlink && docker run --name chainlink -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

Running this the once will save the options provided so that you may easily start the named container in the future by running:

```shell
docker start -i chainlink
```

If you need to make changes to the run parameters or the environment file, first remove the named container by running:

```shell
docker rm chainlink
```

Then make your changes and use the longer `docker run` command again.

## Use Password and API Files On Startup

The Chainlink node can be supplied with files for the wallet password and API email and password (on separate lines) on startup so that you don't need to enter credentials when starting the node. Following the pattern established in [Running a Chainlink Node](../running-a-chainlink-node/), you can create an API file by running the following:

> 🚧 Important
>
> Change the values within the quotes to something unique for your node.

```shell Goerli
echo "user@example.com" > ~/.chainlink-goerli/.api
```
```shell Mainnet
echo "user@example.com" > ~/.chainlink/.api
```

Then add the password line by running:

```shell Goerli
echo "password" >> ~/.chainlink-goerli/.api
```
```shell Mainnet
echo "password" >> ~/.chainlink/.api
```

Create the password file by running the following:

```shell Goerli
echo "my_wallet_password" > ~/.chainlink-goerli/.password
```
```shell Mainnet
echo "my_wallet_password" > ~/.chainlink/.password
```

Finally, in order to use the password and API files upon running the node, add `-p /chainlink/.password -a /chainlink/.api` to your run command, like so:

```shell Goerli
cd ~/.chainlink-goerli && docker run -p 6688:6688 -v ~/.chainlink-goerli:/chainlink -it --env-file=.env smartcontract/chainlink local n -p /chainlink/.password -a /chainlink/.api
```
```shell Mainnet
cd ~/.chainlink && docker run -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n -p /chainlink/.password -a /chainlink/.api
```

## Importing a Keystore

If you haven't ran the node before and want to import a key you can use the following command, where `./keystore.json` is the path to the keystore file of your account.

```shell import
chainlink local import ./keystore.json
```

If there is already a key in your database and you want to import another key, you will need to make sure that the same password unlocks all accounts.


## Full example in detached mode

```shell
cd ~/.chainlink-goerli && docker run --restart=always  -p 6688:6688 -d --name goerli-primary -v ~/.chainlink-goerli:/chainlink -it --env-file=.env smartcontract/chainlink:1.0.0 local n -p /chainlink/.password
```
