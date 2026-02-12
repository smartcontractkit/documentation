import { useState, type ReactNode } from "react"
import SeeMore from "../SeeMore/SeeMore.tsx"
import "./Grid.css"

interface GridProps {
  items: any[]
  renderItem: (item: any, index: number) => ReactNode
  initialDisplayCount: number
  seeMoreLabel: string
  className?: string
  seeMoreLink?: string
}

function Grid({ items, renderItem, initialDisplayCount, seeMoreLabel, className = "grid", seeMoreLink }: GridProps) {
  const [seeMore, setSeeMore] = useState(items.length <= initialDisplayCount)

  return (
    <>
      <div className={className}>
        {items.slice(0, seeMore ? items.length : initialDisplayCount).map((item, index) => renderItem(item, index))}
      </div>
      {!seeMore && <SeeMore onClick={() => setSeeMore(!seeMore)} label={seeMoreLabel} href={seeMoreLink} />}
    </>
  )
}

export default Grid
