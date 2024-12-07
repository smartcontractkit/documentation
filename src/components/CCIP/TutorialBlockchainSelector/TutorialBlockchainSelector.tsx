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
  const [isLoading, setIsLoading] = useState(false)

  // Update networks when environment changes
  useEffect(() => {
    setIsLoading(true)
    setNetworks(getAllNetworks({ filter: environment }))
    setTimeout(() => setIsLoading(false), 300) // Smooth transition
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
      <div className={`selectors-row ${isLoading ? "is-loading" : ""}`}>
        <div className="selector-group">
          <select
            id="env-select"
            value={environment}
            onChange={(e) => {
              const newEnvironment = e.target.value as Environment
              setEnvironment(newEnvironment)
              setSourceChain("")
              setDestinationChain("")
            }}
            className="env-select"
          >
            <option value={Environment.Testnet}>Testnet Environment</option>
            <option value={Environment.Mainnet}>Mainnet Environment</option>
          </select>
        </div>

        <div className="selector-group">
          <select
            value={sourceChain}
            title="Select the blockchain where your token will be deployed"
            onChange={(e) => {
              setSourceChain(e.target.value)
              if (e.target.value === destinationChain) {
                setDestinationChain("")
              }
            }}
            className={sourceChain ? "has-value" : ""}
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
