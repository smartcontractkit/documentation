import "./SeeMore.css"
interface SeeMoreProps {
  onClick?: () => void
}

function SeeMore({ onClick }: SeeMoreProps) {
  return (
    <button className="seeMore" onClick={onClick}>
      See more
    </button>
  )
}

export default SeeMore
