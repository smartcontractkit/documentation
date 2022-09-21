import h from "preact"

import "./NewsletterCTA.css"
import { NewsletterSignupForm } from "./NewsletterSignupForm"

export type NewsletterCTAProps = {
  title?: string
}
export const NewsletterCTA = ({
  title = "Stay updated on the latest Chainlink news",
}: NewsletterCTAProps) => {
  return (
    <section className={"newsletter-cta"}>
      <h2 className="cta-subscribe-h1">{title}</h2>
      <div className="form-subscribe-wrapper w-form">
        <NewsletterSignupForm />
      </div>
    </section>
  )
}
