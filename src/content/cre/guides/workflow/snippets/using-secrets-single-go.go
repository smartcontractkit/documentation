//go:build wasip1

package main

import (
	"log/slog"

	protos "github.com/smartcontractkit/chainlink-protos/cre/go/sdk"
	"github.com/smartcontractkit/cre-sdk-go/capabilities/scheduler/cron"
	"github.com/smartcontractkit/cre-sdk-go/cre"
	"github.com/smartcontractkit/cre-sdk-go/cre/wasm"
)

// Config can be an empty struct if you don't need any parameters from config.json.
type Config struct{}

// MyResult can be an empty struct if your workflow doesn't need to return a result.
type MyResult struct{}

// Define the logical name of the secret as a constant for clarity.
const SecretName = "SECRET_ADDRESS"

// onCronTrigger is the callback function that gets executed when the cron trigger fires.
// This is where you use the secret.
func onCronTrigger(config *Config, runtime cre.Runtime, trigger *cron.Payload) (*MyResult, error) {
	logger := runtime.Logger()
	// Build the request with the secret's logical ID.
	secretReq := &protos.SecretRequest{
		Id: SecretName,
	}

	// Call runtime.GetSecret and await the promise.
	secret, err := runtime.GetSecret(secretReq).Await()
	if err != nil {
		logger.Error("Failed to get secret", "name", SecretName, "err", err)
		return nil, err
	}

	// Use the secret's value.
	secretAddress := secret.Value
	logger.Info("Successfully fetched a secret!", "address", secretAddress)

	// ... now you can use the secretAddress in your logic ...
	return &MyResult{}, nil
}

// InitWorkflow is the required entry point for a CRE workflow.
func InitWorkflow(config *Config, logger *slog.Logger, secretsProvider cre.SecretsProvider) (cre.Workflow[*Config], error) {
	return cre.Workflow[*Config]{
		cre.Handler(
			cron.Trigger(&cron.Config{Schedule: "0 */10 * * * *"}),
			onCronTrigger,
		),
	}, nil
}

// main is the entry point for the WASM binary.
func main() {
	wasm.NewRunner(cre.ParseJSON[Config]).Run(InitWorkflow)
}
