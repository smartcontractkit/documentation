/**
 * Configuration paths for CCIP-related files and directories.
 * This module centralizes all path-related constants for CCIP configuration.
 */

import path from "path"

/** Base directory for all CCIP configuration files */
export const CCIP_CONFIG_DIR = path.join("src", "config", "data", "ccip")

/** Base URL for chain selectors */
export const SELECTORS_SOURCE_BASE_URL =
  "https://raw.githubusercontent.com/smartcontractkit/chain-selectors/refs/heads/main"

/** Selector file names by chain type */
export const SELECTOR_FILES = {
  evm: "selectors.yml",
  solana: "selectors_solana.yml",
  aptos: "selectors_aptos.yml",
}

/** Destination paths for selector files */
export const SELECTOR_CONFIG_PATHS = {
  evm: path.join(CCIP_CONFIG_DIR, SELECTOR_FILES.evm),
  solana: path.join(CCIP_CONFIG_DIR, SELECTOR_FILES.solana),
  aptos: path.join(CCIP_CONFIG_DIR, SELECTOR_FILES.aptos),
}

/** Backup paths for selector files */
export const SELECTOR_BACKUP_PATHS = {
  evm: `${SELECTOR_CONFIG_PATHS.evm}.backup`,
  solana: `${SELECTOR_CONFIG_PATHS.solana}.backup`,
  aptos: `${SELECTOR_CONFIG_PATHS.aptos}.backup`,
}

// Legacy paths for backward compatibility
export const SELECTOR_CONFIG_PATH = SELECTOR_CONFIG_PATHS.evm
export const SELECTOR_BACKUP_PATH = SELECTOR_BACKUP_PATHS.evm
export const SELECTORS_SOURCE_URL = `${SELECTORS_SOURCE_BASE_URL}/${SELECTOR_FILES.evm}`
