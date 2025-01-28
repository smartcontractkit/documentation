export type LinkType = "overview" | "concept" | "get-started" | "guide" | "reference"

export interface RoleLink {
  type: LinkType
  title: string
  url: string
}

export interface RoleConfig {
  id: string
  title: string
  description: string
  iconType: string
  links: RoleLink[]
}

export interface ProductRoles {
  productId: string
  roles: RoleConfig[]
}
