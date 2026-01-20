export type CcipVersion = "v1.6" | "v2.0"

const CCIP_VERSION_RE = /^\/ccip\/(v1\.6|v2\.0)(\/|$)/

export function getCcipVersionFromPathname(pathname: string): CcipVersion | null {
  const match = pathname.match(CCIP_VERSION_RE)
  return (match?.[1] as CcipVersion | undefined) ?? null
}

export function getOtherCcipVersion(version: CcipVersion): CcipVersion {
  return version === "v2.0" ? "v1.6" : "v2.0"
}

/**
 * Removes the CCIP version segment from a pathname.
 *
 * Example:
 *   /ccip/v2.0/concepts/x  -> /ccip/concepts/x
 */
export function stripCcipVersionFromPathname(pathname: string): string {
  const version = getCcipVersionFromPathname(pathname)
  if (!version) return pathname
  return pathname.replace(`/ccip/${version}`, "/ccip")
}

/**
 * Adds a CCIP version segment to a CCIP sidebar URL (which is stored without a leading slash).
 *
 * Rules:
 * - Keep CCIP Directory unversioned (ccip/directory/*)
 * - All other ccip/* URLs become ccip/{version}/*
 */
export function addCcipVersionToSidebarUrl(url: string, version: CcipVersion): string {
  if (!url) return url

  // External URLs
  if (url.startsWith("http://") || url.startsWith("https://")) return url

  const [rawPath, rawQuery] = url.split("?", 2)
  const query = rawQuery ? `?${rawQuery}` : ""

  if (!rawPath.startsWith("ccip")) return url
  if (rawPath.startsWith("ccip/directory")) return url

  const remainder = rawPath === "ccip" ? "" : rawPath.replace(/^ccip\//, "")
  const withVersion = remainder ? `ccip/${version}/${remainder}` : `ccip/${version}`
  return `${withVersion}${query}`
}

export function getCcipVersionToggleState(pathname: string): { current: CcipVersion; other: CcipVersion } {
  const current = getCcipVersionFromPathname(pathname) ?? "v2.0"
  return { current, other: getOtherCcipVersion(current) }
}

async function doesPageExist(url: URL): Promise<boolean> {
  // Hash never reaches the server; strip it for the existence check.
  const checkUrl = new URL(url.toString())
  checkUrl.hash = ""

  try {
    const headRes = await fetch(checkUrl, { method: "HEAD" })
    if (headRes.ok) return true

    // Some hosts block HEAD; try a lightweight GET.
    if (headRes.status === 405) {
      const getRes = await fetch(checkUrl, { method: "GET", headers: { Range: "bytes=0-0" } })
      return getRes.ok
    }

    return false
  } catch {
    return false
  }
}

/**
 * Computes where the version toggle should navigate.
 *
 * Behavior:
 * - Try same path with version swapped (v2.0 <-> v1.6)
 * - If that page doesn't exist, fallback to the other version's landing page (/ccip/{otherVersion})
 */
export async function resolveCcipVersionToggleDestination(currentHref: string): Promise<string> {
  const currentUrl = new URL(currentHref)
  const { current, other } = getCcipVersionToggleState(currentUrl.pathname)

  const candidatePathname = (() => {
    const currentVersionInPath = getCcipVersionFromPathname(currentUrl.pathname)
    if (!currentVersionInPath) return `/ccip/${other}`
    return currentUrl.pathname.replace(`/ccip/${current}`, `/ccip/${other}`)
  })()

  const candidateUrl = new URL(candidatePathname, currentUrl.origin)
  candidateUrl.search = currentUrl.search
  candidateUrl.hash = currentUrl.hash

  const exists = await doesPageExist(candidateUrl)
  if (exists) {
    return `${candidateUrl.pathname}${candidateUrl.search}${candidateUrl.hash}`
  }

  return `/ccip/${other}`
}
