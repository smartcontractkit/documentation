import "./SeeMore.css"
interface SeeMoreProps {
  onClick?: () => void
  label?: string
  href?: string
}

function SeeMore({ onClick, label = "See more", href }: SeeMoreProps) {
  return (
    <div className="seeMore__container">
      {href ? (
        <a href={href} className="seeMore" aria-label={label}>
          {label}
        </a>
      ) : (
        <button className="seeMore" onClick={onClick} aria-label={label}>
          {label}
        </button>
      )}
    </div>
  )
}

export default SeeMore
