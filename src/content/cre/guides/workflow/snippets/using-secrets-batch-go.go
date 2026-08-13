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

const (
	SecretAddressName = "SECRET_ADDRESS"
	ApiKeyName        = "API_KEY"
)

func onCronTrigger(config *Config, runtime cre.Runtime, trigger *cron.Payload) (*MyResult, error) {
	logger := runtime.Logger()

	// Fetch multiple secrets in a single batch call.
	secrets, err := runtime.GetSecrets([]*protos.SecretRequest{
		{Id: SecretAddressName},
		{Id: ApiKeyName},
	}).Await()
	if err != nil {
		logger.Error("Failed to get secrets", "err", err)
		return nil, err
	}

	// Secrets are returned in the same order as the input requests.
	secretAddress := secrets[0].Value
	apiKey := secrets[1].Value

	logger.Info("Successfully fetched secrets!",
		"address", secretAddress,
		"apiKey", apiKey,
	)

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
