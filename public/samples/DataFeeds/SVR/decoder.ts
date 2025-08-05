const decodeInterface = new ethers.Interface(EXAMPLE_ABI)

function decodeForwarderCall(callData: string) {
  const decodedForward = decodeInterface.decodeFunctionData("forward", callData)
  return { to: decodedForward[0], callData: decodedForward[1] }
}

function decodeTransmitSecondary(callData: string) {
  try {
    const decodedTransmitSecondary = decodeInterface.decodeFunctionData("transmitSecondary", callData)
    return { report: decodedTransmitSecondary[1] }
  } catch (error) {
    console.error("not transmit secondary call", error)
    return {}
  }
}

function decodeReport(reportRaw: string) {
  const decodedReport = ethers.AbiCoder.defaultAbiCoder().decode(["uint32", "bytes32", "int192[]", "int192"], reportRaw)

  return { observations: decodedReport[2] }
}

function updatedPrice(observations: bigint[]) {
  const medianObservation = observations[Math.floor(observations.length / 2)]
  return medianObservation
}

async function processTransaction(pendingTx: IPendingTransaction) {
  if (pendingTx.functionSelector !== CHAINLINK_PRICE_FEED_FUNCTION_SELECTOR) {
    return null
  }

  const { to, callData } = decodeForwarderCall(pendingTx.callData)
  const { report } = decodeTransmitSecondary(callData)
  if (report) {
    const { observations } = decodeReport(report)
    const newPrice = updatedPrice(observations)
  }

  // calculate health factors for affected users ...
}
