import { z } from "astro/zod"

const nonblankString = z.string().trim().min(1)

export const evaluationSchema = z
  .object({
    evals: z.array(nonblankString).nonempty().optional(),
    skills: z.array(nonblankString).nonempty().optional(),
    usableBy: z.array(z.enum(["human", "agent"])).nonempty(),
    outcomes: z.array(nonblankString).nonempty(),
  })
  .strict()

export type Evaluation = z.infer<typeof evaluationSchema>
