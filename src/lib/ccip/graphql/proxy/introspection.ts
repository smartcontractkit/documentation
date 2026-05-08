import schemaJson from "~/lib/ccip/graphql/schema.graphql.json" with { type: "json" }

export function isIntrospectionQuery(query: string): boolean {
  return query.includes("__schema") || query.includes("__type")
}

export function getIntrospectionResponse(): { data: unknown } {
  return { data: schemaJson }
}
