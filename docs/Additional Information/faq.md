---
layout: nodes.liquid
date: Last Modified
title: "FAQ"
permalink: "docs/faq/"
metadata:
  title: "Developer FAQ - Chainlink"
  description: "Find answers to common questions about developing on Chainlink."
---
# General

## What is the latest progress of the project?

We usually have many development efforts going on at once with the node, the GUI, and the contracts. Check out the project tracker (linked below) to see the current development status.

Resources:
*  <a href="https://www.pivotaltracker.com/n/projects/2129823" target="_blank">Project Tracker</a>
*  <a href="https://github.com/smartcontractkit/chainlink" target="_blank">GitHub</a>

## When is <*something*> expected?

We do not usually give time frames unless something is visibly near completion on the project tracker. This includes features, contracts, and integration with other projects. If something is immediately pending to be merged within the code base, it will be visible as an open PR (pull request) in the repository.

Resources:
*  <a href="https://github.com/smartcontractkit/chainlink/pulls" target="_blank">Pull Requests</a>

## It was announced you are integrating with a specific blockchain but I do not see the documentation for it. What's going on?

The announcement was probably a working announcement. There are two types of integration announcements:

1\.  <a href="https://fantom.foundation/blog/fantom-collaborates-with-chainlink-to-integrate-chainlink-vrf/" target="_blank">Working Announcements</a>

These announce that work has begun on an integration, but the integration is not yet ready to be used. You will not find documentation on the integration after these announcements.

2\. <a href="https://www.binance.org/en/blog/chainlink-vrf-is-live-on-binance-smart-chain-bringing-verifiable-randomness-to-bsc-developers/" target="_blank">Integration Live Announcements</a>

These announce that an integration is live and ready to be used. You can find the contract addresses in our docs for <a href="https://docs.chain.link/docs/reference-contracts/" target="_blank">Data Feeds</a> and <a href="https://docs.chain.link/docs/vrf-contracts/" target="_blank">Chainlink VRF</a> respectively.

Often these announcements will posted by our integration partners.

## How many members does the team have?

The team is visible <a href="https://chain.link/team/" target="_blank">on our website</a>. We also encourage community contributions to our <a href="https://github.com/smartcontractkit/chainlink" target="_blank">Github repository</a>.

## Are you hiring?

We are always looking for talented and experienced individuals. Please visit <a href="https://careers.chain.link" target="_blank">our careers page</a>.

Resources:
*  <a href="https://careers.chain.link" target="_blank">Chainlink Careers</a>

# Running a node

## How do I set up a Chainlink node?

You can set up a node to run on a test network or the Ethereum mainnet right now. The node will not be able to participate in fulfilling service agreement requests yet, but will in the near future. However, it can be used to fulfill requests sent to your oracle contract address and you can add external adapters to it for extending its functionality.

Resources:
*  [Running a Chainlink Node](../running-a-chainlink-node/)

## How much LINK to run a node?

You will be able to run a Chainlink node with 0 LINK, however, you will not be able to participate in requests that require a deposit until you’ve earned some LINK first.

Requesters may specify an amount of LINK that all nodes must deposit as a penalty fee in case the node doesn’t fulfill the request. However, since penalty fees are optional, not all requests will require it.

## Can I use a local Chainlink node with Ganache?

No. Ganache is a mock testnet and it doesn't work with Chainlink because of that. To use the features of the network, you need to deploy your contract on a real environment: one of the testnets or mainnets. The full list of supported environments can be found [here](../link-token-contracts/).

## What are the hardware requirements for a Chainlink node?

Your Chainlink node should be run on a server that has a public IP address.

### Basic Requirements

To get started running a Chainlink node, you will need a machine with at least **2 cores** and **4 GB of RAM**. 

### Recommended Settings

The requirements for running a Chainlink node scale as the number of jobs your node services also scales.  For nodes with over 100 jobs, you will need at least **4 cores** and **8GB of RAM**.  

Resources:
*  [Running a Chainlink Node](../running-a-chainlink-node/)
*  <a href="https://github.com/smartcontractkit/chainlink/wiki/Development-Setup-Guide" target="_blank">Development Setup Guide</a>

## Database Requirements

In addition to running a Chainlink node, you will also need a PostgreSQL database.  Please use a version >= 11, and be sure that your DB host provides access to logs.

### Basic Requirements

The minimum requirements for the database are **2 cores**, **4GB of RAM**, and **100 GB of storage**.

### Recommended Settings

Similar to the Chainlink node, requirements increase as you service more jobs.  For more than 100 jobs, your database server will need at least **4 cores**, **16 GB of RAM**, and **100 GB of storage**. 

