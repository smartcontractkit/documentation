import React from "react"

interface IconProps {
  width?: number
  height?: number
  className?: string
}

export const PageIcon: React.FC<IconProps> = ({ width = 20, height = 20, className }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" className={className}>
      <path
        d="M4.66699 12.3332V13.6665M9.66699 16.3332H16.3337V4.99984L13.0003 1.6665H4.33366V7.6665M4.66689 9.7599L1.66699 11.3332V14.6666L4.66699 16.2466L7.66699 14.6666V11.3332L4.66689 9.7599Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default PageIcon
