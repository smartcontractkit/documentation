---
layout: nodes.liquid
date: Last Modified
title: "Adding External Initiators to Nodes"
permalink: "docs/external-initiators-in-nodes/"
hidden: false
---
1. Setup a new project in a different folder than the one your node runs on. 

```
mkdir external-initiator
cd external-initiator
```
Add your code to this folder. 

2. Setup a *new* postgres database

This should not be the same as your Chainlink base.

3. Create External Initiator keys

Enter the [Chainlink nodes CLI](/docs/miscellaneous#execute-commands-running-docker) and run the following command
```
chainlink initiators create <NAME> <URL>
```

`NAME`: The name you want to use for your external initiator.
`URL`: The URL of your jobs endpoint. ie: `http://172.17.0.1:8080/jobs`

This will give you the environment variables you need to run your node. Copy the output. It will look something like this:

```
║ ei_name  ║ http://localhost:8080/jobs ║ a4846e85727e46b48889c6e28b555696 ║ dnNfNhiiCTm1o6l+hGJVfCtRSSuDfZbj1VO4BkZG3E+b96lminE7yQHj2KALMAIk ║ iWt64+Q9benOf5JuGwJtQnbByN9rtHwSlElOVpHVTvGTP5Zb2Guwzy6w3wflwyYt ║ 56m38YkeCymYU0kr4Yg6x3e98CyAu+37y2+kMO2AL9lRMjA3hRA1ejFdG9UfFCAE
```
You now can use `ei_name` as an initiator in your jobspec. 

3. Set a new `.env` file, and add the respective values

```
EI_DATABASEURL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE
EI_CHAINLINKURL=http://localhost:6688
EI_IC_ACCESSKEY=<INSERT KEY>
EI_IC_SECRET=<INSERT KEY>
EI_CI_ACCESSKEY=<INSERT KEY>
EI_CI_SECRET=<INSERT KEY>
```
At the time of writing, the output should be in order. For example, in from the output above, `EI_IC_ACCESSKEY=a4846e85727e46b48889c6e28b555696` and so on.

4. Start your EI

Whatever code you used to run your external initiator, pass it the new headers created for the access headers, and then start your service. An easy way to do this is by having it read from the `.env` file you just created. Check out the <a href="https://github.com/Conflux-Network-Global/demo-cfx-chainlink" target="_blank">Conflux External initiator</a> for an example. 

You'll want to test that your job is running properly. Meeting the criteria of your EI and then checking to see if a sample job kicks off is the best way to test this. 

To try a real-life example, feel free to follow along with the <a href="https://www.youtube.com/watch?v=J8oJEp4qz5w" target="_blank">Conflux EI demo</a>.

<a href="https://github.com/smartcontractkit/chainlink/wiki/External-Initiators" target="_blank">Additional external initiator reference</a>