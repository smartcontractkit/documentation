---
layout: nodes.liquid
section: bif
date: Last Modified
title: "Blockchain Integrations Framework"
permalink: "docs/blockchain-integrations-framework/"
---

Chainlink Labs provides self-serve tools that node operators and blockchain projects can use to deploy Data Feed integrations on EVM networks. These tools are called the Blockchain Integrations Framework (BIF). This framework includes a command line interface (CLI) and is available as a binary file. The binary is not publicly available. During the Alpha release, you must receive this binary directly from Chainlink Labs.

The framework simplifies the following tasks:

- Deploy Chainlink nodes into Kubernetes clusters and distribute jobs to them
- Run tests that generate reports detailing compatibility between Chainlink Labs' EVM integration and a given blockchain
- Deploy cluster infrastructure required to test OCR for Data Feeds
- Perform longer running soak tests for OCR for Data Feeds
- Perform smart contract management tasks with the same capabilities as Chainlink Labs' tools

**Contents**

- [Requirements](#requirements)
- [Set up your environment](#set-up-your-environment)
- [Running basic tests](#running-basic-tests)
- [Running integration testing](#running-integration-tests)
- [Troubleshooting integration tests](#troubleshooting-integration-tests)

## Requirements

Most basic tests can be completed on a system with minimal hardware resources. To complete soak testing and use the CLI to create clusters with multiple Chainlink nodes, you must run a Kubernets cluster on a system with the following system resources:

- A Linux system
- 6 CPU cores
- 10 GiB of system memory
- At least 50 GiB of disk storage

## Set up your environment

Install the framework and create an alias:

1. Obtain the binary file from Chainlink Labs and put it in your local directory.
1. Make the binary available in `/usr/bin` so you can run it without the full path: `sudo mv ./bif /usr/bin/`

You can now run the framework CLI. Run `bif integration -h` to see the available commands. See the [Running basic tests](#running-basic-tests) section for examples.

If you plan to run soak tests or other tests that require running Chainlink nodes, set up [Helm](https://helm.sh/docs/intro/install/#through-package-managers), [Kubernets](https://kubernetes.io/docs/setup/) and other required tools:

1. Install [Helm](https://helm.sh/docs/intro/install/#through-package-managers).
1. Add the following repositories:
    - chainlink-qa: `helm repo add chainlink-qa https://raw.githubusercontent.com/smartcontractkit/qa-charts/gh-pages/`
    - bitnami: `helm repo add bitnami https://charts.bitnami.com/bitnami`
1. Update the helm repository: `helm repo update`
1. Install the [kubectl tool](https://kubernetes.io/docs/tasks/tools/)

The [chainlink-env repository](https://github.com/smartcontractkit/chainlink-env) includes several tools for creating clusters of Chainlink nodes for testing. Use this to start a cluster:

1. Clone the [chainlink-env repository](https://github.com/smartcontractkit/chainlink-env) and change directories: `git clone https://github.com/smartcontractkit/chainlink-env.git && cd chainlink-env`
1. Install dependencies: `make install_deps`
1. Optionally, install `Lens` from [k8slens.dev](https://k8slens.dev/) or use `k9s` as a low resource consumption alternative from [k9scli.io](https://k9scli.io/topics/install/) or from the source at [smartcontractkit/helmenv](https://github.com/smartcontractkit/helmenv).
1. Install k3d from [k3d.io](https://k3d.io/v5.4.6/#installation)
1. Create a cluster: `make create_cluster`
1. Install monitoring: `make install_monitoring`

The `make install_monitoring` command starts Grafana, which takes control of your terminal. Open Grafana in a browser at `localhost:3000` to confirm that it is running properly. Log in with `admin` as the username and `sdkfh26!@bHasdZ2` as the default password. If you are running testing a remote system, you can use `ssh -i $KEY $USER@$REMOTE-IP -L 3000:localhost:3000 -N` to create an SSH tunnel to the system where Grafana is running and map port `3000` to your local workstation. Change the default Grafana password.

You can now [run integration testing](#running-integration-tests).

When you are done with testing, you can clean up the environment using the following commands:

1. Stop the cluster: `make stop_cluster`
1. Delete the cluster: `make delete_cluster`

## Running basic tests

You can use the framework to run several basic tests on a network. These commands deploy contracts as part of the tests, so you must provide the following parameters:

- The private key to a wallet that is funded and capable of deploying contracts on the network that you want to test
- The chain ID for your network, which usually can be found on the [LINK Token Contracts](https://docs.chain.link/docs/link-token-contracts/) or [chainlist.org](https://chainlist.org/)
- The RPC URL for either a network node that you run or a third-party service like [Alchemy](https://www.alchemy.com/), [Infura](https://infura.io/), and [Ankr](https://www.ankr.com/rpc/)

**Test compatibility of the network client API:**

```shell
bif compatibility test-rpc \ 
--privateKey <PRIVATE_KEY> \
--chainID <CHAIN_ID> \
--rpc <RPC_URL> \
--storageContractAddress <OPTIONAL_CONTRACT_ADDRESS>
```

The `--storageContractAddress` flag is available so you can re-use deployed contracts from previous tests and save wallet funds.

**Test the smart contract op codes of a network:**

```
bif compatibility test-opcodes \
--privateKey <PRIVATE_KEY> \
--chainID <CHAIN_ID> \
--rpc <RPC_URL> \
--opcodesContractAddress <OPTIONAL_CONTRACT_ADDRESS>
```

The `--opcodesContractAddress` flag is available so you can re-use deployed contracts from previous tests and save wallet funds.

## Running integration tests

Integration testing uses the `bif integration soak` command and a TOML file. The TOML file simplifies managing the many variables involved.

The TOML file for the Blockchain Integrations Framework has two settings sections:

- Network settings: Variables that configure which chain you use for testing and the private key for the wallet you want to use for deploying contracts
- Test settings: Node count and test duration settings to control the behavior of the test

**Example TOML file**

```toml
# network settings
[networks]

    [networks.evm]

        [networks.evm.base]
        name = "EVM"
        private_keys = ["WALLET_PRIVATE_KEY"]
        ws_urls = []
        http_urls = []
        chain_id = 1337
        simulated = false
        chainlink_transaction_limit = 5000
        transaction_timeout = "2m"
        minimum_confirmations = 1
        gas_estimation_buffer = 1000

        [networks.evm.overrides.goerli]
        name = "Goerli"
        ws_urls = ["wss://eth-goerli.g.alchemy.com/v2/<ALCHEMY_KEY>"]
        chain_id = 5

        [networks.evm.overrides.optimism_goerli]
        name = "Optimism Goerli"
        ws_urls = ["wss://opt-goerli.g.alchemy.com/v2/<ALCHEMY_KEY>"]
        chain_id = 420

        [networks.evm.overrides.palm]
        name = "Palm"
        ws_urls = ["wss://palm"]
        chain_id = 11297108099

# test settings
[tests]

    [tests.v1-7-0]

        [tests.v1-7-0.base]
        keep_environments="Never" # Always | OnFail | Never
        chainlink_image="public.ecr.aws/chainlink/chainlink" # Image repo to pull the Chainlink image from
        chainlink_version="1.7.0-nonroot" # Version of the Chainlink image to pull
        chainlink_env_user="Satoshi-Nakamoto" # Name of the person running the tests (change to your own)
        test_log_level="info" # info | debug | trace
        node_count=6
        test_duration=15 # minutes
        contract_count=2
        node_funding=0.1 # ETH
        round_timeout=15 # minutes
        expected_round_time=2 # minutes
        time_between_rounds=1 # minutes

        [tests.v1-7-0.overrides.shorter-test]
        test_duration=2 # minutes

    [tests.v1-9-0]

        [tests.v1-9-0.base]
        keep_environments="Never" # Always | OnFail | Never
        chainlink_image="public.ecr.aws/chainlink/chainlink" # Image repo to pull the Chainlink image from
        chainlink_version="1.9.0" # Version of the Chainlink image to pull
        chainlink_env_user="Satoshi-Nakamoto" # Name of the person running the tests (change to your own)
        test_log_level="info" # info | debug | trace
        node_count=6  
        test_duration=15 # minutes
        contract_count=2
        node_funding=0.1 # ETH
        round_timeout=15 # minutes
        expected_round_time=2 # minutes
        time_between_rounds=1 # minutes

        [tests.v1-9-0.overrides.shorter-test]
        test_duration=2 # minutes
```

If you completed the full [steps to set up your environment](#set-up-your-environment), you can run a soak test using the following steps:

1. Create a file called `example.toml` and paste the example TOML file above.
1. Edit the file to add your `private_keys` under the `networks.evm.base` config.
1. Modify the `ws_urls` under `networks.evm.overrides.goerli` with your specified RPC endpoint URL. Optionally, you can create additional overrides for different networks`.
1. Start running a soak test `bif integration soak ./example.toml`.
1. The interactive menu opens. Select evm, your desired network overrides, the Chainlink node version, and your test length settings.
1. While your test is running, view your local Grafana instance at `localhost:3000` to see test metrics.
1. Check node logs: `bif integration logs NAMESPACE [--level LOG_LEVEL]`

As you test additional networks, modify the TOML file and configure it with the details for your network.

### Troubleshooting integration tests

There are some common issues with soak testing that you can troubleshoot.

**Pods remaining from failed tests:**

If a soak test fails, the pods used for testing often remain running. Use `kubectl` to identify and delete these pods:

1. List all pods by their namespaces: `kubectl get pods --all-namespaces`
1. Delete the deployments that you no longer need by namespace: `kubectl delete --all deployments --namespace=ocr-soak-goerli-50b0c`
1. Modify your test configuration and run `bif integration soak ./example.toml` again.

**Insufficient resources:**

Your system must meet the defined [Requirements](#requirements). Running on systems without sufficient resources will cause soak tests to fail because some containers for Chainlink nodes will not be able to start.

- If you are running on a virtual machine, add additional vCPUs, system memory, or storage.
- Run your soak tests with fewer nodes. The default value in the TOML config is `node_count=6`, which is recommended for a thorough soak test. You can adjust this value if you are unable to obtain the necessary system resources.

**Insufficient wallet funding**

The soak tests send 0.1 ETH to each test node by default, so you must make sure that there are significant funds in the wallet that you use to fund testing. This is the wallet specified by your `private_keys` parameter in the TOML file. Alternatively, you can adjust the `node_funding` parameter in the TOML test configuration, but make sure that each node has enough funds to complete the soak test.