/**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

import * as anchor from "@project-serum/anchor";
import { OCR2Feed } from "@chainlink/solana-sdk";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const CHAINLINK_FEED_ADDRESS = "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
  const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
  const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS); // SOL-USD Devnet Feed

  // load the data feed account
  const dataFeed = await OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);

  // listen for events agains the price feed, and grab the latest rounds price data
  dataFeed.onRound(feedAddress, (event) => {
    console.log(event.answer.toNumber());
  });

  // block execution and keep waiting for events to be emitted with price data
  await new Promise(function () {});
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
