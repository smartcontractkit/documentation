import { describe, expect, it } from "@jest/globals"
import {
  AMOUNT_RANGE,
  CAPACITY_RANGE,
  CONFIG_CHANGE_STATUS,
  CONTRACT_ERRORS,
  DRAWING,
  INITIAL_STATUS,
  RATE_RANGE,
  applyConfig,
  availableTokensAt,
  createBucket,
  describeAmountValue,
  describePreview,
  describePreviewHint,
  describeRefill,
  describeSliderValue,
  describeTransfer,
  errorNameChunks,
  exactTokensAt,
  formatDuration,
  formatInflow,
  formatRate,
  formatTokenAmount,
  formatTokens,
  isFullAt,
  levelToY,
  markerLayout,
  previewTransfer,
  rangeFillPercent,
  secondsUntilFull,
  transfer,
} from "../rateLimitBucketModel.ts"
import type { BucketState } from "../rateLimitBucketModel.ts"

const NBSP = "\u00a0"
const CONFIG = { capacity: 100_000, rate: 1_000 }

/** A bucket created at t=0 that had `consumed` tokens removed at t=0. */
function drained(consumed: number): BucketState {
  return { ...createBucket(CONFIG, 0), tokens: CONFIG.capacity - consumed }
}

describe("slider ranges", () => {
  it("keep rate <= capacity for every selectable value", () => {
    expect(RATE_RANGE.max).toBeLessThanOrEqual(CAPACITY_RANGE.min)
  })

  it("let the transfer amount exceed the largest capacity", () => {
    expect(AMOUNT_RANGE.max).toBeGreaterThan(CAPACITY_RANGE.max)
  })

  it("start on a step of each range", () => {
    for (const range of [CAPACITY_RANGE, RATE_RANGE, AMOUNT_RANGE]) {
      expect((range.initial - range.min) % range.step).toBe(0)
      expect((range.max - range.min) % range.step).toBe(0)
      expect(range.initial).toBeGreaterThanOrEqual(range.min)
      expect(range.initial).toBeLessThanOrEqual(range.max)
    }
  })
})

describe("createBucket / refill", () => {
  it("starts full", () => {
    const bucket = createBucket(CONFIG, 5)
    expect(bucket).toEqual({ capacity: 100_000, rate: 1_000, tokens: 100_000, updatedAt: 5 })
    expect(isFullAt(bucket, 5)).toBe(true)
  })

  it("refills continuously at the rate and never above the capacity", () => {
    const bucket = drained(30_000)
    expect(exactTokensAt(bucket, 1_500)).toBe(71_500)
    expect(availableTokensAt(bucket, 1_500)).toBe(71_500)
    expect(availableTokensAt(bucket, 29_999)).toBe(99_999)
    expect(availableTokensAt(bucket, 30_000)).toBe(100_000)
    expect(availableTokensAt(bucket, 999_999)).toBe(100_000)
  })

  it("rounds available tokens down to whole tokens", () => {
    const bucket = drained(30_000)
    expect(exactTokensAt(bucket, 1)).toBe(70_001)
    expect(availableTokensAt(bucket, 0.5)).toBe(70_000)
  })

  it("ignores a clock that goes backwards", () => {
    expect(exactTokensAt(drained(30_000), -1_000)).toBe(70_000)
  })

  it("reports whole seconds until full", () => {
    expect(secondsUntilFull(createBucket(CONFIG, 0), 0)).toBe(0)
    expect(secondsUntilFull(drained(30_000), 0)).toBe(30)
    expect(secondsUntilFull(drained(30_000), 10_500)).toBe(20)
    expect(secondsUntilFull(drained(1), 0)).toBe(1)
  })
})

