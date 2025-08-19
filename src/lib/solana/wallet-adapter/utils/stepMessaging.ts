export type MintingStep = "idle" | "challenge" | "signing" | "verifying" | "processing"
export type Status = "idle" | "success" | "error"

/**
 * Get user-friendly step messages for the minting process
 * Matches original UX messaging exactly
 */
export function getStepMessage(step: MintingStep, tokenSymbol = "CCIP-BnM"): string {
  switch (step) {
    case "challenge":
      return "Getting challenge..."
    case "signing":
      return "Please sign in your wallet..."
    case "verifying":
      return "Verifying signature..."
    case "processing":
      return "Processing drip request..."
    case "idle":
    default:
      return `Mint ${tokenSymbol} Tokens`
  }
}

/**
 * Check if the current step represents a processing state
 */
export function isProcessingStep(step: MintingStep): boolean {
  return step !== "idle"
}

/**
 * Get button state classes for loading animations
 */
export function getButtonStateClass(step: MintingStep): string {
  return isProcessingStep(step) ? "loadingState" : ""
}
