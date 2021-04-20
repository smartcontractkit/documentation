---
layout: nodes.liquid
date: Last Modified
title: "Running a Chainlink Node"
permalink: "docs/running-a-chainlink-node/"
hidden: false
metadata: 
  title: "Running a Chainlink Node"
  description: "Run your own Chainlink node using this guide which explains the requirements and basics for getting started."
  image: 
    0: "https://files.readme.io/b6632ab-9d99262-670379d-OpenGraph_V3.png"
    1: "9d99262-670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
In this section, we'll explain the requirements and basics for running your own Chainlink node. 

It's important to note that nodes can fulfill requests for open APIs out-of-the-box using our core [Adapters](../adapters) without needing any additional configuration. 

If you would like to provide data from an authenticated API, you can add an [external adapter](../external-adapters) to enable connectivity through the Chainlink node.

Hardware requirements are light. The only heavy part is you'll need a blockchain node connection. If you use a 3rd party (defined below), you can use a machine with as little as 10GB of storage and 2GB of RAM. 
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/ab5762f-end-to-end-diagram.png",
        "end-to-end-diagram.png",
        1630,
        558,
        "#dcd8c2"
      ],
      "caption": "The Chainlink node is middleware, operating between the blockchain and external data. More information on our architecture is available <a href=\"/v1.1/docs/architecture-overview\" target=\"_blank\" rel=\"noreferrer, noopener\">here</a>."
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Using Docker"
}
[/block]
It's recommended to run the Chainlink node with <a href="https://www.docker.com/" target="_blank" rel="noreferrer, noopener">Docker</a>. This is because we continuously build and deploy the code from our <a href="https://github.com/smartcontractkit/chainlink" target="_blank" rel="noreferrer, noopener">repository on Github</a>, which means you don't need a complete development environment to run a node.

### Requirements

