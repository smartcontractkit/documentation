import React from "react"

type Props = {
  style?: React.CSSProperties
}

export const CloseIcon = ({ style }: Props) => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <circle cx="12.1406" cy="12" r="12" transform="rotate(180 12.1406 12)" fill="white" />
    <path d="M16.1406 8L8.14062 16" stroke="#1A2B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.14062 8L16.1406 16" stroke="#1A2B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
