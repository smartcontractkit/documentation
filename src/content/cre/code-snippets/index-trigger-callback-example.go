cre.Handler(
  cron.Trigger(&cron.Config{Schedule: "0 */10 * * * *"}), // Trigger fires every 10 minutes
  onCronTrigger, // your Go callback
)

func onCronTrigger(config *Config, runtime cre.Runtime, trigger *cron.Payload) (struct{}, error) {
  // Create SDK clients and call capabilities
  return struct{}{}, nil
}