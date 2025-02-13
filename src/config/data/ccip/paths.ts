/**
 * Configuration paths for CCIP-related files and directories.
 * This module centralizes all path-related constants for CCIP configuration.
 */

import path from "path"

/** Base directory for all CCIP configuration files */
export const CCIP_CONFIG_DIR = path.join("src", "config", "data", "ccip")

/** Path for the chain selectors configuration file */
export const SELECTOR_CONFIG_PATH = path.join(CCIP_CONFIG_DIR, "selector.yml")

/** Path for the backup file when updating selectors */
export const SELECTOR_BACKUP_PATH = `${SELECTOR_CONFIG_PATH}.backup`

/** Source URL for the official chain selectors YAML file */
export const SELECTORS_SOURCE_URL =
  "https://raw.githubusercontent.com/smartcontractkit/chain-selectors/refs/heads/main/selectors.yml"
