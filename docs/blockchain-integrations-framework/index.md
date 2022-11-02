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
- [Set up your environment](#set_up_your_environment)
- [Running basic tests](#running_basic_tests)
- [Running integration testing](#running_integration_testing)

## Requirements

Most basic tests can be completed on a system with minimal hardware resources. To complete soak testing and use the CLI to create clusters with multiple Chainlink nodes, you must run a Kubernets cluster on a system with the following system resources:

- A Linux system
- 6 CPU cores
- 10 GiB of system memory
- At least 50 GiB of disk storage

## Set up your environment

Install the framework and create an alias:

1. Obtain the binary file from Chainlink Labs and put it in your local directory.
1. Make the binary available in `/usr/bin` so you can run it without the full path: `sudo cp ./bif /usr/bin/`

You can now run the framework CLI. Run `bif integration -h` to see the available commands. See the [Running basic tests](#running_basic_tests) section for examples.

If you plan to run soak tests or other tests that require running Chainlink nodes, set up [Helm](https://helm.sh/docs/intro/install/#through-package-managers), [Kubernets](https://kubernetes.io/docs/setup/) and other required tools:

1. Install [Helm](https://helm.sh/docs/intro/install/#through-package-managers).
1. Add the following repositories:
    - chainlink-qa: `helm repo add chainlink-qa https://raw.githubusercontent.com/smartcontractkit/qa-charts/gh-pages/`
    - bitnami: `helm repo add bitnami https://charts.bitnami.com/bitnami`
1. Update the helm repository: `helm repo update`
1. Clone the [chainlink-env repository](https://github.com/smartcontractkit/chainlink-env) and change directories: `git clone https://github.com/smartcontractkit/chainlink-env.git && cd chainlink-env`
1. Install dependencies: `make install_deps`
1. Optionally, install `Lens` from [k8slens.dev](https://k8slens.dev/) or use `k9s` as a low resource consumption alternative from [k9scli.io](https://k9scli.io/topics/install/) or from the source at [smartcontractkit/helmenv](https://github.com/smartcontractkit/helmenv).
1. Setup your docker resources.
1. Install k3d from [k3d.io](https://k3d.io/v5.4.6/#installation)
1. Create a cluster: `make create_cluster`
1. Install monitoring: `make install_monitoring`

The `make install_monitoring` command starts Grafana, which takes control of your terminal. Open Grafana in a browser at `localhost:3000` to confirm that it is running properly. Log in with `admin` as the username and `sdkfh26!@bHasdZ2` as the default password. If you are running testing a remote system, you can use `ssh -i $KEY $USER@$REMOTE-IP -L 3000:localhost:3000 -N` to create an SSH tunnel to the system where Grafana is running and map port `3000` to your local workstation. Change the default password.

Create deployments:

1. Install the [kubectl tool](https://kubernetes.io/docs/tasks/tools/)
1. Check your contexts with `kubectl config get-contexts`
1. Switch context with `kubectl config use-context k3d-local`
1. Follow the chainlink-env [README](https://github.com/smartcontractkit/chainlink-env/blob/master/README.md) and make some deployments.
1. Open Grafana and check the default dashboard.

You can now [run integration testing](#run_integration_testing).

When you are done with testing, you can clean up the environment using the following commands:

1. Stop the cluster: `make stop_cluster`
1. Delete the cluster: `make delete_cluster`

## Running basic tests

<!--TODO: Add full working examples-->

Out of the box, you can use the framework to run several basic tests on the network. These commands deploy contracts as part of the tests, so you must provide the following parameters:

- The private key to a wallet that is funded with ETH
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

**Test the smart contract op codes of a network:**

```
bif compatibility test-opcodes \
--privateKey <PRIVATE_KEY> \
--chainID <CHAIN_ID> \
--rpc <RPC_URL> \
--opcodesContractAddress <OPTIONAL_CONTRACT_ADDRESS>
```

## Running integration testing

Integration testing uses the `bif integration soak` command and a TOML file. The TOML file simplifies managing the many variables involved.

The TOML file for the Blockchain Integrations Framework has two settings sections:

- Network settings: Variables that configure which chain you use for testing and the private key for the wallet you want to use for deploying contracts
- Test settings: Node count and test duration settings to control the behavior of the test

**Example TOML file**

```toml
# Network settings
[networks]

    [networks.evm]

        [networks.evm.base]
        name = "EVM"
        private_keys = ["<PRIVATE_KEY>"]
        ws_urls = ["wss://rpc.ankr.com/optimism_testnet"]
        http_urls = ["https://rpc.ankr.com/optimism_testnet"]
        chain_id = 420
        simulated = false
        chainlink_transaction_limit = 5000
        transaction_timeout = "2m"
        minimum_confirmations = 1
        gas_estimation_buffer = 1000

        [networks.evm.overrides.goerli]
        name = "Goerli"
        ws_urls = ["wss://rpc.ankr.com/eth_goerli"]
        http_urls = ["https://rpc.ankr.com/eth_goerli"]
        chain_id = 5

        [networks.evm.overrides.goerli_local]
        name = "Goerli"
        ws_urls = ["wss://localhost:8545"]
        http_urls = ["https://localhost:8545"]
        chain_id = 5

        [networks.evm.overrides.palm]
        name = "Palm"
        ws_urls = ["wss://palm"]
        chain_id = 11297108099

# Test settings
[tests]

    [tests.v1-9-0]

        [tests.v1-9-0.base]
        keep_environments="Never" # Always | OnFail | Never
        chainlink_image="public.ecr.aws/chainlink/chainlink" # Image repo to pull the>
        chainlink_version="1.9.0-nonroot" # Version of the Chainlink image to pull
        chainlink_env_user="Satoshi-Nakamoto" # Name of the person running the tests >
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

If you completed the full [steps to set up your environment](#set_up_your_environment), you can run a soak test with the following steps:

1. Create a file called `example.toml` and paste the example TOML file above.
1. Edit the file to add your `private_keys` under the `networks.evm.base` config.
1. Modify the `ws_urls` under `networks.evm.overrides.goerli` or create additional overrides for different networks`.
1. Start running a soak test `bif integration soak ./example.toml`.
1. The interactive menu opens. Select evm, your desired network overrides, the Chainlink node version, and your test length settings.
1. While your test is running, view your local Grafana instance at `localhost:3000` to see test metrics.
1. Check node logs: `bif integration logs NAMESPACE [--level LOG_LEVEL]`
