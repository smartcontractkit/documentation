import "./Segments.css"

interface SegmentsProps {
  tabs: {
    name: string
    id: string
    active?: boolean
  }[]
}

function Segments({ tabs }: SegmentsProps) {
  return (
    <div className="segments__container">
      {tabs.map((tab) => (
        <a key={tab.id} href={`/ccip/directory/${tab.id}`} className={tab.active ? "active" : ""}>
          {tab.name}
        </a>
      ))}
    </div>
  )
}

export default Segments
