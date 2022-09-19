/** @jsxImportSource preact */
import h from "preact"
import { clsx } from "~/lib"

import { VideoPlayerIcon } from "../assets/VideoPlayerIcon"
import { LinkTuple } from "../types"
import productCard from "./ProductCard.module.css"

export type ProductCardProps = {
  title: string
  description: string
  image: string
  learnMorelink: string
  links: LinkTuple[]
  chains: string[]
}

export const ProductCard = (props: ProductCardProps) => {
  return (
    <section class={clsx("card", productCard.productCard)}>
      <div class={clsx(productCard.firstCol)}>
        <img src={props.image} />
        <div class={productCard.ctaCol}>
          <h4>
            <a href={props.learnMorelink}>{props.title}</a>
          </h4>
          <p>{props.description}</p>
        </div>
      </div>
      <div class={productCard.linksWrapper}>
        <div class={productCard.links}>
          {props.links.map((link) => (
            <div>
              <a href={link[1]}>{link[0]}</a>
            </div>
          ))}
          <div class={productCard.separator} />
          <div>
            <a href="#">
              <VideoPlayerIcon /> Video tutorials
            </a>
          </div>
        </div>
      </div>
      <div>
        <div class={productCard.networks}>
          <h6>Available on EVM Chains</h6>
          <div class={productCard.chainsWrapper}>
            {props.chains.map((chain) => (
              <img
                src={`/assets/chains/${chain}.svg`}
                class={productCard.chainIcon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
