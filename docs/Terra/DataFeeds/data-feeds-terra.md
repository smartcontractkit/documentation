---
layout: nodes.liquid
section: terra
title: "Terra Feeds"
stub: data-feeds-terra
permalink: "docs/terra/data-feeds-terra/"
metadata:
  ecosystem: terra
  image:
    0: "https://files.readme.io/8dc5d76-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
date: Last Modified
---

<p>To learn how to implement these feeds, see the <a href="/docs/terra/using-data-feeds-terra/">Terra Examples for Consuming Data Feeds</a>.</p>
<p>To obtain tokens on the Terra Bombay Testnet, see the <a href="https://faucet.terra.money/">Terra Testnet Faucet</a>. For these feeds, use the <strong>Bombay-12</strong> testnet.</p>


<p>Note, off-chain equity and ETF assets are only traded during standard market hours (9:30 am - 4 pm ET M-F). Using these feeds outside of those windows is not recommended.</p>

<style>
table {
   border-collapse: collapse;
   width:100%;
}
th, td {
   border: 1px solid #dfe2e5;
   padding: 6px 13px;
}
thead tr {
   background-color: #f6f8fa;
}
tr:nth-child(2n) {
   background-color: rgb(251, 252, 253);
}
.detail-hidden {
   display: none;
}
input {
   margin-right:8px;
}
</style>

<div id="feed-data"><h2 id="Terra Bombay Testnet">Terra Bombay Testnet <a class="anchor" href="#Terra Bombay Testnet"><img src="/images/link.svg" alt="Link to this section"></a></h2>
<table>
    <thead>
        <tr>
            <th>Pair</th>
            <th class="detail-hidden">Deviation</th>
            <th class="detail-hidden">Heartbeat</th>
            <th>Dec</th>
            <th>Proxy</th>
        </tr>
    </thead>
    <tbody>
    <tr id="Terra Bombay Testnet ATOM/USD">
        <td><code>ATOM/USD</code></td>
        <td class="detail-hidden">0.3%</td>
        <td class="detail-hidden">50s</td>
        <td>8</td>
        <td><a href="https://finder.terra.money/bombay-12/address/terra1nd2hy4nyk9ug9w6fs3z5trtm6mxhj2td9zdgep"><code>terra1nd2hy4nyk9ug9w6fs3z5trtm6mxhj2td9zdgep</code></a></td>
    </tr>
        <tr id="Terra Bombay Testnet LUNA/USD">
        <td><code>LUNA/USD</code></td>
        <td class="detail-hidden">0.3%</td>
        <td class="detail-hidden">50s</td>
        <td>8</td>
        <td><a href="https://finder.terra.money/bombay-12/address/terra185esv8hg3ddn85fkwgznskf95k0th9ryvegeak"><code>terra185esv8hg3ddn85fkwgznskf95k0th9ryvegeak</code></a></td>
    </tr>
        <tr id="Terra Bombay Testnet MIR/USD">
        <td><code>MIR/USD</code></td>
        <td class="detail-hidden">0.3%</td>
        <td class="detail-hidden">50s</td>
        <td>8</td>
        <td><a href="https://finder.terra.money/bombay-12/address/terra1tdux5lds0acwh46nl9wgytptuwtyqvmd0ltw44"><code>terra1tdux5lds0acwh46nl9wgytptuwtyqvmd0ltw44</code></a></td>
    </tr>
        <tr id="Terra Bombay Testnet UST/USD">
        <td><code>UST/USD</code></td>
        <td class="detail-hidden">0.3%</td>
        <td class="detail-hidden">50s</td>
        <td>8</td>
        <td><a href="https://finder.terra.money/bombay-12/address/terra185dcug0qdl4wlvdrznh63wvnj6ekynpxp6jdwl"><code>terra185dcug0qdl4wlvdrznh63wvnj6ekynpxp6jdwl</code></a></td>
    </tr>
      </tbody>
</table></div>

<rdme-callout theme="warn">
<p><small>Please be careful with the feeds used by your smart contracts. The feeds listed in our official documentation have been reviewed; feeds built for custom deployments by other community members might have additional risks. Please do close diligence on your feeds before implementing them in your contracts. <a href="/docs/selecting-data-feeds/">Learn more about making responsible data quality decisions.</a></small>
</p>
</rdme-callout>
