import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
  SvgInformationCircle,
} from "@chainlink/blocks"
import React from "react"
import styles from "./Tooltip.module.css"

interface TooltipProps {
  /** Optional text or element shown next to the info icon. */
  label?: React.ReactNode
  /** Tooltip content. Can include links; the content stays open while hovered. */
  tip: React.ReactNode
  /** Optional custom trigger image. Defaults to the theme-aware info icon. */
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
export const Tooltip = ({ label, tip, imgURL, style, labelStyle, position = "top" }: TooltipProps) => (
  <div className={styles.wrapper} style={style}>
    <span className={styles.container}>
      {label && (
        <span className={styles.label} style={labelStyle}>
          {label}
        </span>
      )}
      <ResponsiveTooltip>
        <ResponsiveTooltipTrigger asChild>
          <button type="button" className={styles.trigger} aria-label="More information">
            {imgURL ? (
              <img src={imgURL} alt="" className={styles.icon} />
            ) : (
              <SvgInformationCircle color="currentColor" className={styles.icon} />
            )}
          </button>
        </ResponsiveTooltipTrigger>
        <ResponsiveTooltipContent side={position}>
          <div className={styles.tipContent}>{tip}</div>
        </ResponsiveTooltipContent>
      </ResponsiveTooltip>
    </span>
  </div>
)
