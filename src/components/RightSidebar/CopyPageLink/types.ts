/**
 * Type definitions for CopyPageLink component
 */

/**
 * Available actions for the copy page feature
 */
export type CopyAction = "copy" | "preview" | "chatgpt" | "claude"

/**
 * Extracted content from the documentation page
 */
export interface ExtractedContent {
  /** The markdown content of the page */
  markdown: string
  /** The title of the page */
  title: string
  /** The full URL of the page */
  url: string
  /** Timestamp when content was extracted */
  timestamp: Date
}

/**
 * Props for the CopyPageLink component
 */
export interface CopyPageLinkProps {
  /** Optional class name for styling */
  className?: string
}

/**
 * Props for the MarkdownPreviewModal component
 */
export interface MarkdownPreviewModalProps {
  /** The markdown content to display */
  markdown: string
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Page title for modal header */
  title?: string
}

/**
 * Configuration for content extraction
 */
export interface ExtractionConfig {
  /** Selectors for elements to remove from content */
  selectorsToRemove: string[]
  /** Main content selector */
  contentSelector: string
  /** Whether to include frontmatter */
  includeFrontmatter: boolean
}

/**
 * Result of a copy operation
 */
export interface CopyResult {
  /** Whether the operation was successful */
  success: boolean
  /** Error message if operation failed */
  error?: string
}
