/**
 * Type definitions for markdown transformation library
 */

import type { Node, Parent } from "unist"

/**
 * Metadata about a documentation page
 */
export interface PageMetadata {
  /** Page title */
  title: string
  /** Canonical URL */
  sourceUrl: string
  /** Last modified date (ISO string) */
  lastModified?: string
  /** Section (e.g., 'ccip', 'vrf') */
  section?: string
  /** SDK language (for language-specific pages) */
  sdkLang?: string
}

/**
 * Frontmatter extracted from MDX files
 */
export interface Frontmatter {
  /** Raw body content (without frontmatter) */
  body: string
  /** Page title from frontmatter */
  fmTitle?: string
  /** Last modified date from metadata */
  fmLastModified?: string
  /** SDK language */
  sdkLang?: string
}

/**
 * MDX JSX attribute
 */
export interface MdxJsxAttribute {
  name: string
  value?: string | { value: string } | { data?: { estree?: { body?: unknown[] } } }
}

/**
 * MDX JSX node in the AST
 */
export interface MdxJsxNode extends Node {
  name?: string
  attributes?: MdxJsxAttribute[]
}

/**
 * Context passed to component handlers
 */
export interface ComponentContext {
  /** Absolute path to the MDX file being processed */
  mdxAbsPath: string
  /** Original markdown content */
  markdown: string
  /** Target language (if any) */
  targetLanguage?: string
  /** Unified processor instance */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processor: any
}

/**
 * Handler function for custom components
 */
export type ComponentHandler = (
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
) => number | void

/**
 * Configuration for markdown transformation
 */
export interface TransformConfig {
  /** Base URL for the documentation site */
  siteBase: string
  /** Target language for language-specific content */
  targetLanguage?: string
  /** Whether to include frontmatter in output */
  includeFrontmatter?: boolean
  /** Custom component handlers */
  componentHandlers?: Record<string, ComponentHandler>
}

/**
 * Result of markdown transformation
 */
export interface TransformResult {
  /** The transformed markdown content */
  markdown: string
  /** Metadata extracted from the page */
  metadata: PageMetadata
}

/**
 * Code block with metadata
 */
export interface CodeBlock {
  /** Programming language */
  lang: string
  /** Code content */
  value: string
  /** Optional title */
  title?: string
}
