import type { Collection } from "src/content/config"

export interface ProductConfig {
  name: Collection
  basePath: string
}

export interface VersionSelectorConfig<T extends string = string> {
  versions: {
    all: ReadonlyArray<T> | T[]
    latest: T
    deprecated?: ReadonlyArray<T> | T[]
    current: T
  }
  product: ProductConfig
  styling?: {
    theme?: "default" | "dark"
    customTokens?: Record<string, string>
  }
}

export interface VersionSelectorProps<T extends string = string> {
  config: VersionSelectorConfig<T>
  onChange?: (newVersion: T) => void
}

// Re-export for convenience
export type { Collection }
