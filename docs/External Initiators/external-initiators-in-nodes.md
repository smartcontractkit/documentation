---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Adding External Initiators to Nodes"
permalink: "docs/external-initiators-in-nodes/"
---

> ⚠️ NOTE
> External initiators are disabled on nodes by default. Set the `FEATURE_EXTERNAL_INITIATORS=true` [configuration variable](/docs/configuration-variables/#feature_external_initiators) to enable this feature.

## Creating an external initiator

To create an external initiator you must use the remote API. You can do this yourself, like so:

```
POST http://<your chainlink node>/v2/external_initiators -d <PAYLOAD>
```

where payload is a JSON blob that contains:

```
{
  "name": <MANDATORY UNIQUE NAME>,
  "url": <OPTIONAL EXTERNAL INITIATOR URL>
}
```

If a URL is provided, Chainlink will notify this URL of added and deleted jobs that can be triggered by this external initiator. This allows the external initiator to program in certain actions e.g. subscribing/unsubscribing to logs based on the job, etc.

On creation:

```
POST <URL> -d {"jobId": <job external UUID>, "type": <name of external initiator>, "params": <optional arbitrary JSON specified at job creation time>}
```

On deletion:

```
DELETE <URL>/<job external UUID>
```

You can use the chainlink client for convenience to access this API.

Enter the [Chainlink nodes CLI](/docs/miscellaneous/#execute-commands-running-docker) and run the following command
```
chainlink initiators create <NAME> <URL>
```

`NAME`: The name you want to use for your external initiator.
`URL`: The URL of your jobs endpoint. ie: `http://172.17.0.1:8080/jobs`

This will give you the environment variables you need to run your external initiator. Copy the output. It will look something like this:

```
║ ei_name  ║ http://localhost:8080/jobs ║ a4846e85727e46b48889c6e28b555696 ║ dnNfNhiiCTm1o6l+hGJVfCtRSSuDfZbj1VO4BkZG3E+b96lminE7yQHj2KALMAIk ║ iWt64+Q9benOf5JuGwJtQnbByN9rtHwSlElOVpHVTvGTP5Zb2Guwzy6w3wflwyYt ║ 56m38YkeCymYU0kr4Yg6x3e98CyAu+37y2+kMO2AL9lRMjA3hRA1ejFdG9UfFCAE
```

Be sure to save these values, since the secrets cannot be shown again.

You now can use `ei_name` as an initiator in your jobspec.

Set a new `.env` file, and add the respective values

```
EI_DATABASEURL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE
EI_CHAINLINKURL=http://localhost:6688
EI_IC_ACCESSKEY=<INSERT KEY>
EI_IC_SECRET=<INSERT KEY>
EI_CI_ACCESSKEY=<INSERT KEY>
EI_CI_SECRET=<INSERT KEY>
```
At the time of writing, the output should be in order. For example, in from the output above, `EI_IC_ACCESSKEY=a4846e85727e46b48889c6e28b555696` and so on.

Start your EI.

Whatever code you used to run your external initiator, pass it the new headers created for the access headers, and then start your service. An easy way to do this is by having it read from the `.env` file you just created. Check out the <a href="https://github.com/Conflux-Network-Global/demo-cfx-chainlink" target="_blank">Conflux External initiator</a> for an example.

You'll want to test that your job is running properly. Meeting the criteria of your EI and then checking to see if a sample job kicks off is the best way to test this.

To try a real-life example, feel free to follow along with the <a href="https://www.youtube.com/watch?v=J8oJEp4qz5w">Conflux EI demo</a>.

<a href="https://github.com/smartcontractkit/chainlink/wiki/External-Initiators">Additional external initiator reference</a>

> ⚠️ NOTE
> The External Initiator can only initiate [webhook jobs](/docs/jobs/types/webhook) that have been linked to it. Trying to initiate a job that is not linked will give an unauthorised error.

## Deleting an external initiator

To delete an external initiator you must use the remote API. You can do this yourself, like so:

```
DELETE http://<your chainlink node>/v2/external_initiators/<external initiator name>
```

You can alternatively use the chainlink client for convenience:
```
chainlink initiators destroy <NAME>
```

## Listing external initiators

To see your installed external initiators:

```
GET http://<your chainlink node>/v2/external_initiators?size=100&page=1
```

Or, using the chainlink client:
```
chainlink initiators list
```
