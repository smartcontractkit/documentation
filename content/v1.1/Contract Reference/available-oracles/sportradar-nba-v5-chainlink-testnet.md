---
layout: nodes.liquid
title: "SportRadar NBA V5 Chainlink (Testnet)"
slug: "sportradar-nba-v5-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://developer.sportradar.com/docs/read/basketball/NBA_v5">SportRadar's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://ropsten.chain.link/" target="_blank">Ropsten faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Ropsten
LINK Token address: 0x20fE562d797A42Dcb3399062AE9546cd06f63280
Oracle address: 0xc99B3D447826532722E41bc36e644ba3479E4365
Bytes32 JobID: a15ed5a323254dae898f927f3a5b7e26
Uint256 JobID: 5771e048fa6746a98e676c411fb78790
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the ability to create Chainlink requests.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract NBAChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Ropsten"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
## Bytes32 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">SportRadar</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Uint256 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">SportRadar</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## game

**Required** 

The Game ID for the Chainlink node to query.

#### Solidity example

```javascript
req.add("game", "b6417794-3f20-4871-8377-aa770da2bb1c");
```

## copyPath

**Required** 

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "winner");
```

Below is an example of the response payload.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"id\": \"b6417794-3f20-4871-8377-aa770da2bb1c\",\n\t\"status\": \"closed\",\n\t\"coverage\": \"full\",\n\t\"neutral_site\": false,\n\t\"scheduled\": \"2019-04-11T02:30:00+00:00\",\n\t\"duration\": \"2:33\",\n\t\"attendance\": 17655,\n\t\"lead_changes\": 7,\n\t\"times_tied\": 8,\n\t\"clock\": \"00:00\",\n\t\"quarter\": 5,\n\t\"track_on_court\": true,\n\t\"reference\": \"0021801229\",\n\t\"entry_mode\": \"WEBSOCKET\",\n\t\"sr_id\": \"sr:match:15331432\",\n\t\"time_zones\": {\n\t\t\"venue\": \"US/Pacific\",\n\t\t\"home\": \"US/Pacific\",\n\t\t\"away\": \"US/Mountain\"\n\t},\n\t\"home\": {\n\t\t\"name\": \"Clippers\",\n\t\t\"alias\": \"LAC\",\n\t\t\"market\": \"Los Angeles\",\n\t\t\"id\": \"583ecdfb-fb46-11e1-82cb-f4ce4684ea4c\",\n\t\t\"points\": 143,\n\t\t\"bonus\": false,\n\t\t\"sr_id\": \"sr:team:3425\",\n\t\t\"reference\": \"1610612746\",\n\t\t\"scoring\": [\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 1,\n\t\t\t\t\"sequence\": 1,\n\t\t\t\t\"points\": 39\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 2,\n\t\t\t\t\"sequence\": 2,\n\t\t\t\t\"points\": 31\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 3,\n\t\t\t\t\"sequence\": 3,\n\t\t\t\t\"points\": 32\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 4,\n\t\t\t\t\"sequence\": 4,\n\t\t\t\t\"points\": 24\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"overtime\",\n\t\t\t\t\"number\": 1,\n\t\t\t\t\"sequence\": 5,\n\t\t\t\t\"points\": 17\n\t\t\t}\n\t\t],\n\t\t\"leaders\": {\n\t\t\t\"points\": [\n\t\t\t\t{\n\t\t\t\t\t\"full_name\": \"Montrezl Harrell\",\n\t\t\t\t\t\"jersey_number\": \"5\",\n\t\t\t\t\t\"id\": \"869c305c-3e1f-49e5-a59b-5f1e03d198f8\",\n\t\t\t\t\t\"position\": \"F-C\",\n\t\t\t\t\t\"primary_position\": \"PF\",\n\t\t\t\t\t\"sr_id\": \"sr:player:852218\",\n\t\t\t\t\t\"reference\": \"1626149\",\n\t\t\t\t\t\"statistics\": {\n\t\t\t\t\t\t\"minutes\": \"20:49\",\n\t\t\t\t\t\t\"field_goals_made\": 10,\n\t\t\t\t\t\t\"field_goals_att\": 13,\n\t\t\t\t\t\t\"field_goals_pct\": 76.9,\n\t\t\t\t\t\t\"three_points_made\": 0,\n\t\t\t\t\t\t\"three_points_att\": 0,\n\t\t\t\t\t\t\"three_points_pct\": 0,\n\t\t\t\t\t\t\"two_points_made\": 10,\n\t\t\t\t\t\t\"two_points_att\": 13,\n\t\t\t\t\t\t\"two_points_pct\": 76.9,\n\t\t\t\t\t\t\"blocked_att\": 1,\n\t\t\t\t\t\t\"free_throws_made\": 4,\n\t\t\t\t\t\t\"free_throws_att\": 6,\n\t\t\t\t\t\t\"free_throws_pct\": 66.7,\n\t\t\t\t\t\t\"offensive_rebounds\": 3,\n\t\t\t\t\t\t\"defensive_rebounds\": 4,\n\t\t\t\t\t\t\"rebounds\": 7,\n\t\t\t\t\t\t\"assists\": 5,\n\t\t\t\t\t\t\"turnovers\": 2,\n\t\t\t\t\t\t\"steals\": 0,\n\t\t\t\t\t\t\"blocks\": 1,\n\t\t\t\t\t\t\"assists_turnover_ratio\": 2.5,\n\t\t\t\t\t\t\"personal_fouls\": 1,\n\t\t\t\t\t\t\"tech_fouls\": 0,\n\t\t\t\t\t\t\"flagrant_fouls\": 0,\n\t\t\t\t\t\t\"pls_min\": 11,\n\t\t\t\t\t\t\"points\": 24,\n\t\t\t\t\t\t\"double_double\": false,\n\t\t\t\t\t\t\"triple_double\": false,\n\t\t\t\t\t\t\"effective_fg_pct\": 76.9,\n\t\t\t\t\t\t\"efficiency\": 32,\n\t\t\t\t\t\t\"efficiency_game_score\": 23.2,\n\t\t\t\t\t\t\"points_in_paint\": 20,\n\t\t\t\t\t\t\"points_in_paint_att\": 13,\n\t\t\t\t\t\t\"points_in_paint_made\": 10,\n\t\t\t\t\t\t\"points_in_paint_pct\": 76.9,\n\t\t\t\t\t\t\"true_shooting_att\": 15.64,\n\t\t\t\t\t\t\"true_shooting_pct\": 76.7,\n\t\t\t\t\t\t\"fouls_drawn\": 4,\n\t\t\t\t\t\t\"offensive_fouls\": 0,\n\t\t\t\t\t\t\"points_off_turnovers\": 2,\n\t\t\t\t\t\t\"second_chance_pts\": 6\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t],\n\t\t\t\"rebounds\": [\n\t\t\t\t{\n\t\t\t\t\t\"full_name\": \"Ivica Zubac\",\n\t\t\t\t\t\"jersey_number\": \"40\",\n\t\t\t\t\t\"id\": \"2da18268-82d4-4b40-a296-7ceddd435d0b\",\n\t\t\t\t\t\"position\": \"C\",\n\t\t\t\t\t\"primary_position\": \"C\",\n\t\t\t\t\t\"sr_id\": \"sr:player:994293\",\n\t\t\t\t\t\"reference\": \"1627826\",\n\t\t\t\t\t\"statistics\": {\n\t\t\t\t\t\t\"minutes\": \"29:47\",\n\t\t\t\t\t\t\"field_goals_made\": 10,\n\t\t\t\t\t\t\"field_goals_att\": 13,\n\t\t\t\t\t\t\"field_goals_pct\": 76.9,\n\t\t\t\t\t\t\"three_points_made\": 0,\n\t\t\t\t\t\t\"three_points_att\": 0,\n\t\t\t\t\t\t\"three_points_pct\": 0,\n\t\t\t\t\t\t\"two_points_made\": 10,\n\t\t\t\t\t\t\"two_points_att\": 13,\n\t\t\t\t\t\t\"two_points_pct\": 76.9,\n\t\t\t\t\t\t\"blocked_att\": 1,\n\t\t\t\t\t\t\"free_throws_made\": 2,\n\t\t\t\t\t\t\"free_throws_att\": 2,\n\t\t\t\t\t\t\"free_throws_pct\": 100,\n\t\t\t\t\t\t\"offensive_rebounds\": 4,\n\t\t\t\t\t\t\"defensive_rebounds\": 7,\n\t\t\t\t\t\t\"rebounds\": 11,\n\t\t\t\t\t\t\"assists\": 2,\n\t\t\t\t\t\t\"turnovers\": 3,\n\t\t\t\t\t\t\"steals\": 0,\n\t\t\t\t\t\t\"blocks\": 3,\n\t\t\t\t\t\t\"assists_turnover_ratio\": 0.67,\n\t\t\t\t\t\t\"personal_fouls\": 2,\n\t\t\t\t\t\t\"tech_fouls\": 0,\n\t\t\t\t\t\t\"flagrant_fouls\": 0,\n\t\t\t\t\t\t\"pls_min\": 0,\n\t\t\t\t\t\t\"points\": 22,\n\t\t\t\t\t\t\"double_double\": true,\n\t\t\t\t\t\t\"triple_double\": false,\n\t\t\t\t\t\t\"effective_fg_pct\": 76.9,\n\t\t\t\t\t\t\"efficiency\": 30,\n\t\t\t\t\t\t\"efficiency_game_score\": 21.5,\n\t\t\t\t\t\t\"points_in_paint\": 20,\n\t\t\t\t\t\t\"points_in_paint_att\": 13,\n\t\t\t\t\t\t\"points_in_paint_made\": 10,\n\t\t\t\t\t\t\"points_in_paint_pct\": 76.9,\n\t\t\t\t\t\t\"true_shooting_att\": 13.88,\n\t\t\t\t\t\t\"true_shooting_pct\": 79.3,\n\t\t\t\t\t\t\"fouls_drawn\": 1,\n\t\t\t\t\t\t\"offensive_fouls\": 1,\n\t\t\t\t\t\t\"points_off_turnovers\": 4,\n\t\t\t\t\t\t\"second_chance_pts\": 4\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t],\n\t\t\t\"assists\": [\n\t\t\t\t{\n\t\t\t\t\t\"full_name\": \"Patrick Beverley\",\n\t\t\t\t\t\"jersey_number\": \"21\",\n\t\t\t\t\t\"id\": \"912e7aa3-dd03-4a98-9980-0442e108f287\",\n\t\t\t\t\t\"position\": \"F\",\n\t\t\t\t\t\"primary_position\": \"SF\",\n\t\t\t\t\t\"sr_id\": \"sr:player:607472\",\n\t\t\t\t\t\"reference\": \"201976\",\n\t\t\t\t\t\"statistics\": {\n\t\t\t\t\t\t\"minutes\": \"21:19\",\n\t\t\t\t\t\t\"field_goals_made\": 5,\n\t\t\t\t\t\t\"field_goals_att\": 9,\n\t\t\t\t\t\t\"field_goals_pct\": 55.6,\n\t\t\t\t\t\t\"three_points_made\": 4,\n\t\t\t\t\t\t\"three_points_att\": 7,\n\t\t\t\t\t\t\"three_points_pct\": 57.1,\n\t\t\t\t\t\t\"two_points_made\": 1,\n\t\t\t\t\t\t\"two_points_att\": 2,\n\t\t\t\t\t\t\"two_points_pct\": 50,\n\t\t\t\t\t\t\"blocked_att\": 0,\n\t\t\t\t\t\t\"free_throws_made\": 0,\n\t\t\t\t\t\t\"free_throws_att\": 0,\n\t\t\t\t\t\t\"free_throws_pct\": 0,\n\t\t\t\t\t\t\"offensive_rebounds\": 0,\n\t\t\t\t\t\t\"defensive_rebounds\": 6,\n\t\t\t\t\t\t\"rebounds\": 6,\n\t\t\t\t\t\t\"assists\": 6,\n\t\t\t\t\t\t\"turnovers\": 1,\n\t\t\t\t\t\t\"steals\": 1,\n\t\t\t\t\t\t\"blocks\": 0,\n\t\t\t\t\t\t\"assists_turnover_ratio\": 6,\n\t\t\t\t\t\t\"personal_fouls\": 4,\n\t\t\t\t\t\t\"tech_fouls\": 0,\n\t\t\t\t\t\t\"flagrant_fouls\": 0,\n\t\t\t\t\t\t\"pls_min\": -4,\n\t\t\t\t\t\t\"points\": 14,\n\t\t\t\t\t\t\"double_double\": false,\n\t\t\t\t\t\t\"triple_double\": false,\n\t\t\t\t\t\t\"effective_fg_pct\": 77.8,\n\t\t\t\t\t\t\"efficiency\": 20,\n\t\t\t\t\t\t\"efficiency_game_score\": 14.1,\n\t\t\t\t\t\t\"points_in_paint\": 2,\n\t\t\t\t\t\t\"points_in_paint_att\": 2,\n\t\t\t\t\t\t\"points_in_paint_made\": 1,\n\t\t\t\t\t\t\"points_in_paint_pct\": 50,\n\t\t\t\t\t\t\"true_shooting_att\": 9,\n\t\t\t\t\t\t\"true_shooting_pct\": 77.8,\n\t\t\t\t\t\t\"fouls_drawn\": 2,\n\t\t\t\t\t\t\"offensive_fouls\": 0,\n\t\t\t\t\t\t\"points_off_turnovers\": 2,\n\t\t\t\t\t\t\"second_chance_pts\": 0\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t},\n\t\"away\": {\n\t\t\"name\": \"Jazz\",\n\t\t\"alias\": \"UTA\",\n\t\t\"market\": \"Utah\",\n\t\t\"id\": \"583ece50-fb46-11e1-82cb-f4ce4684ea4c\",\n\t\t\"points\": 137,\n\t\t\"bonus\": true,\n\t\t\"sr_id\": \"sr:team:3434\",\n\t\t\"reference\": \"1610612762\",\n\t\t\"scoring\": [\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 1,\n\t\t\t\t\"sequence\": 1,\n\t\t\t\t\"points\": 26\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 2,\n\t\t\t\t\"sequence\": 2,\n\t\t\t\t\"points\": 40\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 3,\n\t\t\t\t\"sequence\": 3,\n\t\t\t\t\"points\": 31\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"quarter\",\n\t\t\t\t\"number\": 4,\n\t\t\t\t\"sequence\": 4,\n\t\t\t\t\"points\": 29\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"overtime\",\n\t\t\t\t\"number\": 1,\n\t\t\t\t\"sequence\": 5,\n\t\t\t\t\"points\": 11\n\t\t\t}\n\t\t],\n\t\t\"leaders\": {\n\t\t\t\"points\": [\n\t\t\t\t{\n\t\t\t\t\t\"full_name\": \"Grayson Allen\",\n\t\t\t\t\t\"jersey_number\": \"24\",\n\t\t\t\t\t\"id\": \"ffa9a64f-d624-4033-bd23-59dcfd805175\",\n\t\t\t\t\t\"position\": \"G\",\n\t\t\t\t\t\"primary_position\": \"PG\",\n\t\t\t\t\t\"sr_id\": \"sr:player:1497615\",\n\t\t\t\t\t\"reference\": \"1628960\",\n\t\t\t\t\t\"statistics\": {\n\t\t\t\t\t\t\"minutes\": \"40:43\",\n\t\t\t\t\t\t\"field_goals_made\": 11,\n\t\t\t\t\t\t\"field_goals_att\": 30,\n\t\t\t\t\t\t\"field_goals_pct\": 36.7,\n\t\t\t\t\t\t\"three_points_made\": 5,\n\t\t\t\t\t\t\"three_points_att\": 13,\n\t\t\t\t\t\t\"three_points_pct\": 38.5,\n\t\t\t\t\t\t\"two_points_made\": 6,\n\t\t\t\t\t\t\"two_points_att\": 17,\n\t\t\t\t\t\t\"two_points_pct\": 35.3,\n\t\t\t\t\t\t\"blocked_att\": 1,\n\t\t\t\t\t\t\"free_throws_made\": 13,\n\t\t\t\t\t\t\"free_throws_att\": 14,\n\t\t\t\t\t\t\"free_throws_pct\": 92.9,\n\t\t\t\t\t\t\"offensive_rebounds\": 2,\n\t\t\t\t\t\t\"defensive_rebounds\": 5,\n\t\t\t\t\t\t\"rebounds\": 7,\n\t\t\t\t\t\t\"assists\": 4,\n\t\t\t\t\t\t\"turnovers\": 3,\n\t\t\t\t\t\t\"steals\": 1,\n\t\t\t\t\t\t\"blocks\": 1,\n\t\t\t\t\t\t\"assists_turnover_ratio\": 1.33,\n\t\t\t\t\t\t\"personal_fouls\": 1,\n\t\t\t\t\t\t\"tech_fouls\": 0,\n\t\t\t\t\t\t\"flagrant_fouls\": 0,\n\t\t\t\t\t\t\"pls_min\": -3,\n\t\t\t\t\t\t\"points\": 40,\n\t\t\t\t\t\t\"double_double\": false,\n\t\t\t\t\t\t\"triple_double\": false,\n\t\t\t\t\t\t\"effective_fg_pct\": 45,\n\t\t\t\t\t\t\"efficiency\": 38,\n\t\t\t\t\t\t\"efficiency_game_score\": 27,\n\t\t\t\t\t\t\"points_in_paint\": 4,\n\t\t\t\t\t\t\"points_in_paint_att\": 12,\n\t\t\t\t\t\t\"points_in_paint_made\": 2,\n\t\t\t\t\t\t\"points_in_paint_pct\": 16.7,\n\t\t\t\t\t\t\"true_shooting_att\": 36.16,\n\t\t\t\t\t\t\"true_shooting_pct\": 55.3,\n\t\t\t\t\t\t\"fouls_drawn\": 10,\n\t\t\t\t\t\t\"offensive_fouls\": 0,\n\t\t\t\t\t\t\"points_off_turnovers\": 4,\n\t\t\t\t\t\t\"second_chance_pts\": 2\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t],\n\t\t\t\"rebounds\": [\n\t\t\t\t{\n\t\t\t\t\t\"full_name\": \"Ekpe Udoh\",\n\t\t\t\t\t\"jersey_number\": \"33\",\n\t\t\t\t\t\"id\": \"b90d7326-f5ab-4ed1-bdd9-db3b43318363\",\n\t\t\t\t\t\"position\": \"C\",\n\t\t\t\t\t\"primary_position\": \"C\",\n\t\t\t\t\t\"sr_id\": \"sr:player:608202\",\n\t\t\t\t\t\"reference\": \"202327\",\n\t\t\t\t\t\"statistics\": {\n\t\t\t\t\t\t\"minutes\": \"28:47\",\n\t\t\t\t\t\t\"field_goals_made\": 5,\n\t\t\t\t\t\t\"field_goals_att\": 7,\n\t\t\t\t\t\t\"field_goals_pct\": 71.4,\n\t\t\t\t\t\t\"three_points_made\": 0,\n\t\t\t\t\t\t\"three_points_att\": 0,\n\t\t\t\t\t\t\"three_points_pct\": 0,\n\t\t\t\t\t\t\"two_points_made\": 5,\n\t\t\t\t\t\t\"two_points_att\": 7,\n\t\t\t\t\t\t\"two_points_pct\": 71.4,\n\t\t\t\t\t\t\"blocked_att\": 1,\n\t\t\t\t\t\t\"free_throws_made\": 4,\n\t\t\t\t\t\t\"free_throws_att\": 6,\n\t\t\t\t\t\t\"free_throws_pct\": 66.7,\n\t\t\t\t\t\t\"offensive_rebounds\": 3,\n\t\t\t\t\t\t\"defensive_rebounds\": 10,\n\t\t\t\t\t\t\"rebounds\": 13,\n\t\t\t\t\t\t\"assists\": 5,\n\t\t\t\t\t\t\"turnovers\": 0,\n\t\t\t\t\t\t\"steals\": 0,\n\t\t\t\t\t\t\"blocks\": 4,\n\t\t\t\t\t\t\"assists_turnover_ratio\": 0,\n\t\t\t\t\t\t\"personal_fouls\": 2,\n\t\t\t\t\t\t\"tech_fouls\": 0,\n\t\t\t\t\t\t\"flagrant_fouls\": 0,\n\t\t\t\t\t\t\"pls_min\": 3,\n\t\t\t\t\t\t\"points\": 14,\n\t\t\t\t\t\t\"double_double\": true,\n\t\t\t\t\t\t\"triple_double\": false,\n\t\t\t\t\t\t\"effective_fg_pct\": 71.4,\n\t\t\t\t\t\t\"efficiency\": 34,\n\t\t\t\t\t\t\"efficiency_game_score\": 20.9,\n\t\t\t\t\t\t\"points_in_paint\": 10,\n\t\t\t\t\t\t\"points_in_paint_att\": 7,\n\t\t\t\t\t\t\"points_in_paint_made\": 5,\n\t\t\t\t\t\t\"points_in_paint_pct\": 71.4,\n\t\t\t\t\t\t\"true_shooting_att\": 9.64,\n\t\t\t\t\t\t\"true_shooting_pct\": 72.6,\n\t\t\t\t\t\t\"fouls_drawn\": 5,\n\t\t\t\t\t\t\"offensive_fouls\": 0,\n\t\t\t\t\t\t\"points_off_turnovers\": 1,\n\t\t\t\t\t\t\"second_chance_pts\": 2\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t],\n\t\t\t\"assists\": [\n\t\t\t\t{\n\t\t\t\t\t\"full_name\": \"Naz Mitrou-Long\",\n\t\t\t\t\t\"jersey_number\": \"30\",\n\t\t\t\t\t\"id\": \"8d64d4d4-86f5-426b-a2db-82c2f72fb722\",\n\t\t\t\t\t\"position\": \"G\",\n\t\t\t\t\t\"primary_position\": \"SG\",\n\t\t\t\t\t\"sr_id\": \"sr:player:1303058\",\n\t\t\t\t\t\"reference\": \"1628513\",\n\t\t\t\t\t\"statistics\": {\n\t\t\t\t\t\t\"minutes\": \"33:43\",\n\t\t\t\t\t\t\"field_goals_made\": 3,\n\t\t\t\t\t\t\"field_goals_att\": 9,\n\t\t\t\t\t\t\"field_goals_pct\": 33.3,\n\t\t\t\t\t\t\"three_points_made\": 1,\n\t\t\t\t\t\t\"three_points_att\": 4,\n\t\t\t\t\t\t\"three_points_pct\": 25,\n\t\t\t\t\t\t\"two_points_made\": 2,\n\t\t\t\t\t\t\"two_points_att\": 5,\n\t\t\t\t\t\t\"two_points_pct\": 40,\n\t\t\t\t\t\t\"blocked_att\": 1,\n\t\t\t\t\t\t\"free_throws_made\": 2,\n\t\t\t\t\t\t\"free_throws_att\": 2,\n\t\t\t\t\t\t\"free_throws_pct\": 100,\n\t\t\t\t\t\t\"offensive_rebounds\": 1,\n\t\t\t\t\t\t\"defensive_rebounds\": 3,\n\t\t\t\t\t\t\"rebounds\": 4,\n\t\t\t\t\t\t\"assists\": 9,\n\t\t\t\t\t\t\"turnovers\": 4,\n\t\t\t\t\t\t\"steals\": 1,\n\t\t\t\t\t\t\"blocks\": 1,\n\t\t\t\t\t\t\"assists_turnover_ratio\": 2.25,\n\t\t\t\t\t\t\"personal_fouls\": 5,\n\t\t\t\t\t\t\"tech_fouls\": 0,\n\t\t\t\t\t\t\"flagrant_fouls\": 0,\n\t\t\t\t\t\t\"pls_min\": -3,\n\t\t\t\t\t\t\"points\": 9,\n\t\t\t\t\t\t\"double_double\": false,\n\t\t\t\t\t\t\"triple_double\": false,\n\t\t\t\t\t\t\"effective_fg_pct\": 38.9,\n\t\t\t\t\t\t\"efficiency\": 11,\n\t\t\t\t\t\t\"efficiency_game_score\": 7.5,\n\t\t\t\t\t\t\"points_in_paint\": 4,\n\t\t\t\t\t\t\"points_in_paint_att\": 5,\n\t\t\t\t\t\t\"points_in_paint_made\": 2,\n\t\t\t\t\t\t\"points_in_paint_pct\": 40,\n\t\t\t\t\t\t\"true_shooting_att\": 9.88,\n\t\t\t\t\t\t\"true_shooting_pct\": 45.5,\n\t\t\t\t\t\t\"fouls_drawn\": 3,\n\t\t\t\t\t\t\"offensive_fouls\": 0,\n\t\t\t\t\t\t\"points_off_turnovers\": 0,\n\t\t\t\t\t\t\"second_chance_pts\": 0\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t},\n\t\"points_home\": 143,\n\t\"points_away\": 137,\n\t\"winner\": \"home\"\n}",
      "language": "json",
      "name": "Response"
    }
  ]
}
[/block]
## times

The number to multiply the result by (since Solidity can't handle decimal places).

#### Solidity example

```javascript
req.addInt("times", 100);
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The examples below show how to create requests for the quotes and convert endpoints.
[block:code]
{
  "codes": [
    {
      "code": "function getWinner(address _oracle, bytes32 _jobId, string _game)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"game\", _game);\n  req.add(\"copyPath\", \"winner\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getWinner"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "bytes32 public winner;\n\nfunction fulfill(bytes32 _requestId, bytes32 _data)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  winner = _data;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]