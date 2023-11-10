import React from 'react'

type Props = {
  style?: React.CSSProperties
  className?: string
}

export const Arrow = ({ style = {}, className = '' }: Props) => (
  <svg
    style={style}
    width="18"
    height="7"
    viewBox="0 0 18 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M9 7L0.339744 -0.5L17.6603 -0.500001L9 7Z" fill="#4771D1" />
  </svg>
)
