import { getHighlighter, Highlighter } from "shiki"

let highlighterInstance: Highlighter | null = null

export async function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await getHighlighter({
      themes: ["github-dark"],
      langs: ["plaintext", "javascript", "typescript", "solidity"],
    })
  }
  return highlighterInstance
}

// Call this when the app is shutting down
export function disposeHighlighter() {
  if (highlighterInstance) {
    highlighterInstance.dispose()
    highlighterInstance = null
  }
}
