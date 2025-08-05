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
          // Extract the embedded URL from the hash segment (#url=...)
          const urlParam = remixUrl.hash.split("=")[1]

          if (urlParam) {
            // Parse the embedded URL
            const embeddedUrl = new URL(urlParam)

            // Only proceed if the hostname exactly matches docs.chain.link
            if (embeddedUrl.hostname === "docs.chain.link") {
              // Update the embedded URL to use the current preview host
              embeddedUrl.hostname = currentHost

              // Overwrite the hash portion with the updated embedded URL
              remixUrl.hash = `url=${embeddedUrl.toString()}`

              // Finally, set the link’s href to the rebuilt Remix URL
              item.href = remixUrl.toString()
            }
          }
        }
      } catch (error) {
        console.warn("Failed to process URL:", item.href, error)
      }
    }
  }
})
