import type { APIRoute } from "astro"
import { client } from "@graphql/graphqlClient"
import {
  LaneStatusesFilteredDocument,
  LaneStatusesFilteredQuery,
  LaneStatusesFilteredQueryVariables,
} from "@graphql/generated"
import { commonHeaders, getEnvironmentAndConfig, resolveChainOrThrow, checkIfChainIsCursed, withTimeout } from "./utils"
import { SupportedChain } from "@config"
import { getProviderForChain } from "@config/web3Providers"
import { Environment, getSelectorConfig, LaneStatus } from "@config/data/ccip"
import { getChainId } from "@features/utils"

export const prerender = false
const timeoutCurseCheck = 10000

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const sourceNetworkId = url.searchParams.get("sourceNetworkId")
    console.log(`Fetching lane statuses for ${sourceNetworkId}`)

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
      console.error(`Invalid source network ID: ${sourceNetworkId}`)
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
    try {
      sourceChain = resolveChainOrThrow(sourceNetworkId)
      const sourceChainId = getChainId(sourceChain)
      sourceChainAtlas = sourceChainId ? getSelectorConfig(sourceChainId)?.name || "" : ""
    } catch (error) {
      console.error(`Error resolving source chain for ID ${sourceNetworkId}:`, error)
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
    const isSourceChainCursed = await withTimeout(
      checkIfChainIsCursed(sourceProvider, sourceChain, sourceRouterAddress),
      timeoutCurseCheck,
      `Timeout while checking if source chain ${sourceChain} is cursed`
    )

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
          const destinationChainId = getChainId(destinationChain)
          const destinationChainAtlas = destinationChainId ? getSelectorConfig(destinationChainId)?.name || "" : ""

          atlasNameToIdMap[destinationChainAtlas] = id

          // Attempt to get the provider and check if the chain is cursed
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
      console.warn(`Curse check failed for the following destination chains: ${failedCurseChecks.join(", ")}`)
    }

    if (missingFromGraphQL.length > 0) {
      console.warn(
        `The following destination chains were not returned by the GraphQL query: ${missingFromGraphQL.join(", ")}`
      )

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
          status = environment === Environment.Testnet ? LaneStatus.MAINTENANCE : LaneStatus.DEGRADED
        }

        if (node.destNetworkName) {
          const destNetworkId = atlasNameToIdMap[node.destNetworkName]
          if (destNetworkId) {
            statuses[destNetworkId] = status
          } else {
            console.error(`Could not find destination network ID for ${node.destNetworkName}`)
          }
        } else {
          console.error(`No destination network name found for lane ${node}`)
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
      console.warn(
        `No lane statuses found for source network ID ${sourceNetworkId} and destination network IDs ${destinationNetworkIds}`
      )
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
    console.error("Error fetching lane statuses:", error)
    return new Response(
      JSON.stringify({
        errorType: "ServerError",
        errorMessage: "Failed to fetch lane statuses",
      }),
      { status: 500, headers: commonHeaders }
    )
  }
}
