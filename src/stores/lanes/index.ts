import { atom, computed } from "nanostores"
import { Environment } from "@config/data/ccip"
import type { Network } from "@config/data/ccip/types"
import { utils } from "ethers"

export type DeployedContracts = {
  token?: string
  tokenPool?: string
  tokenPools?: string[]
  registered?: boolean
  configured?: boolean
  poolType?: "lock" | "burn"
}

export interface TokenBucketState {
  tokens: string
  lastUpdated: number
  isEnabled: boolean
  capacity: string
  rate: string
}

export const TUTORIAL_STEPS = {
  setup: {
    id: "setup",
    title: "Setup",
    subSteps: {
      "browser-setup": "Web Browser Setup",
      "gas-tokens": "Native Gas Tokens Ready",
      "blockchains-selected": "Blockchains Selected",
      "contracts-imported": "Contracts Imported",
    },
  },
  sourceChain: {
    id: "sourceChain",
    title: "Source Chain",
    subSteps: {
      "token-deployed": "Token Deployed",
      "admin-claimed": "Admin Role Claimed",
      "admin-accepted": "Admin Role Accepted",
      "pool-deployed": "Pool Deployed",
      "pool-registered": "Pool Registered",
    },
  },
  destinationChain: {
    id: "destinationChain",
    title: "Destination Chain",
    subSteps: {
      "dest-token-deployed": "Token Deployed",
      "admin-claimed": "Admin Role Claimed",
      "admin-accepted": "Admin Role Accepted",
      "dest-pool-deployed": "Pool Deployed",
      "dest-pool-registered": "Pool Registered",
    },
  },
  sourceConfig: {
    id: "sourceConfig",
    title: "Source Configuration",
    subSteps: {
      "source-privileges": "Grant Burn and Mint Privileges",
      "source-pool-config": "Configure Pool",
      "source-verification": "Verify Configuration",
    },
  },
  destinationConfig: {
    id: "destinationConfig",
    title: "Destination Configuration",
    subSteps: {
      "dest-privileges": "Grant Burn and Mint Privileges",
      "dest-pool-config": "Configure Pool",
      "dest-verification": "Verify Configuration",
    },
  },
} as const

export type StepId = keyof typeof TUTORIAL_STEPS
export type SubStepId<T extends StepId> = keyof (typeof TUTORIAL_STEPS)[T]["subSteps"]

export interface RateLimiterConfig {
  enabled: boolean
  capacity: string
  rate: string
}

export type RateLimits = {
  inbound: RateLimiterConfig
  outbound: RateLimiterConfig
}

export type LaneState = {
  sourceChain: string
  destinationChain: string
  environment: Environment
  sourceNetwork: Network | null
  destinationNetwork: Network | null
  sourceContracts: DeployedContracts
  destinationContracts: DeployedContracts
  progress: Record<StepId, Record<string, boolean>>
  inboundRateLimiter: TokenBucketState | null
  outboundRateLimiter: TokenBucketState | null
  sourceRateLimits: RateLimits | null
  destinationRateLimits: RateLimits | null
  currentStep?: StepId
}

