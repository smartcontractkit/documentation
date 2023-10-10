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
  string,
  number,
  number,
  number,
  number,
  BigNumber,
  number,
  string,
  BigNumber,
  BigNumber,
  string,
  string
] & {
  paymentPremiumPPB: number
  flatFeeMicroLink: number
  blockCountPerTurn: string
  maxCheckDataSize: number
  checkGasLimit: number
  stalenessSeconds: number
  gasCeilingMultiplier: number
  minUpkeepSpend: BigNumber
  maxPerformGas: number
  maxPerformDataSize: string
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
  blockCountPerTurn: string
  maxCheckDataSize: number
  checkGasLimit: number
  gasCeilingMultiplier: number
  minUpkeepSpend: { type: "BigNumber"; hex: string }
  maxPerformGas: number
  maxPerformDataSize: string
  fallbackGasPrice: { type: "BigNumber"; hex: string }
  fallbackLinkPrice: { type: "BigNumber"; hex: string }
  flatFeeMicroLink: number
  stalenessSeconds: number
  registrar: string
  transcoder: string
}
export type ChainlinkAutomationConfigs = Partial<Record<SupportedChain, ChainlinkAutomationConfig>>
