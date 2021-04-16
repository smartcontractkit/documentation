---
layout: nodes.liquid
date: Last Modified
title: "Aggregator Job (PCE/BEA)"
permalink: "docs/aggregator-job-bea/"
hidden: true
---
In order to contribute to the price aggregator contract, you will need to run one of the jobs on this page. The Chainlink team will let you know which API to provide, and you can use this page as a guide for adding jobs for each provider to your node.

First, go to this <a href="https://github.com/smartcontractkit/bea-adapter" target="_blank">repository</a> and follow the instructions in the README to run the BEA adapter as a Docker container in your infrastructure. Add the adapter as a bridge to your node with the name "bea".

[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"web\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"bea\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Web BEA Test"
    }
  ]
}
[/block]
On the Job Spec Detail page for the job, click the Run button. You should see a green bar at the top that the node Successfully created job run <JobRunID>. Click on that Job Run ID and verify that all tasks have been Completed with green check marks.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8cfc185-Screenshot_from_2019-06-21_08-29-07.png",
        "Screenshot from 2019-06-21 08-29-07.png",
        1894,
        806,
        "#fafafb"
      ]
    }
  ]
}
[/block]
If the test job has ran successfully, add the following job to your node, replacing `YOUR_ORACLE_CONTRACT_ADDRESS` with your oracle contract address.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\",\n\t\t\t\"params\": {\n\t\t\t\t\"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n\t\t\t}\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"bea\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"copy\",\n\t\t\t\"params\": {\n\t\t\t\t\"copyPath\": [\n\t\t\t\t\t\"result\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 1000000000000000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Runlog BEA"
    }
  ]
}
[/block]
Once added, give the team the Job ID associated with the job above.

Make sure that your `MINIMUM_CONTRACT_PAYMENT` environment variable is low enough to accept the payment amount from the aggregator contract on mainnet.