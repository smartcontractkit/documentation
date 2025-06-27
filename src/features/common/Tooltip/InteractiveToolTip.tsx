import React, { useState, useRef } from "react"

interface InteractiveTooltipProps {
  label?: React.ReactNode
  tip: React.ReactNode
  imgURL?: string
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  label,
  tip,
  imgURL = "https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat",
}) => {
  const [visible, setVisible] = useState(false)
  const closeTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setVisible(true)
  }

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setVisible(false)
    }, 200)
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        position: "relative",
      }}
    >
      {label && <span>{label}</span>}

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: "relative", display: "inline-block" }}
      >
        <img src={imgURL} alt="info" style={{ width: "16px", height: "16px", cursor: "pointer" }} />

        {visible && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              background: "#0e0f13",
              color: "#c9cbd1",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "14px",
              lineHeight: "1.4",
              width: "280px",
              whiteSpace: "normal",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              zIndex: 9999,
              position: "absolute",
              bottom: "100%",
              left: "50%", // start centered under icon
              transform: "translateX(-50%)", // perfect horizontal centering
              marginBottom: "10px",
              pointerEvents: "auto",
            }}
          >
            {/* ✅ Centered caret below tooltip box */}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #0e0f13",
              }}
            />
            <div className="tooltip-content">{tip}</div>
            <style>
              {`
                .tooltip-content a {
                  color: #639CFF;
                  text-decoration: none;
                }

                .tooltip-content a:hover {
                  text-decoration: underline;
                }
              `}
            </style>
          </div>
        )}
      </div>
    </div>
  )
}
