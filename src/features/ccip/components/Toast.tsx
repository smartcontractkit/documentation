/** @jsxImportSource react */
import { useState, useEffect } from "react"
import "./toast.css"

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export const Toast = ({ message, duration = 4000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const timer = setTimeout(() => {
      setIsAnimatingOut(true)
    }, duration - 300) // Start slide-out animation slightly before the end of duration

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    const removeTimer = setTimeout(() => {
      onClose()
    }, duration + 300) // Remove component from DOM after animation is finished

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [duration, onClose])

  return (
    <div className={`toast ${isVisible ? "slide-in" : isAnimatingOut ? "slide-out" : ""}`}>
      <div className="toast-content">{message}</div>
    </div>
  )
}
