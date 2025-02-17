import { useEffect, useState } from "react"

interface RemixUrlOptions {
  optimize?: boolean
  runs?: number
}

export const useRemixUrl = (src: string, options: RemixUrlOptions = {}) => {
  const { optimize, runs } = options
  const [remixUrl, setRemixUrl] = useState<string>("")

  useEffect(() => {
    // Clean the source path
    const cleanSrc = src.replace(/^\/+/, "")

    // Build optimization parameters
    const optimizationParams = [optimize && "optimize=true", runs && `runs=${runs}`].filter(Boolean).join("&")

    // Get current hostname - default to docs.chain.link for SSR
    const hostname = typeof window !== "undefined" ? window.location.hostname : "docs.chain.link"

    // Always use docs.chain.link in the initial URL - will be replaced if on preview
    const baseUrl = "https://remix.ethereum.org/#url=https://docs.chain.link"

    // Construct the full Remix URL
    const url = `${baseUrl}/${cleanSrc}&autoCompile=true${optimizationParams ? `&${optimizationParams}` : ""}`

    // If we're not on docs.chain.link, replace the hostname
    const finalUrl = hostname !== "docs.chain.link" ? url.replace("docs.chain.link", hostname) : url

    setRemixUrl(finalUrl)
  }, [src, optimize, runs])

  return remixUrl
}
