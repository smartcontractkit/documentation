import yaml from "yaml"

export function normalizeFrontmatterValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value.map(normalizeFrontmatterValue)
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeFrontmatterValue(nestedValue)])
    )
  }

  return value
}

export function serializeFrontmatter(data: Record<string, unknown>) {
  const normalized = normalizeFrontmatterValue(data)

  if (!normalized || typeof normalized !== "object" || Object.keys(normalized).length === 0) {
    return ""
  }

  return `---\n${yaml.stringify(normalized).trimEnd()}\n---\n\n`
}
