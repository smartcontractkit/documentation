package main

import (
	"data-streams-direct/client"
	"data-streams-direct/internal"
	"fmt"
	"log"
)

func main() {
    report, err := client.FetchSingleReportSingleFeed()
    if err != nil {
        log.Fatalf("Failed to fetch report: %v", err)
    }

    decodedReport, err := internal.DecodeFullReportAndReportData(report.FullReport)
    if err != nil {
        log.Fatalf("Failed to decode report: %v", err)
    }

    printReportDetails(decodedReport)
}

func printReportDetails(report *internal.ReportWithContext) {
	fmt.Printf("Feed ID: %s\n", report.FeedId)
	fmt.Printf("Feed Version: %d\n", report.FeedVersion)

	if report.V1Report != nil {
		fmt.Println("Decoded V1 Report Details:")
		fmt.Printf("Valid From Timestamp: %d\n", report.V2Report.ValidFromTimestamp)
		fmt.Printf("Observations Timestamp: %d\n", report.V2Report.ObservationsTimestamp)
		fmt.Printf("Native Fee: %s\n", report.V2Report.NativeFee.String())
		fmt.Printf("Link Fee: %s\n", report.V2Report.LinkFee.String())
		fmt.Printf("Expires At: %d\n", report.V2Report.ExpiresAt)
		fmt.Printf("Benchmark Price: %s\n", report.V2Report.BenchmarkPrice.String())
	}

	if report.V2Report != nil {
		fmt.Println("Decoded V2 Report Details:")
		fmt.Printf("Valid From Timestamp: %d\n", report.V2Report.ValidFromTimestamp)
		fmt.Printf("Observations Timestamp: %d\n", report.V2Report.ObservationsTimestamp)
		fmt.Printf("Native Fee: %s\n", report.V2Report.NativeFee.String())
		fmt.Printf("Link Fee: %s\n", report.V2Report.LinkFee.String())
		fmt.Printf("Expires At: %d\n", report.V2Report.ExpiresAt)
		fmt.Printf("Benchmark Price: %s\n", report.V2Report.BenchmarkPrice.String())
	}

	if report.V3Report != nil {
		fmt.Println("Decoded V3 Report Details:")
		fmt.Printf("Valid From Timestamp: %d\n", report.V2Report.ValidFromTimestamp)
		fmt.Printf("Observations Timestamp: %d\n", report.V2Report.ObservationsTimestamp)
		fmt.Printf("Native Fee: %s\n", report.V2Report.NativeFee.String())
		fmt.Printf("Link Fee: %s\n", report.V2Report.LinkFee.String())
		fmt.Printf("Expires At: %d\n", report.V2Report.ExpiresAt)
		fmt.Printf("Benchmark Price: %s\n", report.V2Report.BenchmarkPrice.String())
	}
}