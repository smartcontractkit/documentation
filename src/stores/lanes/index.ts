import { atom } from "nanostores"
import { Environment } from "@config/data/ccip"

export type DeployedContracts = {
  token?: string
  tokenPool?: string
}

export type LaneState = {
  sourceChain: string
  destinationChain: string
  environment: Environment
  sourceContracts: DeployedContracts
  destinationContracts: DeployedContracts
}

export const laneStore = atom<LaneState>({
  sourceChain: "",
  destinationChain: "",
  environment: Environment.Testnet,
  sourceContracts: {},
  destinationContracts: {},
})

// Helper functions to update contract addresses
export const setSourceContract = (type: keyof DeployedContracts, address: string) => {
  const current = laneStore.get()
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
  laneStore.set({
    ...current,
    destinationContracts: {
      ...current.destinationContracts,
      [type]: address,
    },
  })
}
