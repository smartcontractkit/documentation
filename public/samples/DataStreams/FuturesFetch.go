// FuturesFetch.go — Fetch and decode a Futures (v14) report with the Go SDK.
//
// Usage:
//   export API_KEY="..."
//   export API_SECRET="..."
//   go run FuturesFetch.go 0x000ebfe7b7560e1866ef91d4607ce5ee7474382794e5ec755f38b70b1f30e647
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	streams "github.com/smartcontractkit/data-streams-sdk/go/v2"
	feed "github.com/smartcontractkit/data-streams-sdk/go/v2/feed"
	report "github.com/smartcontractkit/data-streams-sdk/go/v2/report"
	v14 "github.com/smartcontractkit/data-streams-sdk/go/v2/report/v14"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintf(os.Stderr, "Usage: go run FuturesFetch.go [FeedID]\n")
		os.Exit(1)
	}
	feedIDInput := os.Args[1]

	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	if apiKey == "" || apiSecret == "" {
		fmt.Fprintf(os.Stderr, "API_KEY and API_SECRET environment variables must be set\n")
		os.Exit(1)
	}

	cfg := streams.Config{
		ApiKey:    apiKey,
		ApiSecret: apiSecret,
		RestURL:   "https://api.testnet-dataengine.chain.link",
		Logger:    streams.LogPrintf,
	}

	client, err := streams.New(cfg)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to create client: %v\n", err)
		os.Exit(1)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	var feedID feed.ID
	if err := feedID.FromString(feedIDInput); err != nil {
		fmt.Fprintf(os.Stderr, "Invalid feed ID format '%s': %v\n", feedIDInput, err)
		os.Exit(1)
	}

	reportResponse, err := client.GetLatestReport(ctx, feedID)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to get latest report: %v\n", err)
		os.Exit(1)
	}

	// Decode the v14 (Futures) report
	decodedReport, err := report.Decode[v14.Data](reportResponse.FullReport)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to decode report: %v\n", err)
		os.Exit(1)
	}

	d := decodedReport.Data

	fmt.Printf("\nDecoded V14 Report for Stream ID %s:\n", feedIDInput)
	fmt.Println("------------------------------------------")
	fmt.Printf("Mid Price             : %s\n", d.MidPrice.String())
	fmt.Printf("Bid Price             : %s\n", d.BidPrice.String())
	fmt.Printf("Ask Price             : %s\n", d.AskPrice.String())
	fmt.Printf("Expiry Time           : %d\n", d.ExpiryTime.Unix())
	fmt.Printf("First Day of Notice   : %d\n", d.FirstDayOfNotice.Unix())
	fmt.Printf("Last Seen TimestampNs : %d\n", d.LastSeenTimestampNs.UnixNano())
	fmt.Printf("Market Status         : %d\n", d.MarketStatus)
	fmt.Printf("Contract Month        : %d\n", d.ContractMonth)
	fmt.Printf("Goldman Roll Price    : %s\n", d.GoldmanRollPrice.String())
	fmt.Printf("Current Business Day  : %d\n", d.CurrentBusinessDay)
	fmt.Printf("Interp Goldman Roll   : %s\n", d.InterpolatedGoldmanRollPrice.String())
	fmt.Println("------------------------------------------")
}
