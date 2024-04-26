package main

import (
	"data-streams-direct/client"
	"data-streams-direct/internal"
	"fmt"
	"log"
	"os"
)

func main() {
    // Ensure the correct number of arguments are provided
    if len(os.Args) < 2 {
        log.Fatalf("Usage: %s <feedID1> <feedID2> ...", os.Args[0])
    }

    // Retrieve the feed IDs from command line arguments
    feedIds := os.Args[1:]

    // Fetch reports for all provided feed IDs
    reports, err := client.FetchSingleReportManyFeeds(feedIds)
    if err != nil {
        log.Fatalf("Failed to fetch reports: %v", err)
    }

    // Slice to store decoded reports
    var decodedReports []*internal.ReportWithContext

    // Process each report fetched
    for index, report := range reports {
        // Decode the full report data
        decodedReport, err := internal.DecodeFullReportAndReportData(report.FullReport)
        if err != nil {
            log.Fatalf("Failed to decode report: %v", err)
        }
        decodedReports = append(decodedReports, decodedReport)

        // Print the full report in hex format as the payload
        printPayload(report.FullReport, feedIds[index])
    }

    // Print details of all decoded reports
    printReportDetails(decodedReports)
}

// Helper function to print the full report (payload) in hex format
func printPayload(payload []byte, feedId string) {
    fmt.Println("")
    fmt.Printf("Payload for onchain verification for Feed ID %s\n", feedId)
    fmt.Println("=============================================================")
    fmt.Printf("Payload (hexadecimal): 0x%x\n", payload)
    fmt.Println("-------------------------------------------------------------")
    fmt.Println()
}

// Helper function to print details of the decoded reports
func printReportDetails(reports []*internal.ReportWithContext) {
    fmt.Println("")
    fmt.Println("Report Details")
    fmt.Println("==============")
    for _, report := range reports {
        fmt.Printf("Feed ID: %s\n", report.FeedId)
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
            fmt.Println("------------------------------------------------")
        }
    }
}
