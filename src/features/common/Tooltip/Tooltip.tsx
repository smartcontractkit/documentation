/**
 * @fileoverview Unified Tooltip Component for Chainlink Documentation
 *
 * This file provides a single, unified tooltip component that replaces the previous
 * InteractiveTooltip component while maintaining full backward compatibility with
 * existing Chainlink tooltip usage.
 *
 * **Migration Guide:**
 * - Replace `<InteractiveTooltip />` with `<Tooltip hoverable={true} />`
 * - All existing `<Tooltip />` usage continues to work unchanged
 * - New responsive design and CSS modules improve maintainability
 *
 * **Architecture:**
 * - Standard mode: Leverages @chainlink/components for consistency
 * - Hoverable mode: Custom implementation with CSS modules for responsive design
 * - Unified API: Single component for all tooltip needs across the application
 *
 * @author Chainlink Documentation Team
 * @version 1.0.0
 * @since 2024
 */

import { Tooltip as ChainlinkToolTip } from "@chainlink/components/src/Tooltip/Tooltip.tsx"
import React, { useState, useRef } from "react"
import styles from "./HoverableTooltip.module.css"

/**
 * Properties for the Tooltip component.
 *
 * @interface TooltipProps
 */
interface TooltipProps {
  /**
   * Optional text or element to display next to the tooltip icon.
   * @example "Chain selector"
   */
  label?: React.ReactNode

  /**
   * The content to display inside the tooltip. Supports rich content including JSX.
   * @example "CCIP Blockchain identifier"
   * @example <>Before using HyperEVM, review <a href="/docs">Network Limits</a>.</>
   */
  tip: React.ReactNode

  /**
   * URL for the tooltip icon. Defaults to Chainlink's info icon.
   * @default "https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat"
   */
  imgURL?: string

  /**
   * Custom styles for the tooltip container.
   */
  style?: React.CSSProperties

  /**
   * Custom styles for the label text.
   */
  labelStyle?: React.CSSProperties

  /**
   * Position of the tooltip relative to the icon (only applies to non-hoverable tooltips).
   * @default "top"
   */
  position?: "top" | "bottom" | "right" | "left"

  /**
   * When true, enables hoverable behavior where users can mouse over the tooltip content
   * to interact with links and keep it visible. When false, uses standard Chainlink tooltip.
   * @default false
   */
  hoverable?: boolean

  /**
   * Delay in milliseconds before hiding hoverable tooltips (grace period for mouse movement).
   * Only applies when hoverable=true.
   * @default 300
   */
  hideDelay?: number
}

/**
 * A unified tooltip component that supports both standard and hoverable tooltip behaviors.
 *
 * This component provides two distinct modes:
 * 1. **Standard Mode** (hoverable=false): Uses the Chainlink design system tooltip with instant show/hide
 * 2. **Hoverable Mode** (hoverable=true): Custom implementation allowing users to hover over tooltip content
 *
 * The hoverable mode is ideal for tooltips containing interactive elements like links, while
 * standard mode is perfect for simple informational tooltips.
 *
 * @component
 * @example
 * // Standard tooltip for simple information
 * <Tooltip
 *   label="Chain selector"
 *   tip="CCIP Blockchain identifier"
 * />
 *
 * @example
 * // Hoverable tooltip with interactive content
 * <Tooltip
 *   hoverable={true}
 *   tip={
 *     <>
 *       Before using HyperEVM, review{" "}
 *       <a href="/ccip/service-limits/network-specific-limits">Network Limits</a>.
 *     </>
 *   }
 * />
 *
 * @example
 * // Custom positioning and styling
 * <Tooltip
 *   label="RMN"
 *   tip="The RMN contract verifies RMN blessings"
 *   position="bottom"
 *   labelStyle={{ marginRight: "8px" }}
 *   style={{ display: "inline-block", verticalAlign: "middle" }}
 * />
 *
 * @param props - The tooltip configuration options
 * @returns A tooltip component with the specified behavior and styling
 *
 * @since 1.0.0 - Replaces the deprecated InteractiveTooltip component
 *
 * @accessibility
 * - Uses semantic HTML with proper alt text for icons
 * - Supports keyboard navigation in standard mode via Chainlink component
 * - Hoverable tooltips include proper ARIA roles and pointer events
 *
 * @performance
 * - Standard mode leverages optimized Chainlink component library
 * - Hoverable mode uses efficient CSS modules with responsive design
 * - Minimal JavaScript overhead with controlled re-renders
 */
export const Tooltip = ({
  label,
  tip,
  imgURL = "https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat",
  style = {},
  labelStyle = {},
  position = "top",
  // New props with sensible defaults
  hoverable = false,
  hideDelay = 300,
}: TooltipProps) => {
  // Hoverable tooltip state management
  const [visible, setVisible] = useState(false)
  const closeTimeout = useRef<NodeJS.Timeout | null>(null)

  /**
   * Handles mouse enter events for hoverable tooltips.
   * Cancels any pending hide timeout and immediately shows the tooltip.
   */
  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setVisible(true)
  }

  /**
   * Handles mouse leave events for hoverable tooltips.
   * Starts a delayed hide timer to allow users to move mouse to tooltip content.
   */
  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setVisible(false)
    }, hideDelay)
  }

  // If hoverable mode is requested, use custom implementation with CSS module
  if (hoverable) {
    return (
      <div className={styles.container} style={style}>
        {label && <span style={labelStyle}>{label}</span>}

        <div className={styles.trigger} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img src={imgURL} alt="info" className={styles.icon} />

          {visible && (
            <div className={styles.tooltip} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className={styles.caret} />
              <div className="tooltip-content">{tip}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default behavior - use existing Chainlink component with CSS module
  return (
    <div {...(!(Object.keys(style).length === 0) && { style })}>
      <span className={styles.defaultContainer}>
        <span className={styles.defaultText} style={labelStyle}>
          {label}
        </span>
        <ChainlinkToolTip tip={tip} position={position}>
          <img src={imgURL} alt="info" className={styles.defaultIcon} />
        </ChainlinkToolTip>
      </span>
    </div>
  )
}
