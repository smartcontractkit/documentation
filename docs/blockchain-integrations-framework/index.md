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


## Requirements

You must run a Kubernets cluster with one or more Chainlink nodes. This requires the following system resources:

- A Linux system
- 6 CPU cores
- 10 GiB of system memory
- At least 50 GiB of disk storage

## Set up your environment

Set up Kubernets and other required tools:

1. Clone the [chainlink-env repository](https://github.com/smartcontractkit/chainlink-env): `git clone https://github.com/smartcontractkit/chainlink-env.git && cd chainlink-env`
1. Install dependencies: `make install_deps`
1. Optionally, install `Lens` from [k8slens.dev](https://k8slens.dev/) or use `k9s` as a low resource consumption alternative from [k9scli.io](https://k9scli.io/topics/install/).
   or from source [here](https://github.com/smartcontractkit/helmenv)
1. Setup your docker resources.
1. Install k3d from [k3d.io](https://k3d.io/v5.4.6/#installation)
1. Create a cluster: `make create_cluster`
1. Install monitoring: `make install_monitoring`
1. Install the [kubectl tool](https://kubernetes.io/docs/tasks/tools/)
1. Check your contexts with `kubectl config get-contexts`
1. Switch context with `kubectl config use-context k3d-local`
1. Follow the chainlink-env [README](https://github.com/smartcontractkit/chainlink-env/blob/master/README.md) and make some deployments.
1. Open Grafana on `localhost:3000` with `admin/<password>` login/password and check the default dashboard

When you are done, you can clean up the environment:

1. `make stop_cluster`
1. `make delete_cluster`

Install the framework and create an alias:

1. Obtain the binary from Chainlink Labs and put it in your local directory. For example, you can put the binary in `~/bif`.
1. Create an alias to the binary: `alias bif="~/bif`

You can now run the framework CLI. Use `-h` to see the available commands: `bif integration -h`

<!--TODO: Sort these steps out
1. Populate `private_keys` under `networks.evm.base` and `ws_urls` under `networks.evm.overrides.goerli` in `example.toml`.
1. Start running a soak test `bif integration soak ./docs/integration/example.toml`.
1. Select TestOCRSoak, evm, goerli, and your desired test settings
1. View your local Grafana instance at `localhost:3000` to see test metrics
1. Check node logs `bif integration logs NAMESPACE [--level LOG_LEVEL]`
-->

## Running basic tests

Out of the box, you can use the framework to run several basic tests on the network.

Run this command to test how compatible is the API of a network client

```shell
bif compatibility test-rpc \ 
--privateKey <PRIVATE_KEY> \
--chainID <CHAIN_ID> \
--rpc <RPC_URL> \
--storageContractAddress <OPTIONAL_CONTRACT_ADDRESS>
```

Run this command to test the smart contract op codes of an arbitrary network

```
go run ./cmd/main.go compatibility test-opcodes \
--privateKey <PRIVATE_KEY> \
--chainID <CHAIN_ID> \
--rpc <RPC_URL> \
--opcodesContractAddress <OPTIONAL_CONTRACT_ADDRESS>
```

The needed flags will be prompted. An example against the Goerli network:

```shell
./bif compatibility test-rpc --chainID 5 --rpc wss://goerli.infura.io/ws/v3/7c43471f9d604276a856f0cff1edb645 --privateKey 15243...
```

## Integration Testing

Integration testing commands require you to [install Helm](https://helm.sh/docs/intro/install/#through-package-managers) and add the following repositories.

```shell
helm repo add chainlink-qa https://raw.githubusercontent.com/smartcontractkit/qa-charts/gh-pages/
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

You will also need to configure a Kubernetes cluster on your local machine. To set up a local cluster via k3d, see our [Kubernetes documentation](/docs/integration/kubernetes.md).

The following command runs an OCR soak test on an EVM network.
```shell
./bif integration soak PATH_TO_TOML_CONFIG
```
The TOML config must have a `networks` and `tests` section. Each entry has a base config and a set of overrides. See [example.toml](/docs/integration/example.toml) for an example config. The only variables that must be updated are `private_keys` and `ws_urls`.


## Commands for setting up Chainlink

### Infra

Run this command to create new chainlink node cluster with the given settings in the TOML config file:

```
./bif infra cluster create --count <NUMBER_OF_NODES> --config <PATH_TO_TOML_CONFIG_FILE>
```

Run this command to add an additional node to an already existing cluster
```
./bif infra cluster add-node
```

Run this command to shutdown a cluster:
```
./bif infra cluster shutdown
```

Run this command to deploy an external adapter to a k8 cluster:
```
./bif infra external-adapter deploy
```

Run this command to attach an external adapter to an existing cluster:
```
./bif infra external-adapter attach
```

Run this command to distribute jobs to a cluster for a feed to run:
```
./bif infra cluster distribute-jobs
```

### Contracts

Run this command for the initial deployment and configuration of a data feed
```shell
./bif contracts evm ocr setup --config=./config.json --rpc=https://goerli.infura.io --privatekey=15243.... --token=ghp...
```







## Packages reference

The integration module contains the following packages:

<!--TODO: Sort out the links and the content.-->

- [integration](/integration/cmd/): cobra commands used to interact with other packages
- [infra](/integration/infra/): adding nodes to k8s deployment, deploying nodes via k8s
- [soak](/integration/soak/): a sample soak test suite
- [logs](/integration/logs/): running log analysis on nodes, fetching logs above a certain log level
- [tests](/integration/tests/): fetching details about test suites, building and running tests
- [internal/cluster](/integration/internal/cluster/): interacting with a k8s cluster, getting namespaces and k8s clients
- [internal/config](/integration/internal/config/): combined configuration type for network and test information
- [internal/prompt](/integration/internal/prompt/): interactive CLI prompt for selecting a string from a list











<!--TODO: Sort out what is necessary in these remaining sections.-->

## Running Any Test Suite

This module provides a default [soak test suite](/integration/soak/), but you can pass in any test suite using the `--pkg` flag
```bash
./bif integration soak config.toml --pkg=github.com/smartcontractkit/chainlink/integration-tests/soak
```
The framework will fetch the tests in this package using `go test [PACKAGE] -list .` and run the test that you select.

## Configuration
Integration tests, like soak tests, depend on a large number of variables. To manage these variables, the Blockchain Integrations Framework uses TOML files. These files have two sections: one for network settings and one for test settings.

### Network Settings
Network settings are variables that configure which chain you will be testing on. `example.toml` contains network settings for a general EVM network:

```toml
# network settings
[networks]
    [networks.evm]
        [networks.evm.base]
        name = "EVM"
        private_keys = ["YOUR_EVM_KEY_HERE"]
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
        ws_urls = ["wss://goerli"]
        chain_id = 5
        [networks.evm.overrides.palm]
        name = "Palm"
        ws_urls = ["wss://palm"]
        chain_id = 11297108099
        [networks.evm.overrides.rinkeby]
        name = "Rinkeby"
        ws_urls = ["wss://rinkeby"]
        chain_id = 4
```
To configure a network, you provide a base and an optional set of overrides. This allows you to share variables across networks without rewriting them.

### Test Settings

Test settings, such as node count and test duration, control the behaviour of the test. `example.toml` contains a standard test config with an override called `shorter-test`:
```toml
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
```

### Interactive Setup

When running a test, you will be prompted to select a test, a network setting, and a test setting

```bash
% ./bif integration soak config.toml
8:15AM INF Getting tests Package=github.com/smartcontractkit/blockchain-integrations-framework/integration/soak
✔ TestOCRSoak
✔ evm
✔ goerli
✔ v1-7-0
Use the arrow keys to navigate: ↓ ↑ → ← 
? Select Test Override: 
  ▸ shorter-test
    none
```

In the example above, the tests are pulled from `github.com/smartcontractkit/integrations-toolkit-soak/soak`. The network and test settings are pulled from the given TOML config.