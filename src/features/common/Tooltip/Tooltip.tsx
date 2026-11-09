import { ResponsiveTooltip, ResponsiveTooltipContent, ResponsiveTooltipTrigger } from "@chainlink/blocks"
import React from "react"
import styles from "./Tooltip.module.css"

interface TooltipProps {
  /** Optional text or element shown next to the info icon. */
  label?: React.ReactNode
  /** Tooltip content. Can include links; the content stays open while hovered. */
  tip: React.ReactNode
  /** URL for the trigger icon. Defaults to Chainlink's info icon. */
  imgURL?: string
  /** Styles for the outer container. */
  style?: React.CSSProperties
  /** Styles for the label. */
  labelStyle?: React.CSSProperties
  /** Side of the icon the tooltip opens on. */
  position?: "top" | "bottom" | "right" | "left"
}

/**
 * Info icon with a tooltip, built on the `@chainlink/blocks` ResponsiveTooltip.
 * Opens on hover or keyboard focus on desktop, and on tap on small screens.
 *
 * @example
 * <Tooltip label="Chain selector" tip="CCIP Blockchain identifier" />
 */
export const Tooltip = ({
  label,
  tip,
  imgURL = "https://d2f70xi62kby8n.cloudfront.net/icons/info.svg?auto=compress%2Cformat",
  style,
  labelStyle,
  position = "top",
}: TooltipProps) => (
  <div style={style}>
    <span className={styles.container}>
      {label && (
        <span className={styles.label} style={labelStyle}>
          {label}
        </span>
      )}
      <ResponsiveTooltip>
        <ResponsiveTooltipTrigger asChild>
          <button type="button" className={styles.trigger}>
            <img src={imgURL} alt="info" className={styles.icon} />
          </button>
        </ResponsiveTooltipTrigger>
        <ResponsiveTooltipContent side={position}>{tip}</ResponsiveTooltipContent>
      </ResponsiveTooltip>
    </span>
  </div>
)
