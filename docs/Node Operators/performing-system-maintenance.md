---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Performing System Maintenance"
permalink: "docs/performing-system-maintenance/"
whatsnext: {"Connecting to a Remote Database":"/docs/connecting-to-a-remote-database/"}
---
You may occasionally need to restart the system which the Chainlink node runs on. In order to be able to accomplish this without any downtime in regards to completing requests, you can perform the upgrade as a series of steps to pass access to the database to a new instance while the first instance is down.

The `DATABASE_TIMEOUT` environment variable allows you to specify an amount of time that the node will wait for the database to be unlocked. You can set it to a higher value (default is 500ms) on the second instance to give you more time to shut down the first instance. With a value of 0, the node will wait indefinitely for the database file to unlock.

Whether you use Docker or the binary to run the node, the database file will need to be available for both instances. This can be accomplished by using a shared volume between instances, which may have unique ways to implement across different providers. Consult your provider's documentation on how to set that up specifically.

## Maintenance and Image Update Example

> 📘 Note
>
> This example uses Docker to run the Chainlink node, see the [Running a Chainlink Node](../running-a-chainlink-node/) page for instructions on how to set it up.

First, pull the latest Docker image for your desired tag based on release version (latest is used in this example):

```shell
docker pull smartcontract/chainlink:latest
```

This will pull the latest code base of the Chainlink node, which has been pre-compiled and uploaded to Dockerhub for your use.

Next, update the environment file you created from the [Running a Chainlink Node](../running-a-chainlink-node/) guide to include a setting for the `DATABASE_TIMEOUT` environment variable. For one hour, use the following value, or you can specify 0 for indefinite:

```
DATABASE_TIMEOUT=1h
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

Now start the second instance of the node. The local port option has been modified so that both containers may run simultaneously.

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6687:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6687:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Mainnet
cd ~/.chainlink && docker run -p 6687:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

Notice the `[INFO]` message informing you that the node is waiting for lock on db file:

```
[INFO] Waiting 1h0m0s for lock on db file /chainlink/db.bolt
```

Now you may shut down the first node instance. We'll use the name given earlier and kill the container. Note that your container name will likely be different.

```shell
docker kill jovial_shirley
```

The output returns the name "jovial_shirley" (or what your container's name was) and if you look at the log of your second container, you'll notice that it has taken over.

At this point, you're now running the latest image on your secondary container. If you have any system maintenance to perform on your primary machine, you may do so now.

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

You should see the same `[INFO]` message that the node is waiting for lock on the db file. You may now shut down the second instance of the node and the original instance automatically obtains a lock and resumes normal operation.

## Failover Node Example

> 📘 Note
>
> This example uses Docker to run the Chainlink node, see the [Running a Chainlink Node](../running-a-chainlink-node/) page for instructions on how to set it up.

You may want to run multiple instances of the Chainlink node on the same machine, so that if one instance goes down, the secondary instance can automatically pick up requests. Building off the concepts in the previous example, we'll use Docker to have primary and a secondary containers referencing the same database file.

To begin, edit your environment variable file to set `DATABASE_TIMEOUT` to 0:

```
DATABASE_TIMEOUT=0
```

This ensures that any secondary container will wait indefinitely for a lock on the database file.

Now, run the Chainlink node with a name option specified:

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

You'll notice the primary container takes control of the database file and resumes operation. You can attach to the secondary container by running:

```shell
docker attach secondary
```

However, it will not produce any output while waiting for a lock on the database.

Congratulations! You now have a redundant setup of Chainlink nodes in case your primary container goes down. Get comfortable with the process by passing control of the database file back and forth between the `chainlink` and `secondary` containers.
