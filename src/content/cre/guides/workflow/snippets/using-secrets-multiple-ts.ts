import { CronCapability, handler, Runner, type Runtime } from "@chainlink/cre-sdk"

// Config can be an empty object if you don't need any parameters from config.json
type Config = Record<string, never>

const SECRET_ADDRESS_NAME = "SECRET_ADDRESS"
const API_KEY_NAME = "API_KEY"

const onCronTrigger = (runtime: Runtime<Config>): string => {
  // 1. Fetch both secrets in a single batch call
  const secrets = runtime.getSecrets([{ id: SECRET_ADDRESS_NAME }, { id: API_KEY_NAME }]).result()

  // 2. Use your secrets
  runtime.log(
    `Successfully fetched secrets! Address: ${secrets[SECRET_ADDRESS_NAME].value}, API Key: ${secrets[API_KEY_NAME].value}`
  )

  return "Success"
}

// initWorkflow is the entry point for the workflow
const initWorkflow = () => {
  const cron = new CronCapability()

  return [handler(cron.trigger({ schedule: "0 */10 * * * *" }), onCronTrigger)]
}

// main is the entry point for the WASM binary
export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}
