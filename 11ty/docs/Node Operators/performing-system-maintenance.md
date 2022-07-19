---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Performing System Maintenance"
permalink: "docs/performing-system-maintenance/"
whatsnext: {"Connecting to a Remote Database":"/docs/connecting-to-a-remote-database/"}
---

You might occasionally need to restart the system that the Chainlink node runs on. To restart without any downtime for completing requests, perform the upgrade as a series of steps that passes database access to a new instance while the first instance is down.

## Maintenance and Image Update Example

> 📘 Note
>
> This example uses Docker to run the Chainlink node, see the [Running a Chainlink Node](../running-a-chainlink-node/) page for instructions on how to set it up.

First, find the most recent Chainlink image on [Docker Hub](https://hub.docker.com/r/smartcontract/chainlink/) and pull that Docker image. For version 1.1.0:

```shell
docker pull smartcontract/chainlink:1.1.0
```

Then, check what port the existing container is running on:

```shell
docker ps
```

Output:

```
CONTAINER ID        IMAGE                            COMMAND                  CREATED             STATUS              PORTS                    NAMES
2d203191c1d6        smartcontract/chainlink:latest   "./chainlink-launche…"   26 seconds ago      Up 25 seconds       0.0.0.0:6688->6688/tcp   jovial_shirley
```

Look under the PORTS label to see the ports in use by the running container, in this case, the local port 6688 has been mapped to the application's port 6688, as identified by the `->` arrow. Since we can't use the same local port number twice, we'll need to run the second instance with a different one.

Now start the second instance of the node. The local port option has been modified so that both containers run simultaneously.

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6687:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6687:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Mainnet
cd ~/.chainlink && docker run -p 6687:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

The log messages on the second node instance inform you that it is waiting for the database lock.

Now you can shut down the first node instance. We'll use the name given earlier and kill the container. Note that your container name will likely be different.

```shell
docker kill jovial_shirley
```

The output returns the name "jovial_shirley" (or what your container's name was) and if you look at the log of your second container, you'll notice that it has taken over.

At this point, you're now running the latest image on your secondary container. If you have any system maintenance to perform on your primary machine, you can do so now.

Next, you will simply need to run the container again with the local port 6688 in order to go back to normal operations.

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Mainnet
cd ~/.chainlink && docker run -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

When the log messages on the first node indicate that it is waiting for the database lock, shut down the second instance of the node. The original instance automatically obtains a lock and resumes normal operation.

## Failover Node Example

> 📘 Note
>
> This example uses Docker to run the Chainlink node, see the [Running a Chainlink Node](../running-a-chainlink-node/) page for instructions on how to set it up.

You might want to run multiple instances of the Chainlink node on the same machine. If one instance goes down, the second instance can automatically pick up requests. Building off the concepts in the previous example, use Docker to have primary and a secondary containers referencing the same database URL.

Use the default `DATABASE_LOCKING_MODE=advisorylock` setting unless you want to test the `lease` or `dual` settings. See [the docs](/docs/configuration-variables/#database_locking_mode) for more information about this configuration variable.

Run the Chainlink node with a name option specified:

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run --name chainlink -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run --name chainlink -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Mainnet
cd ~/.chainlink && docker run --name chainlink -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

You will now notice that you no longer receive a randomly generated name from Docker:

```shell
docker ps
```

Output (truncated):

```
... NAMES
... chainlink
```

This will remain your primary Chainlink container, and should always use port 6688 (unless configured otherwise). For the secondary instance, you will run the container in the same way, but with a different name and a different local port:

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run --name secondary -p 6687:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run --name secondary -p 6687:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Mainnet
cd ~/.chainlink && docker run --name secondary -p 6687:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

Notice the `--name secondary` was used for this container and the local port is 6687. Be sure to add this port to your SSH tunnel as well so that you can access the secondary node's GUI if it has become active (it will not function until the primary container goes down).

Running `docker ps` now reveals two named containers running (output truncated):

```
... NAMES
... secondary
... chainlink
```

If your primary container goes down, the secondary one will automatically take over. To start the primary container again, simply run:

```shell
docker start -i chainlink
```

This will start the container, but the secondary node still has a lock on the database. To give the primary container access, you can restart the secondary container:

```shell
docker restart secondary -t 0
```

The primary container takes control of the database and resumes operation. You can attach to the secondary container using `docker attach`:

```shell
docker attach secondary
```

However, it will not produce any output while waiting for a lock on the database.

Congratulations! You now have a redundant setup of Chainlink nodes in case the primary container goes down. Get comfortable with the process by passing control of the database back and forth between the `chainlink` and `secondary` containers.
