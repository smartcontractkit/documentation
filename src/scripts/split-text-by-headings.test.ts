import { expect, test } from "@jest/globals"
import { splitTextByHeadings } from "./split-text-by-headings"

describe("splitTextByHeadings", () => {
  test("works", () => {
    const sampleText = `Some text before
## Section 1
This is the content of section 1.

### Subsection 1.1
This is the content of subsection 1.1.

## Section 2
This is the content of section 2.`

    const expectedOutput = [
      "Some text before",
      "## Section 1\nThis is the content of section 1.",
      "### Subsection 1.1\nThis is the content of subsection 1.1.",
      "## Section 2\nThis is the content of section 2.",
    ]
    const receivedOutput = splitTextByHeadings(sampleText)
    expect(receivedOutput).toEqual(expectedOutput)
  })
})
