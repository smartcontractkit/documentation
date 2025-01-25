import React from "react"

type Props = {
  style?: React.CSSProperties
}

export const CaretIcon = ({ style }: Props) => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.70711 5.94975C2.31658 6.34028 2.31658 6.97344 2.70711 7.36397L6.94975 11.6066C6.99856 11.6554 7.05117 11.6981 7.10662 11.7347C7.49477 11.991 8.02225 11.9483 8.36396 11.6066L12.6066 7.36397C12.9971 6.97344 12.9971 6.34028 12.6066 5.94975C12.2161 5.55923 11.5829 5.55923 11.1924 5.94975L7.65686 9.48529L4.12132 5.94975C3.7308 5.55923 3.09763 5.55923 2.70711 5.94975Z"
    />
  </svg>
)
