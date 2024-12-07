import { atom } from "nanostores"
import { Environment } from "@config/data/ccip"
import { debounce } from "@utils/performance"
import type { Network } from "@config/data/ccip/types"

export type DeployedContracts = {
  token?: string
  tokenPool?: string
  tokenPools?: string[]
  registered?: boolean
  configured?: boolean
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
      "gas-tokens": "Gas Tokens Ready",
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
      "source-privileges": "Grant Burnt Mint Privileges",
      "source-pool-config": "Configure Pool",
      "source-verification": "Verify Configuration",
    },
  },
  destConfig: {
    id: "destConfig",
    title: "Destination Configuration",
    subSteps: {
      "dest-privileges": "Grant Burnt Mint Privileges",
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
}

export const updateStepProgress = (stepId: string, subStepId: string, completed: boolean) => {
  const current = laneStore.get()
  if (current.progress[stepId]?.[subStepId] === completed) return

  laneStore.set({
    ...current,
    progress: {
      ...current.progress,
      [stepId]: {
        ...current.progress[stepId],
        [subStepId]: completed,
      },
    },
  })
}

const checkProgress = (state: LaneState) => {
  let hasChanges = false
  const updates = new Set<{ stepId: StepId; subStepId: string; completed: boolean }>()

  const conditions = [
    {
      stepId: "setup" as StepId,
      subStepId: "blockchains-selected",
      check: (state: LaneState) => !!state.sourceChain && !!state.destinationChain,
    },
    {
      stepId: "sourceChain" as StepId,
      subStepId: "token-deployed",
      check: (state: LaneState) => !!state.sourceContracts.token,
    },
    {
      stepId: "sourceChain" as StepId,
      subStepId: "pool-deployed",
      check: (state: LaneState) => !!state.sourceContracts.tokenPool,
    },
    {
      stepId: "sourceChain" as StepId,
      subStepId: "pool-registered",
      check: (state: LaneState) => !!state.sourceContracts.registered,
    },
    {
      stepId: "destinationChain" as StepId,
      subStepId: "dest-token-deployed",
      check: (state: LaneState) => !!state.destinationContracts.token,
    },
    {
      stepId: "destinationChain" as StepId,
      subStepId: "dest-pool-deployed",
      check: (state: LaneState) => !!state.destinationContracts.tokenPool,
    },
    {
      stepId: "destinationChain" as StepId,
      subStepId: "dest-pool-registered",
      check: (state: LaneState) => !!state.destinationContracts.registered,
    },
    {
      stepId: "sourceChain" as StepId,
      subStepId: "admin-claimed",
      check: (state: LaneState) => state.progress.sourceChain?.["admin-claimed"] === true,
    },
    {
      stepId: "sourceChain" as StepId,
      subStepId: "admin-accepted",
      check: (state: LaneState) => state.progress.sourceChain?.["admin-accepted"] === true,
    },
    {
      stepId: "destinationChain" as StepId,
      subStepId: "admin-claimed",
      check: (state: LaneState) => state.progress.destinationChain?.["admin-claimed"] === true,
    },
    {
      stepId: "destinationChain" as StepId,
      subStepId: "admin-accepted",
      check: (state: LaneState) => state.progress.destinationChain?.["admin-accepted"] === true,
    },
    {
      stepId: "sourceConfig" as StepId,
      subStepId: "source-pool-config",
      check: (state: LaneState) => state.progress.sourceConfig?.["source-pool-config"] === true,
    },
    {
      stepId: "destConfig" as StepId,
      subStepId: "dest-pool-config",
      check: (state: LaneState) => state.progress.destConfig?.["dest-pool-config"] === true,
    },
  ]

  conditions.forEach(({ stepId, subStepId, check }) => {
    const isComplete = check(state)
    if (isComplete !== state.progress[stepId]?.[subStepId]) {
      updates.add({ stepId, subStepId, completed: isComplete })
      hasChanges = true
    }
  })

  if (hasChanges) {
    const current = laneStore.get()
    if (current !== state) return
    const newProgress = { ...current.progress }

    updates.forEach(({ stepId, subStepId, completed }) => {
      newProgress[stepId] = {
        ...newProgress[stepId],
        [subStepId]: completed,
      }
    })

    laneStore.set({
      ...current,
      progress: newProgress,
    })
  }
}

export const laneStore = atom<LaneState>({
  sourceChain: "",
  destinationChain: "",
  environment: Environment.Testnet,
  sourceNetwork: null,
  destinationNetwork: null,
  sourceContracts: {},
  destinationContracts: {},
  progress: {
    setup: {},
    sourceChain: {},
    destinationChain: {},
    sourceConfig: {},
    destConfig: {},
  },
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

const debouncedCheckProgress = debounce((state: LaneState) => {
  checkProgress(state)
}, 100)

laneStore.subscribe((state) => {
  debouncedCheckProgress(state)
})

// Helper functions to update contract addresses
export const setSourceContract = (type: keyof DeployedContracts, address: string) => {
  const current = laneStore.get()
  if (current.sourceContracts[type] === address) return

  laneStore.set({
    ...current,
    sourceContracts: {
      ...current.sourceContracts,
      [type]: address,
    },
  })
}

export const setDestinationContract = (type: keyof DeployedContracts, address: string) => {
  const current = laneStore.get()
  if (current.destinationContracts[type] === address) return

  laneStore.set({
    ...current,
    destinationContracts: {
      ...current.destinationContracts,
      [type]: address,
    },
  })
}

export const setPoolRegistered = (chain: "source" | "destination", registered: boolean) => {
  const current = laneStore.get()
  if (chain === "source") {
    laneStore.set({
      ...current,
      sourceContracts: { ...current.sourceContracts, registered },
    })
  } else {
    laneStore.set({
      ...current,
      destinationContracts: { ...current.destinationContracts, registered },
    })
  }
}

interface SubStep {
  id: string
  title: string
  completed: boolean
}

interface StepProgress {
  setup: {
    prerequisites: SubStep[]
    chainSelection: SubStep[]
  }
  sourceChain: {
    deployment: SubStep[]
    adminSetup: SubStep[]
  }
  destinationChain: {
    deployment: SubStep[]
    adminSetup: SubStep[]
  }
  sourceConfig: {
    privileges: SubStep[]
    poolConfig: SubStep[]
  }
  destConfig: {
    privileges: SubStep[]
    poolConfig: SubStep[]
  }
}

export const initialProgress: StepProgress = {
  setup: {
    prerequisites: [
      { id: "browser-setup", title: "Web Browser Setup", completed: false },
      { id: "gas-tokens", title: "Gas Tokens Ready", completed: false },
    ],
    chainSelection: [
      { id: "source-chain", title: "Source Chain Selected", completed: false },
      { id: "dest-chain", title: "Destination Chain Selected", completed: false },
    ],
  },
  sourceChain: {
    deployment: [
      { id: "token-deployed", title: "Token Deployed", completed: false },
      { id: "pool-deployed", title: "Pool Deployed", completed: false },
    ],
    adminSetup: [
      { id: "admin-claimed", title: "Admin Role Claimed", completed: false },
      { id: "admin-accepted", title: "Admin Role Accepted", completed: false },
    ],
  },
  destinationChain: {
    deployment: [
      { id: "dest-token-deployed", title: "Token Deployed", completed: false },
      { id: "dest-pool-deployed", title: "Pool Deployed", completed: false },
    ],
    adminSetup: [
      { id: "dest-admin-claimed", title: "Admin Role Claimed", completed: false },
      { id: "dest-admin-accepted", title: "Admin Role Accepted", completed: false },
    ],
  },
  sourceConfig: {
    privileges: [{ id: "source-privileges", title: "Grant Burnt Mint Privileges", completed: false }],
    poolConfig: [{ id: "source-pool-config", title: "Configure Pool", completed: false }],
  },
  destConfig: {
    privileges: [{ id: "dest-privileges", title: "Grant Burnt Mint Privileges", completed: false }],
    poolConfig: [{ id: "dest-pool-config", title: "Configure Pool", completed: false }],
  },
}

export const subscribeToProgress = (callback: (progress: LaneState["progress"]) => void) => {
  return laneStore.subscribe((state) => {
    callback(state.progress)
  })
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
