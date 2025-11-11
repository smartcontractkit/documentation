//go:build wasip1

package main

import (
	"encoding/json"
	"fmt"
	"log/slog"

	"github.com/smartcontractkit/cre-sdk-go/capabilities/networking/http"
	"github.com/smartcontractkit/cre-sdk-go/cre"
	"github.com/smartcontractkit/cre-sdk-go/cre/wasm"
)

type Config struct {
	MinimumAmount int `json:"minimumAmount"`
}

type RequestData struct {
	UserID string `json:"userId"`
	Action string `json:"action"`
	Amount *int   `json:"amount"` // Pointer to detect missing field
}

func onHttpTrigger(config *Config, runtime cre.Runtime, payload *http.Payload) (string, error) {
	var data RequestData
	if err := json.Unmarshal(payload.Input, &data); err != nil {
		return "", fmt.Errorf("failed to parse input: %w", err)
	}

	// Validate required fields
	if data.UserID == "" || data.Action == "" || data.Amount == nil {
		runtime.Logger().Info("Missing required fields")
		return "Error: Missing required fields (userId, action, amount)", nil
	}

	runtime.Logger().Info("Processing request", "action", data.Action, "userId", data.UserID)

	if *data.Amount < config.MinimumAmount {
		runtime.Logger().Info("Amount below minimum", "amount", *data.Amount, "minimum", config.MinimumAmount)
		return "Amount too low", nil
	}

	runtime.Logger().Info("Processing amount", "amount", *data.Amount)
	return fmt.Sprintf("Successfully processed %s", data.Action), nil
}

func InitWorkflow(config *Config, logger *slog.Logger, secretsProvider cre.SecretsProvider) (cre.Workflow[*Config], error) {
	httpTrigger := http.Trigger(&http.Config{}) // Empty config OK for simulation

	return cre.Workflow[*Config]{
		cre.Handler(httpTrigger, onHttpTrigger),
	}, nil
}

func main() {
	wasm.NewRunner(cre.ParseJSON[Config]).Run(InitWorkflow)
}
