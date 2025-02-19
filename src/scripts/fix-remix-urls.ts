/** Fixes deployment URLs when on a preview URL */
document.addEventListener("DOMContentLoaded", () => {
  const currentHost = window.location.hostname
  if (currentHost !== "docs.chain.link") {
    // Rewrite Remix URLs with current hostname
    // eg https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFD20.sol

    // Allowed Remix hosts
    const ALLOWED_REMIX_HOST = "remix.ethereum.org"

    for (const item of Array.from(document.links)) {
      try {
        // Parse URL first before any checks
        const remixUrl = new URL(item.href)

        // Validate the Remix URL host explicitly
        if (remixUrl.hostname === ALLOWED_REMIX_HOST) {
          // Get the embedded URL parameter
          const urlParam = remixUrl.hash.split("=")[1]

          if (urlParam) {
            // Parse the embedded URL
            const embeddedUrl = new URL(urlParam)

            // Only proceed if the hostname exactly matches docs.chain.link
            if (embeddedUrl.hostname === "docs.chain.link") {
              // Create new URL for manipulation to preserve original
              const newEmbeddedUrl = new URL(urlParam)
              // Update hostname
              newEmbeddedUrl.hostname = currentHost
              // Reconstruct the Remix URL safely
              const newUrl = `${remixUrl.origin}${remixUrl.pathname}#url=${newEmbeddedUrl.toString()}`
              item.setAttribute("href", newUrl)
            }
          }
        }
      } catch (error) {
        console.warn("Failed to process URL:", item.href, error)
      }
    }
  }
})
