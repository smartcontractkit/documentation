import "./SeeMore.css"
interface SeeMoreProps {
  onClick?: () => void
}

function SeeMore({ onClick }: SeeMoreProps) {
  return (
    <div className="seeMore__container">
      <button className="seeMore" onClick={onClick}>
        See more
      </button>
    </div>
  )
}

export default SeeMore
