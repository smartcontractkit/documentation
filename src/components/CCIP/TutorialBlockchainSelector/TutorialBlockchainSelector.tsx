import { useStore } from "@nanostores/react"
import { laneStore, updateStepProgress } from "@stores/lanes"
import { Environment, getAllNetworks } from "@config/data/ccip"
import type { Network } from "@config/data/ccip/types"
import { ChainSelect } from "./ChainSelect"
import styles from "./TutorialBlockchainSelector.module.css"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import { SetupSection } from "../TutorialSetup/SetupSection"

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

  // Generate unique IDs for each substep
  const getSubStepId = (subStepId: string) => `setup-${subStepId}`

  const checkAndUpdateProgress = () => {
    // Use the latest state from the store instead of component state
    const currentState = laneStore.get()
    const bothChainsSelected = Boolean(
      currentState.sourceChain &&
        currentState.destinationChain &&
        currentState.sourceNetwork &&
        currentState.destinationNetwork
    )
    updateStepProgress("setup", "blockchains-selected", bothChainsSelected)
  }

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

    // Reset progress when environment changes
    updateStepProgress("setup", "blockchains-selected", false)
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

    // Update store first
    laneStore.set({
      ...state,
      ...updates,
    })

    // Then schedule progress check for next frame
    requestAnimationFrame(checkAndUpdateProgress)
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

    // Update store first
    laneStore.set({
      ...state,
      ...updates,
    })

    // Then schedule progress check for next frame
    requestAnimationFrame(checkAndUpdateProgress)
  }

  return (
    <TutorialCard
      title="Blockchain Setup"
      description="Choose the source and destination blockchains for your cross-chain token"
    >
      <SetupSection
        title="Select Your Blockchains"
        description="Choose the source and destination blockchains for your cross-chain token"
      >
        <div className={styles.blockchainSelector}>
          <div id={getSubStepId("browser-setup")} className={styles.environmentToggle}>
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

          <div id={getSubStepId("blockchains-selected")} className={styles.chainSelectors}>
            <ChainSelect
              value={state.sourceChain}
              onChange={handleSourceChainChange}
              options={sourceNetworks}
              placeholder="Select Source"
            />

            <div
              className={styles.arrowContainer}
              role="presentation"
              aria-hidden="true"
              style={{ pointerEvents: "none" }}
            >
              <svg
                className={styles.arrow}
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="arrow-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <g className={styles.arrowGroup}>
                  <path
                    className={styles.arrowPath}
                    d="M9 7l-7 5 7 5M15 7l7 5-7 5"
                    stroke="url(#arrow-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    className={styles.arrowLine}
                    x1="2"
                    y1="12"
                    x2="22"
                    y2="12"
                    stroke="url(#arrow-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
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
      </SetupSection>
    </TutorialCard>
  )
}
