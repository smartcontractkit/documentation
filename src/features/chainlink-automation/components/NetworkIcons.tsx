/** @jsxImportSource preact */
import { useEffect } from "preact/compat"
import { normalizeTechnologyName } from "@features/utils/index.ts"

// Component to add icons to network headings in the Automation supported-networks page
export default function NetworkIcons() {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof document === "undefined") {
      return
    }

    // List of valid blockchain networks that should have icons (in uppercase as used in the codebase)
    const validNetworks = [
      "ARBITRUM",
      "AVALANCHE",
      "BASE",
      "BNB",
      "ETHEREUM",
      "FANTOM",
      "GNOSIS",
      "OP",
      "POLYGON",
      "POLYGON_ZKEVM",
      "SCROLL",
      "ZKSYNC",
    ]

    // Special mapping for display names to technology identifiers
    const displayNameToTechnology: Record<string, string> = {
      Polygon: "POLYGON",
      "Polygon zkEVM": "POLYGON_ZKEVM",
      // Add other mappings as needed
    }

    // Function to add an icon to a heading
    const addIconToHeading = (heading: HTMLElement, technology: string) => {
      // Skip if already has an icon
      if (heading.querySelector("img")) {
        return
      }

      // Get the normalized technology name for icon path
      const normalizedTech = normalizeTechnologyName(technology)
      const iconPath = `/assets/chains/${normalizedTech}.svg`

      console.log(`Adding icon for ${technology}, normalized to ${normalizedTech}, path: ${iconPath}`)

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
        console.log(`Failed to load icon for ${technology} at path ${iconPath}`)
        icon.style.display = "none"
      }

      // For SectionWrapper titles, we need to handle them differently
      if (heading.classList.contains("section-title")) {
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
      } else {
        // For regular h2 elements, check if there's an anchor element
        const anchor = heading.querySelector("a")
        if (anchor) {
          // Create a wrapper span to ensure proper alignment
          const wrapper = document.createElement("span")
          wrapper.style.display = "inline-flex"
          wrapper.style.alignItems = "center"
          wrapper.style.fontSize = "inherit"
          wrapper.style.lineHeight = "inherit"
          wrapper.style.fontFamily = "inherit"
          wrapper.style.fontWeight = "inherit"

          // Move the anchor content to the wrapper
          while (anchor.firstChild) {
            wrapper.appendChild(anchor.firstChild)
          }

          // Add the icon to the beginning of the wrapper
          wrapper.insertBefore(icon, wrapper.firstChild)

          // Add the wrapper to the anchor
          anchor.appendChild(wrapper)
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
    }

    // Function to process headings
    const processHeadings = () => {
      console.log("Processing headings for icons")

      // Try to find the section wrapper titles
      const headings = document.querySelectorAll('.section-wrapper[data-depth="2"] .section-title')
      console.log(`Found ${headings.length} section wrapper headings`)

      if (headings.length > 0) {
        // Process section wrapper headings
        headings.forEach((heading) => {
          const headingText = heading.textContent?.trim() || ""
          console.log(`Found section heading: "${headingText}"`)

          // Skip "Parameters" heading
          if (headingText && headingText !== "Parameters") {
            // First check if we have an exact match in our display name mapping
            if (displayNameToTechnology[headingText]) {
              const technology = displayNameToTechnology[headingText]
              console.log(`Exact match for heading "${headingText}" with technology "${technology}"`)
              addIconToHeading(heading as HTMLElement, technology)
              return
            }

            // If no exact match, try to match with a valid network
            for (const network of validNetworks) {
              if (
                headingText.toUpperCase() === network ||
                headingText.toUpperCase().includes(network) ||
                network.includes(headingText.toUpperCase())
              ) {
                console.log(`Matched heading "${headingText}" with network "${network}"`)
                addIconToHeading(heading as HTMLElement, network)
                break
              }
            }
          }
        })
      } else {
        // If no section wrapper headings found, try regular h2 headings
        const h2Headings = document.querySelectorAll("h2")
        console.log(`Found ${h2Headings.length} h2 headings`)

        h2Headings.forEach((heading) => {
          const headingText = heading.textContent?.trim() || ""
          console.log(`Found h2 heading: "${headingText}"`)

          // Skip "Parameters" heading
          if (headingText && headingText !== "Parameters") {
            // First check if we have an exact match in our display name mapping
            if (displayNameToTechnology[headingText]) {
              const technology = displayNameToTechnology[headingText]
              console.log(`Exact match for heading "${headingText}" with technology "${technology}"`)
              addIconToHeading(heading as HTMLElement, technology)
              return
            }

            // If no exact match, try to match with a valid network
            for (const network of validNetworks) {
              if (
                headingText.toUpperCase() === network ||
                headingText.toUpperCase().includes(network) ||
                network.includes(headingText.toUpperCase())
              ) {
                console.log(`Matched heading "${headingText}" with network "${network}"`)
                addIconToHeading(heading as HTMLElement, network)
                break
              }
            }
          }
        })
      }
    }

    // Try multiple times with increasing delays
    const delays = [500, 1000, 2000, 3000]
    delays.forEach((delay) => {
      setTimeout(processHeadings, delay)
    })
  }, [])

  // This component doesn't render anything visible
  return null
}
