---
layout: nodes.liquid
date: Last Modified
title: "Glossary"
permalink: "docs/glossary/"
---

## Answer

The result produced from an oracle service, after all safety checks and aggregations have been performed.

## Bridge

Bridge is the connection between a Chainlink node and an [External Adapter](https://docs.chain.link/docs/contract-creators/). The External Adapter runs as a separate [service](https://en.wikipedia.org/wiki/Service-oriented_architecture), and a Bridge facilitates communication between the node and one of these adapters.

If you would like to add a new External Adapter to your node, you create a new Bridge either in the GUI or the CLI. Within the Chainlink node, a bridge must have a unique name, but can share the same URL with other bridges. You can also set a different number of default confirmations for each bridge, and an additional payment amount. Once the bridge is added to the node, its name can then be used as a task type in [Jobs](https://docs.chain.link/docs/jobs/).

## Consumer (Contract)

Recipient of an [Answer](https://docs.chain.link/docs/glossary/#answer) provided by an [Oracle](https://docs.chain.link/docs/glossary/#oracle). The Consumer is commonly a contract, and is also commonly the same [entity that requested the Answer](https://docs.chain.link/docs/glossary/#requester), but does not have to be. We have a helper function,  addExternalRequest, that gives consuming contracts the ability to safely check answers it receives without requesting them itself.

## Encumbrance Parameters

Encumbrance parameters are the part of a [service agreement](https://docs.chain.link/docs/glossary/#service-agreement) that can be enforced on-chain. Information on encumbrance parameters can be found [on our Wiki](https://github.com/smartcontractkit/chainlink/wiki/Protocol-Information#encumbrance).

## External Adapter

[External adapters](https://github.com/smartcontractkit/chainlink/wiki/External-Adapters) are what make Chainlink easily extensible, providing simple integration of custom computations and specialized APIs.

A Chainlink node communicates with external adapters by sending a POST request with a JSON data payload. More information can be found on the external adapter [developers](https://docs.chain.link/docs/developers/) page.

## Function Selector

A [function selector](https://solidity.readthedocs.io/en/develop/abi-spec.html/#function-selector) specifies the function to be called in Ethereum. It is the first four bytes of the call data for a function call in an Ethereum transaction. Solidity contracts have a built-in helper method to access the function selector by using this.myFunction.selector, where myFunction is a non-overloaded function in the contract.

## JobID

The ID associated with a given [Job](https://docs.chain.link/docs/jobs/). This will be unique per-node, even with the same contents within the spec itself.

## Job Run

The Job Run is the artifact documenting the outcome of executing a [Job](https://docs.chain.link/docs/jobs/). The Job Run is made up of one set of [Request Parameters](https://docs.chain.link/docs/glossary/#request-parameters), a [TaskRun](https://docs.chain.link/docs/glossary/#task-run) for each [Task Spec](https://docs.chain.link/docs/glossary/#task-spec) in the Job, and a [Run Result](https://docs.chain.link/docs/glossary/#run-result) representing the ultimate outcome of the Job Run.

## Job Spec

The [Job Specification](https://docs.chain.link/docs/jobs/) is the specification of a piece of work to be completed by an Oracle Node. The job Spec consists of multiple [shared fields](https://docs.chain.link/docs/jobs/#shared-fields), including the job's name, type, schema version, etc.

## Oracle

Entity which connects computations on blockchains with off-chain resources. Typically made up of two components: the [Oracle Node](https://docs.chain.link/docs/glossary/#oracle-node) (off-chain) and the [Oracle Contract](https://docs.chain.link/docs/glossary/#oracle-contract) (on-chain).

## Oracle Contract

The on-chain component of an [Oracle](https://docs.chain.link/docs/glossary/#oracle). The Oracle Contract is the interface through which [Consuming Contracts](https://docs.chain.link/docs/glossary/#consumer-contract) pass and receive data with off-chain resources.

## Oracle Node

The off-chain component of an [Oracle](https://docs.chain.link/docs/glossary/#oracle).

## Requester

A Smart Contract or Externally Owned Account which requests data from an [Oracle](https://docs.chain.link/docs/glossary/#oracle). The Requester does not have to be the same entity as the [Consumer](https://docs.chain.link/docs/glossary/#consumer-contract) but commonly is the same.

## Request Parameters

When a [Job Run](https://docs.chain.link/docs/glossary/#job-run) is requested, the full definition of all [Task Specs](https://hackmd.io/Yz-jZTLbSZ6FzG9ZhafjYA#task-spec) may be filled in. The [Requester](https://hackmd.io/Yz-jZTLbSZ6FzG9ZhafjYA#requester) can specify the rest of the Job Spec definition when requesting a Job Run by passing a JSON payload with the request. The JSON will be merged with each Task Spec before executing each [Task Run](https://docs.chain.link/docs/glossary/#task-run).

## Run

Short-hand for a [Job Run](https://docs.chain.link/docs/glossary/#job-run), sometimes a [Task Run](https://docs.chain.link/docs/glossary/#task-run).

## Run Result

A Run Result is the result of executing a [Job Spec](https://docs.chain.link/docs/glossary/#job-spec) or [Task Spec](https://docs.chain.link/docs/glossary/#task-spec). A Run Result is made up of a JSON blob, a [Run Status](https://docs.chain.link/docs/glossary/#run-status), and an optional error field. Run Results are stored on [Job Runs](https://docs.chain.link/docs/glossary/#job-run) and [Task Runs](https://docs.chain.link/docs/glossary/#task-run).

## Run Status

Each [Job Run](https://docs.chain.link/docs/glossary/#job-run) and [Task Run](https://docs.chain.link/docs/glossary/#task-run) has a status field indicating its current progress. The Run Status can be in one of the [following states](https://godoc.org/github.com/smartcontractkit/chainlink/core/store/models/#pkg-constants):

* Unstarted
* In Progress
* Pending Confirmations
* Pending Bridge
* Pending Sleep
* Errored
* Completed

## SAID

The ID associated with a given [Service Agreement](https://docs.chain.link/docs/glossary/#service-agreement).

## Service Agreement

The Service agreement consists of a [Job Spec](https://docs.chain.link/docs/glossary/#job-spec) and a set of [encumbrance parameters](https://docs.chain.link/docs/glossary/#encumbrance-parameters) that is shared among a creator and multiple Chainlink nodes. Information on service agreements can be found [on our Wiki](https://github.com/smartcontractkit/chainlink/wiki/Protocol-Information#service-agreements).

## Spec

Another short-hand for a [Job Spec](https://docs.chain.link/docs/glossary/#job-spec).

## Task

A Task is a piece of software responsible for executing a specific piece of functionality. A Chainlink node comes with a number of built-in Tasks. For more details, refer to [Tasks docs](https://docs.chain.link/docs/tasks/).

## Task Spec

The Task Spec is the definition for an individual task to be performed within the [job specification](https://docs.chain.link/docs/glossary/#job-spec) by a specific adapter. The Task Spec always includes a type field which specifies which job will execute it. Optionally, a Task Spec can specify additional params which will be passed on to its adapter, and confirmations which specify how many confirmations a [Task Run](https://docs.chain.link/docs/glossary/#task-run) needs before executing.

## Task Run

The result of the individual [Task Spec](https://docs.chain.link/docs/glossary/#task-spec)’s execution. A Task Run includes the Task Spec that it used for input and the [Run Result](https://docs.chain.link/docs/glossary/#run-result) which was the output of the execution.