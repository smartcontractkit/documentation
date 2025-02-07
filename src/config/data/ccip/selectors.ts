import config from "./selectors.yml"

export interface Selector {
  selector: string
  name: string
}

export interface SelectorsConfig {
  selectors: Record<number, Selector>
}

/**
 * The selectors configuration from the static YAML file.
 */
export const selectorsConfig = config as SelectorsConfig

/**
 * Retrieves the selector configuration for the given chainId from the static YAML file.
 * @param chainId The chain ID for which to retrieve the selector.
 * @returns The Selector object if found, otherwise null.
 */
export function getSelectorConfig(chainId: number): Selector | null {
  return selectorsConfig.selectors[chainId] || null
}
