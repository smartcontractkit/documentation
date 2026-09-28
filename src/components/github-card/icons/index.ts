import githubSvgCard from "./github-svg-card.svg"
import chainlinkSvgCard from "./chainlink-svg-card.svg"

export const cardIcons = {
  "github-svg-card": githubSvgCard,
  "chainlink-svg-card": chainlinkSvgCard,
} as const

export type CardIconName = keyof typeof cardIcons
