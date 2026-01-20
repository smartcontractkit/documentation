import { HTTPCapability, handler, type Runtime, type HTTPPayload, Runner, decodeJson } from "@chainlink/cre-sdk"

type Config = {
  minimumAmount: number
}

type RequestData = {
  userId: string
  action: string
  amount: number
}

const onHttpTrigger = (runtime: Runtime<Config>, payload: HTTPPayload): string => {
  const requestData = decodeJson(payload.input) as RequestData

  // Validate required fields
  if (!requestData.userId || !requestData.action || requestData.amount === undefined) {
    runtime.log("Missing required fields")
    return "Error: Missing required fields (userId, action, amount)"
  }

  runtime.log(`Processing ${requestData.action} for user ${requestData.userId}`)

  if (requestData.amount < runtime.config.minimumAmount) {
    runtime.log(`Amount ${requestData.amount} below minimum ${runtime.config.minimumAmount}`)
    return "Amount too low"
  }

  runtime.log(`Processing amount: ${requestData.amount}`)
  return `Successfully processed ${requestData.action}`
}

const initWorkflow = (config: Config) => {
  const http = new HTTPCapability()

  return [
    handler(http.trigger({}), onHttpTrigger), // Empty config OK for simulation
  ]
}

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}
