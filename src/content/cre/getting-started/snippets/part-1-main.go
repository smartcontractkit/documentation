//go:build wasip1

package main

import (
	"log/slog"

	"github.com/smartcontractkit/cre-sdk-go/capabilities/scheduler/cron"
	"github.com/smartcontractkit/cre-sdk-go/cre"
	"github.com/smartcontractkit/cre-sdk-go/cre/wasm"
)

// Config struct defines the parameters that can be passed to the workflow.
type Config struct {
	Schedule string `json:"schedule"`
}

// The result of our workflow, which is empty for now.
type MyResult struct{}

// onCronTrigger is the callback function that gets executed when the cron trigger fires.
func onCronTrigger(config *Config, runtime cre.Runtime, trigger *cron.Payload) (*MyResult, error) {
	logger := runtime.Logger()
	logger.Info("Hello, Calculator! Workflow triggered.")
	return &MyResult{}, nil
}

// InitWorkflow is the required entry point for a CRE workflow.
// The runner calls this function to initialize the workflow and register its handlers.
func InitWorkflow(config *Config, logger *slog.Logger, secretsProvider cre.SecretsProvider) (cre.Workflow[*Config], error) {
	return cre.Workflow[*Config]{
		cre.Handler(
			// Use the schedule from our config file.
			cron.Trigger(&cron.Config{Schedule: config.Schedule}),
			onCronTrigger,
		),
	}, nil
}

// main is the entry point for the WASM binary.
func main() {
	// The runner is initialized with our Config struct.
	// It will automatically parse the config.json file into this struct.
	wasm.NewRunner(cre.ParseJSON[Config]).Run(InitWorkflow)
}
