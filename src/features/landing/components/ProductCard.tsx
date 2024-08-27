/** @jsxImportSource preact */
import { clsx } from "~/lib"

import productCard from "./ProductCard.module.css"
import { ImageMetadata } from "astro"

export type ProductCardProps = {
  title: string
  description: string
  image: ImageMetadata
  shape: ImageMetadata
  docsLandingLink: string
  learnMoreLink: string
  chains: { id: string; title: string }[]
}

export const ProductCard = (props: ProductCardProps) => {
  return (
    <div class={productCard.productCardWrapper}>
      <a href={props.docsLandingLink} class={productCard.productCard}>
        <div class={productCard.heading}>
          <img
            loading="lazy"
            src={props.image.src}
            class={productCard.logo}
            width={64}
            height={64}
            alt={`Chainlink ${props.title}`}
          />
          <h3>{props.title}</h3>
        </div>
        <div class={productCard.content}>
          <p class={productCard.paragraph}>{props.description}</p>
        </div>
      </a>
    </div>
  )
}
