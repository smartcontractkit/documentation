export interface TokenExtraInfo {
  token: string
  symbol: string
  address: string
  rateLimiterConfig?: {
    in?: {
      capacity: string
      isEnabled: boolean
      rate: string
    }
    out?: {
      capacity: string
      isEnabled: boolean
      rate: string
    }
  }
  name?: string
  decimals: number
  poolMechanism?: string
}
