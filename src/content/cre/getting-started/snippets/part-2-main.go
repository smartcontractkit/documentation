//go:build wasip1

package main

import (
	"fmt"
	"log/slog"
	"math/big"

	"github.com/smartcontractkit/cre-sdk-go/capabilities/networking/http"
	"github.com/smartcontractkit/cre-sdk-go/capabilities/scheduler/cron"
	"github.com/smartcontractkit/cre-sdk-go/cre"
	"github.com/smartcontractkit/cre-sdk-go/cre/wasm"
)

// Add the ApiUrl to your config struct
type Config struct {
	Schedule string `json:"schedule"`
	ApiUrl   string `json:"apiUrl"`
}

type MyResult struct {
	Result *big.Int
}

func InitWorkflow(config *Config, logger *slog.Logger, secretsProvider cre.SecretsProvider) (cre.Workflow[*Config], error) {
	return cre.Workflow[*Config]{
		cre.Handler(
			cron.Trigger(&cron.Config{Schedule: config.Schedule}),
			onCronTrigger,
		),
	}, nil
}

// fetchMathResult is the function passed to the http.SendRequest helper.
// It contains the logic for making the request and parsing the response.
func fetchMathResult(config *Config, logger *slog.Logger, sendRequester *http.SendRequester) (*big.Int, error) {
	req := &http.Request{
		Url:    config.ApiUrl,
		Method: "GET",
	}

	// Send the request using the provided sendRequester
	resp, err := sendRequester.SendRequest(req).Await()
	if err != nil {
		return nil, fmt.Errorf("failed to get API response: %w", err)
	}

	// The mathjs.org API returns the result as a raw string in the body.
	// We need to parse it into a big.Int.
	val, ok := new(big.Int).SetString(string(resp.Body), 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse API response into big.Int")
	}
	return val, nil
}

// onCronTrigger is our main DON-level callback.
func onCronTrigger(config *Config, runtime cre.Runtime, trigger *cron.Payload) (*MyResult, error) {
	logger := runtime.Logger()
	logger.Info("Hello, Calculator! Workflow triggered.")

	client := &http.Client{}
	// Use the http.SendRequest helper to execute the offchain fetch.
	mathPromise := http.SendRequest(config, runtime, client,
		fetchMathResult,
		// The API returns a random number, so each node can get a different result. We use Median Aggregation to find a median value.
		cre.ConsensusMedianAggregation[*big.Int](),
	)

	// Await the final, aggregated result.
	result, err := mathPromise.Await()
	if err != nil {
		return nil, err
	}

	logger.Info("Successfully fetched and aggregated math result", "result", result)

	return &MyResult{
		Result: result,
	}, nil
}

func main() {
	wasm.NewRunner(cre.ParseJSON[Config]).Run(InitWorkflow)
}
