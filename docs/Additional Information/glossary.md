---
layout: nodes.liquid
date: Last Modified
title: "Glossary"
permalink: "docs/glossary/"
---
### Adapter

> ❗️The adapters or JSON adapters for v1 Jobs are removed for Chainlink nodes running version 1.0.0 and later. Use [v2 job tasks](/docs/tasks) instead.

An Adapter or [Task](#task) is a piece of software responsible for executing a specific piece of functionality. A Chainlink node comes with a number of Adapters built-in, commonly known as Core Adapters, but can also be extended via [Bridges](/docs/node-operators/) to connect with user-defined [External Adapters](#external-adapter).

### Answer

The result produced from an oracle service, after all safety checks and aggregations have been performed.

### Bridge

Bridge is the connection between a Chainlink node and an [External Adapter](#external-adapter). The External Adapter runs as a separate [service](https://en.wikipedia.org/wiki/Service-oriented_architecture), and a Bridge facilitates communication between the node and one of these adapters.

If you would like to add a new External Adapter to your node, you create a new Bridge either in the GUI or the CLI. Within the Chainlink node, a bridge must have a unique name, but can share the same URL with other bridges. You can also set a different number of default confirmations for each bridge, and an additional payment amount. Once the bridge is added to the node, its name can then be used as a task type in [Jobs](../jobs/).

### Consumer (Contract)

Recipient of an [Answer](#answer) provided by an [Oracle](#oracle). The Consumer is commonly a contract, and is also commonly the same [entity that requested the Answer](#requester), but does not have to be. We have a helper function, `
addExternalRequest`, that gives consuming contracts the ability to safely check answers it receives without requesting them itself.

### Encumbrance Parameters

Encumbrance parameters are the part of a [service agreement](#service-agreement) that can be enforced on-chain. Information on encumbrance parameters can be found <a href="https://github.com/smartcontractkit/chainlink/wiki/Service-Agreements-and-the-Coordinator-Contract" target="_blank">on our Wiki</a>.

### External Adapter

[External adapters](https://github.com/smartcontractkit/chainlink/wiki/External-Adapters) are what make Chainlink easily extensible, providing simple integration of custom computations and specialized APIs.

A Chainlink node communicates with external adapters by sending a POST request with a JSON data payload. More information can be found on the external adapter [developers](../developers/) page.

### Function Selector

A [function selector](https://docs.soliditylang.org/en/develop/abi-spec.html#function-selector) specifies the function to be called in Ethereum. It is the first four bytes of the call data for a function call in an Ethereum transaction. Solidity contracts have a built-in helper method to access the function selector by using `this.myFunction.selector`, where `myFunction` is a non-overloaded function in the contract.

### Initiator

> ❗️The initiators for v1 Jobs are removed for Chainlink nodes running version 1.0.0 and later. Use the [v2 job types](/docs/jobs) instead.

Triggers the execution of a [Job Spec](#job-spec).

### Job

Short-hand for a [Job Spec](#job-spec).

### Job Run

The Job Run is the artifact documenting the outcome of executing a [Job](#job). The Job Run is made up of a [Task](#task) and a [Run Result](#run-result) representing the ultimate outcome of the Job Run.

### JobID

The ID associated to a given [Job Spec](#job-spec). This will be unique per-node, even with the same contents within the spec itself.

### Job Spec

The [Job Specification](../jobs/) is the specification of a piece of work to be completed by an Oracle Node. The Job Spec is made up of two main parts:

- The [Task Type](/docs/jobs/#shared-fields) or the [External Initiator](/docs/external-initiators-introduction/): Defines the ways a Job can be triggered to execute.
- The [Task list](#task-spec): The `tasks` that specify all of the computation steps to perform when executing a Job Spec. The Task list is sometimes referred to as the [Job Pipeline](/docs/jobs/task-types/pipelines/) because all of the Tasks' operations are performed in order, with the result being fed into the next task.

### Oracle

Entity which connects computations on blockchains with off-chain resources. Typically made up of two components: the [Oracle Node](#oracle-node) (off-chain) and the [Oracle Contract](#oracle-contract) (on-chain).

### Oracle Contract

The on-chain component of an [Oracle](#oracle). The Oracle Contract is the interface through which [Consuming Contracts](#consumer-contract) pass and receive data with off-chain resources.

### Oracle Node

The off-chain component of an [Oracle](#oracle).

### Phase

For data feeds, a phase indicates the underlying aggregator implementation has been updated. Phases are relevant only for the EACAggregatorProxys. You can think of a roundId on the proxies as a large number containing data for two numbers (phaseId + roundId). The roundId is pulled from the aggregator's implementation and combined by bit shifting with the latest phaseId of the proxy.

### Requester

A Smart Contract or Externally Owned Account which requests data from an [Oracle](#oracle). The Requester does not have to be the same entity as the [Consumer](#consumer-contract) but commonly is the same.

### Run Result

A Run Result is the result of executing a [Job Spec](#job-spec).

### Run Status

Each [Job Run](#job) has a status field indicating its current progress. The Run Status can be in one of the [following states](https://godoc.org/github.com/smartcontractkit/chainlink/core/store/models/#pkg-constants):

- Unstarted
- In Progress
- Pending Confrimations
- Pending Bridge
- Pending Sleep
- Errored
- Completed

### SAID

The ID associated with a given [Service Agreement](#service-agreement).

### Service Agreement

The Service agreement consists of a [Job Spec](#job-spec) and a set of [encumbrance parameters](#encumbrance-parameters) that is shared among a creator and multiple Chainlink nodes. Information on service agreements can be found [on our Wiki](https://github.com/smartcontractkit/chainlink/wiki/Service-Agreements-and-the-Coordinator-Contract).

### Spec

Another short-hand for a [Job Spec](#job-spec).

### Task

A v2 job [task](/docs/tasks/).

### Task Spec

The Task Spec is the definition for an individual task to be performed within the [job specification](../jobs/) by a specific adapter. The Task Spec always includes a `type` field which specifies which [adapter](#adapter) will execute it. Optionally, a Task Spec can specify additional `params` which will be passed on to its adapter, and `confirmations` which specify how many confirmations a [Task Run](#task-run) needs before executing.

### Task Run

The result of the individual [Task Spec](#task-spec)'s execution. A Task Run includes the Task Spec that it used for input and the [Run Result](#run-result) which was the output of the execution.
