/**
 * Atlas + DappControl addresses for SVR auctions, keyed by chain page.
 * Sourced from the reference-data-directory `dAppControl` entries, where
 * `destination` is the Atlas contract. Tempo is absent: it has SVR but no Atlas.
 */
export interface AtlasContracts {
  atlas: string
  dappControl: string
  /** Block explorer URL template; `%s` is replaced with the address. */
  explorerUrl: string
}

export const ATLAS_CONTRACTS: Record<string, AtlasContracts> = {
  base: {
    atlas: "0x583dcFef0D240DC80753F0F0B26513feE27D9B77",
    dappControl: "0xa5E1a36938769cbd5a26f5e19D8FCB379f597c83",
    explorerUrl: "https://basescan.org/address/%s",
  },
  arbitrum: {
    atlas: "0x8ad1aE9D97C79aA68A0a151E83ff3942f68F86C1",
    dappControl: "0xe15BBa987C002ecc3586e81244517877D294d291",
    explorerUrl: "https://arbiscan.io/address/%s",
  },
  "bnb-chain": {
    atlas: "0x21B7d28B882772A1Cfe633Daee6f42ebb95DeC4E",
    dappControl: "0x7D50b32444609A9B53BcF208c159C8d0d0767835",
    explorerUrl: "https://bscscan.com/address/%s",
  },
  monad: {
    atlas: "0x2DA28fedc4643c787CB5c5e84fa6AaDb596875E8",
    dappControl: "0xa40d9f38621b4ffb2181508b973519e8133951c0",
    explorerUrl: "https://monadvision.com/address/%s",
  },
  arc: {
    atlas: "0x3b7B38362bB7E2F000Cd2432343F3483F785F435",
    dappControl: "0x5210729C598746F2bD7A22d5B66A7cDE72f462E7",
    explorerUrl: "https://explorer.arc.io/address/%s",
  },
  hyperevm: {
    atlas: "0x137B8Fdf027598f1Bf5F2d60cB081bD8539BD8c7",
    dappControl: "0x2ac121f89b39BA231CBF8Abf7aC6D0140f6B8821",
    explorerUrl: "https://hyperevmscan.io/address/%s",
  },
  ink: {
    atlas: "0x3efbaBE0ee916A4677D281c417E895a3e7411Ac2",
    dappControl: "0xB0B992eaed9CbB37667E25D9C5214CDEB406Bd13",
    explorerUrl: "https://explorer.inkonchain.com/address/%s",
  },
  robinhood: {
    atlas: "0x3efbaBE0ee916A4677D281c417E895a3e7411Ac2",
    dappControl: "0xC9eACB1CF3bBe2874ccF5d25737c418Cfb944340",
    explorerUrl: "https://robinhoodchain.blockscout.com/address/%s",
  },
  unichain: {
    atlas: "0xbAf4fBB4FD65199D5795Ee4990B9661387ce3B6e",
    dappControl: "0x763D32a9EDf2F1684F1Dee50AB6CcCa5b68EF655",
    explorerUrl: "https://uniscan.xyz/address/%s",
  },
}

/** Returns the Atlas contracts for a chain page, or null when Atlas is not deployed. */
export function getAtlasContracts(chainPage?: string): AtlasContracts | null {
  if (!chainPage) return null
  return ATLAS_CONTRACTS[chainPage] ?? null
}
