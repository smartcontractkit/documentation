import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import type { DeployedContracts } from "@stores/lanes"
import { ReactCopyText } from "@components/ReactCopyText"
import { ethers } from "ethers"

interface StoredContractAddressProps {
  type: keyof DeployedContracts
  chain: "source" | "destination"
  required?: boolean
  encode?: boolean
}

export const StoredContractAddress = ({ type, chain, required = true, encode = false }: StoredContractAddressProps) => {
  const state = useStore(laneStore)
  const contracts = chain === "source" ? state.sourceContracts : state.destinationContracts
  const address = contracts[type]

  if (!address) {
    return required ? <code>[No address saved yet]</code> : null
  }

  const displayAddress = encode ? ethers.utils.defaultAbiCoder.encode(["address"], [address]) : address

  return <ReactCopyText text={displayAddress} code={true} />
}
