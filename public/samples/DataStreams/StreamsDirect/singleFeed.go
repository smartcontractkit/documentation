// main.go for a single feed

package main

import (
	"data-streams-direct/client"
	"data-streams-direct/internal"
	"fmt"
	"log"
	"os"
)

func main() {
    // Check if a feed ID has been provided as an argument
    if len(os.Args) < 2 {
        log.Fatalf("Usage: %s <feedId>", os.Args[0])
    }

    // Retrieve the feedId from the CL arguments
    feedId := os.Args[1]

    // Fetch the report for the specified feedId
    report, err := client.FetchSingleReportSingleFeed(feedId)
    if err != nil {
        log.Fatalf("Failed to fetch report: %v", err)
    }

    // Decode the full report data
    decodedReport, err := internal.DecodeFullReportAndReportData(report.FullReport)
    if err != nil {
        log.Fatalf("Failed to decode report: %v", err)
    }

    // Print details of the decoded report
    printReportDetails(decodedReport)

    // Print the full report in hex format as the payload
    printPayload(report.FullReport)
}

// Helper function to print the full report (payload) in hex format
func printPayload(payload []byte) {
    fmt.Println("")
    fmt.Println("Payload for onchain verification")
    fmt.Println("=========================================")
    fmt.Printf("Payload (hexadecimal): 0x%x\n", payload)  // Adding '0x' prefix for hexadecimal representation
    fmt.Println("------------------------------------------------")
    fmt.Println()
}


// Helper function to print details of the decoded report
func printReportDetails(report *internal.ReportWithContext) {
    fmt.Println("")
    fmt.Println("Report Details")
    fmt.Println("==============")
    fmt.Printf("Feed ID: %s\n", report.FeedId)
    fmt.Println()

    if report.V3Report != nil {
        fmt.Println("Decoded V3 Report Details:")
        fmt.Println("-------------------------")
        fmt.Printf("Valid From Timestamp: %d\n", report.V3Report.ValidFromTimestamp)
        fmt.Printf("Observations Timestamp: %d\n", report.V3Report.ObservationsTimestamp)
        fmt.Printf("Native Fee: %s\n", report.V3Report.NativeFee.String())
        fmt.Printf("Link Fee: %s\n", report.V3Report.LinkFee.String())
        fmt.Printf("Expires At: %d\n", report.V3Report.ExpiresAt)
        fmt.Printf("Benchmark Price: %s\n", report.V3Report.BenchmarkPrice.String())
        fmt.Printf("Bid: %s\n", report.V3Report.Bid.String())
        fmt.Printf("Ask: %s\n", report.V3Report.Ask.String())
        fmt.Println()
    }
}
