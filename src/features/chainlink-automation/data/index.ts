import { ChainlinkAutomationAddresses, ChainlinkAutomationConfigs } from "../types"
import rawConfig from "./chainlink-automation-config.json"
import rawAddresses from "./chainlink-automation-addresses.json"

export const chainlinkAutomationConfig = rawConfig as ChainlinkAutomationConfigs
export const automationAddresses = rawAddresses as ChainlinkAutomationAddresses
