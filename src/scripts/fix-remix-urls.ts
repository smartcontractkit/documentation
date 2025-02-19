/** Fixes deployment URLs when on a preview URL */
document.addEventListener("DOMContentLoaded", () => {
  const currentHost = window.location.hostname
  if (currentHost !== "docs.chain.link") {
    // Rewrite Remix URLs with current hostname
    // eg https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFD20.sol

    for (const item of Array.from(document.links)) {
      try {
        if (item.href.startsWith("https://remix.ethereum.org")) {
          // Parse the Remix URL
          const remixUrl = new URL(item.href)
          // Get the embedded URL parameter
          const urlParam = remixUrl.hash.split("=")[1]

          if (urlParam) {
            // Parse the embedded URL
            const embeddedUrl = new URL(urlParam)
            // Create a new URL object for manipulation
            const newEmbeddedUrl = new URL(urlParam)

            // Only proceed if the hostname exactly matches docs.chain.link
            if (embeddedUrl.hostname === "docs.chain.link") {
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