describe("transfer (mirrors RateLimiter._consume)", () => {
  it("accepts an amount that fits and subtracts it", () => {
    const result = transfer(createBucket(CONFIG, 0), 30_000, 0)
    expect(result.outcome).toBe("accepted")
    if (result.outcome !== "accepted") return
    expect(result.remaining).toBe(70_000)
    expect(result.requested).toBe(30_000)
    expect(result.state).toEqual({ capacity: 100_000, rate: 1_000, tokens: 70_000, updatedAt: 0 })
  })

  it("refills before consuming", () => {
    const result = transfer(drained(90_000), 20_000, 10_000)
    expect(result.outcome).toBe("accepted")
    if (result.outcome !== "accepted") return
    expect(result.remaining).toBe(0)
    expect(result.state.updatedAt).toBe(10_000)
  })

  it("accepts an amount equal to the available tokens", () => {
    const result = transfer(drained(90_000), 10_000, 0)
    expect(result.outcome).toBe("accepted")
  })

  it("accepts an amount equal to the capacity (the contract reverts only when capacity < amount)", () => {
    expect(transfer(createBucket(CONFIG, 0), 100_000, 0).outcome).toBe("accepted")
  })

  it("reverts with TokenMaxCapacityExceeded when the amount is larger than the capacity", () => {
    const result = transfer(createBucket(CONFIG, 0), 100_001, 0)
    expect(result).toEqual({
      outcome: "maxCapacityExceeded",
      error: "TokenMaxCapacityExceeded",
      requested: 100_001,
      capacity: 100_000,
    })
  })

  it("checks the capacity before the available tokens", () => {
    const result = transfer(drained(100_000), 150_000, 0)
    expect(result.outcome).toBe("maxCapacityExceeded")
  })

  it("reverts with TokenRateLimitReached and the minimum wait when the amount is larger than the available tokens", () => {
    const result = transfer(drained(90_000), 30_000, 0)
    expect(result).toEqual({
      outcome: "rateLimited",
      error: "TokenRateLimitReached",
      requested: 30_000,
      available: 10_000,
      minWaitSeconds: 20,
    })
  })

  it("rounds the minimum wait up to the next whole second", () => {
    const result = transfer(drained(90_000), 10_001, 0)
    expect(result.outcome === "rateLimited" && result.minWaitSeconds).toBe(1)
  })

  it("treats a zero amount as a no-op", () => {
    const bucket = drained(30_000)
    const result = transfer(bucket, 0, 0)
    expect(result.outcome).toBe("accepted")
    if (result.outcome !== "accepted") return
    expect(result.state).toBe(bucket)
  })

  it("uses the contract error names", () => {
    expect(CONTRACT_ERRORS).toEqual({
      maxCapacityExceeded: "TokenMaxCapacityExceeded",
      rateLimitReached: "TokenRateLimitReached",
      invalidRate: "InvalidRateLimitRate",
    })
  })
})

describe("applyConfig (mirrors RateLimiter._setTokenBucketConfig)", () => {
  it("refills the bucket to the new capacity", () => {
    const result = applyConfig({ capacity: 150_000, rate: 2_000 }, 7)
    expect(result).toEqual({ ok: true, state: { capacity: 150_000, rate: 2_000, tokens: 150_000, updatedAt: 7 } })
  })

  it("rejects a rate larger than the capacity with InvalidRateLimitRate", () => {
    expect(applyConfig({ capacity: 1_000, rate: 1_001 }, 0)).toEqual({ ok: false, error: "InvalidRateLimitRate" })
  })

  it("accepts a rate equal to the capacity", () => {
    expect(applyConfig({ capacity: 1_000, rate: 1_000 }, 0).ok).toBe(true)
  })
})

describe("previewTransfer", () => {
  it("fits when the amount is available now", () => {
    expect(previewTransfer(createBucket(CONFIG, 0), 30_000, 0)).toEqual({ kind: "fits" })
  })

  it("waits when the amount is larger than the available tokens", () => {
    expect(previewTransfer(drained(90_000), 30_000, 0)).toEqual({ kind: "wait", waitSeconds: 20 })
    expect(previewTransfer(drained(90_000), 30_000, 20_000)).toEqual({ kind: "fits" })
  })

  it("exceeds when the amount is larger than the capacity", () => {
    expect(previewTransfer(createBucket(CONFIG, 0), 100_001, 0)).toEqual({ kind: "exceeds" })
  })

  it("fits when the amount equals the capacity of a full bucket", () => {
    expect(previewTransfer(createBucket(CONFIG, 0), 100_000, 0)).toEqual({ kind: "fits" })
  })

  it("rounds the preview wait up to the next whole second", () => {
    expect(previewTransfer(drained(90_000), 10_001, 0)).toEqual({ kind: "wait", waitSeconds: 1 })
  })
})

describe("formatting", () => {
  it("formats whole tokens with en-US separators", () => {
    expect(formatTokens(100_000)).toBe("100,000")
    expect(formatTokens(71_999.9)).toBe("71,999")
    expect(formatTokens(0)).toBe("0")
  })

  it("formats durations with non-breaking spaces", () => {
    expect(formatDuration(0)).toBe(`0${NBSP}s`)
    expect(formatDuration(18)).toBe(`18${NBSP}s`)
    expect(formatDuration(18.2)).toBe(`19${NBSP}s`)
    expect(formatDuration(60)).toBe(`1${NBSP}min`)
    expect(formatDuration(125)).toBe(`2${NBSP}min 5${NBSP}s`)
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe("never")
  })

  it("formats amounts, rates and the refill arrow", () => {
    expect(formatTokenAmount(30_000)).toBe(`30,000${NBSP}tokens`)
    expect(formatRate(1_000)).toBe(`1,000${NBSP}tokens/s`)
    expect(formatInflow(1_000)).toBe("+1,000/s")
  })

  it("describes slider values for assistive technology", () => {
    expect(describeSliderValue("capacity", 100_000)).toBe("100,000 tokens")
    expect(describeSliderValue("rate", 1_000)).toBe("1,000 tokens per second")
    expect(describeSliderValue("amount", 30_000)).toBe("30,000 tokens")
  })

  it("computes the filled part of a slider track", () => {
    expect(rangeFillPercent(CAPACITY_RANGE.min, CAPACITY_RANGE)).toBe(0)
    expect(rangeFillPercent(CAPACITY_RANGE.max, CAPACITY_RANGE)).toBe(100)
    expect(rangeFillPercent(100_000, CAPACITY_RANGE)).toBe(44.4)
    expect(rangeFillPercent(1_000, RATE_RANGE)).toBe(9.1)
    expect(rangeFillPercent(30_000, AMOUNT_RANGE)).toBe(10.2)
  })
})

