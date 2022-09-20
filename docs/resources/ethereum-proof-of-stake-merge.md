---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Ethereum Proof-of-Stake Merge"
permalink: "docs/ethereum-proof-of-stake-merge/"
---

The [Ethereum Merge](https://ethereum.org/en/upgrades/merge/) is an upcoming network upgrade in which the Proof-of-Work (PoW) consensus layer of the Ethereum blockchain will be replaced with a new Proof-of-Stake (PoS) consensus layer. To ensure continuity for Chainlink protocol users on Ethereum, Chainlink Labs is following a rigorous quality assurance process in preparation of the Merge.

The Chainlink protocol and its services will remain operational on the Ethereum blockchain during and after the Merge to the PoS consensus layer. Users should be aware that forked versions of the Ethereum blockchain, including PoW forks, will not be supported by the Chainlink protocol. This is aligned with both the Ethereum Foundation’s and broader Ethereum community’s decision, achieved via social consensus, to upgrade the Ethereum blockchain to PoS consensus.

Ethereum developers and dApp teams should, at minimum, take the following actions to avoid unforeseen incidents and help protect end users:

- Review all external dependencies that their contracts may rely upon 
- Test their smart contract deployments on [Ethereum Proof-of-Stake testnets](https://ethereum.org/en/developers/docs/networks/#ethereum-testnets)
- Review the performance of their smart contracts under extreme market conditions and implement necessary safeguards to protect end-users

Chainlink Labs is not responsible for unforeseen incidents, including loss events, that may arise due to a failure to take the actions specified above. For more detail on the risk of using data feeds and your responsibility for mitigating them, please review the [Risk Mitigation](/docs/selecting-data-feeds/#risk-mitigation) documentation. Chainlink Labs will continue to monitor any developments surrounding the Ethereum Merge to ensure the utmost level of reliability of Chainlink services.
