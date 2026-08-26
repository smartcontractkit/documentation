import { describe, expect, it } from "@jest/globals"
import { z } from "astro/zod"
import { evaluationSchema } from "../config/evaluation.js"

const pageSchema = z.object({ evaluation: evaluationSchema.optional() })

const validEvaluation = {
  evals: [" Evaluation-ID "],
  skills: [" Skill-ID "],
  usableBy: ["human", "agent"],
  outcomes: [" Complete the task "],
}

const invalidEvaluations: [string, unknown][] = [
  ["an empty evaluation", {}],
  ["empty evals", { ...validEvaluation, evals: [] }],
  ["a blank eval", { ...validEvaluation, evals: [" \t "] }],
  ["a non-string eval", { ...validEvaluation, evals: [1] }],
  ["a non-array evals value", { ...validEvaluation, evals: "Evaluation-ID" }],
  ["empty skills", { ...validEvaluation, skills: [] }],
  ["a blank skill", { ...validEvaluation, skills: [" \t "] }],
  ["a non-string skill", { ...validEvaluation, skills: [1] }],
  ["a non-array skills value", { ...validEvaluation, skills: "Skill-ID" }],
  ["missing usableBy", { outcomes: ["Outcome"] }],
  ["empty usableBy", { usableBy: [], outcomes: ["Outcome"] }],
  ["an invalid usableBy value", { usableBy: ["Human"], outcomes: ["Outcome"] }],
  ["a non-string usableBy value", { usableBy: [1], outcomes: ["Outcome"] }],
  ["a non-array usableBy value", { usableBy: "human", outcomes: ["Outcome"] }],
  ["missing outcomes", { usableBy: ["human"] }],
  ["empty outcomes", { usableBy: ["human"], outcomes: [] }],
  ["a blank outcome", { usableBy: ["human"], outcomes: [" \t "] }],
  ["a non-string outcome", { usableBy: ["human"], outcomes: [true] }],
  ["a non-array outcomes value", { usableBy: ["human"], outcomes: "Outcome" }],
  ["a non-object evaluation", "evaluation"],
  ["an extra evaluation field", { ...validEvaluation, extra: "not allowed" }],
]

describe("evaluation schema", () => {
  it("is optional at a page property and accepts the required fields alone", () => {
    expect(pageSchema.parse({})).toEqual({})
    expect(
      pageSchema.parse({
        evaluation: { usableBy: ["agent"], outcomes: ["Outcome"] },
      })
    ).toEqual({
      evaluation: { usableBy: ["agent"], outcomes: ["Outcome"] },
    })
  })

  it("accepts optional arrays and trims nonblank strings without changing case", () => {
    expect(evaluationSchema.parse(validEvaluation)).toEqual({
      evals: ["Evaluation-ID"],
      skills: ["Skill-ID"],
      usableBy: ["human", "agent"],
      outcomes: ["Complete the task"],
    })
  })

  it.each(invalidEvaluations)("rejects %s", (_name, evaluation) => {
    expect(() => evaluationSchema.parse(evaluation)).toThrow()
  })
})