// Add performance monitoring
const monitorStoreUpdate = (action: string, details: Record<string, unknown>) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[StoreAction] ${action}:`, {
      ...details,
      timestamp: new Date().toISOString(),
    })
  }
}

// Define conditions at the top level
const conditions = [
  // Prerequisites conditions
  {
    stepId: "setup" as StepId,
    subStepId: "browser-setup",
    check: (state: LaneState) => state.progress.setup?.["browser-setup"] === true,
    dependencies: [] as StepId[],
  },
  {
    stepId: "setup" as StepId,
    subStepId: "gas-tokens",
    check: (state: LaneState) => state.progress.setup?.["gas-tokens"] === true,
    dependencies: ["setup"] as StepId[],
  },
  {
    stepId: "setup" as StepId,
    subStepId: "blockchains-selected",
    check: (state: LaneState) => {
      const sourceSelected = Boolean(state.sourceChain && state.sourceNetwork)
      const destSelected = Boolean(state.destinationChain && state.destinationNetwork)
      return sourceSelected && destSelected
    },
    dependencies: ["setup"] as StepId[],
  },
  {
    stepId: "setup" as StepId,
    subStepId: "contracts-imported",
    check: (state: LaneState) => state.progress.setup?.["contracts-imported"] === true,
    dependencies: ["setup"] as StepId[],
  },
  // Token deployment conditions
  {
    stepId: "sourceChain" as StepId,
    subStepId: "token-deployed",
    check: (state: LaneState) => {
      const hasToken = !!state.sourceContracts.token && utils.isAddress(state.sourceContracts.token)
      return hasToken
    },
    dependencies: ["setup"] as StepId[],
  },
  {
    stepId: "sourceChain" as StepId,
    subStepId: "pool-deployed",
    check: (state: LaneState) => {
      const hasPool = !!state.sourceContracts.tokenPool && utils.isAddress(state.sourceContracts.tokenPool)
      return hasPool
    },
    dependencies: ["sourceChain"] as StepId[],
  },
  {
    stepId: "sourceChain" as StepId,
    subStepId: "pool-registered",
    check: (state: LaneState) => !!state.sourceContracts.registered,
    dependencies: ["sourceChain"] as StepId[],
  },
  {
    stepId: "destinationChain" as StepId,
    subStepId: "dest-token-deployed",
    check: (state: LaneState) => !!state.destinationContracts.token,
    dependencies: ["setup"] as StepId[],
  },
  {
    stepId: "destinationChain" as StepId,
    subStepId: "dest-pool-deployed",
    check: (state: LaneState) => {
      const hasPool = !!state.destinationContracts.tokenPool && utils.isAddress(state.destinationContracts.tokenPool)
      return hasPool
    },
    dependencies: ["destinationChain"] as StepId[],
  },
  {
    stepId: "destinationChain" as StepId,
    subStepId: "dest-pool-registered",
    check: (state: LaneState) => !!state.destinationContracts.registered,
    dependencies: ["destinationChain"] as StepId[],
  },
  {
    stepId: "sourceChain" as StepId,
    subStepId: "admin-claimed",
    check: (state: LaneState) => state.progress.sourceChain?.["admin-claimed"] === true,
    dependencies: ["sourceChain"] as StepId[],
  },
  {
    stepId: "sourceChain" as StepId,
    subStepId: "admin-accepted",
    check: (state: LaneState) => state.progress.sourceChain?.["admin-accepted"] === true,
    dependencies: ["sourceChain"] as StepId[],
  },
  {
    stepId: "destinationChain" as StepId,
    subStepId: "admin-claimed",
    check: (state: LaneState) => state.progress.destinationChain?.["admin-claimed"] === true,
    dependencies: ["destinationChain"] as StepId[],
  },
  {
    stepId: "destinationChain" as StepId,
    subStepId: "admin-accepted",
    check: (state: LaneState) => state.progress.destinationChain?.["admin-accepted"] === true,
    dependencies: ["destinationChain"] as StepId[],
  },
  {
    stepId: "sourceConfig" as StepId,
    subStepId: "source-privileges",
    check: (state: LaneState) => state.progress.sourceConfig?.["source-privileges"] === true,
    dependencies: ["sourceChain"],
  },
  {
    stepId: "sourceConfig" as StepId,
    subStepId: "source-pool-config",
    check: (state: LaneState) => state.progress.sourceConfig?.["source-pool-config"] === true,
    dependencies: ["sourceChain"],
  },
  {
    stepId: "sourceConfig" as StepId,
    subStepId: "source-verification",
    check: (state: LaneState) => state.progress.sourceConfig?.["source-verification"] === true,
    dependencies: ["sourceChain"],
  },
  {
    stepId: "destinationConfig" as StepId,
    subStepId: "dest-privileges",
    check: (state: LaneState) => state.progress.destinationConfig?.["dest-privileges"] === true,
    dependencies: ["destinationChain"],
  },
  {
    stepId: "destinationConfig" as StepId,
    subStepId: "dest-pool-config",
    check: (state: LaneState) => state.progress.destinationConfig?.["dest-pool-config"] === true,
    dependencies: ["destinationChain"],
  },
  {
    stepId: "destinationConfig" as StepId,
    subStepId: "dest-verification",
    check: (state: LaneState) => state.progress.destinationConfig?.["dest-verification"] === true,
    dependencies: ["destinationChain"],
  },
]

// Helper function to check if prerequisites are complete
export const arePrerequisitesComplete = (state: LaneState): boolean => {
  return (
    state.progress.setup?.["browser-setup"] === true &&
    state.progress.setup?.["gas-tokens"] === true &&
    state.progress.setup?.["blockchains-selected"] === true &&
    state.progress.setup?.["contracts-imported"] === true
  )
}

// Create individual atoms for each step's progress
export const setupProgressStore = atom<Record<string, boolean>>({})
export const sourceChainProgressStore = atom<Record<string, boolean>>({})
export const destinationChainProgressStore = atom<Record<string, boolean>>({})
export const sourceConfigProgressStore = atom<Record<string, boolean>>({})
export const destinationConfigProgressStore = atom<Record<string, boolean>>({})

// Computed store that combines all progress
export const progressStore = computed(
  [
    setupProgressStore,
    sourceChainProgressStore,
    destinationChainProgressStore,
    sourceConfigProgressStore,
    destinationConfigProgressStore,
  ],
  (setup, sourceChain, destinationChain, sourceConfig, destinationConfig) => ({
    setup,
    sourceChain,
    destinationChain,
    sourceConfig,
    destinationConfig,
  })
)

// Main store without progress
export const laneStore = atom<Omit<LaneState, "progress">>({
  sourceChain: "",
  destinationChain: "",
  environment: Environment.Testnet,
  sourceNetwork: null,
  destinationNetwork: null,
  sourceContracts: {},
  destinationContracts: {},
  inboundRateLimiter: null,
  outboundRateLimiter: null,
  sourceRateLimits: {
    inbound: { enabled: false, capacity: "", rate: "" },
    outbound: { enabled: false, capacity: "", rate: "" },
  },
  destinationRateLimits: {
    inbound: { enabled: false, capacity: "", rate: "" },
    outbound: { enabled: false, capacity: "", rate: "" },
  },
})

// Helper to get the correct store for a step with type safety
const getStoreForStep = (stepId: StepId) => {
  switch (stepId) {
    case "setup":
      return setupProgressStore
    case "sourceChain":
      return sourceChainProgressStore
    case "destinationChain":
      return destinationChainProgressStore
    case "sourceConfig":
      return sourceConfigProgressStore
    case "destinationConfig":
      return destinationConfigProgressStore
    default:
      throw new Error(`Invalid step ID: ${stepId}`)
  }
}

// Standard progress update function for all checkboxes
export const updateStepProgress = (stepId: string, subStepId: string, completed: boolean) => {
  const startTime = Date.now()
  const store = getStoreForStep(stepId as StepId)
  const current = store.get()

  if (current[subStepId] === completed) {
    monitorStoreUpdate("SkippedUpdate", {
      stepId,
      subStepId,
      reason: "No change needed",
      duration: Date.now() - startTime,
    })
    return
  }

  monitorStoreUpdate("StartUpdate", {
    stepId,
    subStepId,
    completed,
    currentState: current,
  })

  // Batch updates to minimize renders
  const updates = new Map()

  // Update progress store
  updates.set(store, {
    ...current,
    [subStepId]: completed,
  })

  // For pool registration, also update contract state
  if (
    (stepId === "sourceChain" && subStepId === "pool-registered") ||
    (stepId === "destinationChain" && subStepId === "dest-pool-registered")
  ) {
    const chain = stepId === "sourceChain" ? "source" : "destination"
    const contractsKey = `${chain}Contracts` as const
    const currentState = laneStore.get()

    updates.set(laneStore, {
      ...currentState,
      [contractsKey]: {
        ...currentState[contractsKey],
        registered: completed,
      },
    })
  }

  // Apply all updates in a single batch
  updates.forEach((value, store) => {
    store.set(value)
  })

  monitorStoreUpdate("CompleteUpdate", {
    stepId,
    subStepId,
    duration: Date.now() - startTime,
  })
}

// Helper to update progress for a specific step (internal use only)
function updateProgressForStep(stepId: StepId, updates: Record<string, boolean>) {
  const store = getStoreForStep(stepId)
  const current = store.get()
  store.set({
    ...current,
    ...updates,
  })
}

// Utility function to handle contract progress updates
const updateContractProgress = (type: keyof DeployedContracts, chain: "source" | "destination", value: string) => {
  const isValidAddress = Boolean(value) && utils.isAddress(value)

  if (type === "token") {
    updateProgressForStep(chain === "source" ? "sourceChain" : "destinationChain", {
      [chain === "source" ? "token-deployed" : "dest-token-deployed"]: isValidAddress,
    })
  } else if (type === "tokenPool") {
    updateProgressForStep(chain === "source" ? "sourceChain" : "destinationChain", {
      [chain === "source" ? "pool-deployed" : "dest-pool-deployed"]: isValidAddress,
    })
  }
}

export const setSourceContract = (type: keyof DeployedContracts, value: string) => {
  const currentState = laneStore.get()
  monitorStoreUpdate("setSourceContract", { type, value })

  laneStore.set({
    ...currentState,
    sourceContracts: {
      ...currentState.sourceContracts,
      [type]: value,
    },
  })

  updateContractProgress(type, "source", value)
}

export const setDestinationContract = (type: keyof DeployedContracts, value: string) => {
  const currentState = laneStore.get()
  monitorStoreUpdate("setDestinationContract", { type, value })

  laneStore.set({
    ...currentState,
    destinationContracts: {
      ...currentState.destinationContracts,
      [type]: value,
    },
  })

  updateContractProgress(type, "destination", value)
}

// Helper to subscribe to specific step's progress
export const subscribeToStepProgress = (stepId: StepId, callback: (progress: Record<string, boolean>) => void) => {
  const store = getStoreForStep(stepId)
  return store.subscribe(callback)
}

export const setRateLimiterState = (type: "inbound" | "outbound", state: TokenBucketState | null) => {
  const current = laneStore.get()
  laneStore.set({
    ...current,
    [type === "inbound" ? "inboundRateLimiter" : "outboundRateLimiter"]: state,
  })
}

export const setRemotePools = (chain: "source" | "destination", pools: string[]) => {
  const current = laneStore.get()
  const contracts = chain === "source" ? "sourceContracts" : "destinationContracts"
  laneStore.set({
    ...current,
    [contracts]: {
      ...current[contracts],
      tokenPool: pools[0],
      tokenPools: pools,
    },
  })
}

export const validateRateLimits = (limits: RateLimits): boolean => {
  if (!limits) return false

  const validateConfig = (config: RateLimiterConfig) => {
    if (config.enabled) {
      try {
        // Parse as BigInt and validate
        const capacity = BigInt(config.capacity || "0")
        const rate = BigInt(config.rate || "0")

        // Ensure it's a valid uint128
        const MAX_UINT128 = BigInt(2) ** BigInt(128) - BigInt(1)
        return capacity >= 0n && capacity <= MAX_UINT128 && rate >= 0n && rate <= MAX_UINT128
      } catch (e) {
        console.error("Rate limit validation error:", e)
        return false
      }
    }
    return true
  }

  return validateConfig(limits.inbound) && validateConfig(limits.outbound)
}

// Helper to update rate limits with validation
export const updateRateLimits = (
  chain: "source" | "destination",
  type: "inbound" | "outbound",
  updates: Partial<RateLimiterConfig>
) => {
  const current = laneStore.get()
  const rateLimitsKey = `${chain}RateLimits` as const
  const currentLimits = current[rateLimitsKey] ?? {
    inbound: { enabled: false, capacity: "", rate: "" },
    outbound: { enabled: false, capacity: "", rate: "" },
  }

  const newLimits = {
    ...currentLimits,
    [type]: {
      ...currentLimits[type],
      ...updates,
    },
  }

  if (validateRateLimits(newLimits)) {
    laneStore.set({
      ...current,
      [rateLimitsKey]: newLimits,
    })
    return true
  }
  return false
}

// Helper function to get complete state
const getCompleteState = (): LaneState => ({
  ...laneStore.get(),
  progress: progressStore.get(),
})

// Update checkSpecificProgress to optionally accept state
const checkSpecificProgress = (conditionsToCheck: typeof conditions, providedState?: LaneState) => {
  const state = providedState || getCompleteState()

  // Only check dependent conditions if prerequisites are complete
  if (!arePrerequisitesComplete(state) && !conditionsToCheck.every((c) => c.stepId === "setup")) {
    return
  }

  for (const condition of conditionsToCheck) {
    const startTime = performance.now()
    const isComplete = condition.check(state)

    monitorStoreUpdate("ConditionCheck", {
      stepId: condition.stepId,
      subStepId: condition.subStepId,
      isComplete,
      duration: Math.round(performance.now() - startTime),
    })

    // Update progress if needed
    if (isComplete !== state.progress[condition.stepId]?.[condition.subStepId]) {
      updateProgressForStep(condition.stepId, { [condition.subStepId]: isComplete })
    }
  }
}

// Update the progress check function to be more focused
export const checkProgress = (stepId: StepId, subStepId: string) => {
  const state = getCompleteState()
  monitorStoreUpdate("StartUpdate", { stepId, subStepId, currentState: state })

  // For setup steps, check all setup conditions and their dependencies
  if (stepId === "setup") {
    const setupConditions = conditions.filter((condition) => condition.stepId === "setup")
    checkSpecificProgress(setupConditions, state)

    // If all prerequisites are complete, check dependent conditions
    if (arePrerequisitesComplete(state)) {
      const dependentConditions = conditions.filter((condition) => condition.dependencies.includes("setup"))
      checkSpecificProgress(dependentConditions, state)
    }
  } else {
    // For other steps, check only directly related conditions
    const relevantConditions = conditions.filter(
      (condition) =>
        (condition.stepId === stepId && condition.subStepId === subStepId) || condition.dependencies.includes(stepId)
    )
    if (relevantConditions.length > 0) {
      checkSpecificProgress(relevantConditions, state)
    }
  }
}

export const navigateToStep = (stepId: StepId) => {
  const store = getStoreForStep(stepId)
  const currentState = store.get()

  // Update lane store to reflect the current step
  const currentLaneState = laneStore.get()
  laneStore.set({
    ...currentLaneState,
    currentStep: stepId,
  })

  // Emit navigation event for scroll handling
  window.dispatchEvent(
    new CustomEvent("tutorial-navigate", {
      detail: { stepId },
    })
  )
}
