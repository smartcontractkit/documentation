import "./Segments.css"

interface SegmentsProps {
  tabs: {
    name: string
    id: string
    default?: boolean
  }[]
}

function Segments({ tabs }: SegmentsProps) {
  const network = new URLSearchParams(window?.location.search).get("network")
  const activeTab = tabs.find((tab) => tab.id === network)?.id || tabs.find((tab) => tab.default)?.id || tabs[0].id
  return (
    <div className="segments__container">
      {tabs.map((tab) => (
        <a key={tab.id} href={`?network=${tab.id}`} className={tab.id === activeTab ? "active" : ""}>
          {tab.name}
        </a>
      ))}
    </div>
  )
}

export default Segments