- <a href="https://docs.docker.com/install/" target="_blank" rel="noreferrer, noopener">Docker-CE</a>. Quick instructions for setting up Docker is below:
[block:code]
{
  "codes": [
    {
      "code": "sudo amazon-linux-extras install -y docker\nsudo systemctl start docker\nsudo gpasswd -a $USER docker\nexit\n# log in again",
      "language": "shell",
      "name": "Amazon Linux 2"
    },
    {
      "code": "curl -sSL https://get.docker.com/ | sh\nsudo systemctl start docker\nsudo usermod -aG docker $USER\nexit\n# log in again",
      "language": "shell",
      "name": "CentOS"
    },
    {
      "code": "curl -sSL https://get.docker.com/ | sh\nsudo usermod -aG docker $USER\nexit\n# log in again",
      "language": "shell",
      "name": "Debian"
    },
    {
      "code": "curl -sSL https://get.docker.com/ | sh\nsudo systemctl start docker\nsudo usermod -aG docker $USER\nexit\n# log in again",
      "language": "shell",
      "name": "Fedora"
    },
    {
      "code": "curl -sSL https://get.docker.com/ | sh\nsudo usermod -aG docker $USER\nexit\n# log in again",
      "language": "shell",
      "name": "Ubuntu"
    }
  ]
}
[/block]
- A fully synced Ethereum client with websockets enabled. Client specific instructions can be found below:
  - [Run Geth](../run-an-ethereum-client#geth)
  - [Run OpenEthereum](../run-an-ethereum-client#parity)
  - [Use an external service](../run-an-ethereum-client#external-services)
[block:api-header]
{
  "title": "Create a Directory"
}
[/block]
Once you have your Ethereum client running and fully synced, you're ready to run the Chainlink node.

Create a local directory to hold the Chainlink data:
[block:code]
{
  "codes": [
    {
      "code": "mkdir ~/.chainlink-rinkeby",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "mkdir ~/.chainlink-kovan",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "mkdir ~/.chainlink",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Other Supported Networks",
  "body": "Chainlink is blockchain agnostic technology. The [LINK Token Contracts](../link-token-contracts) page details networks which support the LINK token. You can setup your node to provide data to any of these blockchains."
}
[/block]

[block:api-header]
{
  "title": "Create an Environment File"
}
[/block]
Run the following as a command to create an environment file and populate with variables specific to the network you're running on. For a full list of available configuration variables, click [here](../configuration-variables).
[block:code]
{
  "codes": [
    {
      "code": "echo \"ROOT=/chainlink\nLOG_LEVEL=debug\nETH_CHAIN_ID=4\nMIN_OUTGOING_CONFIRMATIONS=2\nLINK_CONTRACT_ADDRESS=0x01BE23585060835E02B77ef475b0Cc51aA1e0709\nCHAINLINK_TLS_PORT=0\nSECURE_COOKIES=false\nGAS_UPDATER_ENABLED=true\nALLOW_ORIGINS=*\" > ~/.chainlink-rinkeby/.env",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "echo \"ROOT=/chainlink\nLOG_LEVEL=debug\nETH_CHAIN_ID=42\nMIN_OUTGOING_CONFIRMATIONS=2\nLINK_CONTRACT_ADDRESS=0xa36085F69e2889c224210F603D836748e7dC0088\nCHAINLINK_TLS_PORT=0\nSECURE_COOKIES=false\nGAS_UPDATER_ENABLED=true\nALLOW_ORIGINS=*\" > ~/.chainlink-kovan/.env",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "echo \"ROOT=/chainlink\nLOG_LEVEL=debug\nETH_CHAIN_ID=1\nCHAINLINK_TLS_PORT=0\nSECURE_COOKIES=false\nGAS_UPDATER_ENABLED=true\nALLOW_ORIGINS=*\" > ~/.chainlink/.env",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Set your Ethereum Client URL"
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "If you're using a 3rd party service to connect to the blockchain, skip to the [External Provider](#ethereum-client-as-an-external-provider) section to set the `ETH_URL` environment variable. We provide general guidance, but you will need to obtain the websocket connection string to add to your environment file.",
  "title": "Using an external Ethereum client?"
}
[/block]
### Ethereum Client on the Same Machine

Next you need to get the URL for the Ethereum client. The command below will help you obtain the IP address of the container that your Ethereum client is running on. **This will only work if you have started an Ethereum client on the same machine as your Chainlink node.** 
[block:code]
{
  "codes": [
    {
      "code": "ETH_CONTAINER_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $(docker ps -f name=eth -q))",
      "language": "shell",
      "name": "Local Ethereum Client IP"
    }
  ]
}
[/block]
Then run the following command to add the Ethereum client's URL to your environment file. If you are using an external Ethereum client, use the External tab below, and update `$ETH_CONTAINER_IP` to the websocket address used for connectivity.
[block:code]
{
  "codes": [
    {
      "code": "echo \"ETH_URL=ws://$ETH_CONTAINER_IP:8546\" >> ~/.chainlink-rinkeby/.env",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "echo \"ETH_URL=ws://$ETH_CONTAINER_IP:8546\" >> ~/.chainlink-kovan/.env",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "echo \"ETH_URL=ws://$ETH_CONTAINER_IP:8546\" >> ~/.chainlink/.env",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]
### Ethereum Client as an External Provider

If you are using an external provider for connectivity to the Ethereum blockchain or you are running an Ethereum client on a separate instance, you may use the command below for your network. Be sure to update the value for `CHANGEME` to the value given by your provider or the address and port of your separate instance.
[block:code]
{
  "codes": [
    {
      "code": "echo \"ETH_URL=CHANGEME\" >> ~/.chainlink-rinkeby/.env",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "echo \"ETH_URL=CHANGEME\" >> ~/.chainlink-kovan/.env",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "echo \"ETH_URL=CHANGEME\" >> ~/.chainlink/.env",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "Ganache is a mock testnet and it doesn't work with Chainlink because of that. To use the features of the network, you need to deploy your contract on a real environment: one of the testnets or mainnets. The full list of supported environments can be found [here](../link-token-contracts).",
  "title": "Running Chainlink Node on Ganache"
}
[/block]

[block:api-header]
{
  "title": "Set the Remote DATABASE_URL Config"
}
[/block]
You will need to connect your Chainlink node with a remote PostgreSQL database. See the [Connecting to a Remote Database](../connecting-to-a-remote-database) page for more information. Use the example below to configure your `DATABASE_URL` setting in your environment file, replacing `$VARIABLES` with their actual values.

- `$USERNAME`: The database username (must be owner)
- `$PASSWORD`: The user's password
- `$SERVER`: The server name or IP address of the database server
- `$PORT`: The port that the database is listening on
- `$DATABASE`: The database to use for the Chainlink node (i.e. "postgres")
[block:callout]
{
  "type": "warning",
  "body": "If you're testing you can add `?sslmode=disable` to the end of your `DATABASE_URL`. However you should *never* do this on a production node."
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "echo \"DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE\" >> ~/.chainlink-rinkeby/.env",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "echo \"DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE\" >> ~/.chainlink-kovan/.env",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "echo \"DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE\" >> ~/.chainlink/.env",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]
For a primary/secondary Chainlink node architecture, you may also want to set the `DATABASE_TIMEOUT` configuration as well. Setting `DATABASE_TIMEOUT` to 0 allows a secondary node to wait for the lock to be released on the database indefinitely.
[block:code]
{
  "codes": [
    {
      "code": "echo \"DATABASE_TIMEOUT=0\" >> ~/.chainlink-rinkeby/.env",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "echo \"DATABASE_TIMEOUT=0\" >> ~/.chainlink-kovan/.env",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "echo \"DATABASE_TIMEOUT=0\" >> ~/.chainlink/.env",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Start the Chainlink Node"
}
[/block]
Now you can run the Docker image. Replace `<version>` with your desired version. Tag versions are available in the [Chainlink docker hub](https://hub.docker.com/r/smartcontract/chainlink/tags). *The `latest` version does not work.*
[block:code]
{
  "codes": [
    {
      "code": "cd ~/.chainlink-rinkeby && docker run -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "cd ~/.chainlink && docker run -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Local Database",
  "body": "If you're running a local database you may need to add `--network host` to the end of the command above."
}
[/block]
The first time running the image, it will ask you for a password and confirmation. This will be your wallet password that you can use to unlock the keystore file generated for you. Then, you'll be prompted to enter an API Email and Password. This will be used to expose the API for the GUI interface, and will be used every time you log into your node. When running the node again, you can supply the `-p` option with a path to a text file containing the wallet key password, and a `-a` option, pointing to a text file containing the API email and password. Instructions on how to do that are [here](../miscellaneous#use-password-and-api-files-on-startup). 
[block:callout]
{
  "type": "info",
  "body": "You will need to send some ETH to your node's address in order for it to fulfill requests. You can view your node's ETH address when the node starts up or on the Configuration page of the GUI."
}
[/block]
You can now connect to your Chainlink node's UI interface by navigating to <a href="http://localhost:6688" target="_blank" rel="noreferrer, noopener">http://localhost:6688</a>. If using a VPS, you can create a <a href="https://www.howtogeek.com/168145/how-to-use-ssh-tunneling/" target="_blank" rel="noreferrer, noopener">SSH tunnel</a> to your node for `6688:localhost:6688` to enable connectivity to the GUI. Typically this is done with `ssh -i $KEY $USER@$REMOTE-IP -L 6688:localhost:6688 -N`. A SSH tunnel is recommended over opening up ports specific to the Chainlink node to be public facing. See our [Best Security and Operating Practices](../best-security-practices) page for more details on how to secure your node.