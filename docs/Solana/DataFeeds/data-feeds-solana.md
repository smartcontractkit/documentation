---
layout: nodes.liquid
section: solana
title: "Solana Feeds"
stub: data-feeds-solana
permalink: "docs/solana/data-feeds-solana/"
metadata:
  ecosystem: solana
  image:
    0: "https://files.readme.io/8dc5d76-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
date: Last Modified
---

<p>To learn how to implement these feeds, see the <a href="/docs/solana/using-data-feeds-solana/">Solana Examples for Consuming Data Feeds</a>.</p>
<p>To learn how to obtain SOL tokens on the Solana Devnet, see the <a href="https://docs.solana.com/cli/transfer-tokens#airdrop-some-tokens-to-get-started">Solana Documentation</a>.</p>


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


<div id="feed-data"><h2 id="Solana Devnet">Solana Devnet <a class="anchor" href="#Solana Devnet"><img src="/images/link.svg" alt="Link to this section"></a></h2><label>
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
    <tr id="Solana Devnet AVAX / USD">
        <td><code>AVAX / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/DinfGKkKxJsU3kFnj173zSRdXNhZxxgZY8YC5GCQYhsi?cluster=devnet"><code>DinfGKkKxJsU3kFnj173zSRdXNhZxxgZY8YC5GCQYhsi</code></a></td>
    </tr>
    <tr id="Solana Devnet BTC / USD">
        <td><code>BTC / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/6dbkV6QCToTk6DRfuJyrGuz18kZ4rPUSHLLLVrryWdUC?cluster=devnet"><code>6dbkV6QCToTk6DRfuJyrGuz18kZ4rPUSHLLLVrryWdUC</code></a></td>
    </tr>
    <tr id="Solana Devnet ETH / USD">
        <td><code>ETH / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/8pcXGi4QoHKytv3issKdFF3XRDeYAGEgy6EEAi1ioLe7?cluster=devnet"><code>8pcXGi4QoHKytv3issKdFF3XRDeYAGEgy6EEAi1ioLe7</code></a></td>
    </tr>
    <tr id="Solana Devnet FTT / USD">
        <td><code>FTT / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/DxuuKdgxuT6Quu7niMJy1aL1qS9oHm2mCSP3Z5L8nNBo?cluster=devnet"><code>DxuuKdgxuT6Quu7niMJy1aL1qS9oHm2mCSP3Z5L8nNBo</code></a></td>
    </tr>
    <tr id="Solana Devnet LINK / USD">
        <td><code>LINK / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/DKE5VrYbboAteTfzAycvtV7Hah7VwvyXC56hj2hZ8dfS?cluster=devnet"><code>DKE5VrYbboAteTfzAycvtV7Hah7VwvyXC56hj2hZ8dfS</code></a></td>
    </tr>
    <tr id="Solana Devnet MATIC / USD">
        <td><code>MATIC / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/9Xzp4FjgB9UKF3tDXS1WxHTGauv4dtPmkxxTZdWZsP2x?cluster=devnet"><code>9Xzp4FjgB9UKF3tDXS1WxHTGauv4dtPmkxxTZdWZsP2x</code></a></td>
    </tr>
    <tr id="Solana Devnet RAY / USD">
        <td><code>RAY / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/HvYREVU9R1MeVp61bJFg39E7qqgnuxKnqxsuYg27T7NE?cluster=devnet"><code>HvYREVU9R1MeVp61bJFg39E7qqgnuxKnqxsuYg27T7NE</code></a></td>
    </tr>
    <tr id="Solana Devnet SOL / USD">
        <td><code>SOL / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf?cluster=devnet"><code>FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf</code></a></td>
    </tr>
    <tr id="Solana Devnet SRM / USD">
        <td><code>SRM / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/ELfANVHk7wYB3ALoxPsiTQgM3t9MXgjbNZQNZyPuBp9C?cluster=devnet"><code>ELfANVHk7wYB3ALoxPsiTQgM3t9MXgjbNZQNZyPuBp9C</code></a></td>
    </tr>
    <tr id="Solana Devnet USDC / USD">
        <td><code>USDC / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/F3Wgm7HqxnxvNznF7MmHMW7566zBQyuwzF5JWRhjhUtc?cluster=devnet"><code>F3Wgm7HqxnxvNznF7MmHMW7566zBQyuwzF5JWRhjhUtc</code></a></td>
    </tr>
    <tr id="Solana Devnet USDT / USD">
        <td><code>USDT / USD</code></td>
        <td class="detail-hidden">N/A</td>
        <td class="detail-hidden">1s</td>
        <td>9</td>
        <td><a href="https://solscan.io/account/FG5FPJnT4ubjoNMm9Bh2uAfgbq2bwxP7aY6AKVmYou1p?cluster=devnet"><code>FG5FPJnT4ubjoNMm9Bh2uAfgbq2bwxP7aY6AKVmYou1p</code></a></td>
    </tr></tbody>
</table></div>

<rdme-callout theme="warn">
<p><small>Please be careful with the feeds used by your smart contracts. The feeds listed in our official documentation have been reviewed; feeds built for custom deployments by other community members might have additional risks. Please do close diligence on your feeds before implementing them in your contracts. <a href="/docs/selecting-data-feeds/">Learn more about making responsible data quality decisions.</a></small>
</p>
</rdme-callout>


</div>
