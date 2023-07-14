import { expect, test } from "@jest/globals"
import { flatteningArray } from "./flattening-array"

describe("flatteningArray", () => {
  test("works", () => {
    const sample = [{ 1: 1, 2: 2, 3: 3, children: [{ 1: 1, 2: 2 }] }]

    const expectedOutput = [
      { 1: 1, 2: 2, 3: 3, children: [{ 1: 1, 2: 2 }] },
      { 1: 1, 2: 2 },
    ]
    const receivedOutput = flatteningArray(sample)
    expect(receivedOutput).toEqual(expectedOutput)
  })
})
