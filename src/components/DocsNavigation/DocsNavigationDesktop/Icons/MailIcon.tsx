import React from "react"

interface IconProps {
  width?: number
  height?: number
  className?: string
}

export const MailIcon: React.FC<IconProps> = ({ width = 20, height = 20, className }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 16" fill="none" className={className}>
      <path
        d="M1.66699 4L9.00033 8L16.3337 4M1.66699 2H16.3337V14H1.66699V2Z"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MailIcon
