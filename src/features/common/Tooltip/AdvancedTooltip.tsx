import React, { useState, useRef, useEffect } from "react"

type TooltipProps = {
  label: string
  children: React.ReactNode
  imgURL?: string
  style?: React.CSSProperties
  labelStyle?: React.CSSProperties
}

export const AdvancedTooltip: React.FC<TooltipProps> = ({
  label,
  children,
  imgURL = "https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat",
  style = {},
  labelStyle = {},
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setIsOpen(true)
  }

  const hideTooltip = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const tooltipBoxStyle: React.CSSProperties = {
    position: "absolute",
    backgroundColor: "white",
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    maxWidth: "300px",
    width: "max-content",
    fontSize: "12px",
    lineHeight: "1.4",
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    top: "110%",
    left: "50%",
    transform: "translateX(-30%)",
  }

  const tooltipArrowStyle: React.CSSProperties = {
    position: "absolute",
    borderStyle: "solid",
    borderWidth: "6px",
    borderColor: "transparent transparent white transparent",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
  }

  const containerStyle: React.CSSProperties = {
    display: "inline-block",
    position: "relative",
    ...style,
  }

  const labelContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    ...labelStyle,
  }

  const iconStyle: React.CSSProperties = {
    marginLeft: "4px",
    height: "0.8em",
  }

  return (
    <div style={containerStyle} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      <span style={labelContainerStyle}>
        <span>{label}</span>
        <img src={imgURL} alt="info" style={iconStyle} />
      </span>

      {isOpen && (
        <div ref={tooltipRef} style={tooltipBoxStyle} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
          <div style={tooltipArrowStyle}></div>
          <div style={{ whiteSpace: "normal" }}>{children}</div>
        </div>
      )}
    </div>
  )
}
