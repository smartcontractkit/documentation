import { parse, Kind } from "graphql"

const ALLOWED_ROOT_FIELDS = new Set(["allCcipTokenPools", "allCcipTokenPoolLanesWithPools"])

export interface ValidationResult {
  valid: boolean
  reason?: string
}

export function validateQuery(query: string): ValidationResult {
  let doc
  try {
    doc = parse(query)
  } catch {
    return { valid: false, reason: "Invalid GraphQL syntax" }
  }

  for (const def of doc.definitions) {
    if (def.kind === Kind.OPERATION_DEFINITION) {
      if (def.operation !== "query") {
        return { valid: false, reason: `Operation type '${def.operation}' is not allowed` }
      }
      for (const sel of def.selectionSet.selections) {
        if (sel.kind === Kind.FIELD && !ALLOWED_ROOT_FIELDS.has(sel.name.value)) {
          return { valid: false, reason: `Query field '${sel.name.value}' is not allowed` }
        }
      }
    }
  }

  return { valid: true }
}
