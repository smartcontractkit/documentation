/**
 * Fix for 1Password and other browser extensions that bundle Prism.js
 *
 * Problem: Extensions with bundled Prism.js (especially 1Password beta/nightly)
 * run Prism.highlightAll() on page load, which strips our syntax highlighting
 * by removing .token spans and even <pre> wrappers.
 *
 * Solution: Detect when highlighting is stripped and re-apply it.
 * Only targets code BLOCKS (pre>code), not inline code elements.
 */

// Extend Window interface to include Prism
declare global {
  interface Window {
    Prism?: {
      highlightAll: () => void
    }
  }
}

let isFixing = false
let retryCount = 0
const MAX_RETRIES = 3

/**
 * Check if Prism highlighting has been compromised
 * Returns true if we find code blocks that should be highlighted but aren't
 */
function isPrismCompromised(): boolean {
  // Look for code elements with language-* class but no token spans inside
  const codeBlocks = document.querySelectorAll('pre code[class*="language-"]')

  for (const block of Array.from(codeBlocks)) {
    const hasTokens = block.querySelector('[class*="token"]')
    if (!hasTokens && block.textContent && block.textContent.trim().length > 0) {
      // Found a code block that should be highlighted but isn't
      return true
    }
  }

  return false
}

/**
 * Re-highlight all code blocks using Prism
 */
function reHighlightCode() {
  if (isFixing) return

  isFixing = true
  retryCount++

  try {
    // Check if Prism is available
    if (typeof window.Prism !== "undefined") {
      // Re-run Prism highlighting on all code blocks
      window.Prism.highlightAll()
      console.log("[Prism Fix] Re-applied syntax highlighting (retry", retryCount, ")")
    }
  } catch (error) {
    console.error("[Prism Fix] Error re-highlighting:", error)
  } finally {
    isFixing = false
  }
}

/**
 * Check and fix Prism highlighting after a delay
 */
function checkAndFix(delay = 100) {
  setTimeout(() => {
    if (isPrismCompromised() && retryCount < MAX_RETRIES) {
      reHighlightCode()
    }
  }, delay)
}

/**
 * Initialize the fix
 */
function init() {
  // Check immediately after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => checkAndFix(50))
  } else {
    checkAndFix(50)
  }

  // Check again after a short delay (in case extension runs after us)
  checkAndFix(200)
  checkAndFix(500)

  // Set up a MutationObserver to detect if extension modifies code blocks
  const observer = new MutationObserver((mutations) => {
    // Check if any mutation affected code blocks
    for (const mutation of mutations) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const target = mutation.target as HTMLElement

        // Check if the mutation is inside a code block
        const codeBlock = target.closest('pre code[class*="language-"]')
        if (codeBlock) {
          checkAndFix(100)
          break
        }
      }
    }
  })

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  })
}

// Only run in browser
if (typeof window !== "undefined") {
  init()
}
