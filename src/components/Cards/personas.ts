export const getPersonaKey = (persona: string): "appDevs" | "assetIssuers" | "advanced" | null => {
  const p = persona.trim().toLowerCase()

  if (p === "application developers") return "appDevs"
  if (p === "asset issuers") return "assetIssuers"
  if (p === "advanced") return "advanced"

  return null
}
