import { GraphQLClient } from "graphql-request"
import type { TypedDocumentNode } from "@graphql-typed-document-node/core"

const GRAPHQL_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
} as const

async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = GRAPHQL_CONFIG.MAX_RETRIES
): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (attempt < maxRetries) {
        console.warn(`[CCIP GraphQL] Request failed, retrying (${attempt}/${maxRetries})...`)
        await new Promise((resolve) => setTimeout(resolve, GRAPHQL_CONFIG.RETRY_DELAY_MS))
      }
    }
  }
  throw lastError
}

let clientInstance: GraphQLClient | null = null

export function getGraphQLClient(): GraphQLClient {
  if (clientInstance) return clientInstance

  const endpoint = import.meta.env.CCIP_GRAPHQL_ENDPOINT
  const apiKey = import.meta.env.CCIP_GRAPHQL_API_KEY

  if (!endpoint) throw new Error("CCIP_GRAPHQL_ENDPOINT is not configured")
  if (!apiKey) throw new Error("CCIP_GRAPHQL_API_KEY is not configured")

  clientInstance = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `${apiKey}`,
    },
  })

  return clientInstance
}

export async function executeGraphQLQuery<TResult, TVariables extends Record<string, unknown>>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables
): Promise<TResult> {
  const client = getGraphQLClient()
  return executeWithRetry(() => client.request<TResult>(document, variables))
}
