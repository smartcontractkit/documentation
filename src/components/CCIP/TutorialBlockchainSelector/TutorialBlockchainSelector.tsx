import { useState, useEffect } from "react"
import { getAllNetworks, Environment } from "@config/data/ccip"
import "./TutorialBlockchainSelector.css"

interface TutorialBlockchainSelectorProps {
  onSourceChange: (chain: string) => void
  onDestinationChange: (chain: string) => void
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
              onSourceChange("")
              onDestinationChange("")
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
              onSourceChange(e.target.value)
              if (e.target.value === destinationChain) {
                setDestinationChain("")
                onDestinationChange("")
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
              onDestinationChange(e.target.value)
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
