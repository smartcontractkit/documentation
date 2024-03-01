/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import buttonStyles from "@chainlink/design-system/button.module.css"

declare global {
  interface Window {
    dataLayer: Array<{
      event: string
      feedback_message?: string
    }>
  }
}

export const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState("")
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverState, setHoverState] = useState({ thumbUp: false, thumbDown: false })

  const handleFeedback = (type) => {
    setFeedbackType(type)
    setShowFeedbackForm(true)
  }

  const thumbUpIconStyle = {
    transition: "transform 0.3s ease",
    transform: hoverState.thumbUp ? "scale(1.1)" : "scale(1)",
  }

  const thumbDownIconStyle = {
    transition: "transform 0.3s ease",
    transform: hoverState.thumbDown ? "scale(1.1)" : "scale(1)",
  }

  const thumbUpIcon = (
    <svg
      stroke={hoverState.thumbUp ? "var(--blue-500)" : "var(--gray-500)"}
      stroke-width="18"
      fill={hoverState.thumbUp ? "var(--blue-500)" : "var(--gray-500)"}
      height="20px"
      width="20px"
      style={thumbUpIconStyle}
      viewBox="0 0 512 512"
    >
      <g>
        <g>
          <g>
            <path
              d="M495.736,290.773C509.397,282.317,512,269.397,512,260.796c0-22.4-18.253-47.462-42.667-47.462H349.918
				c-4.284-0.051-25.651-1.51-25.651-25.6c0-4.71-3.814-8.533-8.533-8.533s-8.533,3.823-8.533,8.533
				c0,33.749,27.913,42.667,42.667,42.667h119.467c14.182,0,25.6,16.631,25.6,30.396c0,4.437,0,17.946-26.53,20.855
				c-4.506,0.495-7.834,4.42-7.586,8.951c0.239,4.523,3.985,8.064,8.516,8.064c14.114,0,25.6,11.486,25.6,25.6
				s-11.486,25.6-25.6,25.6h-17.067c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533c14.114,0,25.6,11.486,25.6,25.6
				s-11.486,25.6-25.6,25.6h-25.6c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533c8.934,0,17.067,8.132,17.067,17.067
				c0,8.61-8.448,17.067-17.067,17.067h-128c-35.627,0-48.444-7.074-63.292-15.258c-12.553-6.921-26.786-14.763-54.963-18.79
				c-4.668-0.674-8.994,2.577-9.66,7.236c-0.666,4.668,2.569,8.994,7.236,9.66c25.105,3.584,37.325,10.325,49.152,16.845
				c15.497,8.542,31.505,17.374,71.526,17.374h128c17.869,0,34.133-16.273,34.133-34.133c0-6.229-1.775-12.134-4.83-17.229
				c21.794-1.877,38.963-20.224,38.963-42.505c0-10.829-4.062-20.736-10.735-28.271C500.42,358.212,512,342.571,512,324.267
				C512,310.699,505.634,298.59,495.736,290.773z"
            />
            <path
              d="M76.8,443.733c9.412,0,17.067-7.654,17.067-17.067S86.212,409.6,76.8,409.6c-9.412,0-17.067,7.654-17.067,17.067
				S67.388,443.733,76.8,443.733z"
            />
            <path
              d="M179.2,247.467c25.353,0,57.429-28.297,74.3-45.167c36.634-36.634,36.634-82.167,36.634-151.1
				c0-5.342,3.191-8.533,8.533-8.533c29.508,0,42.667,13.158,42.667,42.667v102.4c0,4.71,3.814,8.533,8.533,8.533
				s8.533-3.823,8.533-8.533v-102.4c0-39.083-20.659-59.733-59.733-59.733c-14.831,0-25.6,10.769-25.6,25.6
				c0,66.978,0,107.401-31.633,139.034C216.661,215.006,192.811,230.4,179.2,230.4c-4.719,0-8.533,3.823-8.533,8.533
				S174.481,247.467,179.2,247.467z"
            />
            <path
              d="M145.067,213.333H8.533c-4.719,0-8.533,3.823-8.533,8.533v256c0,4.71,3.814,8.533,8.533,8.533h136.533
				c4.719,0,8.533-3.823,8.533-8.533v-256C153.6,217.156,149.786,213.333,145.067,213.333z M136.533,469.333H17.067V230.4h119.467
				V469.333z"
            />
          </g>
        </g>
      </g>
    </svg>
  )

  const thumbDownIcon = (
    <svg
      stroke={hoverState.thumbDown ? "var(--blue-500)" : "var(--gray-500)"}
      stroke-width="18"
      fill={hoverState.thumbDown ? "var(--blue-500)" : "var(--gray-500)"}
      height="20px"
      width="20px"
      style={thumbDownIconStyle}
      viewBox="0 0 512 512"
    >
      <g>
        <g>
          <g>
            <path
              d="M76.8,247.467c9.412,0,17.067-7.654,17.067-17.067c0-9.412-7.654-17.067-17.067-17.067
				c-9.412,0-17.067,7.654-17.067,17.067C59.733,239.812,67.388,247.467,76.8,247.467z"
            />
            <path
              d="M495.736,221.227C505.634,213.41,512,201.301,512,187.733c0-18.295-11.58-33.946-27.802-39.996
				c6.673-7.535,10.735-17.434,10.735-28.271c0-22.281-17.169-40.627-38.963-42.505c3.055-5.094,4.83-10.999,4.83-17.229
				c0-17.86-16.265-34.133-34.133-34.133h-128c-40.021,0-56.03,8.832-71.526,17.374c-11.827,6.519-24.047,13.261-49.152,16.845
				c-4.668,0.666-7.902,4.992-7.236,9.66c0.666,4.659,4.949,7.885,9.66,7.236c28.177-4.028,42.411-11.87,54.963-18.79
				c14.848-8.183,27.665-15.258,63.292-15.258h128c8.619,0,17.067,8.456,17.067,17.067c0,8.934-8.132,17.067-17.067,17.067
				c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533h25.6c14.114,0,25.6,11.486,25.6,25.6s-11.486,25.6-25.6,25.6
				c-4.719,0-8.533,3.823-8.533,8.533c0,4.71,3.814,8.533,8.533,8.533h17.067c14.114,0,25.6,11.486,25.6,25.6
				s-11.486,25.6-25.6,25.6c-4.531,0-8.277,3.541-8.516,8.064c-0.247,4.531,3.081,8.457,7.586,8.951
				c26.53,2.91,26.53,16.418,26.53,20.847c0,13.773-11.418,30.404-25.6,30.404H349.867c-14.763,0-42.667,8.917-42.667,42.667
				c0,4.71,3.814,8.533,8.533,8.533s8.533-3.823,8.533-8.533c0-24.09,21.367-25.549,25.6-25.6h119.467
				c24.414,0,42.667-25.054,42.667-47.471C512,242.603,509.397,229.683,495.736,221.227z"
            />
            <path
              d="M349.867,315.733c-4.719,0-8.533,3.823-8.533,8.533v102.4c0,29.508-13.158,42.667-42.667,42.667
				c-5.342,0-8.533-3.192-8.533-8.533c0-68.932,0-114.466-36.634-151.1c-16.87-16.87-48.947-45.167-74.3-45.167
				c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533c13.611,0,37.461,15.394,62.234,40.166
				c31.633,31.633,31.633,72.055,31.633,139.034c0,14.831,10.769,25.6,25.6,25.6c39.074,0,59.733-20.651,59.733-59.733v-102.4
				C358.4,319.556,354.586,315.733,349.867,315.733z"
            />
            <path
              d="M145.067,25.6H8.533C3.814,25.6,0,29.423,0,34.133v256c0,4.71,3.814,8.533,8.533,8.533h136.533
				c4.719,0,8.533-3.823,8.533-8.533v-256C153.6,29.423,149.786,25.6,145.067,25.6z M136.533,281.6H17.067V42.667h119.467V281.6z"
            />
          </g>
        </g>
      </g>
    </svg>
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const messageValue = formData.get("msg")
    const message = typeof messageValue === "string" ? messageValue : undefined

    const data = {
      msg: message,
      time: Date.now(),
      url: window.location.href,
      type: feedbackType, // "positive" or "negative"
    }

    // Dispatch a custom event based on the feedback type
    if (feedbackType === "positive") {
      window.dataLayer.push({
        event: "positive_feedback_submitted",
        feedback_message: data.msg,
      })
    } else if (feedbackType === "negative") {
      window.dataLayer.push({
        event: "negative_feedback_submitted",
        feedback_message: data.msg,
      })
    }

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
        <div style={{ display: "inline-flex", gap: "15px", alignItems: "center" }}>
          <p style={{ fontSize: "14px", marginTop: 0 }}>Is this page useful?</p>
          <div
            id="thumbDownFeedbackButton"
            onClick={() => handleFeedback("negative")}
            onMouseEnter={() => setHoverState({ ...hoverState, thumbDown: true })}
            onMouseLeave={() => setHoverState({ ...hoverState, thumbDown: false })}
            style={{ paddingBottom: "10px", cursor: "pointer", ...thumbDownIconStyle }}
          >
            {thumbDownIcon}
          </div>
          <div
            id="thumbUpFeedbackButton"
            onClick={() => handleFeedback("positive")}
            onMouseEnter={() => setHoverState({ ...hoverState, thumbUp: true })}
            onMouseLeave={() => setHoverState({ ...hoverState, thumbUp: false })}
            style={{ paddingBottom: "20px", cursor: "pointer", ...thumbUpIconStyle }}
          >
            {thumbUpIcon}
          </div>
        </div>
      )}
      {feedbackGiven && <p style={{ fontSize: "14px", marginTop: 0 }}>Thank you for your feedback!</p>}
      {showFeedbackForm && (
        <section
          className="card"
          style={{
            padding: "var(--space-4x)",
            marginRight: "var(--space-4x)",
            width: "max-content",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label htmlFor="msg">Tell us more about your experience.</label>
            <textarea name="msg" style={{ resize: "none", height: "150px", width: "100%" }} />
            <button className={buttonStyles.primary} disabled={isSubmitting}>
              Submit feedback
            </button>
          </form>
        </section>
      )}
    </>
  )
}
