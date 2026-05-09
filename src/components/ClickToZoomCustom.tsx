import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import styles from "./ClickToZoomCustom.module.css"

interface ClickToZoomCustomProps {
  src: string
  alt?: string
  style?: string | React.CSSProperties
  caption?: string
}

interface ModalState {
  isOpen: boolean
  isZoomed: boolean
}

export default function ClickToZoomCustom({ src, alt, style, caption }: ClickToZoomCustomProps) {
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, isZoomed: false })
  const imageRef = useRef<HTMLImageElement>(null)

  // Parse style prop if it's a string
  const parseStyle = (styleValue: string | React.CSSProperties | undefined): React.CSSProperties => {
    if (!styleValue) return {}
    if (typeof styleValue === "object") return styleValue

    // Parse CSS string to object
    const styleObj: React.CSSProperties = {}
    styleValue.split(";").forEach((rule) => {
      const [property, value] = rule.split(":").map((s) => s.trim())
      if (property && value) {
        // Convert kebab-case to camelCase
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        styleObj[camelProperty as keyof React.CSSProperties] = value as any
      }
    })
    return styleObj
  }

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalState.isOpen) {
        closeModal()
      }
    }

    if (modalState.isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [modalState.isOpen])

  const openModal = () => {
    setModalState({ isOpen: true, isZoomed: false })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, isZoomed: false })
  }

  const toggleZoom = (event: React.MouseEvent) => {
    event.stopPropagation()
    setModalState((prev) => ({ ...prev, isZoomed: !prev.isZoomed }))
  }

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal()
    }
  }

  const Modal = () => (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="expanded-image"
    >
      <img
        id="expanded-image"
        ref={imageRef}
        src={src}
        alt={alt}
        className={`${styles.expandedImage} ${modalState.isZoomed ? styles.zoomed : ""}`}
        onClick={toggleZoom}
        style={{
          cursor: modalState.isZoomed ? "zoom-out" : "zoom-in",
        }}
      />
      {caption && <p className={styles.expandedCaption}>{caption}</p>}
    </div>
  )

  return (
    <>
      <img
        src={src}
        alt={alt}
        style={parseStyle(style)}
        className={styles.thumbnailImage}
        onClick={openModal}
        onKeyDown={(e) => e.key === "Enter" && openModal()}
        role="button"
        tabIndex={0}
        aria-label={`Click to zoom image: ${alt || "diagram"}`}
      />
      {caption && <p className={styles.caption}>{caption}</p>}

      {modalState.isOpen && typeof document !== "undefined" && createPortal(<Modal />, document.body)}
    </>
  )
}
