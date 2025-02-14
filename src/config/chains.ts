/* eslint-disable no-unused-vars */
import { Chains, SupportedChain, SupportedTechnology } from "./index.ts"
import { rawChainToTechnology, rawChains } from "./data/index.ts"

export const chains = rawChains as Chains

export const chainToTechnology = rawChainToTechnology as Record<SupportedChain, SupportedTechnology>
