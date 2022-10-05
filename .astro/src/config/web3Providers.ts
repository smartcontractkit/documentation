/* eslint-disable no-unused-vars */

import { providers } from "ethers"

const infuraProjectKey = "34ed41c4cf28406885f032930d670036"
export const mainnetProvider = new providers.InfuraProvider(
  "homestead",
  infuraProjectKey
)

export const goerliEthProvider = new providers.InfuraProvider(
  "goerli",
  infuraProjectKey
)

export enum ProviderList {
  ETH_MAINNET = "mainnetProvider",
  ETH_GOERLI = "goerliEthProvider",
}
