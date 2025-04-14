async function sendBackrunBundle(pendingTx: IPendingTransaction) {
  const currentBlock = await provider.getBlockNumber()
  const signedBackrunTx = await buildDummyBackrunTx(pendingTx)
  const bundleParams: BundleParams = {
    inclusion: {
      block: currentBlock + 1,
      maxBlock: currentBlock + TARGET_BUNDLE_BLOCK_DELAY,
    },
    body: [{ hash: pendingTx.hash }, { tx: signedBackrunTx, canRevert: false }],
  }

  const sendBundleResult = await mevShareClient.sendBundle(bundleParams)
  return sendBundleResult
}

async function buildDummyBackrunTx(pendingTx: IPendingTransaction) {
  const backrunTx = { data: {}, maxFeePerGas: 22000, maxPriorityFeePerGas: 22000 }
  const signedBackrunTx = await executorWallet.signTransaction(backrunTx)
  return signedBackrunTx
}
