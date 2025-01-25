import React, { useState, useEffect } from "react"
import headerbanner from "@chainlink/design-system/headerbanner.module.css"
import headerbannerCustom from "./headerBanner.module.css"
import { clsx } from "~/lib"
import { CloseIcon } from "./CloseIcon"

type BannerType = "info" | "success" | "warning" | "danger"
export type BannerContent = {
  description: string
  type: BannerType
  linkText?: string
  linkUrl?: string
}

const bannerTypes: Record<BannerType, { primaryColour: string; textColour: string }> = {
  info: {
    primaryColour: "#1a2b6b",
    textColour: "var(--white)",
  },
  success: {
    primaryColour: "var(--green-600)",
    textColour: "var(--white)",
  },
  warning: {
    primaryColour: "var(--yellow-400)",
    textColour: "var(--black)",
  },
  danger: {
    primaryColour: "var(--red-600)",
    textColour: "var(--black)",
  },
}

export const HeaderBanner: React.FC<{ bannerContent?: BannerContent }> = ({ bannerContent }) => {
  const [isDismissed, setIsDismissed] = useState(true) // Change to false to show banner later to prevent flasing on page load for users who have already dismissed it
  useEffect(() => {
    const isDismissedLocalStorage = localStorage.getItem("headerBannerDismissed")
    if (!isDismissedLocalStorage || isDismissedLocalStorage !== bannerContent?.description) {
      setIsDismissed(false)
    }
  }, [isDismissed])
  if (!bannerContent || isDismissed) return null
  return (
    <div
      className={clsx(headerbanner.container, headerbannerCustom.container)}
      style={{ backgroundColor: bannerTypes[bannerContent.type].primaryColour }}
    >
      <p style={{ color: bannerTypes[bannerContent.type].textColour }} className="text-200">
        {bannerContent.description}{" "}
        {bannerContent.linkUrl && (
          <a
            target="_blank"
            href={bannerContent.linkUrl}
            style={{ color: bannerTypes[bannerContent.type].textColour, textDecoration: "underline" }}
          >
            {bannerContent.linkText}
          </a>
        )}
      </p>
      <button
        className={headerbannerCustom.dismiss}
        onClick={() => {
          localStorage.setItem("headerBannerDismissed", bannerContent.description)
          setIsDismissed(true)
        }}
      >
        <CloseIcon />
      </button>
    </div>
  ) as React.ReactElement // Explicitly assigning to ReactElement cause TS is confused otherwise
}
