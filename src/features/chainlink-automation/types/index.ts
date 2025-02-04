import { BigNumber } from "ethers"
import { SupportedChain } from "@config"

type StateStructOutput = [number, BigNumber, BigNumber, BigNumber] & {
  nonce: number
  ownerLinkBalance: BigNumber
  expectedLinkBalance: BigNumber
  numUpkeeps: BigNumber
}

type ConfigStructOutput = [
  number,
  number,
  number | "Not Applicable",
  number | "Not Applicable",
  number,
  number,
  number,
  BigNumber,
  number,
  number | "Not Applicable",
  BigNumber,
  BigNumber,
  string,
  string
] & {
  paymentPremiumPPB: number
  flatFeeMicroLink: number
  blockCountPerTurn: number | "Not Applicable"
  maxCheckDataSize: number | "Not Applicable"
  checkGasLimit: number
  stalenessSeconds: number
  gasCeilingMultiplier: number
  minUpkeepSpend: BigNumber
  maxPerformGas: number
  maxPerformDataSize: number | "Not Applicable"
  fallbackGasPrice: BigNumber
  fallbackLinkPrice: BigNumber
  transcoder: string
  registrar: string
}

export type GetStateResponse = [StateStructOutput, ConfigStructOutput, string[]]

export type ChainlinkAutomationAddresses = Partial<
  Record<
    SupportedChain,
    {
      registryAddress: string
      registrarAddress: string
    }
  >
>

export type ChainlinkAutomationConfig = {
  paymentPremiumPPB: number
  blockCountPerTurn: number | "Not Applicable"
  maxCheckDataSize: number | "Not Applicable"
  checkGasLimit: number
  gasCeilingMultiplier: number
  minUpkeepSpend: { type: "BigNumber"; hex: string }
  maxPerformGas: number
  maxPerformDataSize: number | "Not Applicable"
  fallbackGasPrice: { type: "BigNumber"; hex: string }
  fallbackLinkPrice: { type: "BigNumber"; hex: string }
  flatFeeMicroLink: number
  stalenessSeconds: number
  registrar: string
  transcoder: string
  latestVersion: string
}

export type ChainlinkAutomationConfig_2_3 = {
  gasFeePPBLink: number | "Not Applicable"
  gasFeePPBNative: number | "Not Applicable"
  maxCheckDataSize: number | "Not Applicable"
  checkGasLimit: number
  gasCeilingMultiplier: number
  minSpendLink: { type: "BigNumber"; hex: string } | "Not Applicable"
  minSpendNative: { type: "BigNumber"; hex: string } | "Not Applicable"
  maxPerformGas: number
  maxPerformDataSize: number | "Not Applicable"
  fallbackGasPrice: { type: "BigNumber"; hex: string }
  fallbackLinkPrice: { type: "BigNumber"; hex: string }
  fallbackNativePrice: { type: "BigNumber"; hex: string }
  stalenessSeconds: number
  registrar: string
  latestVersion: string
}
export type ChainlinkAutomationConfigs = Partial<Record<SupportedChain, ChainlinkAutomationConfig>>
export type ChainlinkAutomationConfigs_2_3 = Partial<Record<SupportedChain, ChainlinkAutomationConfig_2_3>>
