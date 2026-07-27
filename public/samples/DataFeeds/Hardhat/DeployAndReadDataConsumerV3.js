import { network } from "hardhat"

/**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

const { ethers } = await network.create()

async function main() {
  // 1. Deploy the DataConsumerV3 contract
  const consumer = await ethers.deployContract("DataConsumerV3")
  await consumer.waitForDeployment()

  const consumerAddress = await consumer.getAddress()
  console.log("DataConsumerV3 deployed at:", consumerAddress)

  // 2. Read the latest price through the consumer contract
  const answer = await consumer.getChainlinkDataFeedLatestAnswer()
  console.log("Latest answer (raw):", answer.toString())

  // 3. Read decimals directly from the feed to scale the answer
  // Sepolia BTC / USD price feed proxy address
  const feedAddress = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"
  const AggregatorV3Interface = [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
  ]
  const feed = await ethers.getContractAt(AggregatorV3Interface, feedAddress)
  const decimals = await feed.decimals()
  console.log("Decimals:", decimals)

  // 4. Scale and print the human-readable price
  const scaled = Number(answer) / 10 ** Number(decimals)
  console.log("Latest price (USD):", scaled)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
