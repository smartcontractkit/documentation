import { CCIPArmABI, CCIPRouterABI } from "@features/abi"
import { ethers } from "ethers"
import { ChainsConfig, Environment, loadReferenceData, Version } from "@config/data/ccip"
import { SupportedChain } from "@config"
import { directoryToSupportedChain } from "@features/utils"

export const commonHeaders = { "Content-Type": "application/json" }

export type ArmProxyArgs = {
  provider: ethers.providers.JsonRpcProvider
  routerAddress: string
}

export const getArmContract = async ({ provider, routerAddress }: ArmProxyArgs) => {
  const routerContract = new ethers.Contract(routerAddress, CCIPRouterABI, provider)
  const armProxyAddress: string = await routerContract.getArmProxy()
  return new ethers.Contract(armProxyAddress, CCIPArmABI, provider)
}

export const getArmIsCursed = async ({ provider, routerAddress }: ArmProxyArgs): Promise<boolean> => {
  const armContract = await getArmContract({ provider, routerAddress })
  return armContract.isCursed()
}

export const getEnvironmentAndConfig = (
  sourceNetworkId: string
): {
  environment: Environment
  chainsConfig: ChainsConfig
  sourceRouterAddress: string
  destinationNetworkIds: string[]
} | null => {
  const { chainsReferenceData, lanesReferenceData } = loadReferenceData({
    environment: Environment.Mainnet,
    version: Version.V1_2_0,
  })

  if (chainsReferenceData[sourceNetworkId] === undefined) {
    const { chainsReferenceData: testnetChainsReferenceData, lanesReferenceData: testnetLanesReferenceData } =
      loadReferenceData({
        environment: Environment.Testnet,
        version: Version.V1_2_0,
      })

    if (testnetChainsReferenceData[sourceNetworkId] === undefined) {
      return null
    }

    return {
      environment: Environment.Testnet,
      chainsConfig: testnetChainsReferenceData,
      sourceRouterAddress: testnetChainsReferenceData[sourceNetworkId].router.address,
      destinationNetworkIds: Object.keys(testnetLanesReferenceData[sourceNetworkId]),
    }
  }

  return {
    environment: Environment.Mainnet,
    chainsConfig: chainsReferenceData,
    sourceRouterAddress: chainsReferenceData[sourceNetworkId].router.address,
    destinationNetworkIds: Object.keys(lanesReferenceData[sourceNetworkId]),
  }
}

export const resolveChainOrThrow = (networkId: string): SupportedChain => {
  try {
    return directoryToSupportedChain(networkId)
  } catch {
    throw new Error(`Invalid network ID: ${networkId}`)
  }
}

export const checkIfChainIsCursed = async (
  provider: ethers.providers.JsonRpcProvider,
  chain: SupportedChain,
  routerAddress: string
): Promise<boolean> => {
  try {
    return await getArmIsCursed({ provider, routerAddress })
  } catch (error) {
    console.error(`Error checking if chain ${chain} is cursed: ${error}`)
    return false
  }
}

export const withTimeout = <T>(promise: Promise<T>, ms: number, timeoutErrorMessage: string): Promise<T> => {
  const timeout = new Promise<never>((resolve, reject) => setTimeout(() => reject(new Error(timeoutErrorMessage)), ms))
  return Promise.race([promise, timeout])
}
