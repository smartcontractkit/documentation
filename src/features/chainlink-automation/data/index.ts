import { ChainlinkAutomationAddresses, ChainlinkAutomationConfigs } from "../types/index.ts"
import rawConfig from "./chainlink-automation-config.json" with { type: "json" }
import rawAddresses from "./chainlink-automation-addresses.json" with { type: "json" }

export const chainlinkAutomationConfig = rawConfig as ChainlinkAutomationConfigs
export const automationAddresses = rawAddresses as ChainlinkAutomationAddresses
