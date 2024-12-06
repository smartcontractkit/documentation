import { useState, useEffect } from "react"
import { getAllNetworks, Environment } from "@config/data/ccip"
import { laneStore } from "@stores/lanes"
import "./TutorialBlockchainSelector.css"

interface TutorialBlockchainSelectorProps {
  onSourceChange?: (chain: string) => void
  onDestinationChange?: (chain: string) => void
}

// Mark as client-side component
export const TutorialBlockchainSelector = ({
  onSourceChange,
  onDestinationChange,
}: TutorialBlockchainSelectorProps) => {
  const [environment, setEnvironment] = useState<Environment>(Environment.Testnet)
  const [sourceChain, setSourceChain] = useState<string>("")
  const [destinationChain, setDestinationChain] = useState<string>("")
  const [networks, setNetworks] = useState(getAllNetworks({ filter: Environment.Testnet }))

  // Update networks when environment changes
  useEffect(() => {
    setNetworks(getAllNetworks({ filter: environment }))
  }, [environment])

  // Update store when values change
  useEffect(() => {
    const current = laneStore.get()
    laneStore.set({
      ...current,
      sourceChain,
      destinationChain,
      environment,
    })
  }, [sourceChain, destinationChain, environment])

  const handleSourceChange = (chain: string) => {
    onSourceChange?.(chain)
  }

  const handleDestinationChange = (chain: string) => {
    onDestinationChange?.(chain)
  }

  return (
    <div className="tutorial-blockchain-selector">
      <div className="selectors-row">
        <div className="selector-group">
          <select
            value={environment}
            onChange={(e) => {
              const newEnvironment = e.target.value as Environment
              setEnvironment(newEnvironment)
              setSourceChain("")
              setDestinationChain("")
              handleSourceChange("")
              handleDestinationChange("")
            }}
          >
            <option value={Environment.Testnet}>Testnet Environment</option>
            <option value={Environment.Mainnet}>Mainnet Environment</option>
          </select>
        </div>

        <div className="selector-group">
          <select
            value={sourceChain}
            onChange={(e) => {
              setSourceChain(e.target.value)
              handleSourceChange(e.target.value)
              if (e.target.value === destinationChain) {
                setDestinationChain("")
                handleDestinationChange("")
              }
            }}
          >
            <option value="">Source Blockchain</option>
            {networks.map((network) => (
              <option key={network.chain} value={network.chain}>
                {network.name}
              </option>
            ))}
          </select>
        </div>

        <div className="selector-group">
          <select
            value={destinationChain}
            onChange={(e) => {
              setDestinationChain(e.target.value)
              handleDestinationChange(e.target.value)
            }}
          >
            <option value="">Destination Blockchain</option>
            {networks
              .filter((n) => n.chain !== sourceChain)
              .map((network) => (
                <option key={network.chain} value={network.chain}>
                  {network.name}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  )
}
