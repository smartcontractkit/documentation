// FuturesFetch.ts — Fetch and decode a Futures (v14) report with the TypeScript SDK.
//
// Usage:
//   export API_KEY="..."
//   export USER_SECRET="..."
//   npx tsx FuturesFetch.ts 0x000ebfe7b7560e1866ef91d4607ce5ee7474382794e5ec755f38b70b1f30e647
import { createClient, decodeReport, getReportVersion, formatReport, LogLevel } from "@chainlink/data-streams-sdk"
import "dotenv/config"

async function main() {
  if (process.argv.length < 3) {
    console.error("Please provide a feed ID as an argument")
    process.exit(1)
  }

  const feedId = process.argv[2]
  const version = getReportVersion(feedId)

  const config = {
    apiKey: process.env.API_KEY || "YOUR_API_KEY",
    userSecret: process.env.USER_SECRET || "YOUR_USER_SECRET",
    endpoint: "https://api.testnet-dataengine.chain.link",
    wsEndpoint: "wss://ws.testnet-dataengine.chain.link",
    logging: {
      logger: console,
      logLevel: LogLevel.INFO,
    },
  }

  const client = createClient(config)
  console.log(`\nFetching latest report for feed ${feedId} (${version})...\n`)

  const report = await client.getLatestReport(feedId)
  console.log(`Raw Report Blob: ${report.fullReport}`)

  // The TS SDK auto-detects the report version from the feed ID.
  const decodedData = decodeReport(report.fullReport, report.feedID)

  const decodedReport = {
    ...decodedData,
    feedID: report.feedID,
    validFromTimestamp: report.validFromTimestamp,
    observationsTimestamp: report.observationsTimestamp,
  }
  console.log(formatReport(decodedReport, version))
}

main().catch((error) => {
  console.error("Error:", error instanceof Error ? error.message : error)
  process.exit(1)
})
