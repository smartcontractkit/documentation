import "./Breadcrumb.css"
import { Fragment } from "react"

interface BreadcrumbProps {
  items: {
    name: string
    url: string
  }[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="ccip-hero__breadcrumb">
      {items.map((item, index) => (
        <Fragment key={index}>
          <a href={item.url} className="ccip-hero__breadcrumb__item">
            {item.name}
          </a>
          {index < items.length - 1 && <img src="/assets/icons/breadcrumb-arrow.svg" alt="" />}
        </Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
