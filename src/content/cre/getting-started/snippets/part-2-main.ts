import {
  CronCapability,
  HTTPClient,
  handler,
  consensusMedianAggregation,
  Runner,
  type NodeRuntime,
  type Runtime,
} from "@chainlink/cre-sdk"

type Config = {
  schedule: string
  apiUrl: string
}

type MyResult = {
  result: bigint
}

const initWorkflow = (config: Config) => {
  const cron = new CronCapability()

  return [handler(cron.trigger({ schedule: config.schedule }), onCronTrigger)]
}

// fetchMathResult is the function passed to the runInNodeMode helper.
// It contains the logic for making the request and parsing the response.
const fetchMathResult = (nodeRuntime: NodeRuntime<Config>): bigint => {
  const httpClient = new HTTPClient()

  const req = {
    url: nodeRuntime.config.apiUrl,
    method: "GET" as const,
  }

  // Send the request using the HTTP client
  const resp = httpClient.sendRequest(nodeRuntime, req).result()

  // The mathjs.org API returns the result as a raw string in the body.
  // We need to parse it into a bigint.
  const bodyText = new TextDecoder().decode(resp.body)
  const val = BigInt(bodyText.trim())

  return val
}

const onCronTrigger = (runtime: Runtime<Config>): MyResult => {
  runtime.log("Hello, Calculator! Workflow triggered.")
  // Use runInNodeMode to execute the offchain fetch.
  // The API returns a random number, so each node can get a different result.
  // We use median consensus to find a single, trusted value.
  const result = runtime.runInNodeMode(fetchMathResult, consensusMedianAggregation())().result()

  runtime.log(`Successfully fetched and aggregated math result: ${result}`)

  return {
    result,
  }
}

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}
