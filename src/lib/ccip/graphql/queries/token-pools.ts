import { gql } from "../__generated__/index.ts"

export const TOKEN_POOLS_QUERY = gql(`
  query GetTokenPools(
    $first: Int
    $offset: Int
    $condition: CcipTokenPoolCondition
    $filter: CcipTokenPoolFilter
  ) {
    allCcipTokenPools(
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
        typeAndVersion
        minBlockConfirmations
        tokenPool
      }
      totalCount
    }
  }
`)
