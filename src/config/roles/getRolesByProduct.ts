import type { ProductRoles } from "./types"
import { ccipRoles } from "./ccip"

export const PRODUCT_CONFIGS: Record<string, ProductRoles> = {
  ccip: ccipRoles,
  // Add other products here when they're ready for the role-based layout
}
