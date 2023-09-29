import React from "react"
import { useRef, useEffect } from "preact/hooks"
import { render, h } from "preact"
import { createPortal } from "preact/compat"

export function withReact(Component) {
  return function ReactWrapper(props) {
    const containerRef = useRef(null)

    useEffect(() => {
      render(<Component {...props} />, containerRef.current)
      return () => {
        render(null, containerRef.current)
      }
    }, [props])

    return h("div", { ref: containerRef })
  }
}