If you run your node on AWS, use an instance type with dedicated core time. [Burstable Performance Instances](https://aws.amazon.com/ec2/instance-types/#Burstable_Performance_Instances) have a limited number of [CPU credits](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-credits-baseline-concepts.html), so you should not use them to run Chainlink nodes that require consistent performance.

## Connecting to Ethereum Client

Connectivity to an Ethereum client is also required for communication with the blockchain. If you decide to run your own Ethereum client, you will want to run that on a separate machine. Hardware requirements of Ethereum clients may change over time.

Resources:
*  [StackExchange Answer](https://ethereum.stackexchange.com/a/27369)
*  [All Ethereum Hardware Questions](https://ethereum.stackexchange.com/questions/tagged/hardware)

## Do I need to have access to APIs in order to provide data?

The Chainlink node can fulfill requests from open (unauthenticated) APIs out-of-the-box, without the need for [External Adapters](../external-adapters/) as long as you've added the [jobs in the Fulfilling Requests guide](../fulfilling-requests/#add-a-job-to-the-node). For these requests, requesters would supply the URL to the open API they wish each node to retrieve, and the Chainlink node will use its core adapters to fulfill the request.

If you would like to provide access to an API which requires authentication, you will need to create a job specific for that API, either with an external adapter or by using the parameters of the [HTTP task](/docs/jobs/task-types/http/).

##  Is there a list of external adapters available?

Currently, the community maintains lists of available external adapters.

Resources:
*  <a href="https://market.link/" target="_blank">Chainlink Market</a>
*  <a href="https://chainlinkadapters.com/" target="_blank">Chainlink Adapters</a>

## How many nodes are currently running?

The <a href="https://market.link/search/nodes" target="_blank">Chainlink Market</a> keeps a list of node operators registered with them across multiple networks.

Resources:
*  <a href="https://market.link/" target="_blank">Chainlink Market</a>

# Smart contract creators

## How do I request data from Chainlink?

You can use our <a href="https://blog.chain.link/how-to-use-chainlink-with-truffle-2/" target="_blank">Truffle Box</a> to get started by unboxing a developer-focused template.

If you already have a project started and would like to integrate Chainlink, you can [add Chainlink to your existing project](../create-a-chainlinked-project/#install-into-existing-projects) by using our `chainlink` NPM package.

Resources:
*  [Create a Chainlinked Project](../create-a-chainlinked-project/)
*  [Example Walkthrough](/docs/intermediates-tutorial/)
*  <a href="https://blog.chain.link/how-to-use-chainlink-with-truffle-2/" target="_blank">How to use Chainlink with Truffle</a>

## Can Chainlink be used to connect to <*some blockchain/API*>?

Yes, the Chainlink node can connect to most APIs out-of-the-box. Some APIs require authentication by providing request headers for the operator's API key, which the Chainlink node supports. Additionally, external adapters allow for connectivity to any resource as long as the adapter conforms to a minimal JSON specification for communicating to and from the Chainlink node.

Resources:
*  [External Adapters](../external-adapters/)
<a href="https://blog.chain.link/chainlink-external-adapters-explained/">Chainlink External Adapters Explained</a>

## How do I select Chainlink nodes for my requests?

You can use the <a href="https://market.link/" target="_blank">Chainlink Market</a> to select nodes for your requests. Then with the node's oracle contract address and Job ID, you will use the [`sendChainlinkRequestTo`](../chainlink-framework/#sendchainlinkrequestto)  method to create requests to oracles.

Resources:
*  [Create a Chainlinked Project](../create-a-chainlinked-project/)
*  [Example Walkthrough](/docs/intermediates-tutorial/)
*  <a href="https://market.link/" target="_blank">Chainlink Market</a>
*  [Chainlink Contract Reference](../chainlink-framework/#sendchainlinkrequestto)

## How do I request a value that is greater than 32 bytes?

Currently, the EthTX core adapter can only write a single value no larger than 32 bytes onto a blockchain. If the value is larger than 32 bytes, the data may need to be returned by making multiple requests.

## How can I get multiple values with a single request?

Currently, the EthTX core adapter can only write a single value that is no larger than 32 bytes onto a blockchain. If multiple values are needed, the data may need to be returned by making multiple requests.

# Token

## What is the LINK token used for?

The LINK token is an ERC677 token that inherits functionality from the ERC20 token standard and allows token transfers to contain a data payload. It is used to pay node operators for retrieving data for smart contracts and also for deposits placed by node operators as required by contract creators.

Resources:
*  <a href="https://github.com/ethereum/EIPs/issues/677" target="_blank">ERC677: transferAndCall Token Standard</a>

## What wallet do I use to store LINK?

Any wallet that handles ERC20 tokens should work fine. The ERC677 token standard that the LINK token implements still retains all functionality of ERC20 tokens.

# Data Feeds

## What is a phase?

A phase indicates the underlying aggregator implementation has been updated. Phases are only relevant for the EACAggregatorProxys. You can think of a roundId on the proxies as a large number containing data for two numbers (phaseId + roundId). The roundId is pulled from the aggregator's implementation and combined (by bit shifting) with the latest phaseId of the proxy.

## Why don’t the rounds update chronologically?

They do, in the best-case scenario. However, a round can time out if it doesn't reach consensus, so that would technically be a timed out round, which carries over the answer from the previous round. Though roundIds can seemingly jump significantly when the phaseId is updated, because of how that combination of phaseId+roundId is stored in the proxy.

## What is the difference between the data feed properties updatedAt and answeredInRound?

updatedAt is the timestamp of an answered round while answeredInRound is the round it was updated in.

## How can I check if the answer to a round is being carried over from a previous round?

You can check answeredInRound against the current roundId. If answeredInRound is less than roundId, the answer is being carried over. If answeredInRound is equal to roundId, then the answer is fresh.

## Can the data feed read revert?  

A read can revert if the caller is requesting details of a round that was invalid (perhaps, not being answered yet), which basically is just relevant to a roundId which is greater than a uint32 or 0. It hasn't happened yet, however you can prevent this from happening if you add a check on the roundId.

## Why is latestAnswer reported at 8 decimals for some contracts, but for other contracts it is reported with 18 decimals?

For crypto quotes, 18 decimals is typically used because they usually require more precision. For FX quotes, 8 decimals are used because that is the precision data sources typically report them at.
