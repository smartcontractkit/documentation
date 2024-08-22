export interface TokenExtraInfo {
  token: string
  symbol: string
  address: string
  rateLimiterConfig: { capacity: string; isEnabled: boolean; rate: string }
  name?: string
  decimals: number
  poolMechanism?: string
}
