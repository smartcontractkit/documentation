// FuturesFetch.rs — Fetch and decode a Futures (v14) report with the Rust SDK.
//
// Usage:
//   export API_KEY="..."
//   export API_SECRET="..."
//   cargo run 0x000ebfe7b7560e1866ef91d4607ce5ee7474382794e5ec755f38b70b1f30e647
use chainlink_data_streams_report::feed_id::ID;
use chainlink_data_streams_report::report::{ decode_full_report, v14::ReportDataV14 };
use chainlink_data_streams_sdk::client::Client;
use chainlink_data_streams_sdk::config::Config;
use std::env;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: cargo run [FeedID]");
        std::process::exit(1);
    }
    let feed_id_input = &args[1];

    let api_key = env::var("API_KEY").expect("API_KEY must be set");
    let api_secret = env::var("API_SECRET").expect("API_SECRET must be set");

    let config = Config::new(
        api_key,
        api_secret,
        "https://api.testnet-dataengine.chain.link".to_string(),
        "wss://api.testnet-dataengine.chain.link/ws".to_string(),
    )
    .build()?;

    let client = Client::new(config)?;

    let feed_id = ID::from_hex_str(feed_id_input)?;

    let response = client.get_latest_report(feed_id).await?;

    let full_report = hex::decode(&response.report.full_report[2..])?;
    let (_report_context, report_blob) = decode_full_report(&full_report)?;
    let report_data = ReportDataV14::decode(&report_blob)?;

    println!("\nDecoded V14 Report for Stream ID {}:", feed_id_input);
    println!("------------------------------------------");
    println!("Mid Price             : {}", report_data.mid_price);
    println!("Bid Price             : {}", report_data.bid_price);
    println!("Ask Price             : {}", report_data.ask_price);
    println!("Expiry Time           : {}", report_data.expiry_time);
    println!("First Day of Notice   : {}", report_data.first_day_of_notice);
    println!("Last Seen TimestampNs : {}", report_data.last_seen_timestamp_ns);
    println!("Market Status         : {}", report_data.market_status);
    println!("Contract Month        : {}", report_data.contract_month);
    println!("Goldman Roll Price    : {}", report_data.goldman_roll_price);
    println!("Current Business Day  : {}", report_data.current_business_day);
    println!("Interp Goldman Roll   : {}", report_data.interpolated_goldman_roll_price);
    println!("------------------------------------------");

    Ok(())
}
