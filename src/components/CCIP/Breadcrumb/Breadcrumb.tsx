import "./Breadcrumb.css"

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
        <>
          <a key={index} href={item.url} className="ccip-hero__breadcrumb__item">
            {item.name}
          </a>
          {index < items.length - 1 && <img src="/assets/icons/breadcrumb-arrow.svg" alt="" />}
        </>
      ))}
    </div>
  )
}

export default Breadcrumb
