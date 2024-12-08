import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { Environment, getAllNetworks } from "@config/data/ccip"
import { ChainSelect } from "./ChainSelect"
import styles from "./TutorialBlockchainSelector.module.css"

export const TutorialBlockchainSelector = () => {
  const state = useStore(laneStore)
  const networks = getAllNetworks({ filter: state.environment })

  const handleEnvironmentChange = (newEnvironment: Environment) => {
    if (newEnvironment === state.environment) return

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
    const network = networks.find((n) => n.chain === chain)
    laneStore.set({
      ...state,
      sourceChain: chain,
      sourceNetwork: network || null,
    })
  }

  const handleDestinationChainChange = (chain: string) => {
    const network = networks.find((n) => n.chain === chain)
    laneStore.set({
      ...state,
      destinationChain: chain,
      destinationNetwork: network || null,
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
          options={networks}
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
          options={networks}
          placeholder="Select Destination"
        />
      </div>
    </div>
  )
}
