import React from "react"
import { getIconUrl } from "./utils"
import { AppName, config } from "./config"

type Props = {
  app: AppName
}
export const Logo = ({ app }: Props) => {
  const { logo } = config[app]
  return (
    <a className="home-logo" href={logo.href}>
      <picture>
        <source srcSet={getIconUrl(`logo-${logo.productIcon}`)} media="(max-width: 480px)" height={24} />

        <img
          alt={`Chainlink ${app}`}
          title={`Chainlink ${app}`}
          style={{ display: "flex" }}
          src={getIconUrl(`logo-${logo.ecosystemIcon}`)}
          height={28}
        />
      </picture>
    </a>
  )
}
