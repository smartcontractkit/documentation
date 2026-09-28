/**
 * Pure model for the interactive rate limit bucket (no DOM access).
 *
 * The bucket behavior mirrors `RateLimiter.sol` in smartcontractkit/chainlink-ccip
 * (`chains/evm/contracts/libraries/RateLimiter.sol`):
 * - `_consume`: refill first, then revert with `TokenMaxCapacityExceeded` when the amount is larger than
 *   the capacity, then revert with `TokenRateLimitReached` when the amount is larger than the available
 *   tokens (minimum wait = ceil(missing tokens / rate)), otherwise subtract the amount.
 * - `_setTokenBucketConfig`: an enabled config needs rate <= capacity (`InvalidRateLimitRate`), and applying
 *   a config sets the available tokens to the new capacity.
 *
 * On-chain refills happen in whole seconds. This model refills continuously (time in milliseconds) so the
 * drawing can animate smoothly; every number shown to the reader is rounded down to whole tokens. Because the
 * refill is continuous, ceil(missing tokens / rate) is an upper bound of the remaining wait here, so the copy
 * says "within" / "up to" rather than "at least".
 */

export interface SliderRange {
  min: number
  max: number
  step: number
  initial: number
}

/** Max capacity slider, in tokens. */
export const CAPACITY_RANGE: SliderRange = { min: 20_000, max: 200_000, step: 10_000, initial: 100_000 }
/** Refill rate slider, in tokens per second. Its max stays below the smallest capacity, so rate <= capacity always holds. */
export const RATE_RANGE: SliderRange = { min: 100, max: 10_000, step: 100, initial: 1_000 }
/** Transfer amount slider, in tokens. Its max is above the largest capacity, so "larger than max capacity" is reachable. */
export const AMOUNT_RANGE: SliderRange = { min: 5_000, max: 250_000, step: 5_000, initial: 30_000 }

export const CONTRACT_ERRORS = {
  maxCapacityExceeded: "TokenMaxCapacityExceeded",
  rateLimitReached: "TokenRateLimitReached",
  invalidRate: "InvalidRateLimitRate",
} as const

export interface BucketConfig {
  /** Maximum number of tokens in the bucket, which is also the largest possible single transfer. */
  capacity: number
  /** Tokens added back to the bucket per second. */
  rate: number
}

export interface BucketState extends BucketConfig {
  /** Tokens in the bucket at `updatedAt`. Can be fractional because the model refills continuously. */
  tokens: number
  /** Time of the last change, in milliseconds (same clock as `performance.now()`). */
  updatedAt: number
}

export type TransferResult =
  | { outcome: "accepted"; state: BucketState; requested: number; remaining: number }
  | {
      outcome: "maxCapacityExceeded"
      error: typeof CONTRACT_ERRORS.maxCapacityExceeded
      requested: number
      capacity: number
    }
  | {
      outcome: "rateLimited"
      error: typeof CONTRACT_ERRORS.rateLimitReached
      requested: number
      available: number
      minWaitSeconds: number
    }

export type ConfigResult = { ok: true; state: BucketState } | { ok: false; error: typeof CONTRACT_ERRORS.invalidRate }

export type TransferPreview = { kind: "fits" } | { kind: "wait"; waitSeconds: number } | { kind: "exceeds" }

export type StatusTone = "neutral" | "info" | "success" | "warning" | "error"

export interface StatusMessage {
  tone: StatusTone
  title: string
  detail: string
  /** Contract error name, shown as code. Only set when the transfer reverts. */
  error?: string
}

/** A full bucket, as it is right after a rate limit config is applied. */
export function createBucket(config: BucketConfig, now: number): BucketState {
  return { capacity: config.capacity, rate: config.rate, tokens: config.capacity, updatedAt: now }
}

/** Exact (possibly fractional) tokens in the bucket at `now`, capped at the capacity. */
export function exactTokensAt(state: BucketState, now: number): number {
  const elapsedSeconds = Math.max(0, now - state.updatedAt) / 1000
  return Math.min(state.capacity, state.tokens + elapsedSeconds * state.rate)
}

/** Whole tokens available at `now`. */
export function availableTokensAt(state: BucketState, now: number): number {
  return Math.floor(exactTokensAt(state, now))
}

export function isFullAt(state: BucketState, now: number): boolean {
  return exactTokensAt(state, now) >= state.capacity
}

/** Whole seconds until the bucket is full again. 0 when it is already full. */
export function secondsUntilFull(state: BucketState, now: number): number {
  const missing = state.capacity - availableTokensAt(state, now)
  if (missing <= 0) return 0
  if (state.rate <= 0) return Number.POSITIVE_INFINITY
  return Math.ceil(missing / state.rate)
}

