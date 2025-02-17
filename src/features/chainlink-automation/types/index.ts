import { BigNumberish } from "ethers"
import { SupportedChain } from "@config/index.ts"

type StateStructOutput = [number, BigNumberish, BigNumberish, BigNumberish] & {
  nonce: number
  ownerLinkBalance: BigNumberish
  expectedLinkBalance: BigNumberish
  numUpkeeps: BigNumberish
}

type ConfigStructOutput = [
  number,
  number,
  number | "Not Applicable",
  number | "Not Applicable",
  number,
  number,
  number,
  BigNumberish,
  number,
  number | "Not Applicable",
  BigNumberish,
  BigNumberish,
  string,
  string,
] & {
  paymentPremiumPPB: number
  flatFeeMicroLink: number
  blockCountPerTurn: number | "Not Applicable"
  maxCheckDataSize: number | "Not Applicable"
  checkGasLimit: number
  stalenessSeconds: number
  gasCeilingMultiplier: number
  minUpkeepSpend: BigNumberish
  maxPerformGas: number
  maxPerformDataSize: number | "Not Applicable"
  fallbackGasPrice: BigNumberish
  fallbackLinkPrice: BigNumberish
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
}
export type ChainlinkAutomationConfigs = Partial<Record<SupportedChain, ChainlinkAutomationConfig>>
