import { useStore } from "@nanostores/react"
import { laneStore } from "~/stores/lanes/index.ts"
import type { DeployedContracts } from "~/stores/lanes/index.ts"
import { ReactCopyText } from "~/components/ReactCopyText.tsx"
import { isAddress, AbiCoder, getAddress } from "ethers"

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
      const validAddresses = value.filter((addr): addr is string => typeof addr === "string" && isAddress(addr))
      if (!validAddresses.length) return ""

      return encode
        ? validAddresses.map((addr) => AbiCoder.defaultAbiCoder().encode(["address"], [addr])).join(", ")
        : validAddresses.join(", ")
    }

    if (typeof value === "string" && value) {
      return encode ? AbiCoder.defaultAbiCoder().encode(["address"], [getAddress(value)]) : getAddress(value)
    }

    return ""
  })()

  return <ReactCopyText text={displayAddress} code={code} />
}
