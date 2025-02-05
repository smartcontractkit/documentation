import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { getAllNetworks } from "@config/data/ccip"
import { ReactCopyText } from "@components/ReactCopyText"

type ContractType = "registryModule" | "tokenAdminRegistry" | "router" | "armProxy" | "chainSelector"

interface NetworkAddressProps {
  chain: "source" | "destination"
  type: ContractType
  required?: boolean
}

export const NetworkAddress = ({ chain, type, required = true }: NetworkAddressProps) => {
  const state = useStore(laneStore)
  const chainId = chain === "source" ? state.sourceChain : state.destinationChain

  if (!chainId) return required ? <code>[Select {chain} blockchain first]</code> : null

  const networks = getAllNetworks({ filter: state.environment })
  const network = networks.find((n) => n.chain === chainId)

  if (!network) return required ? <code>Network not found</code> : null

  let address: string | undefined
  switch (type) {
    case "registryModule":
      address = network.registryModule
      break
    case "tokenAdminRegistry":
      address = network.tokenAdminRegistry
      break
    case "router":
      address = network.router?.address
      break
    case "armProxy":
      address = network.armProxy?.address
      break
    case "chainSelector":
      address = network.chainSelector
      break
  }

  if (!address) return required ? <code>Contract address not available</code> : null

  return (
    <ReactCopyText
      text={address}
      code={true}
      eventName="tutorial_copy_address"
      additionalInfo={{
        chain: chainId,
        contractType: type,
      }}
    />
  )
}
