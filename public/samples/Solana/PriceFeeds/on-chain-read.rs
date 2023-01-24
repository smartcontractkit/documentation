/**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

use chainlink_solana as chainlink;

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

struct Decimal {
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

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    _program_id: &Pubkey, // Ignored
    accounts: &[AccountInfo],
    _instruction_data: &[u8], // Ignored
) -> ProgramResult {
    msg!("Chainlink Price Feed Consumer entrypoint");

    let accounts_iter = &mut accounts.iter();

    // This is the account of the price feed data to read from
    let feed_account = next_account_info(accounts_iter)?;
    // This is the chainlink solana program ID
    let chainlink_program = next_account_info(accounts_iter)?;

    let round = chainlink::latest_round_data(
        chainlink_program.clone(),
        feed_account.clone(),
    )?;

    let description = chainlink::description(
        chainlink_program.clone(),
        feed_account.clone(),
    )?;

    let decimals = chainlink::decimals(
        chainlink_program.clone(),
        feed_account.clone(),
    )?;

    let decimal_print = Decimal::new(round.answer, u32::from(decimals));
    msg!("{} price is {}", description, decimal_print);

    Ok(())
}
