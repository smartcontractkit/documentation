import { memo, type ReactNode } from "react"
import "./Card.css"

interface CardProps {
  logo: ReactNode
  title: string
  subtitle?: string
  link?: string
  onClick?: () => void
  ariaLabel?: string
}

const Card = memo(function Card({ logo, title, subtitle, link, onClick, ariaLabel }: CardProps) {
  const content = (
    <>
      {logo}
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </>
  )

  if (link) {
    return (
      <a href={link} aria-label={ariaLabel}>
        <div className="card__container">{content}</div>
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" className="card__container" onClick={onClick} aria-label={ariaLabel || title}>
        {content}
      </button>
    )
  }

  return <div className="card__container">{content}</div>
})

export default Card
