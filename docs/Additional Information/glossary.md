---
layout: nodes.liquid
date: Last Modified
title: "Glossary"
permalink: "docs/glossary/"
hidden: false
---
### Adapter

An Adapter is a piece of software responsible for executing a specific piece of functionality. A Chainlink node comes with a number of Adapters built in, commonly known as Core Adapters, but can also be extended via [Bridges](#section-bridge) to connect with user defined [External Adapters](#section-external-adapter). Core Adapters offered by the Chainlink Node by default:

- [Bridge](/docs/adapters/#section-bridge)
- [Copy](/docs/adapters/#section-copy)
- [EthBytes32](/docs/adapters/#section-ethbytes32)
- [EthInt256](/docs/adapters/#section-ethint256)
- [EthTx](/docs/adapters/#section-ethtx)
- [EthUint256](/docs/adapters/#section-ethuint256)
- [HTTPGet](/docs/adapters/#section-httpget)
- [HTTPPost](/docs/adapters/#section-httppost)
- [JSONParse](/docs/adapters/#section-jsonparse)
- [Multiply](/docs/adapters/#section-multiply)
- [NoOp](/docs/adapters/#section-noop)
- [NoOpPend](/docs/adapters/#section-nooppend)
- [Sleep](/docs/adapters/#section-sleep)

### Answer

The result produced from an oracle service, after all safety checks and aggregations have been performed. 

### Bridge

Bridge is the connection between a Chainlink node and an [External Adapter](#section-external-adapter). The External Adapter runs as a separate [service](https://en.wikipedia.org/wiki/Service-oriented_architecture), and a Bridge facilitates communication between the node and one of these adapters. 

If you would like to add a new External Adapter to your node, you create a new Bridge either in the GUI or the CLI. Within the Chainlink node, a bridge must have a unique name, but can share the same URL with other bridges. You can also set a different number of default confirmations for each bridge, and an additional payment amount. Once the bridge is added to the node, its name can then be used as a task type in [Job Specifications](../job-specifications/).

### Consumer (Contract)

Recipient of an [Answer](#section-answer) provided by an [Oracle](#section-oracle). The Consumer is commonly a contract, and is also commonly the same [entity that requested the Answer](#section-requester), but does not have to be. We have a helper function, `
addExternalRequest`, that gives consuming contracts the ability to safely check answers it receives without requesting them itself.

### Encumbrance Parameters

Encumbrance parameters are the part of a [service agreement](#section-service-agreement) that can be enforced on-chain. Information on encumbrance parameters can be found <a href="https://github.com/smartcontractkit/chainlink/wiki/Protocol-Information#encumbrance" target="_blank">on our Wiki</a>.

### External Adapter

[External adapters](https://github.com/smartcontractkit/chainlink/wiki/External-Adapters) are what make Chainlink easily extensible, providing simple integration of custom computations and specialized APIs.

A Chainlink node communicates with external adapters by sending a POST request with a JSON data payload. More information can be found on the external adapter [developers](../developers/) page.

### Function Selector

A [function selector](https://solidity.readthedocs.io/en/develop/abi-spec.html/#function-selector) specifies the function to be called in Ethereum. It is the first four bytes of the call data for a function call in an Ethereum transaction. Solidity contracts have a built-in helper method to access the function selector by using `this.myFunction.selector`, where `myFunction` is a non-overloaded function in the contract.

### Initiator

Triggers the execution of a [Job Spec](#section-job-spec). 

Available initiators are:

- runlog
- cron
- ethlog
- runat
- web
- execagreement

Currently only the `runlog` and `execagreement` can be used with payment to the node operator. These initiators will use the node configured [MINIMUM_CONTRACT_PAYMENT](../configuration-variables/#section-minimum_contract_payment), plus any additional payment if there is a bridge in the given [JobID](#section-jobid) or [SAID](#section-said) configured with a payment specified, to determine whether or not enough payment was sent along with the request.

### Job

Short-hand for a [Job Spec](#section-job-spec).

### JobID

The ID associated to a given [Job Spec](#section-job-spec). This will be unique per-node, even with the same contents within the spec itself.

### Job Run

The Job Run is the artifact documenting the outcome of executing a [Job Spec](#section-job-spec). The Job Run is made up of one set of [Request Parameters](#section-request-parameters), a [TaskRun](#section-task-run) for each [Task Spec](#section-task-spec) in the Job Spec, and a [Run Result](#section-run-result) representing the ultimate outcome of the Job Run.

### Job Spec

The [Job Specification](../job-specifications/) is the specification of a piece of work to be completed by an Oracle Node. The Job Spec is made up of two main parts:

1. The [Initiator](#section-initiator) list, `initiators`, lists out all of the ways a Job Spec can be triggered to execute.
2. The [Task](#section-task-spec) list, `tasks`, which specifies all of the  the computation steps to perform when executing a Job Spec. The Task list is sometimes referred to as the Job Pipeline because all of the Tasks' operations are performed in order, with the result being fed into the next task. 

### Oracle 

Entity which connects computations on blockchains with off-chain resources. Typically made up of two components: the [Oracle Node](#section-oracle-node) (off-chain) and the [Oracle Contract](#section-oracle-contract) (on-chain).

### Oracle Contract

The on-chain component of an [Oracle](#section-oracle). The Oracle Contract is the interface through which [Consuming Contracts](#section-consumer-contract-) pass and receive data with off-chain resources.

### Oracle Node

The off-chain component of an [Oracle](#section-oracle).

### Requester

A Smart Contract or Externally Owned Account which requests data from an [Oracle](#section-oracle). The Requester does not have to be the same entity as the [Consumer](#section-consumer-contract-) but commonly is the same.

### Request Parameters

When a [Job Run](#section-job-run) is requested, the full definition of all [Task Specs](#section-task-spec) may be filled in. The [Requester](#section-requester) can specify the rest of the Job Spec definition when requesting a Job Run by passing a JSON payload with the request. The JSON will be merged with each Task Spec before executing each [Task Run](#section-task-run).

### Run

Short-hand for a [Job Run](#section-job-run), sometimes a [Task Run](#section-task-run).

### Run Result

A Run Result is the result of executing a [Job Spec](#section-job-spec) or [Task Spec](#section-task-spec). A Run Result is made up of a JSON blob, a [Run Status](#section-run-status), and an optional error field. Run Results are stored on [Job Runs](#section-job-run) and [Task Runs](#section-task-runs).

### Run Status

Each [Job Run](#section-job-run) and [Task Run](#section-task-run) has a status field indicating its current progress. The Run Status can be in one of the [following states](https://godoc.org/github.com/smartcontractkit/chainlink/core/store/models/#pkg-constants):

- Unstarted
- In Progress
- Pending Confrimations
- Pending Bridge
- Pending Sleep
- Errored
- Completed

### SAID

The ID associated with a given [Service Agreement](#section-service-agreement).

### Service Agreement

The Service agreement consists of a [Job Spec](#section-job-spec) and a set of [encumbrance parameters](#section-encumbrance-parameters) that is shared among a creator and multiple Chainlink nodes. Information on service agreements can be found <a href="https://github.com/smartcontractkit/chainlink/wiki/Protocol-Information#service-agreements" target="_blank">on our Wiki</a>.

### Spec

Another short-hand for a [Job Spec](#section-job-spec).

### Task

Short-hand for a [Task Spec](#section-task-spec).

### Task Spec

The Task Spec is the definition for an individual task to be performed within the [job specification](../job-specifications/) by a specific adapter. The Task Spec always includes a `type` field which specifies which [adapter](#section-adapter) will execute it. Optionally, a Task Spec can specify additional `params` which will be passed on to its adapter, and `confirmations` which specify how many confirmations a [Task Run](#section-task-run) needs before executing.

### Task Run

The result of the individual [Task Spec](#section-task-spec)'s execution. A Task Run includes the Task Spec that it used for input and the [Run Result](#section-run-result) which was the output of the execution.