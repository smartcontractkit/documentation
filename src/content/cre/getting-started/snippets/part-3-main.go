//go:build wasip1

package main

import (
	"fmt"
	"log/slog"
	"math/big"

	"onchain-calculator/contracts/evm/src/generated/storage" // highlight-line

	"github.com/ethereum/go-ethereum/common"                             // highlight-line
	"github.com/smartcontractkit/cre-sdk-go/capabilities/blockchain/evm" // highlight-line
	"github.com/smartcontractkit/cre-sdk-go/capabilities/networking/http"
	"github.com/smartcontractkit/cre-sdk-go/capabilities/scheduler/cron"
	"github.com/smartcontractkit/cre-sdk-go/cre"
	"github.com/smartcontractkit/cre-sdk-go/cre/wasm"
)

// highlight-start
// EvmConfig defines the configuration for a single EVM chain.
type EvmConfig struct {
	StorageAddress string `json:"storageAddress"`
	ChainName      string `json:"chainName"`
}

// Config struct now contains a list of EVM configurations.
// This makes it consistent with the structure used in Part 4.
type Config struct {
	Schedule string      `json:"schedule"`
	ApiUrl   string      `json:"apiUrl"`
	Evms     []EvmConfig `json:"evms"`
}

// highlight-end

type MyResult struct {
	FinalResult *big.Int // highlight-line
}

func InitWorkflow(config *Config, logger *slog.Logger, secretsProvider cre.SecretsProvider) (cre.Workflow[*Config], error) {
	return cre.Workflow[*Config]{
		cre.Handler(cron.Trigger(&cron.Config{Schedule: config.Schedule}), onCronTrigger),
	}, nil
}

func fetchMathResult(config *Config, logger *slog.Logger, sendRequester *http.SendRequester) (*big.Int, error) {
	req := &http.Request{Url: config.ApiUrl, Method: "GET"}
	resp, err := sendRequester.SendRequest(req).Await()
	if err != nil {
		return nil, fmt.Errorf("failed to get API response: %w", err)
	}
	val, ok := new(big.Int).SetString(string(resp.Body), 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse API response into big.Int")
	}
	return val, nil
}

func onCronTrigger(config *Config, runtime cre.Runtime, trigger *cron.Payload) (*MyResult, error) {
	logger := runtime.Logger()
	// Step 1: Fetch offchain data (from Part 2)
	client := &http.Client{}
	mathPromise := http.SendRequest(config, runtime, client, fetchMathResult, cre.ConsensusMedianAggregation[*big.Int]())
	offchainValue, err := mathPromise.Await()
	if err != nil {
		return nil, err
	}
	logger.Info("Successfully fetched offchain value", "result", offchainValue) // highlight-line

	// highlight-start
	// Get the first EVM configuration from the list.
	evmConfig := config.Evms[0]

	// Step 2: Read onchain data using the binding
	// Convert the human-readable chain name to a numeric chain selector
	chainSelector, err := evm.ChainSelectorFromName(evmConfig.ChainName)
	if err != nil {
		return nil, fmt.Errorf("invalid chain name: %w", err)
	}

	evmClient := &evm.Client{
		ChainSelector: chainSelector,
	}

	storageAddress := common.HexToAddress(evmConfig.StorageAddress)

	storageContract, err := storage.NewStorage(evmClient, storageAddress, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create contract instance: %w", err)
	}

	onchainValue, err := storageContract.Get(runtime, big.NewInt(-3)).Await() // -3 means finalized block
	if err != nil {
		return nil, fmt.Errorf("failed to read onchain value: %w", err)
	}

	logger.Info("Successfully read onchain value", "result", onchainValue)

	// Step 3: Combine the results
	finalResult := new(big.Int).Add(onchainValue, offchainValue)
	logger.Info("Final calculated result", "result", finalResult)

	return &MyResult{
		FinalResult: finalResult,
	}, nil
	// highlight-end
}

func main() {
	wasm.NewRunner(cre.ParseJSON[Config]).Run(InitWorkflow)
}
