import React from "react"

export function useScrollPosition(offset: number) {
  const [isAtTopOfPage, setIsAtTopOfPage] = React.useState(true)
  const [isAtBottomOfPage, setIsAtBottomOfPage] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      // Calculate if the user is at the bottom of the page.
      // We check if the sum of the height of the viewport (window.innerHeight)
      // and the scrolled amount (window.scrollY) is close to the height of the entire document.
      // The "- 5" is a buffer to account for minor discrepancies in some browsers or devices.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - offset

      if (window.scrollY > offset) {
        setIsAtTopOfPage(false)
      } else {
        setIsAtTopOfPage(true)
      }

      if (atBottom) {
        setIsAtBottomOfPage(true)
      } else {
        setIsAtBottomOfPage(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return { isAtTopOfPage, isAtBottomOfPage }
}
