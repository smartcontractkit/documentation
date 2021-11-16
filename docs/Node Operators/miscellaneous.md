---
layout: nodes.liquid
date: Last Modified
title: "Miscellaneous"
permalink: "docs/miscellaneous/"
whatsnext: {"Best Security and Operating Practices":"/docs/best-security-practices/"}
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


## Change your API password

> 🚧 Note
>
> If using Docker, you will first need to follow the [Execute Commands Running Docker](#execute-commands-running-docker) guide to enter the running container.

In order to change your password, you first need to log into the CLI by running:

```bash
chainlink admin login
```

Use your API email and old password in order to authenticate.

Then run the following in order to update the password:

```bash
chainlink admin chpass
```

It will ask for your old password first, then ask for the new password and a confirmation.

Once complete, you should see a message "Password updated."

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

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run --name chainlink -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run --name chainlink -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
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

```shell Rinkeby
echo "user@example.com" > ~/.chainlink-rinkeby/.api
```
```shell Kovan
echo "user@example.com" > ~/.chainlink-kovan/.api
```
```shell Mainnet
echo "user@example.com" > ~/.chainlink/.api
```

Then add the password line by running:

```shell Rinkeby
echo "password" >> ~/.chainlink-rinkeby/.api
```
```shell Kovan
echo "password" >> ~/.chainlink-kovan/.api
```
```shell Mainnet
echo "password" >> ~/.chainlink/.api
```

Create the password file by running the following:

```shell Rinkeby
echo "my_wallet_password" > ~/.chainlink-rinkeby/.password
```
```shell Kovan
echo "my_wallet_password" > ~/.chainlink-kovan/.password
```
```shell Mainnet
echo "my_wallet_password" > ~/.chainlink/.password
```

Finally, in order to use the password and API files upon running the node, add `-p /chainlink/.password -a /chainlink/.api` to your run command, like so:

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n -p /chainlink/.password -a /chainlink/.api
```
```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n -p /chainlink/.password -a /chainlink/.api
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
cd ~/.chainlink-kovan && docker run --restart=always  -p 6688:6688 -d --name kovan-primary -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink:1.0.0 local n -p /chainlink/.password
```
