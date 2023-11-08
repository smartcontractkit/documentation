/** @jsxImportSource preact */
import { clsx } from "~/lib"

import productCard from "./ProductCard.module.css"
import { ImageMetadata } from "astro"

export type ProductCardProps = {
  title: string
  description: string
  image: ImageMetadata
  shape: ImageMetadata
  learnMorelink: string
  chains: { id: string; title: string }[]
}

export const ProductCard = (props: ProductCardProps) => {
  const productCardClasses = clsx({
    [productCard.productCard]: true,
    [productCard.productCardWithTransition]: props.chains.length > 0,
  })

  return (
    <div class={productCard.productCardWrapper}>
      <a href={props.learnMorelink} class={productCardClasses}>
        <img
          loading="lazy"
          src={props.image.src}
          class={productCard.logo}
          width={64}
          height={64}
          alt={`Chainlink ${props.title}`}
        />
        <div class={productCard.content}>
          <h3 class={productCard.heading}>{props.title}</h3>
          <p class={productCard.paragraph}>{props.description}</p>
          {props.chains.length > 0 && (
            <div class={productCard.chains}>
              <div class={productCard.chainsSupported}>Chains supported</div>
              <div class={productCard.chainsWrap}>
                {props.chains.map((chain) => (
                  <img src={`/assets/chains/${chain.id}.svg`} class={productCard.chainsLogo} title={chain.title} />
                ))}
              </div>
            </div>
          )}
        </div>
        <img loading="lazy" src={props.shape.src} alt="" width={24} height={24} class={productCard.backgroundShape} />
      </a>
    </div>
  )
}
