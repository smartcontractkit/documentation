import React from "react"

export type ScrollDirection = "up" | "down"

export function useScrollDirection() {
  const [lastScrollTop, setLastScrollTop] = React.useState(0)
  const [direction, setDirection] = React.useState<ScrollDirection>("up")

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      if (scrollTop > lastScrollTop) {
        setDirection("down")
      } else {
        setDirection("up")
      }

      setLastScrollTop(scrollTop)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollTop])

  return direction
}
