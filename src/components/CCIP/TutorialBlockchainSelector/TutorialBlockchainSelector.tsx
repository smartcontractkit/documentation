import { useState, useEffect } from "react"
import { getAllNetworks, Environment } from "@config/data/ccip"
import { laneStore } from "@stores/lanes"
import "./TutorialBlockchainSelector.css"

interface TutorialBlockchainSelectorProps {
  onSourceChange?: (chain: string) => void
  onDestinationChange?: (chain: string) => void
}

export const TutorialBlockchainSelector = ({
  onSourceChange,
  onDestinationChange,
}: TutorialBlockchainSelectorProps) => {
  const [environment, setEnvironment] = useState<Environment>(Environment.Testnet)
  const [sourceChain, setSourceChain] = useState<string>("")
  const [destinationChain, setDestinationChain] = useState<string>("")
  const [networks, setNetworks] = useState(getAllNetworks({ filter: Environment.Testnet }))
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Update networks when environment changes
  useEffect(() => {
    setIsLoading(true)
    setNetworks(getAllNetworks({ filter: environment }))
    setTimeout(() => setIsLoading(false), 300)
  }, [environment])

  const handleEnvironmentChange = (newEnvironment: Environment) => {
    // Safeguard: Clear networks and state when environment changes
    const current = laneStore.get()
    laneStore.set({
      ...current,
      sourceChain: "",
      destinationChain: "",
      environment: newEnvironment,
      sourceNetwork: null,
      destinationNetwork: null,
      sourceContracts: {},
      destinationContracts: {},
    })

    setEnvironment(newEnvironment)
    setSourceChain("")
    setDestinationChain("")
  }

  const handleSourceChainSelect = async (chain: string) => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      const networks = getAllNetworks({ filter: environment })
      const selectedNetwork = networks.find((n) => n.chain === chain)

      // Safeguard: Validate network has required fields
      if (selectedNetwork?.chainSelector && selectedNetwork?.name) {
        const current = laneStore.get()
        laneStore.set({
          ...current,
          sourceChain: chain,
          sourceNetwork: selectedNetwork,
        })

        setSourceChain(chain)
        onSourceChange?.(chain)

        if (chain === destinationChain) {
          setDestinationChain("")
          onDestinationChange?.("")
        }
      } else {
        console.warn(`Invalid network configuration for ${chain}`)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDestinationChainSelect = async (chain: string) => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      const networks = getAllNetworks({ filter: environment })
      const selectedNetwork = networks.find((n) => n.chain === chain)

      if (selectedNetwork?.chainSelector && selectedNetwork?.name) {
        const current = laneStore.get()
        laneStore.set({
          ...current,
          destinationChain: chain,
          destinationNetwork: selectedNetwork,
        })

        setDestinationChain(chain)
        onDestinationChange?.(chain)
      } else {
        console.warn(`Invalid network configuration for ${chain}`)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="tutorial-blockchain-selector">
      <div className={`selectors-row ${isLoading ? "is-loading" : ""}`}>
        <div className="selector-group">
          <select
            id="env-select"
            value={environment}
            onChange={(e) => handleEnvironmentChange(e.target.value as Environment)}
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
            onChange={(e) => handleSourceChainSelect(e.target.value)}
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
          <select value={destinationChain} onChange={(e) => handleDestinationChainSelect(e.target.value)}>
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
