import React, { useState, useEffect } from "react"
import headerbanner from "@chainlink/design-system/headerbanner.module.css"
import headerbannerCustom from "./headerBanner.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { CloseIcon } from "./CloseIcon.tsx"

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
  const [cookieValue, setCookieValue] = useState([])
  const [isDismissed, setIsDismissed] = useState(true) // Change to false to show banner later to prevent flasing on page load for users who have already dismissed it

  if (!bannerContent) return null
  useEffect(() => {
    const dismissedBannersCookie = getCookie("headerBannerDismissed")
    const parsedCookieValue = JSON.parse(dismissedBannersCookie || "[]")
    setCookieValue(parsedCookieValue)
    if (!parsedCookieValue.includes(bannerContent.description)) {
      setIsDismissed(false)
    }
  }, [isDismissed])
  if (isDismissed) return null
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
          const newCookieValue = [...cookieValue, bannerContent.description]
          setCookie("headerBannerDismissed", JSON.stringify(newCookieValue), 365)
          setIsDismissed(true)
        }}
      >
        <CloseIcon />
      </button>
    </div>
  ) as React.ReactElement // Explicitly assigning to ReactElement cause TS is confused otherwise
}

function getCookie(cname) {
  const name = cname + "="
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return undefined
}
function setCookie(cname, cvalue, exdays = 365) {
  const baseDomain = getBaseDomain(window.location.href)
  const d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  const expires = "expires=" + d.toUTCString()
  document.cookie = `${cname}=${cvalue};${expires};path=/;domain=${baseDomain}`
}

function getBaseDomain(url) {
  try {
    const hostname = new URL(url).hostname
    const parts = hostname.split(".").reverse()
    if (parts.length >= 2) {
      return `${parts[1]}.${parts[0]}`
    }
    return hostname
  } catch (error) {
    console.error("Invalid URL:", error)
    return ""
  }
}
