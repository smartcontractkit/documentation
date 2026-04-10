import githubSvgCard from "./github-svg-card.svg"

export const cardIcons = {
  "github-svg-card": githubSvgCard,
} as const

export type CardIconName = keyof typeof cardIcons
