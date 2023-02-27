/* eslint-disable no-unused-vars */
import { Chains, SupportedChain, SupportedTechnology } from "."
import { rawChainToTechnology, rawChains } from "./data"

export const chains = rawChains as Chains

export const chainToTechnology = rawChainToTechnology as Record<SupportedChain, SupportedTechnology>
