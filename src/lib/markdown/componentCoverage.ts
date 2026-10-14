/**
 * Counts unhandled JSX drops during TXT generation; Go/TS use per-page/component maxima.
 * approxChars = 0 can hide lost dynamic content; the baseline maps names to reasons for accepting losses.
 * Local/CI output: reports/component-coverage.json, also uploaded as a CI artifact.
 * Weekly, from up-to-date main, run npm run report:component-coverage (--coverage-only).
 * It writes public/reports/component-coverage.json for the public /reports/component-coverage.json URL.
 * Open a dedicated PR containing only that file; content PRs never update it.
 */
import fs from "node:fs/promises"
import path from "node:path"
import type { LlmsRenderObservers, MarkdownArtifact } from "./types.js"

export const COMPONENT_COVERAGE_PATH = "reports/component-coverage.json"
export const COMPONENT_COVERAGE_PUBLIC_PATH = "public/reports/component-coverage.json"
export const COMPONENT_COVERAGE_BASELINE_PATH = "src/scripts/component-coverage-baseline.json"
export type ComponentCoverageBaseline = Record<string, string>

type Counters = { instances: number; approxChars: number }
type TransformMode = MarkdownArtifact["transformMode"]

export type ComponentCoverageReport = {
  /** Public artifact contract version for docs-agent-score. */
  schemaVersion: 1
  /** UTC ISO timestamp of this generation. */
  generatedAt: string
  /** Unique source pages rendered, counting language variants once. */
  pagesProcessed: number
  /** Unique source pages per mode; language variants can use different modes. */
  transformModes: Record<TransformMode, number>
  /** Removed components, sorted by descending pageCount, then name. */
  components: {
    /** Unhandled JSX tag name. */
    name: string
    /** Number of distinct source pages with this component removed. */
    pageCount: number
    /** Sum of maximum removed occurrences per source page across variants. */
    instances: number
    /** Removed AST text and code length in UTF-16 units, using per-page maxima. */
    approxChars: number
    /** All affected paths relative to src/content, sorted and using / separators. */
    pages: string[]
  }[]
  /** Sorted observed names absent from the baseline; accepted names remain in components. */
  newSinceBaseline: string[]
}

export function parseComponentCoverageBaseline(value: unknown): ComponentCoverageBaseline {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.entries(value).some(([name, reason]) => !name.trim() || typeof reason !== "string" || !reason.trim())
  ) {
    throw new Error("Expected component names mapped to nonempty reasons")
  }
  return value as ComponentCoverageBaseline
}

/** Per-page maxima avoid counting the Go/TS renders of a page twice. */
export function createComponentCoverageCollector(contentRoot = path.resolve("src/content")) {
  const pages = new Map<string, { modes: Set<TransformMode>; components: Map<string, Counters> }>()
  const observers: LlmsRenderObservers = {
    onPageRendered(sourcePath, mode, drops) {
      const relative = path.relative(contentRoot, path.resolve(sourcePath))
      if (!relative || relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
        throw new Error("Component coverage only accepts pages inside the content root")
      }
      const page = relative.split(path.sep).join("/")
      const previous = pages.get(page) ?? { modes: new Set<TransformMode>(), components: new Map<string, Counters>() }
      previous.modes.add(mode)
      const current = new Map<string, Counters>()
      for (const drop of drops) {
        const counters = current.get(drop.name) ?? { instances: 0, approxChars: 0 }
        counters.instances++
        counters.approxChars += drop.approxChars
        current.set(drop.name, counters)
      }
      for (const [name, counters] of current) {
        const old = previous.components.get(name)
        previous.components.set(name, {
          instances: Math.max(old?.instances ?? 0, counters.instances),
          approxChars: Math.max(old?.approxChars ?? 0, counters.approxChars),
        })
      }
      pages.set(page, previous)
    },
  }

  function report(options: { baseline: ComponentCoverageBaseline; generatedAt?: string }): ComponentCoverageReport {
    const grouped = new Map<string, Counters & { pages: string[] }>()
    const transformModes = { normal: 0, sanitized: 0, fallback: 0, replacement: 0 }
    for (const [page, stats] of pages) {
      for (const mode of stats.modes) transformModes[mode]++
      for (const [name, counters] of stats.components) {
        const component = grouped.get(name) ?? { pages: [], instances: 0, approxChars: 0 }
        component.pages.push(page)
        component.instances += counters.instances
        component.approxChars += counters.approxChars
        grouped.set(name, component)
      }
    }
    const components = [...grouped].map(([name, component]) => ({
      name,
      pageCount: component.pages.length,
      instances: component.instances,
      approxChars: component.approxChars,
      pages: component.pages.sort(),
    }))
    components.sort((a, b) => b.pageCount - a.pageCount || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    return {
      schemaVersion: 1,
      generatedAt: options.generatedAt ?? new Date().toISOString(),
      pagesProcessed: pages.size,
      transformModes,
      components,
      newSinceBaseline: components
        .map((component) => component.name)
        .filter((name) => !Object.hasOwn(options.baseline, name))
        .sort(),
    }
  }

  return { observers, report }
}

export async function writeComponentCoverageReport(report: ComponentCoverageReport, outputPath: string): Promise<void> {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const temporaryPath = path.join(path.dirname(outputPath), `.${path.basename(outputPath)}.${process.pid}.tmp`)
  try {
    await fs.writeFile(temporaryPath, JSON.stringify(report, null, 2) + "\n", "utf8")
    await fs.rename(temporaryPath, outputPath)
  } finally {
    await fs.rm(temporaryPath, { force: true }).catch(() => {
      // Cleanup cannot replace the original write/rename error.
    })
  }
}
