/** @jsxImportSource preact */
import { useEffect } from "preact/compat"
import { normalizeTechnologyName } from "@features/utils/index.ts"

// List of valid network names that should have icons
const VALID_NETWORKS = ["Arbitrum", "Avalanche", "BASE", "Celo", "Ethereum", "OP", "Polygon", "Soneium", "ZKSync"]

// Component to add icons to network headings in the Functions supported-networks page
export default function NetworkIcons() {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof document === "undefined") {
      return
    }

    // Store parent technologies for each h2 section
    const technologyMap = new Map<HTMLHeadingElement, string>()

    // Function to add an icon to a heading
    const addIconToHeading = (heading: HTMLHeadingElement, technology: string) => {
      // Skip if already has an icon
      if (heading.querySelector("img")) {
        return
      }

      // Skip if not a valid network
      if (!VALID_NETWORKS.includes(technology)) {
        return
      }

      // Get the normalized technology name for the icon path
      const normalizedTech = normalizeTechnologyName(technology)
      const iconPath = `/assets/chains/${normalizedTech}.svg`

      // Create the icon element
      const icon = document.createElement("img")
      icon.src = iconPath
      icon.alt = `${technology} icon`
      icon.style.width = "24px"
      icon.style.height = "24px"
      icon.style.marginRight = "8px"
      icon.style.display = "inline-block"
      icon.style.verticalAlign = "middle"

      // Ensure proper alignment with text
      icon.style.position = "relative"
      icon.style.top = "-1px"

      // Handle error if the icon fails to load
      icon.onerror = () => {
        icon.style.display = "none"
      }

      // Get any existing anchor element
      const existingAnchor = heading.querySelector("a")

      if (existingAnchor) {
        // Create a wrapper span to ensure proper alignment
        const wrapper = document.createElement("span")
        wrapper.style.display = "inline-flex"
        wrapper.style.alignItems = "center"
        wrapper.style.fontSize = "inherit"
        wrapper.style.lineHeight = "inherit"
        wrapper.style.fontFamily = "inherit"
        wrapper.style.fontWeight = "inherit"

        // Move the anchor content to the wrapper
        while (existingAnchor.firstChild) {
          wrapper.appendChild(existingAnchor.firstChild)
        }

        // Add the icon to the beginning of the wrapper
        wrapper.insertBefore(icon, wrapper.firstChild)

        // Add the wrapper to the anchor
        existingAnchor.appendChild(wrapper)
      } else {
        // Create a wrapper span to ensure proper alignment
        const wrapper = document.createElement("span")
        wrapper.style.display = "inline-flex"
        wrapper.style.alignItems = "center"
        wrapper.style.fontSize = "inherit"
        wrapper.style.lineHeight = "inherit"
        wrapper.style.fontFamily = "inherit"
        wrapper.style.fontWeight = "inherit"

        // Move the heading content to the wrapper
        while (heading.firstChild) {
          wrapper.appendChild(heading.firstChild)
        }

        // Add the icon to the beginning of the wrapper
        wrapper.insertBefore(icon, wrapper.firstChild)

        // Add the wrapper to the heading
        heading.appendChild(wrapper)
      }
    }

    // Find all h2 headings (main network sections)
    const h2Headings = document.querySelectorAll("h2")
    h2Headings.forEach((heading) => {
      const headingText = heading.textContent?.trim() || ""
      if (headingText) {
        // Store the technology name for this section
        technologyMap.set(heading as HTMLHeadingElement, headingText)

        // Add icon to the h2 heading
        addIconToHeading(heading as HTMLHeadingElement, headingText)
      }
    })

    // Find all h3 headings (network variants like mainnet/testnet)
    const h3Headings = document.querySelectorAll("h3")
    h3Headings.forEach((heading) => {
      // Style h3 headings similarly but don't add icons
      const existingAnchor = heading.querySelector("a")

      if (existingAnchor) {
        existingAnchor.style.display = "flex"
        existingAnchor.style.alignItems = "center"
      } else {
        heading.style.display = "flex"
        heading.style.alignItems = "center"
      }
    })
  }, [])

  // This component doesn't render anything visible
  return null
}
