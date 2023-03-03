import { automationAddresses, chainlinkAutomationConfig as currentConfig } from "@features/chainlink-automation/data"
import { ChainlinkAutomationConfigs, GetStateResponse } from "@features/chainlink-automation/types"
import { SupportedChain } from "@config"
import { getWeb3Provider } from "@features/utils"
// eslint-disable-next-line camelcase
import { KeeperRegistry, keeperRegistry1_3, keeperRegistry2_0 } from "@abi"
import { ContractInterface, ethers } from "ethers"
import { normalize } from "path"
import { isEqual } from "lodash"
import { writeFile } from "fs/promises"
import { format } from "prettier"

const configToBePath = normalize("./src/features/chainlink-automation/data/chainlink-automation-configTOBE.json")

const getRegistryAbi = (supportedChain: SupportedChain) => {
  if (supportedChain === "ETHEREUM_MAINNET") return KeeperRegistry
  // eslint-disable-next-line camelcase
  if (supportedChain === "ETHEREUM_SEPOLIA") return keeperRegistry2_0
  // eslint-disable-next-line camelcase
  return keeperRegistry1_3
}

const getChainlinkAutomationConfig = async (
  provider: ethers.providers.Provider,
  abi: ContractInterface,
  registryAddress: string
) => {
  const registry = new ethers.Contract(registryAddress, abi, provider)
  const state = (await registry.getState()) as GetStateResponse
  const {
    paymentPremiumPPB,
    blockCountPerTurn,
    checkGasLimit,
    gasCeilingMultiplier,
    minUpkeepSpend,
    maxPerformGas,
    fallbackGasPrice,
    fallbackLinkPrice,
    flatFeeMicroLink,
    stalenessSeconds,
    registrar,
    transcoder,
  } = state[1]
  return {
    paymentPremiumPPB,
    blockCountPerTurn,
    checkGasLimit,
    gasCeilingMultiplier,
    minUpkeepSpend,
    maxPerformGas,
    fallbackGasPrice,
    fallbackLinkPrice,
    flatFeeMicroLink,
    stalenessSeconds,
    registrar,
    transcoder,
  }
}

const getChainlinkAutomationConfigs = async () => {
  const configs: ChainlinkAutomationConfigs = {}
  for (const key in automationAddresses) {
    const supportedChain = key as SupportedChain
    const abi = getRegistryAbi(supportedChain) as ContractInterface
    const registryAddress = automationAddresses[key].registryAddress
    const provider = getWeb3Provider(supportedChain)
    if (!registryAddress) {
      console.error(`Registry address not found for ${key}`)
    } else if (!provider) {
      console.error(`Web3 provider not found for ${key}`)
    } else {
      try {
        const config = await getChainlinkAutomationConfig(provider, abi, registryAddress)
        configs[key] = config
      } catch (error) {
        console.error(error)
        console.error(`Error while retriving chainlink automation config for ${key}`)
      }
    }
  }
  return configs
}

const compareConfigs = async () => {
  const toBeConfig: ChainlinkAutomationConfigs = await getChainlinkAutomationConfigs()
  let result: { isEqual: boolean; toBeConfig?: ChainlinkAutomationConfigs }
  if (isEqual(JSON.stringify(currentConfig), JSON.stringify(toBeConfig))) {
    result = { isEqual: true }
  } else {
    result = { isEqual: false, toBeConfig }
  }
  return result
}

compareConfigs().then(async (res) => {
  if (!res.isEqual) {
    await writeFile(
      configToBePath,
      format(JSON.stringify(res.toBeConfig), {
        parser: "json",
        semi: true,
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 120,
      }),
      {
        flag: "w",
      }
    )
  }
})
