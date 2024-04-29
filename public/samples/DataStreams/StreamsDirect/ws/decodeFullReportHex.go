// decodeFullReportHex.go

package main

import (
	"data-streams-direct-ws/internal"
	"encoding/hex"
	"fmt"
	"log"
)

func main() {
    // Sample FullReport payload extracted from the WebSocket message as a hex string
    fullReportHex := "00067f14c763070bec1de1118aceeed1546878ab24e3213de21127249adabcbd0000000000000000000000000000000000000000000000000000000011f0c90b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000240010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b0000000000000000000000000000000000000000000000000000000065cdcd950000000000000000000000000000000000000000000000000000000065cdcd95000000000000000000000000000000000000000000000000000020b5e9c686e80000000000000000000000000000000000000000000000000011b8f926846fb80000000000000000000000000000000000000000000000000000000065cf1f15000000000000000000000000000000000000000000000096ba314c8f5ec2800000000000000000000000000000000000000000000000000000000000000000029c85f7bb779ce5316821a6efd3bdc843e32f1438bad24a6b269871ade0c166d2142574b78d7a75d3cb855e51caf9cb36e1d598b43c881989251bd2c450624a2600000000000000000000000000000000000000000000000000000000000000021c1e5c393a57a24f2c698e23c59e6a954a9ef006b63c7f58eeabdd0bbeff21e5353ddef53e9beb93f628cd23e2cc28750533f444559622640bcf7dcc935d66af"

    // Convert the hex string to a byte slice
    fullReportPayload, err := hex.DecodeString(fullReportHex)
    if err != nil {
        log.Fatalf("Failed to decode hex string: %v", err)
    }

    // Decode the full report
    decodedReport, err := internal.DecodeFullReportAndReportData(fullReportPayload)
    if err != nil {
        log.Fatalf("Failed to decode report: %v", err)
    }

    fmt.Printf("Decoded Report: %+v\n", decodedReport)

    if decodedReport.FeedVersion == 3 && decodedReport.V3Report != nil {
        fmt.Printf("Valid From Timestamp: %d\n", decodedReport.V3Report.ValidFromTimestamp)
        fmt.Printf("Observations Timestamp: %d\n", decodedReport.V3Report.ObservationsTimestamp)
        fmt.Printf("Native Fee: %s\n", decodedReport.V3Report.NativeFee.String())
        fmt.Printf("Link Fee: %s\n", decodedReport.V3Report.LinkFee.String())
        fmt.Printf("Expires At: %d\n", decodedReport.V3Report.ExpiresAt)
        fmt.Printf("Benchmark Price: %s\n", decodedReport.V3Report.BenchmarkPrice.String())
        fmt.Printf("Bid: %s\n", decodedReport.V3Report.Bid.String())
        fmt.Printf("Ask: %s\n", decodedReport.V3Report.Ask.String())
    } 
}