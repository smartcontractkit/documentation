import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { Environment, getAllNetworks } from "@config/data/ccip"
import type { Network } from "@config/data/ccip/types"
import { ChainSelect } from "./ChainSelect"
import styles from "./TutorialBlockchainSelector.module.css"

type ChainUpdate = Partial<{
  sourceChain: string
  destinationChain: string
  sourceNetwork: Network | null
  destinationNetwork: Network | null
  sourceContracts: Record<string, string>
  destinationContracts: Record<string, string>
}>

export const TutorialBlockchainSelector = () => {
  const state = useStore(laneStore)
  const allNetworks = getAllNetworks({ filter: state.environment })

  // Filter available networks based on selection
  const sourceNetworks = allNetworks.filter((n) => n.chain !== state.destinationChain)
  const destinationNetworks = allNetworks.filter((n) => n.chain !== state.sourceChain)

  const handleEnvironmentChange = (newEnvironment: Environment) => {
    if (newEnvironment === state.environment) return

    // Reset both chains when environment changes
    laneStore.set({
      ...state,
      environment: newEnvironment,
      sourceChain: "",
      destinationChain: "",
      sourceNetwork: null,
      destinationNetwork: null,
      sourceContracts: {},
      destinationContracts: {},
    })
  }

  const handleSourceChainChange = (chain: string) => {
    const network = allNetworks.find((n) => n.chain === chain)

    const updates: ChainUpdate = {
      sourceChain: chain,
      sourceNetwork: network || null,
    }

    if (chain === state.destinationChain) {
      updates.destinationChain = ""
      updates.destinationNetwork = null
      updates.destinationContracts = {}
    }

    laneStore.set({
      ...state,
      ...updates,
    })
  }

  const handleDestinationChainChange = (chain: string) => {
    const network = allNetworks.find((n) => n.chain === chain)

    const updates: ChainUpdate = {
      destinationChain: chain,
      destinationNetwork: network || null,
    }

    if (chain === state.sourceChain) {
      updates.sourceChain = ""
      updates.sourceNetwork = null
      updates.sourceContracts = {}
    }

    laneStore.set({
      ...state,
      ...updates,
    })
  }

  return (
    <div className={styles.blockchainSelector}>
      <div className={styles.environmentToggle}>
        <button
          className={`${styles.toggleButton} ${state.environment === Environment.Testnet ? styles.active : ""}`}
          onClick={() => handleEnvironmentChange(Environment.Testnet)}
          aria-pressed={state.environment === Environment.Testnet}
        >
          <span className={styles.toggleIcon}>🔧</span>
          Testnet
        </button>
        <button
          className={`${styles.toggleButton} ${state.environment === Environment.Mainnet ? styles.active : ""}`}
          onClick={() => handleEnvironmentChange(Environment.Mainnet)}
          aria-pressed={state.environment === Environment.Mainnet}
        >
          <span className={styles.toggleIcon}>🌐</span>
          Mainnet
        </button>
      </div>

      <div className={styles.chainSelectors}>
        <ChainSelect
          value={state.sourceChain}
          onChange={handleSourceChainChange}
          options={sourceNetworks}
          placeholder="Select Source"
        />

        <div className={styles.arrowContainer}>
          <svg className={styles.arrow} width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12h18M15 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <ChainSelect
          value={state.destinationChain}
          onChange={handleDestinationChainChange}
          options={destinationNetworks}
          placeholder="Select Destination"
        />
      </div>
    </div>
  )
}
