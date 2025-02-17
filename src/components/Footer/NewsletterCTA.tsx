/** @jsxImportSource preact */

import "./NewsletterCTA.css"
import { NewsletterSignupForm } from "./NewsletterSignupForm.tsx"

export type NewsletterCTAProps = {
  title?: string
}
export const NewsletterCTA = ({
  title = "Get the latest Chainlink content straight to your inbox.",
}: NewsletterCTAProps) => {
  return (
    <div className={"newsletter-cta"}>
      <h2 className="cta-subscribe-h1 heading-600">{title}</h2>
      <NewsletterSignupForm />
    </div>
  )
}
