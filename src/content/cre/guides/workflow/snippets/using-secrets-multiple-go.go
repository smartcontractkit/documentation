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

	// Important: Fetch secrets sequentially, not in parallel.
	// The WASM host for CRE runtime does not support parallel runtime.GetSecret() requests.
	// Always call GetSecret(), then Await() before making the next GetSecret() call.

	// 1. Fetch the first secret
	addressPromise := runtime.GetSecret(&protos.SecretRequest{Id: SecretAddressName})
	secretAddress, err := addressPromise.Await()
	if err != nil {
		logger.Error("Failed to get SECRET_ADDRESS", "err", err)
		return nil, err
	}

	// 2. Fetch the second secret (only after the first is complete)
	apiKeyPromise := runtime.GetSecret(&protos.SecretRequest{Id: ApiKeyName})
	apiKey, err := apiKeyPromise.Await()
	if err != nil {
		logger.Error("Failed to get API_KEY", "err", err)
		return nil, err
	}

	// 3. Use your secrets
	logger.Info("Successfully fetched secrets!",
		"address", secretAddress.Value,
		"apiKey", apiKey.Value,
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