/** Mirrors `RateLimiter._consume`. A reverted transfer does not change the bucket. */
export function transfer(state: BucketState, amount: number, now: number): TransferResult {
  if (amount <= 0) {
    return { outcome: "accepted", state, requested: 0, remaining: availableTokensAt(state, now) }
  }
  if (amount > state.capacity) {
    return {
      outcome: "maxCapacityExceeded",
      error: CONTRACT_ERRORS.maxCapacityExceeded,
      requested: amount,
      capacity: state.capacity,
    }
  }
  const available = availableTokensAt(state, now)
  if (amount > available) {
    return {
      outcome: "rateLimited",
      error: CONTRACT_ERRORS.rateLimitReached,
      requested: amount,
      available,
      minWaitSeconds: state.rate > 0 ? Math.ceil((amount - available) / state.rate) : Number.POSITIVE_INFINITY,
    }
  }
  const next: BucketState = { ...state, tokens: exactTokensAt(state, now) - amount, updatedAt: now }
  return { outcome: "accepted", state: next, requested: amount, remaining: availableTokensAt(next, now) }
}

/** Mirrors `RateLimiter._setTokenBucketConfig` for an enabled limit: the bucket is refilled to the new capacity. */
export function applyConfig(config: BucketConfig, now: number): ConfigResult {
  if (config.rate > config.capacity) {
    return { ok: false, error: CONTRACT_ERRORS.invalidRate }
  }
  return { ok: true, state: createBucket(config, now) }
}

/** What would happen if `amount` were sent at `now`. */
export function previewTransfer(state: BucketState, amount: number, now: number): TransferPreview {
  if (amount > state.capacity) return { kind: "exceeds" }
  const available = availableTokensAt(state, now)
  if (amount <= available) return { kind: "fits" }
  const waitSeconds = state.rate > 0 ? Math.ceil((amount - available) / state.rate) : Number.POSITIVE_INFINITY
  return { kind: "wait", waitSeconds }
}

const tokenFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })
/** Non-breaking space, so a number never wraps away from its unit. */
const NBSP = "\u00a0"

/** 100000 -> "100,000" (always en-US, always rounded down to a whole token). */
export function formatTokens(value: number): string {
  return tokenFormat.format(Math.floor(value))
}

