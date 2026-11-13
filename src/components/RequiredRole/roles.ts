/**
 * Roles per product, used by <RequiredRole>.
 *
 * This file is the single source of role names for the component. It is shared by the Astro
 * component and by the Markdown/LLM export, so both always say the same thing.
 *
 * - The product keys match the `?parent=` values of the shared Chainlink Platform pages.
 * - Roles are listed from the most to the least privileged. A role includes the permissions of
 *   the roles below it, which is why the component says "or higher".
 * - Keep the labels and anchors in sync with /chainlink-platform/rbac.
 */
export const REQUIRED_ROLE_PRODUCTS = {
  ace: {
    label: "ACE",
    /** Heading id of the product section on /chainlink-platform/rbac. */
    anchor: "ace",
    roles: { admin: "Admin", operator: "Operator", viewer: "Viewer" },
  },
  crec: {
    label: "CRE Connect",
    anchor: "cre-connect",
    roles: { admin: "Admin", operator: "Operator", viewer: "Viewer" },
  },
  cre: {
    label: "CRE",
    anchor: "cre",
    roles: { admin: "Admin", developer: "Developer", viewer: "Viewer" },
  },
} as const

export type RequiredRoleProduct = keyof typeof REQUIRED_ROLE_PRODUCTS

export interface RequiredRoleDescription {
  /** Full role name, for example "ACE Operator". */
  name: string
  /** True when higher roles also qualify, which is every role except the most privileged. */
  orHigher: boolean
  /** Link to the role reference, scoped to the product so the reader stays in its docs. */
  url: string
}

/**
 * Resolves a product and role key to the text shown to the reader.
 * Returns null for an unknown product or role, so callers can fail loudly.
 */
export function describeRequiredRole(product: unknown, role: unknown): RequiredRoleDescription | null {
  if (typeof product !== "string" || typeof role !== "string") return null
  if (!Object.hasOwn(REQUIRED_ROLE_PRODUCTS, product)) return null

  const config = REQUIRED_ROLE_PRODUCTS[product as RequiredRoleProduct]
  const roleKeys: string[] = Object.keys(config.roles)
  const index = roleKeys.indexOf(role)
  if (index === -1) return null

  const roleLabel = (config.roles as Record<string, string>)[role]
  return {
    name: `${config.label} ${roleLabel}`,
    orHigher: index > 0,
    url: `/chainlink-platform/rbac?parent=${product}#${config.anchor}`,
  }
}
