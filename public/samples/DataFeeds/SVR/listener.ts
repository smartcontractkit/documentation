import MevShareClient, { IPendingBundle, IPendingTransaction } from "@flashbots/mev-share-client"

const mevShareClient = MevShareClient.useEthereumMainnet(authSigner)

const txHandler = mevShareClient.on("transaction", async (tx: IPendingTransaction) => {
  if (tx.functionSelector === "6fadc72") {
    // Do something with the pending tx here.
  }
})

// call before your program terminates:
txHandler.close()
bundleHandler.close()
