import { cre } from "@chainlink/cre-sdk"

cre.handler(
  cron.trigger({ schedule: "0 */5 * * *" }), // Every 5 minutes
  (runtime) => {
    // Fetch data from API
    const price = httpClient.get(url).result()

    // Read from EVM blockchain
    const threshold = evmClient.read(contract).result()

    // Make any computation
    const shouldUpdate = price > threshold

    // Write result onchain
    return evmClient.write(contract, price).result()
  }
)
