/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { v4 as uuidv4 } from "uuid"
import buttonStyles from "@chainlink/design-system/button.module.css"
import styles from "./Feedback.module.css"
import ThumbUpIcon from "./Assets/ThumbUpIcon"
import ThumbDownIcon from "./Assets/ThumbDownIcon"

export const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState({ type: "", uuid: "" })
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverState, setHoverState] = useState({ thumbUp: false, thumbDown: false })

  const handleFeedback = (type) => {
    const feedbackUUID = uuidv4()
    setFeedbackType({
      type,
      uuid: feedbackUUID,
    })
    setShowFeedbackForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const messageValue = formData.get("msg")
    const message = typeof messageValue === "string" ? messageValue : undefined

    const data = {
      msg: message,
      time: Date.now(),
      url: window.location.href,
      type: feedbackType.type, // "positive" or "negative"
      uuid: feedbackType.uuid,
    }

    // Push to dataLayer
    window.dataLayer.push({
      event: feedbackType.type + "_feedback_submitted",
      feedback_message: data.msg,
      feedback_uuid: data.uuid,
    })

    const path = "https://docs-feedbacks-22203-default-rtdb.firebaseio.com/feedback.json"
    setIsSubmitting(true)
    fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        setFeedbackGiven(true)
        setShowFeedbackForm(false)
      })
      .catch((error) => console.error("Error submitting feedback:", error))
      .finally(() => setIsSubmitting(false))
  }

  return (
    <>
      {!feedbackGiven && !showFeedbackForm && (
        <div className={styles.feedbackContainer}>
          <p className={styles.feedbackPrompt}>Was this page helpful?</p>
          <div className={styles.feedbackButtons}>
            <div
              id="thumbUpFeedbackButton"
              className={styles.feedbackButton}
              onClick={() => handleFeedback("positive")}
              onMouseEnter={() => setHoverState({ ...hoverState, thumbUp: true })}
              onMouseLeave={() => setHoverState({ ...hoverState, thumbUp: false })}
            >
              <ThumbUpIcon isHovered={hoverState.thumbUp} />
              <span>Yes</span>
            </div>
            <div
              id="thumbDownFeedbackButton"
              className={styles.feedbackButton}
              onClick={() => handleFeedback("negative")}
              onMouseEnter={() => setHoverState({ ...hoverState, thumbDown: true })}
              onMouseLeave={() => setHoverState({ ...hoverState, thumbDown: false })}
            >
              <ThumbDownIcon isHovered={hoverState.thumbDown} />
              <span>No</span>
            </div>
          </div>
        </div>
      )}
      {feedbackGiven && <p className={styles.feedbackPrompt}>Thank you for your feedback!</p>}
      {showFeedbackForm && (
        <section className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="msg">Tell us more about your experience.</label>
            <textarea name="msg" className={styles.textarea} />
            <button className={buttonStyles.primary} disabled={isSubmitting}>
              Submit feedback
            </button>
          </form>
        </section>
      )}
    </>
  )
}
