import React from "react"

interface IconProps {
  width?: number
  height?: number
  className?: string
}

export const MailIcon: React.FC<IconProps> = ({ width = 20, height = 20, className }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 7L13.03 13.2C12.7 13.42 12.35 13.53 12 13.53C11.65 13.53 11.3 13.42 10.97 13.2L2 7"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MailIcon
