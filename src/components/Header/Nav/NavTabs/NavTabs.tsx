import React from "react"
import { clsx } from "../utils"
import { Divider } from "../Divider"
import { isMatchedPath } from "../isMatchedPath"
import { Arrow } from "./Arrow"
import styles from "./navTabs.module.css"

export type NavTabsOption = {
  label: string
  href: string
}

type Props = {
  options: NavTabsOption[]
  path: string
}

const isTabIndexValid = (index: number | undefined) => typeof index === "number" && index > -1

export const NavTabs: React.FC<Props> = ({ options, path }) => {
  const defaultTabIndex = options.findIndex((option) => isMatchedPath(path, option.href))

  const [highlightedTabIndex, setHighlightedTabIndex] = React.useState<number | undefined>()
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number | undefined>(defaultTabIndex)
  const [arrowLeftPosition, setArrowLeftPosition] = React.useState<string | undefined>(undefined)
  const [hoveredComponent, setHoveredComponent] = React.useState(false)
  const [transition, setTransition] = React.useState<"fade" | "slide" | undefined>(
    !isTabIndexValid(defaultTabIndex) ? "fade" : undefined
  )

  const currentTabIndex = highlightedTabIndex ?? selectedTabIndex
  const arrowOpacity = hoveredComponent || isTabIndexValid(currentTabIndex) ? 1 : 0

  const tabRefs = React.useRef<{ [key: number]: HTMLLIElement | null }>({})
  const calculateLeftPosition = React.useCallback((index: number | undefined) => {
    if (index === undefined) return
    const element = tabRefs.current[index]
    if (typeof index === "number" && element) {
      const offsetLeft = element.offsetLeft
      const halfWidth = element.offsetWidth / 2
      return `calc(${offsetLeft}px + ${halfWidth}px - 9px)`
    }
    return undefined
  }, [])

  React.useEffect(() => {
    if (hoveredComponent || isTabIndexValid(selectedTabIndex)) {
      setArrowLeftPosition(calculateLeftPosition(currentTabIndex))
    }
  }, [currentTabIndex, calculateLeftPosition, hoveredComponent])

  const handleMouseEnter = (index: number) => {
    if (hoveredComponent || isTabIndexValid(defaultTabIndex)) {
      setTransition("slide")
    } else {
      setHoveredComponent(true)
      setTransition("fade")
    }
    setHighlightedTabIndex(index)
  }

  const handleMouseLeave = () => {
    if (!isTabIndexValid(selectedTabIndex)) {
      setHoveredComponent(false)
      setTransition("fade")
      setHighlightedTabIndex(undefined)
    } else {
      setHighlightedTabIndex(selectedTabIndex)
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <ul className={clsx(styles.navTabs)} onMouseLeave={handleMouseLeave}>
        <Divider />
        {options.map((option, index) => (
          <li
            ref={(element) => (tabRefs.current[index] = element)}
            key={option.label}
            onClick={() => setSelectedTabIndex(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <a
              className={clsx(
                ((!highlightedTabIndex && selectedTabIndex === index) || highlightedTabIndex === index) &&
                  styles.highlighted,
                "text-300"
              )}
              href={option.href}
            >
              {option.label}
            </a>
          </li>
        ))}
        {arrowLeftPosition && (
          <Arrow
            style={{ left: arrowLeftPosition, opacity: arrowOpacity }}
            className={clsx(transition && styles[transition])}
          />
        )}
      </ul>
    </div>
  )
}
