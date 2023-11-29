/** @jsxImportSource preact */

import { useState } from "preact/hooks"
import "./NewsletterCTA.css"
import button from "@chainlink/design-system/button.module.css"
import { clsx } from "~/lib"

const TAG_1 = "Developers"
const TAG_2 = "Developer Docs"
const NEWSLETTER_URL = "https://hooks.zapier.com/hooks/catch/10015000/bb8efqc"

export const NewsletterSignupForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  function onSubmit(e) {
    e.preventDefault()
    const email = new FormData(e.target).get("Email")
    setIsLoading(true)
    fetch(NEWSLETTER_URL, {
      mode: "no-cors",
      method: "POST",
      body: JSON.stringify({
        email,
        tag1: TAG_1,
        tag2: TAG_2,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.type !== "opaque" && !response.ok) {
          throw Error(response.statusText)
        }
        setIsSuccess(true)
      })
      .catch((err) => {
        console.error(err)
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      {!isSuccess ? (
        <form
          id="wf-form-Chainlink-Newsletter"
          name="wf-form-Chainlink-Newsletter"
          data-name="Chainlink Newsletter"
          className="form-subscribe"
          onSubmit={onSubmit}
        >
          <div className="form-subscribe-field-wrapper">
            <label htmlFor="Email" className="hiddenLabel ">
              Email Address
            </label>
            <input
              type="email"
              className="cta-subscribe-input w-input text-300"
              maxLength={256}
              name="Email"
              data-name="Email"
              placeholder="Enter your email address"
              onChange={() => setIsError(false)}
              id="Email"
              required
            />
            <input
              id="subscribe-button"
              type="submit"
              value={isLoading ? "Please Wait..." : "Subscribe now"}
              disabled={isLoading}
              className={clsx(button.secondary, "text-300")}
            />
          </div>
        </form>
      ) : (
        <div className="form-success-message w-form-done">
          <div className="subscribe-success-message-text">
            Thank you for signing up! Please check your inbox to confirm your subscription.
          </div>
          <div className="subscribe-success-social">
            <a
              href="https://twitter.com/chainlink"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img src="/images/twitter.svg" loading="lazy" width="24" height="24" alt="Twitter" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCnjkrlqaWEBSnKZQ71gdyFA"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img src="/images/youtube.svg" loading="lazy" width="24" height="24" alt="YouTube" />
            </a>
            <a
              href="https://stackoverflow.com/questions/tagged/chainlink"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img src="/images/stackoverflow.svg" loading="lazy" width="24" height="24" alt="Stack Overflow" />
            </a>
            <a
              href="https://ethereum.stackexchange.com/questions/tagged/chainlink"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img
                src="/images/stackexchange.svg"
                loading="lazy"
                width="24"
                height="24"
                alt="Stack Exchange Ethereum"
              />
            </a>
            <a
              href="https://discord.gg/aSK4zew"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img src="/images/discord.svg" loading="lazy" width="24" height="24" alt="Discord" />
            </a>
            <a
              href="https://t.me/chainlinkofficial"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img src="/images/telegram.svg" loading="lazy" width="24" height="24" alt="Telegram" />
            </a>
            <a
              href="https://blog.chain.link/chainlink-chinese-communities/"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img src="/images/wechat.svg" loading="lazy" width="24" height="24" alt="WeChat" />
            </a>
            <a
              href="https://www.reddit.com/r/Chainlink/"
              className="subscribe-form-success-social w-inline-block"
              target="_blank"
              rel="noopener"
            >
              <img src="/images/reddit.svg" loading="lazy" width="24" height="24" alt="Reddit" />
            </a>
          </div>
        </div>
      )}
      {isError && (
        <div className="form-error-message w-form-fail">
          <div className="subscribe-text-block">
            Oops! Something went wrong while submitting the form. Please try again
          </div>
        </div>
      )}
    </>
  )
}
