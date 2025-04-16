import React from "react"

interface IconProps {
  width?: number
  height?: number
  className?: string
}

export const PageIcon: React.FC<IconProps> = ({ width = 20, height = 20, className }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 3C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9L14 3H6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M14 3V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default PageIcon
