import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { getAllNetworks } from "@config/data/ccip"

interface ChainValueProps {
  type: "source" | "destination"
  bold?: boolean
  required?: boolean
}

export const ChainValue = ({ type, bold = false, required = true }: ChainValueProps) => {
  const state = useStore(laneStore)
  const chainId = type === "source" ? state.sourceChain : state.destinationChain

  if (!chainId) {
    return required ? <span>[Select {type} blockchain]</span> : <span></span>
  }

  const networks = getAllNetworks({ filter: state.environment })
  const network = networks.find((n) => n.chain === chainId)

  if (!network) {
    return required ? <span>Network not found</span> : <span></span>
  }

  return bold ? <strong>{network.name}</strong> : <span>{network.name}</span>
}
