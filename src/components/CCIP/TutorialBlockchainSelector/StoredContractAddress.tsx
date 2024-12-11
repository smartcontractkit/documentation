import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import type { DeployedContracts } from "@stores/lanes"
import { ReactCopyText } from "@components/ReactCopyText"
import { utils } from "ethers"

type AddressFields = Extract<keyof DeployedContracts, "token" | "tokenPool" | "tokenPools">

interface StoredContractAddressProps {
  type: AddressFields
  chain: "source" | "destination"
  code?: boolean
  encode?: boolean
}

export const StoredContractAddress = ({ type, chain, code = true, encode = false }: StoredContractAddressProps) => {
  const state = useStore(laneStore)
  const contracts = chain === "source" ? state.sourceContracts : state.destinationContracts
  const value = contracts[type]

  // Format and encode addresses
  const displayAddress = (() => {
    if (!value) return ""

    if (Array.isArray(value)) {
      const validAddresses = value.filter((addr): addr is string => typeof addr === "string" && utils.isAddress(addr))
      if (!validAddresses.length) return ""

      return encode
        ? validAddresses.map((addr) => utils.defaultAbiCoder.encode(["address"], [addr])).join(", ")
        : validAddresses.join(", ")
    }

    if (typeof value === "string" && value) {
      return encode ? utils.defaultAbiCoder.encode(["address"], [utils.getAddress(value)]) : utils.getAddress(value)
    }

    return ""
  })()

  return <ReactCopyText text={displayAddress} code={code} />
}
