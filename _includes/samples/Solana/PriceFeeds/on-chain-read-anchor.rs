/**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

use anchor_lang::prelude::*;
use chainlink_solana as chainlink;

//Program ID required by Anchor. Replace with your unique program ID once you build your project
declare_id!("HPuUpM1bKbaqx7yY2EJ4hGBaA3QsfP5cofHHK99daz85");

#[account]
pub struct Decimal {
    pub value: i128,
    pub decimals: u32,
}

impl Decimal {
    pub fn new(value: i128, decimals: u32) -> Self {
        Decimal { value, decimals }
    }
}

impl std::fmt::Display for Decimal {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut scaled_val = self.value.to_string();
        if scaled_val.len() <= self.decimals as usize {
            scaled_val.insert_str(
                0,
                &vec!["0"; self.decimals as usize - scaled_val.len()].join(""),
            );
            scaled_val.insert_str(0, "0.");
        } else {
            scaled_val.insert(scaled_val.len() - self.decimals as usize, '.');
        }
        f.write_str(&scaled_val)
    }
}

#[program]
pub mod chainlink_solana_demo {
    use super::*;
        pub fn execute(ctx: Context<Execute>) -> Result<()>  {
        let round = chainlink::latest_round_data(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;

        let description = chainlink::description(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;

        let decimals = chainlink::decimals(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;
        // write the latest price to the program output
        let decimal_print = Decimal::new(round.answer, u32::from(decimals));
        msg!("{} price is {}", description, decimal_print);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Execute<'info> {
    /// CHECK: We're reading data from this chainlink feed account
    pub chainlink_feed: AccountInfo<'info>,
    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>
}
