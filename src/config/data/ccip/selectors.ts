import config from "./selectors.yml"

interface Selector {
  selector: string
  name: string
}

interface Config {
  selectors: Record<number, Selector>
}

const selectorsConfig = config as Config

/**
 * Retrieves the selector configuration for the given chainId from the static YAML file.
 * @param chainId The chain ID for which to retrieve the selector.
 * @returns The Selector object if found, otherwise null.
 */
export function getSelectorConfig(chainId: number): Selector | null {
  return selectorsConfig.selectors[chainId] || null
}
