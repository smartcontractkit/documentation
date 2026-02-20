//go:build wasip1

package main

import (
	"fmt"
	"log/slog"
	"math/big"

	"onchain-calculator/contracts/evm/src/generated/calculator_consumer" // highlight-line
	"onchain-calculator/contracts/evm/src/generated/storage"

	"github.com/ethereum/go-ethereum/common"
	"github.com/smartcontractkit/cre-sdk-go/capabilities/blockchain/evm"
	"github.com/smartcontractkit/cre-sdk-go/capabilities/networking/http"
	"github.com/smartcontractkit/cre-sdk-go/capabilities/scheduler/cron"
	"github.com/smartcontractkit/cre-sdk-go/cre"
	"github.com/smartcontractkit/cre-sdk-go/cre/wasm"
)

// highlight-start
// The EvmConfig is updated from Part 3 with new fields for the write operation.
type EvmConfig struct {
	ChainName                 string `json:"chainName"`
	StorageAddress            string `json:"storageAddress"`
	CalculatorConsumerAddress string `json:"calculatorConsumerAddress"`
	GasLimit                  uint64 `json:"gasLimit"`
}

// highlight-end

type Config struct {
	Schedule string      `json:"schedule"`
	ApiUrl   string      `json:"apiUrl"`
	Evms     []EvmConfig `json:"evms"`
}

// highlight-start
// MyResult struct now holds all the outputs of our workflow.
type MyResult struct {
	OffchainValue *big.Int
	OnchainValue  *big.Int
	FinalResult   *big.Int
	TxHash        string
}

// highlight-end

func InitWorkflow(config *Config, logger *slog.Logger, secretsProvider cre.SecretsProvider) (cre.Workflow[*Config], error) {
	return cre.Workflow[*Config]{
		cre.Handler(cron.Trigger(&cron.Config{Schedule: config.Schedule}), onCronTrigger),
	}, nil
}

func onCronTrigger(config *Config, runtime cre.Runtime, trigger *cron.Payload) (*MyResult, error) {
	logger := runtime.Logger()
	evmConfig := config.Evms[0]

	// Convert the human-readable chain name to a numeric chain selector
	chainSelector, err := evm.ChainSelectorFromName(evmConfig.ChainName)
	if err != nil {
		return nil, fmt.Errorf("invalid chain name: %w", err)
	}

	// Step 1: Fetch offchain data
	client := &http.Client{}
	mathPromise := http.SendRequest(config, runtime, client, fetchMathResult, cre.ConsensusMedianAggregation[*big.Int]())
	offchainValue, err := mathPromise.Await()
	if err != nil {
		return nil, err
	}
	logger.Info("Successfully fetched offchain value", "result", offchainValue)

	// Step 2: Read onchain data using the binding for the Storage contract
	evmClient := &evm.Client{
		ChainSelector: chainSelector,
	}

	storageAddress := common.HexToAddress(evmConfig.StorageAddress)

	storageContract, err := storage.NewStorage(evmClient, storageAddress, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create contract instance: %w", err)
	}

	onchainValue, err := storageContract.Get(runtime, big.NewInt(-3)).Await()
	if err != nil {
		return nil, fmt.Errorf("failed to read onchain value: %w", err)
	}
	logger.Info("Successfully read onchain value", "result", onchainValue)

	// highlight-start
	// Step 3: Calculate the final result
	finalResultInt := new(big.Int).Add(onchainValue, offchainValue)

	logger.Info("Final calculated result", "result", finalResultInt)

	// Step 4: Write the result to the consumer contract
	txHash, err := updateCalculatorResult(config, runtime, chainSelector, evmConfig, offchainValue, onchainValue, finalResultInt)
	if err != nil {
		return nil, fmt.Errorf("failed to update calculator result: %w", err)
	}

	// Step 5: Log and return the final, consolidated result.
	finalWorkflowResult := &MyResult{
		OffchainValue: offchainValue,
		OnchainValue:  onchainValue,
		FinalResult:   finalResultInt,
		TxHash:        txHash,
	}

	logger.Info("Workflow finished successfully!", "result", finalWorkflowResult)

	return finalWorkflowResult, nil
	// highlight-end
}

func fetchMathResult(config *Config, logger *slog.Logger, sendRequester *http.SendRequester) (*big.Int, error) {
	req := &http.Request{Url: config.ApiUrl, Method: "GET"}
	resp, err := sendRequester.SendRequest(req).Await()
	if err != nil {
		return nil, fmt.Errorf("failed to get API response: %w", err)
	}
	// The mathjs.org API returns the result as a raw string in the body.
	// We need to parse it into a number.
	val, ok := new(big.Int).SetString(string(resp.Body), 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse API response into big.Int")
	}
	return val, nil
}

// highlight-start
// updateCalculatorResult handles the logic for writing data to the CalculatorConsumer contract.
func updateCalculatorResult(config *Config, runtime cre.Runtime, chainSelector uint64, evmConfig EvmConfig, offchainValue *big.Int, onchainValue *big.Int, finalResult *big.Int) (string, error) {
	logger := runtime.Logger()
	logger.Info("Updating calculator result", "consumerAddress", evmConfig.CalculatorConsumerAddress)

	evmClient := &evm.Client{
		ChainSelector: chainSelector,
	}

	// Create a contract binding instance pointed at the CalculatorConsumer address.
	consumerAddress := common.HexToAddress(evmConfig.CalculatorConsumerAddress)

	consumerContract, err := calculator_consumer.NewCalculatorConsumer(evmClient, consumerAddress, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create consumer contract instance: %w", err)
	}

	gasConfig := &evm.GasConfig{
		GasLimit: evmConfig.GasLimit,
	}

	logger.Info("Writing report to consumer contract", "offchainValue", offchainValue, "onchainValue", onchainValue, "finalResult", finalResult)
	// Call the `WriteReport` method on the binding. This sends a secure report to the consumer.
	writeReportPromise := consumerContract.WriteReportFromCalculatorResult(runtime, calculator_consumer.CalculatorResult{
		OffchainValue: offchainValue,
		OnchainValue:  onchainValue,
		FinalResult:   finalResult,
	}, gasConfig)

	logger.Info("Waiting for write report response")
	resp, err := writeReportPromise.Await()
	if err != nil {
		logger.Error("WriteReport await failed", "error", err)
		return "", fmt.Errorf("failed to await write report: %w", err)
	}
	txHash := fmt.Sprintf("0x%x", resp.TxHash)
	logger.Info("Write report transaction succeeded", "txHash", txHash)
	logger.Info("View transaction at", "url", fmt.Sprintf("https://sepolia.etherscan.io/tx/%s", txHash))
	return txHash, nil
}

// highlight-end

func main() {
	wasm.NewRunner(cre.ParseJSON[Config]).Run(InitWorkflow)
}
