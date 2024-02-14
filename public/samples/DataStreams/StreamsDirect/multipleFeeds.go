package main

import (
	"data-streams-direct/client"
	"data-streams-direct/internal"
	"fmt"
	"log"
)

func main() {
    singleReports, err := client.FetchSingleReportManyFeeds()
    if err != nil {
        log.Fatalf("Failed to fetch reports: %v", err)
    }

    var decodedReports []*internal.ReportWithContext
    for _, singleReport := range singleReports {
        decodedReport, err := internal.DecodeFullReportAndReportData(singleReport.FullReport)
        if err != nil {
            log.Fatalf("Failed to decode report: %v", err)
        }
        decodedReports = append(decodedReports, decodedReport)
    }

    printReportDetails(decodedReports)
}

func printReportDetails(reports []*internal.ReportWithContext) {
    for _, report := range reports {
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
}
