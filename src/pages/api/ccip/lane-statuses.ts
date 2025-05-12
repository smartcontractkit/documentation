import type { APIRoute } from "astro"
import { client } from "@graphql/graphqlClient.ts"
import {
  LaneStatusesFilteredDocument,
  LaneStatusesFilteredQuery,
  LaneStatusesFilteredQueryVariables,
} from "@graphql/generated.ts"
import {
  commonHeaders,
  getEnvironmentAndConfig,
  resolveChainOrThrow,
  checkIfChainIsCursed,
  withTimeout,
  structuredLog,
  LogLevel,
} from "./utils.ts"
import { ChainType, SupportedChain } from "@config/index.ts"
import { getProviderForChain } from "@config/web3Providers.ts"
import { Environment, getSelectorEntry, LaneStatus } from "@config/data/ccip/index.ts"
import { getChainId, getChainTypeAndFamily } from "@features/utils/index.ts"

export const prerender = false
const timeoutCurseCheck = 10000

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const sourceNetworkId = url.searchParams.get("sourceNetworkId")
    const requestId = request.headers.get("x-request-id") || "unknown"

    structuredLog(LogLevel.INFO, {
      message: "Fetching lane statuses",
      requestId,
      sourceNetworkId,
    })

    // Validate required parameters
    if (!sourceNetworkId) {
      return new Response(
        JSON.stringify({
          errorType: "MissingParameters",
          errorMessage: "Missing required parameters: sourceNetworkId is required.",
        }),
        { status: 400, headers: commonHeaders }
      )
    }

    // Determine the environment and load the configuration
    const envConfig = getEnvironmentAndConfig(sourceNetworkId)
    if (!envConfig) {
      structuredLog(LogLevel.ERROR, {
        message: "Invalid source network ID",
        requestId,
        sourceNetworkId,
      })
      return new Response(
        JSON.stringify({
          errorType: "InvalidNetwork",
          errorMessage: `Invalid source network ID: ${sourceNetworkId}`,
        }),
        { status: 400, headers: commonHeaders }
      )
    }

    const { environment, chainsConfig, sourceRouterAddress, destinationNetworkIds } = envConfig

    // Resolve the source chain
    let sourceChain: SupportedChain
    let sourceChainAtlas: string
    let sourceChainType: ChainType
    try {
      sourceChain = resolveChainOrThrow(sourceNetworkId)
      const { chainType } = getChainTypeAndFamily(sourceChain)
      sourceChainType = chainType
      const sourceChainId = getChainId(sourceChain)
      sourceChainAtlas = sourceChainId ? getSelectorEntry(sourceChainId, chainType)?.name || "" : ""
    } catch (error) {
      structuredLog(LogLevel.ERROR, {
        message: "Error resolving source chain",
        requestId,
        sourceNetworkId,
        error: error instanceof Error ? error.message : String(error),
      })
      return new Response(
        JSON.stringify({
          errorType: "InvalidNetwork",
          errorMessage: error.message,
        }),
        { status: 500, headers: commonHeaders }
      )
    }

    // Check if the source chain is cursed
    const sourceProvider = getProviderForChain(sourceChain)
    let isSourceChainCursed = false
    if (sourceChainType === "evm") {
      try {
        isSourceChainCursed = await withTimeout(
          checkIfChainIsCursed(sourceProvider, sourceChain, sourceRouterAddress),
          timeoutCurseCheck,
          `Timeout while checking if source chain ${sourceChain} is cursed`
        )
      } catch (error) {
        structuredLog(LogLevel.ERROR, {
          message: "Error checking if source chain is cursed",
          requestId,
          sourceChain,
          error: error instanceof Error ? error.message : String(error),
        })
        // Continue execution instead of returning 500
      }
    }

    const statuses: Record<string, LaneStatus> = {}
    const failedCurseChecks: string[] = []

    if (isSourceChainCursed) {
      destinationNetworkIds.forEach((id) => {
        statuses[id] = LaneStatus.CURSED
      })
      return new Response(JSON.stringify(statuses), {
        status: 200,
        headers: {
          ...commonHeaders,
          "Cache-Control": "s-max-age=300, stale-while-revalidate",
          "CDN-Cache-Control": "max-age=300",
          "Vercel-CDN-Cache-Control": "max-age=300",
        },
      })
    }

    const validDestinationNetworkIds: string[] = []
    const destinationChecks: Promise<void>[] = []

    const atlasNameToIdMap: Record<string, string> = {}

    for (const id of destinationNetworkIds) {
      const destinationCheck = async () => {
        try {
          const destinationChain = resolveChainOrThrow(id)
          const { chainType: destinationChainType } = getChainTypeAndFamily(destinationChain)
          const destinationChainId = getChainId(destinationChain)
          const destinationChainAtlas = destinationChainId
            ? getSelectorEntry(destinationChainId, destinationChainType)?.name || ""
            : ""

          atlasNameToIdMap[destinationChainAtlas] = id

          // Attempt to get the provider and check if the chain is cursed
          if (destinationChainType === "evm") {
            try {
              const provider = getProviderForChain(destinationChain)
              const destinationRouterAddress = chainsConfig[id].router.address

              const isDestinationCursed = await withTimeout(
                checkIfChainIsCursed(provider, destinationChain, destinationRouterAddress),
                timeoutCurseCheck,
                `Timeout while checking if destination chain ${destinationChain} is cursed`
              )

              if (isDestinationCursed) {
                statuses[id] = LaneStatus.CURSED
              } else {
                validDestinationNetworkIds.push(destinationChainAtlas) // Push if no curse detected
              }
            } catch (innerError) {
              console.error(
                `Error during provider resolution or curse check for destination network ID ${id}:`,
                innerError
              )
              failedCurseChecks.push(id) // Track failed curse checks
              validDestinationNetworkIds.push(destinationChainAtlas) // Push if curse check fails
            }
          }
        } catch (outerError) {
          console.error(`Error resolving destination chain or mapping to atlas for network ID ${id}:`, outerError)
        }
      }

      destinationChecks.push(destinationCheck())
    }

    await Promise.all(destinationChecks)

    if (validDestinationNetworkIds.length === 0) {
      return new Response(JSON.stringify(statuses), {
        status: 200,
        headers: {
          ...commonHeaders,
          "Cache-Control": "s-max-age=300, stale-while-revalidate",
          "CDN-Cache-Control": "max-age=300",
          "Vercel-CDN-Cache-Control": "max-age=300",
        },
      })
    }
    const variables: LaneStatusesFilteredQueryVariables = {
      sourceRouterAddress: sourceRouterAddress.toLowerCase(),
      sourceNetworkId: sourceChainAtlas,
      destinationNetworkIds: validDestinationNetworkIds,
    }

    const response = await client.query<LaneStatusesFilteredQuery>({
      query: LaneStatusesFilteredDocument,
      variables,
    })

    const graphqlReturnedNetworkNames = response.data.allCcipAllLaneStatuses?.nodes.map((node) => node.destNetworkName)
    const missingFromGraphQL = validDestinationNetworkIds.filter(
      (network) => !graphqlReturnedNetworkNames?.includes(network)
    )

    if (failedCurseChecks.length > 0) {
      structuredLog(LogLevel.WARN, {
        message: "Curse check failed for destination chains",
        requestId,
        failedChains: failedCurseChecks,
      })
    }

    if (missingFromGraphQL.length > 0) {
      structuredLog(LogLevel.WARN, {
        message: "Destination chains missing from GraphQL response",
        requestId,
        missingChains: missingFromGraphQL,
      })

      // Add missing networks as OPERATIONAL by default
      missingFromGraphQL.forEach((network) => {
        const networkId = atlasNameToIdMap[network]
        if (networkId) {
          statuses[networkId] = LaneStatus.OPERATIONAL
        }
      })
    }

    if (response.data.allCcipAllLaneStatuses?.nodes.length) {
      for (const node of response.data.allCcipAllLaneStatuses.nodes) {
        let status = LaneStatus.OPERATIONAL

        if (node.successRate === 0) {
          const newStatus = environment === Environment.Testnet ? LaneStatus.MAINTENANCE : LaneStatus.DEGRADED
          status = newStatus
          structuredLog(LogLevel.WARN, {
            message: "Lane status changed due to zero success rate",
            requestId,
            lane: {
              source: sourceChainAtlas,
              destination: node.destNetworkName || "unknown",
              status: newStatus,
              successRate: node.successRate,
            },
          })
        }

        if (node.destNetworkName) {
          const destNetworkId = atlasNameToIdMap[node.destNetworkName]
          if (destNetworkId) {
            statuses[destNetworkId] = status
          } else {
            structuredLog(LogLevel.ERROR, {
              message: "Could not find destination network ID for network name",
              requestId,
              destNetworkName: node.destNetworkName,
            })
          }
        } else {
          structuredLog(LogLevel.ERROR, {
            message: "No destination network name found for lane",
            requestId,
            node,
          })
        }
      }
      return new Response(JSON.stringify(statuses), {
        status: 200,
        headers: {
          ...commonHeaders,
          "Cache-Control": "s-max-age=300, stale-while-revalidate",
          "CDN-Cache-Control": "max-age=300",
          "Vercel-CDN-Cache-Control": "max-age=300",
        },
      })
    } else {
      structuredLog(LogLevel.WARN, {
        message: "No lane statuses found",
        requestId,
        sourceNetworkId,
        destinationNetworkIds,
      })
      destinationNetworkIds.forEach((id) => {
        statuses[id] = LaneStatus.OPERATIONAL
      })

      return new Response(JSON.stringify(statuses), {
        status: 200,
        headers: {
          ...commonHeaders,
          "Cache-Control": "s-max-age=300, stale-while-revalidate",
          "CDN-Cache-Control": "max-age=300",
          "Vercel-CDN-Cache-Control": "max-age=300",
        },
      })
    }
  } catch (error) {
    structuredLog(LogLevel.ERROR, {
      message: "Error fetching lane statuses",
      requestId: request.headers.get("x-request-id") || "unknown",
      error: error instanceof Error ? error.message : String(error),
    })
    return new Response(
      JSON.stringify({
        errorType: "ServerError",
        errorMessage: "Failed to fetch lane statuses",
      }),
      { status: 500, headers: commonHeaders }
    )
  }
}
