cre.handler(
  cronTrigger.trigger({ schedule: "0 */10 * * * *" }), // trigger fires every 10 minutes
  onCronTrigger // your callback function
)

function onCronTrigger(runtime: Runtime<Config>): Record<string, never> {
  // Create SDK clients and call capabilities
  return {}
}
