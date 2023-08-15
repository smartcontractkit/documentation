import { expect, test } from "@jest/globals"
import { flattenChildren } from "./flatten-children"

describe("flattenChildren", () => {
  test("works", () => {
    const sample = [{ 1: 1, 2: 2, 3: 3, children: [{ 1: 1, 2: 2 }] }]

    const expectedOutput = [
      { 1: 1, 2: 2, 3: 3, children: [{ 1: 1, 2: 2 }] },
      { 1: 1, 2: 2 },
    ]
    const receivedOutput = flattenChildren(sample)
    expect(receivedOutput).toEqual(expectedOutput)
  })
})
