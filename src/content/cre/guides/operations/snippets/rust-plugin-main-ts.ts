import { CronCapability, handler, Runner, type Runtime } from "@chainlink/cre-sdk"
import { myPlugin } from "./my-plugin-accessor" // highlight-line

export type Config = {
  schedule: string
}

export const onCronTrigger = (runtime: Runtime<Config>): string => {
  runtime.log("Hello world! Workflow triggered.")
  const greeting = myPlugin().greet() // highlight-line
  runtime.log(`Rust says: ${greeting}`) // highlight-line
  return greeting // highlight-line
}

export const initWorkflow = (config: Config) => {
  const cron = new CronCapability()
  return [handler(cron.trigger({ schedule: config.schedule }), onCronTrigger)]
}

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}
