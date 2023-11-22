import React from "react"

type Props = {
  scrollDirection: "down" | "up"
  isAtTopOfPage: boolean
  isAtBottomOfPage: boolean
  isMenuOpen: boolean
  onHideChange: any
}

export const useHideHeader = ({
  scrollDirection,
  isAtTopOfPage,
  isAtBottomOfPage,
  isMenuOpen,
  onHideChange,
}: Props) => {
  let shouldHideHeader = false

  if (scrollDirection === "down") {
    shouldHideHeader = true
  }

  if (isAtTopOfPage) {
    shouldHideHeader = false
  }

  if (isAtBottomOfPage) {
    shouldHideHeader = true
  }

  if (isMenuOpen) {
    shouldHideHeader = false
  }

  React.useEffect(() => {
    if (onHideChange) {
      onHideChange(shouldHideHeader)
    }
  }, [shouldHideHeader])

  return { shouldHideHeader }
}
