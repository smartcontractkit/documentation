import { useState } from "react"
import "./Tabs.css"
import { clsx } from "~/lib"

interface TabsProps {
  tabs: {
    name: string
    key: string
  }[]
  onChange: (key: string) => void
}

function Tabs({ tabs, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].key)

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    onChange(key)
  }
  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={clsx("tabs__tab", {
            "tabs__tab--active": activeTab === tab.key,
          })}
          onClick={() => handleTabChange(tab.key)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}

export default Tabs
