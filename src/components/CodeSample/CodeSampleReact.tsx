import React from "react"
import { useRemixUrl } from "src/hooks/useRemixUrl"

interface CodeSampleReactProps {
  src: string
  showButtonOnly?: boolean
  optimize?: boolean
  runs?: number
}

export const CodeSampleReact: React.FC<CodeSampleReactProps> = ({ src, showButtonOnly = false, optimize, runs }) => {
  const remixUrl = useRemixUrl(src, { optimize, runs })

  const isSolidityFile = src.match(/\.sol/)
  const isSample = isSolidityFile && (src.indexOf("samples/") === 0 || src.indexOf("/samples/") === 0)

  if (!isSample || !showButtonOnly || !remixUrl) return null

  return (
    <div className="remix-callout" data-remix-component data-source={src}>
      <a href={remixUrl} target="_blank" rel="noopener noreferrer" data-remix-url>
        Open in Remix
      </a>
      <a href="/getting-started/conceptual-overview#what-is-remix">What is Remix?</a>
    </div>
  )
}
