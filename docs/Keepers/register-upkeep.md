---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Register Keeper Upkeep for a Contract'
permalink: 'docs/chainlink-keepers/register-upkeep/'
whatsnext:
  {
    'Overview of the Chainlink Keeper Network': '/docs/chainlink-keepers/overview/',
  }
---
{% include keepers-beta %}

Once you have deployed a Keeper compatible contract, we need to register it with the Chainlink Keeper Network. You must do this via the [Chainlink Keepers Website](https://keeper.chain.link).

<div class="remix-callout">
    <a href="https://keeper.chain.link" class="cl-button--ghost solidity-tracked">Chainlink Keepers Website</a>
</div>

Once registerd, you can interact directly with the [registry contract](https://etherscan.io/address/0x109A81F1E0A35D4c1D0cae8aCc6597cd54b47Bc6#code) functions (`registerUpkeep`,`cancelUpkeep`, `addFunds`, etc).

The website will walk you through several steps.

# 5 Steps to register and fund Upkeep on the Chainlink Keeper Network

1. **Connect your wallet** with the button in the top right corner and choose a chain. The Chainlink Keeper Network currently supports Ethereum Mainnet or Kovan.
  ![Metamask](/images/contract-devs/keeper/keeper-metamask.png)

1. **Click the `Register new upkeep` button**
  ![Register New Upkeep](/images/contract-devs/keeper/keeper-register.png)

1. **Fill out the registration form**
    The information you provide will be publicly visible on the blockchain. Your email address will be encrypted.

     Make sure you have LINK to fund your Upkeep with. Learn how to [acquire testnet LINK](/docs/acquire-link/).

    > 🚧 FUNDING NOTE
    > You should fund your contract with more LINK that you anticipate you will need. The network will not check or perform your Upkeep if your balance could be too low based on current exchange rates.
    >
    > Your balance will be charged LINK based on a 20% premium over the gas cost to `performUpeep`. There's currently a ~80k gas overhead from the registry. The premium and overhead are not fixed and will change over time.



    The gas limit of the example counter contract should be set to 200,000.
   
 
1. **Press `Register upkeep`** and confirm the transaction in MetaMask
  This will send a request to the Chainlink Keeper Network which will need to be manually approved.  This is a temporary step during the Beta, and requests are automatically approved on testnets, so you should be up and running in a matter of minutes.

    ![success](/images/contract-devs/keeper/keeper-registration-submitted.png)

1. **Add funds to your Upkeep**
  Your contract was provided initial funding as part of the registration step, but once this runs out, you'll need to add more LINK to your Upkeep.

  * Click `View Upkeep` or navigate back to the [home page of the Chainlink Keepers Website](https://keeper.chain.link) and click on your recently registered Upkeep
  * Press `Add funds` button
  * Approve the LINK spend allowance
    ![approve-allowance](/images/contract-devs/keeper/keeper-approve-allowance.png)
  * Confirm LINK transfer by sending funds to the Chainlink Keeper Network Registry
    ![confirm-transfer](/images/contract-devs/keeper/keeper-confirm-transfer.png)
  * Receive a success message and verify that the funds were added to the Upkeep
    ![add-funds-upkeep](/images/contract-devs/keeper/keeper-add-funds.png)

## How funding works
* Your balance will be reduced each time a Keeper executes your `performUpkeep` method.
* There is no cost for `checkUpkeep` calls
* If you want to automate adding funds, you can directly call the `addFunds()` function on the `KeeperRegistry` contract.
* Anyone (not just the Upkeep owner) can call the `addFunds()` function
* To withdraw funds, first cancel the Upkeep 



# Congratulations!
After you register your Upkeep, it has been approved, and you have added sufficient funds, the Chainlink Keeper Network will begin to simulate `checkUpkeep` calls, and execute your contract's `performUpkeep` as needed.

You have now built and registered a Keeper Compatible contract with the Chainlink Keeper Network. Wohoo!

<!-- Once we know how developers get stuck, add a next step about troubleshooting -->
