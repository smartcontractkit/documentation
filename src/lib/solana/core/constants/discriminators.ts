/**
 * Anchor instruction discriminators
 * Pure byte arrays for instruction identification
 */

/**
 * Anchor discriminator for 'drip' instruction
 * Generated from: anchor idl parse | jq '.instructions[] | select(.name == "drip") | .discriminator'
 * Value from legacy constants.ts - preserving exact discriminator from working implementation
 */
export const DRIP_DISCRIMINATOR = new Uint8Array([215, 250, 141, 179, 116, 10, 187, 192] as const)
