import linkNameSymbol from "./reference/linkNameSymbol.json"
import currentChainsMetadata from "./reference/chains.json"
import fetch from "node-fetch"
import { isEqual } from "lodash"
import { writeFile } from "fs/promises"
import { normalize } from "path"
import { format } from "prettier"

interface ChainMetadata {
  name: string
  chain: string
  chainId: number
}

/**
 * Helper function to fetch chains metadata from reference api
 * @returns
 */
const getChainsMetadata = async () => {
  const chainsMetadataSource = "https://chainid.network/chains.json"
  const response = await fetch(chainsMetadataSource)
  return response.json() as Promise<ChainMetadata[]>
}

/**
 * Helper function to filter the chain metadata to keep only the support chain ids. the result in then sorted by chainId asc
 * @returns
 */
const getSupportedChainsMetadata = async () => {
  const chainsMetadata = await getChainsMetadata()
  const supportedChainsMetadata = chainsMetadata.filter((chainMetadata) => {
    if (!chainMetadata.chainId) {
      throw new Error(`Problem with chain reference data ${JSON.stringify(chainMetadata)}`)
    }
    return chainMetadata.chainId.toString() in linkNameSymbol
  })
  // ensure it is sorted
  supportedChainsMetadata.sort((a, b) => a.chainId - b.chainId)
  return supportedChainsMetadata
}

/**
 * Compares current chains metadata with reference one
 * @returns
 */
const compareChainsMetadata = async () => {
  const toBeChainsMetadata = await getSupportedChainsMetadata()
  let result: { isEqual: boolean; toBeChainsMetadata?: ChainMetadata[] }
  if (isEqual(currentChainsMetadata, toBeChainsMetadata)) {
    result = { isEqual: true }
  } else {
    result = { isEqual: false, toBeChainsMetadata }
  }
  return result
}

compareChainsMetadata().then(async (res) => {
  if (!res.isEqual) {
    const chainsTobePath = normalize("./src/scripts/reference/chainsToBe.json")
    await writeFile(
      chainsTobePath,
      format(JSON.stringify(res.toBeChainsMetadata), {
        parser: "json",
        semi: true,
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 120,
      }),
      {
        flag: "w",
      }
    )
  }
})
