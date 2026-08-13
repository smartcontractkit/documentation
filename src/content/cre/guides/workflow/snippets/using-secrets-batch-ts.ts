import { CronCapability, handler, Runner, type Runtime } from "@chainlink/cre-sdk"

// Config can be an empty object if you don't need any parameters from config.json
type Config = Record<string, never>

const SECRET_ADDRESS_NAME = "SECRET_ADDRESS"
const API_KEY_NAME = "API_KEY"

const onCronTrigger = (runtime: Runtime<Config>): string => {
  // Fetch multiple secrets in a single batch call
  const secretsToFetch = [{ id: SECRET_ADDRESS_NAME }, { id: API_KEY_NAME }]
  const secrets = runtime.getSecrets(secretsToFetch).result()

  // Access each secret from the result map by its ID
  const secretAddress = secrets[SECRET_ADDRESS_NAME].value
  const apiKey = secrets[API_KEY_NAME].value

  runtime.log(`Successfully fetched secrets! Address: ${secretAddress}, API Key: ${apiKey}`)

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
