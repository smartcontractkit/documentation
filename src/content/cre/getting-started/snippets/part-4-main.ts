import {
  CronCapability,
  HTTPClient,
  EVMClient,
  handler,
  consensusMedianAggregation,
  Runner,
  type NodeRuntime,
  type Runtime,
  getNetwork,
  LAST_FINALIZED_BLOCK_NUMBER,
  encodeCallMsg,
  bytesToHex,
  hexToBase64, // highlight-line
} from "@chainlink/cre-sdk"
import { encodeAbiParameters, parseAbiParameters, encodeFunctionData, decodeFunctionResult, zeroAddress } from "viem" // highlight-line
import { Storage } from "../contracts/abi"

type EvmConfig = {
  chainName: string
  storageAddress: string
  calculatorConsumerAddress: string // highlight-line
  gasLimit: string // highlight-line
}

type Config = {
  schedule: string
  apiUrl: string
  evms: EvmConfig[]
}

// highlight-start
// MyResult struct now holds all the outputs of our workflow.
type MyResult = {
  offchainValue: bigint
  onchainValue: bigint
  finalResult: bigint
  txHash: string
}
// highlight-end

const initWorkflow = (config: Config) => {
  const cron = new CronCapability()

  return [handler(cron.trigger({ schedule: config.schedule }), onCronTrigger)]
}

const onCronTrigger = (runtime: Runtime<Config>): MyResult => {
  const evmConfig = runtime.config.evms[0]

  // Convert the human-readable chain name to a chain selector
  const network = getNetwork({
    chainFamily: "evm",
    chainSelectorName: evmConfig.chainName,
    isTestnet: true,
  })
  if (!network) {
    throw new Error(`Unknown chain name: ${evmConfig.chainName}`)
  }

  // Step 1: Fetch offchain data
  const offchainValue = runtime.runInNodeMode(fetchMathResult, consensusMedianAggregation())().result()

  runtime.log(`Successfully fetched offchain value: ${offchainValue}`)

  // Step 2: Read onchain data using the EVM client
  const evmClient = new EVMClient(network.chainSelector.selector)

  const callData = encodeFunctionData({
    abi: Storage,
    functionName: "get",
  })

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

  const onchainValue = decodeFunctionResult({
    abi: Storage,
    functionName: "get",
    data: bytesToHex(contractCall.data),
  }) as bigint

  runtime.log(`Successfully read onchain value: ${onchainValue}`)

  // highlight-start
  // Step 3: Calculate the final result
  const finalResultValue = onchainValue + offchainValue

  runtime.log(`Final calculated result: ${finalResultValue}`)

  // Step 4: Write the result to the consumer contract
  const txHash = updateCalculatorResult(
    runtime,
    network.chainSelector.selector,
    evmConfig,
    offchainValue,
    onchainValue,
    finalResultValue
  )

  // Step 5: Log and return the final, consolidated result.
  const finalWorkflowResult: MyResult = {
    offchainValue,
    onchainValue,
    finalResult: finalResultValue,
    txHash,
  }

  runtime.log(
    `Workflow finished successfully! offchainValue: ${offchainValue}, onchainValue: ${onchainValue}, finalResult: ${finalResultValue}, txHash: ${txHash}`
  )

  return finalWorkflowResult
}
// highlight-end

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

// highlight-start
// updateCalculatorResult handles the logic for writing data to the CalculatorConsumer contract.
function updateCalculatorResult(
  runtime: Runtime<Config>,
  chainSelector: bigint,
  evmConfig: EvmConfig,
  offchainValue: bigint,
  onchainValue: bigint,
  finalResult: bigint
): string {
  runtime.log(`Updating calculator result for consumer: ${evmConfig.calculatorConsumerAddress}`)

  const evmClient = new EVMClient(chainSelector)

  // Encode the CalculatorResult struct according to the contract's ABI
  const reportData = encodeAbiParameters(
    parseAbiParameters("uint256 offchainValue, int256 onchainValue, uint256 finalResult"),
    [offchainValue, onchainValue, finalResult]
  )

  runtime.log(
    `Writing report to consumer contract - offchainValue: ${offchainValue}, onchainValue: ${onchainValue}, finalResult: ${finalResult}`
  )

  // Step 1: Generate a signed report using the consensus capability
  const reportResponse = runtime
    .report({
      encodedPayload: hexToBase64(reportData),
      encoderName: "evm",
      signingAlgo: "ecdsa",
      hashingAlgo: "keccak256",
    })
    .result()

  // Step 2: Submit the report to the consumer contract
  const writeReportResult = evmClient
    .writeReport(runtime, {
      receiver: evmConfig.calculatorConsumerAddress,
      report: reportResponse,
      gasConfig: {
        gasLimit: evmConfig.gasLimit,
      },
    })
    .result()

  runtime.log("Waiting for write report response")

  const txHash = bytesToHex(writeReportResult.txHash || new Uint8Array(32))
  runtime.log(`Write report transaction succeeded: ${txHash}`)
  runtime.log(`View transaction at https://sepolia.etherscan.io/tx/${txHash}`)
  return txHash
}
// highlight-end

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}
