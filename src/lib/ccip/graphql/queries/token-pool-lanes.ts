import { gql } from "../__generated__/index.ts"

export const TOKEN_POOL_LANES_WITH_POOLS_QUERY = gql(`
  query GetTokenPoolLanesWithPools(
    $first: Int
    $offset: Int
    $condition: CcipTokenPoolLanesWithPoolCondition
    $filter: CcipTokenPoolLanesWithPoolFilter
  ) {
    allCcipTokenPoolLanesWithPools(
      first: $first
      offset: $offset
      condition: $condition
      filter: $filter
      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]
    ) {
      nodes {
        network
        token
        tokenSymbol
        tokenDecimals
        remoteNetworkName
        remoteToken
        removed
        typeAndVersion
        tokenPool
        inboundCapacity
        inboundRate
        inboundEnabled
        outboundCapacity
        outboundRate
        outboundEnabled
        customInboundCapacity
        customInboundRate
        customInboundEnabled
        customOutboundCapacity
        customOutboundRate
        customOutboundEnabled
      }
      totalCount
    }
  }
`)
