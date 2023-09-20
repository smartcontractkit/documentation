/** @jsxImportSource preact */

import "./NewsletterCTA.css"
import { NewsletterSignupForm } from "./NewsletterSignupForm"

export type NewsletterCTAProps = {
  title?: string
}
export const NewsletterCTA = ({ title = "Stay updated on the latest Chainlink news" }: NewsletterCTAProps) => {
  return (
    <div className={"newsletter-cta"}>
      <h2 className="cta-subscribe-h1 heading-600">{title}</h2>
      <NewsletterSignupForm />
    </div>
  )
}
