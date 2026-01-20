import {
  CronCapability,
  HTTPClient,
  EVMClient,
  handler,
  consensusMedianAggregation,
  Runner,
  type NodeRuntime,
  type Runtime,
  getNetwork, // highlight-line
  LAST_FINALIZED_BLOCK_NUMBER, // highlight-line
  encodeCallMsg, // highlight-line
  bytesToHex, // highlight-line
} from "@chainlink/cre-sdk"
import { encodeFunctionData, decodeFunctionResult, zeroAddress } from "viem" // highlight-line
import { Storage } from "../contracts/abi" // highlight-line

// highlight-start
// EvmConfig defines the configuration for a single EVM chain.
type EvmConfig = {
  storageAddress: string
  chainName: string
}
// highlight-end

type Config = {
  schedule: string
  apiUrl: string
  evms: EvmConfig[] // highlight-line
}

type MyResult = {
  finalResult: bigint // highlight-line
}

const initWorkflow = (config: Config) => {
  const cron = new CronCapability()

  return [handler(cron.trigger({ schedule: config.schedule }), onCronTrigger)]
}

// fetchMathResult is the function passed to the runInNodeMode helper.
const fetchMathResult = (nodeRuntime: NodeRuntime<Config>): bigint => {
  const httpClient = new HTTPClient()

  const req = {
    url: nodeRuntime.config.apiUrl,
    method: "GET" as const,
  }

  const resp = httpClient.sendRequest(nodeRuntime, req).result()
  const bodyText = new TextDecoder().decode(resp.body)
  const val = BigInt(bodyText.trim())

  return val
}

const onCronTrigger = (runtime: Runtime<Config>): MyResult => {
  // Step 1: Fetch offchain data (from Part 2)
  const offchainValue = runtime.runInNodeMode(fetchMathResult, consensusMedianAggregation())().result()

  runtime.log(`Successfully fetched offchain value: ${offchainValue}`) // highlight-line

  // highlight-start
  // Get the first EVM configuration from the list.
  const evmConfig = runtime.config.evms[0]

  // Step 2: Read onchain data using the EVM client
  // Convert the human-readable chain name to a chain selector
  const network = getNetwork({
    chainFamily: "evm",
    chainSelectorName: evmConfig.chainName,
    isTestnet: true,
  })
  if (!network) {
    throw new Error(`Unknown chain name: ${evmConfig.chainName}`)
  }

  const evmClient = new EVMClient(network.chainSelector.selector)

  // Encode the function call using the Storage ABI
  const callData = encodeFunctionData({
    abi: Storage,
    functionName: "get",
  })

  // Call the contract
  const contractCall = evmClient
    .callContract(runtime, {
      call: encodeCallMsg({
        from: zeroAddress,
        to: evmConfig.storageAddress as `0x${string}`,
        data: callData,
      }),
      blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
    })
    .result()

  // Decode the result
  const onchainValue = decodeFunctionResult({
    abi: Storage,
    functionName: "get",
    data: bytesToHex(contractCall.data),
  }) as bigint

  runtime.log(`Successfully read onchain value: ${onchainValue}`)

  // Step 3: Combine the results
  const finalResult = onchainValue + offchainValue
  runtime.log(`Final calculated result: ${finalResult}`)
  // highlight-end

  return {
    finalResult,
  }
}

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}