describe("messages", () => {
  it("describes the refill state", () => {
    expect(describeRefill(createBucket(CONFIG, 0), 0)).toBe("Full")
    expect(describeRefill(drained(30_000), 0)).toBe(`Full in 30${NBSP}s`)
  })

  it("describes the transfer preview", () => {
    expect(describePreview({ kind: "fits" })).toBe("Fits in the bucket right now.")
    expect(describePreview({ kind: "wait", waitSeconds: 18 })).toBe(`Needs up to 18${NBSP}s of refill before it fits.`)
    expect(describePreview({ kind: "exceeds" })).toBe("Larger than the max capacity, so it can never fit.")
  })

  it("describes an accepted transfer", () => {
    const message = describeTransfer(transfer(createBucket(CONFIG, 0), 30_000, 0), CONFIG)
    expect(message).toEqual({
      tone: "success",
      title: "Transfer accepted",
      detail: `30,000${NBSP}tokens consumed. 70,000 of 100,000${NBSP}tokens remain, refilling at 1,000${NBSP}tokens/s.`,
    })
  })

  it("describes a rate-limited transfer with its contract error", () => {
    const message = describeTransfer(transfer(drained(90_000), 30_000, 0), CONFIG)
    expect(message).toEqual({
      tone: "warning",
      title: "Transfer reverted",
      detail: `Only 10,000${NBSP}tokens are available right now. At 1,000${NBSP}tokens/s, enough capacity refills within 20${NBSP}s.`,
      error: "TokenRateLimitReached",
    })
  })

  it("describes a transfer above the max capacity with its contract error", () => {
    const message = describeTransfer(transfer(createBucket(CONFIG, 0), 250_000, 0), CONFIG)
    expect(message).toEqual({
      tone: "error",
      title: "Transfer reverted",
      detail: `250,000${NBSP}tokens is more than the max capacity of 100,000${NBSP}tokens. This transfer can never succeed unless the max capacity is raised.`,
      error: "TokenMaxCapacityExceeded",
    })
  })

  it("describes a config change with the same text for every value, and the initial state", () => {
    expect(CONFIG_CHANGE_STATUS).toEqual({
      tone: "info",
      title: "Rate limit updated",
      detail: "Changing the capacity or refill rate resets the bucket to its new max capacity.",
    })
    expect(INITIAL_STATUS.tone).toBe("neutral")
  })

  it("describes the amount slider value together with the preview", () => {
    expect(describePreviewHint("fits")).toBe("fits now")
    expect(describePreviewHint("wait")).toBe("needs refill first")
    expect(describePreviewHint("exceeds")).toBe("larger than max capacity")
    expect(describeAmountValue(30_000, "fits")).toBe("30,000 tokens, fits now")
    expect(describeAmountValue(95_000, "wait")).toBe("95,000 tokens, needs refill first")
    expect(describeAmountValue(250_000, "exceeds")).toBe("250,000 tokens, larger than max capacity")
  })

  it("splits contract error names at camel-case boundaries", () => {
    expect(errorNameChunks("TokenMaxCapacityExceeded")).toEqual(["Token", "Max", "Capacity", "Exceeded"])
    expect(errorNameChunks("TokenRateLimitReached")).toEqual(["Token", "Rate", "Limit", "Reached"])
    expect(errorNameChunks("")).toEqual([])
  })
})

describe("drawing geometry", () => {
  it("maps a full bucket to the rim and an empty one to the inner bottom", () => {
    expect(levelToY(100_000, 100_000)).toBe(DRAWING.rimY)
    expect(levelToY(0, 100_000)).toBe(DRAWING.innerBottom)
    expect(levelToY(50_000, 100_000)).toBe(103.5)
    expect(levelToY(200_000, 100_000)).toBe(DRAWING.rimY)
  })

  it("places the amount marker inside the bucket when it fits the capacity", () => {
    expect(markerLayout(30_000, 100_000)).toEqual({
      lineStartX: DRAWING.innerLeft,
      lineY: 130.5,
      labelY: 134.5,
      label: "AMOUNT",
      showMaxLabel: true,
    })
  })

  it("keeps the AMOUNT label clear of the MAX label near the rim", () => {
    const layout = markerLayout(100_000, 100_000)
    expect(layout.lineY).toBe(DRAWING.rimY)
    expect(layout.labelY).toBe(DRAWING.rimY + DRAWING.labelBaselineOffset + DRAWING.labelGap)
  })

  it("moves an amount above the capacity outside the bucket and replaces the MAX label", () => {
    expect(markerLayout(250_000, 100_000)).toEqual({
      lineStartX: DRAWING.bucketRight + 2,
      lineY: DRAWING.rimY,
      labelY: DRAWING.rimY + DRAWING.labelBaselineOffset,
      label: "OVER MAX",
      showMaxLabel: false,
    })
  })
})