/** 18 -> "18 s", 60 -> "1 min", 125 -> "2 min 5 s" (with non-breaking spaces). */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "never"
  const seconds = Math.max(0, Math.ceil(totalSeconds))
  if (seconds < 60) return `${seconds}${NBSP}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest === 0 ? `${minutes}${NBSP}min` : `${minutes}${NBSP}min ${rest}${NBSP}s`
}

export function formatTokenAmount(value: number): string {
  return `${formatTokens(value)}${NBSP}tokens`
}

export function formatRate(rate: number): string {
  return `${formatTokens(rate)}${NBSP}tokens/s`
}

/** Text for the refill arrow in the drawing, e.g. "+1,000/s". */
export function formatInflow(rate: number): string {
  return `+${formatTokens(rate)}/s`
}

/** Readout under "Available now". */
export function describeRefill(state: BucketState, now: number): string {
  return isFullAt(state, now) ? "Full" : `Full in ${formatDuration(secondsUntilFull(state, now))}`
}

/** Slider value text for assistive technology. */
export function describeSliderValue(kind: "capacity" | "rate" | "amount", value: number): string {
  if (kind === "rate") return `${formatTokens(value)} tokens per second`
  return `${formatTokens(value)} tokens`
}

/** Position of a value on a slider track, as a percentage (drives the filled part of the track). */
export function rangeFillPercent(value: number, range: SliderRange): number {
  const ratio = (value - range.min) / (range.max - range.min)
  return Math.round(Math.min(1, Math.max(0, ratio)) * 1000) / 10
}

export function describePreview(preview: TransferPreview): string {
  switch (preview.kind) {
    case "fits":
      return "Fits in the bucket right now."
    case "wait":
      return `Needs up to ${formatDuration(preview.waitSeconds)} of refill before it fits.`
    case "exceeds":
      return "Larger than the max capacity, so it can never fit."
  }
}

export const INITIAL_STATUS: StatusMessage = {
  tone: "neutral",
  title: "Try a transfer",
  detail: "Set an amount and send it. Used capacity refills every second, up to the max capacity.",
}

/**
 * Status after the capacity or refill rate changes. The text is the same for every value, so dragging a slider
 * does not make the live region announce a new message on every step.
 */
export const CONFIG_CHANGE_STATUS: StatusMessage = {
  tone: "info",
  title: "Rate limit updated",
  detail: "Changing the capacity or refill rate resets the bucket to its new max capacity.",
}

/** Short spoken form of a transfer preview (no countdown, so it only changes when the kind changes). */
export function describePreviewHint(kind: TransferPreview["kind"]): string {
  switch (kind) {
    case "fits":
      return "fits now"
    case "wait":
      return "needs refill first"
    case "exceeds":
      return "larger than max capacity"
  }
}

/** Value text of the transfer amount slider for assistive technology, e.g. "30,000 tokens, fits now". */
export function describeAmountValue(amount: number, kind: TransferPreview["kind"]): string {
  return `${describeSliderValue("amount", amount)}, ${describePreviewHint(kind)}`
}

/** Splits a contract error name at its camel-case boundaries, so narrow screens can wrap it between words. */
export function errorNameChunks(name: string): string[] {
  return name.split(/(?=[A-Z])/).filter((chunk) => chunk.length > 0)
}

export function describeTransfer(result: TransferResult, config: BucketConfig): StatusMessage {
  switch (result.outcome) {
    case "accepted":
      return {
        tone: "success",
        title: "Transfer accepted",
        detail: `${formatTokenAmount(result.requested)} consumed. ${formatTokens(result.remaining)} of ${formatTokenAmount(
          config.capacity
        )} remain, refilling at ${formatRate(config.rate)}.`,
      }
    case "rateLimited":
      return {
        tone: "warning",
        title: "Transfer reverted",
        detail: `Only ${formatTokenAmount(result.available)} are available right now. At ${formatRate(
          config.rate
        )}, enough capacity refills within ${formatDuration(result.minWaitSeconds)}.`,
        error: result.error,
      }
    case "maxCapacityExceeded":
      return {
        tone: "error",
        title: "Transfer reverted",
        detail: `${formatTokenAmount(result.requested)} is more than the max capacity of ${formatTokenAmount(
          result.capacity
        )}. This transfer can never succeed unless the max capacity is raised.`,
        error: result.error,
      }
  }
}

/**
 * Drawing geometry, in SVG user units (1 unit = 1 CSS pixel; the SVG is never scaled).
 * The bucket is an open-top rectangle drawn with a 2px stroke centered on these coordinates.
 * The width leaves room for the widest label, "OVER MAX" (11px Inter, it ends at about x = 200).
 */
export const DRAWING = {
  width: 204,
  height: 180,
  bucketLeft: 8,
  bucketRight: 120,
  rimY: 36,
  bottomY: 172,
  /** Interior, inside the 2px stroke. */
  innerLeft: 9,
  innerRight: 119,
  innerBottom: 171,
  /** Refill arrow (x of the vertical line, its top and the tip of its head). */
  inflowX: 64,
  inflowTop: 4,
  inflowTip: 32,
  /** Right-hand labels ("MAX", "AMOUNT"). */
  tickStart: 124,
  tickEnd: 132,
  labelX: 136,
  /** Baseline offset that visually centers an 11px uppercase label on a line. */
  labelBaselineOffset: 4,
  /** Minimum distance between the "MAX" and "AMOUNT" label baselines. */
  labelGap: 13,
} as const

/** Y coordinate of the liquid surface for `tokens` in a bucket of `capacity`. */
export function levelToY(tokens: number, capacity: number): number {
  const ratio = capacity > 0 ? Math.min(1, Math.max(0, tokens / capacity)) : 0
  const y = DRAWING.innerBottom - ratio * (DRAWING.innerBottom - DRAWING.rimY)
  return Math.round(y * 100) / 100
}

export interface MarkerLayout {
  /** X where the dashed transfer-amount line starts (it always ends at `DRAWING.tickEnd`). */
  lineStartX: number
  /** Y of the dashed transfer-amount line. */
  lineY: number
  /** Baseline Y of the marker label. */
  labelY: number
  /** Marker label text. */
  label: "AMOUNT" | "OVER MAX"
  /** Whether the "MAX" label next to the rim is shown (hidden when the marker label takes its place). */
  showMaxLabel: boolean
}

/**
 * Where the dashed transfer-amount marker and its label go.
 * An amount above the capacity cannot be drawn inside the bucket, so it becomes a short segment outside the
 * right wall at rim height, labeled "OVER MAX" (it replaces the "MAX" label).
 */
export function markerLayout(amount: number, capacity: number): MarkerLayout {
  const maxLabelY = DRAWING.rimY + DRAWING.labelBaselineOffset
  if (amount > capacity) {
    return {
      lineStartX: DRAWING.bucketRight + 2,
      lineY: DRAWING.rimY,
      labelY: maxLabelY,
      label: "OVER MAX",
      showMaxLabel: false,
    }
  }
  const lineY = levelToY(amount, capacity)
  const labelY = Math.max(lineY + DRAWING.labelBaselineOffset, maxLabelY + DRAWING.labelGap)
  return { lineStartX: DRAWING.innerLeft, lineY, labelY, label: "AMOUNT", showMaxLabel: true }
}
