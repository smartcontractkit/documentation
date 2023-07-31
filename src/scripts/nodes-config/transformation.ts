const rule1 = (content: string): string => {
  // This regex captures:
  // 1. Everything between <details><summary> and </summary> (including any HTML tags inside)
  // 2. Everything after <p> and before </p></details>
  const regex = /<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g

  let transformedContent = content

  let match
  while ((match = regex.exec(content)) !== null) {
    // Removing potential HTML tags inside the summary
    const headerContent = match[1].replace(/<[^>]*>/g, "").trim()
    const header = `### ${headerContent}\n`
    const innerContent = match[2].trim()

    transformedContent = transformedContent.replace(match[0], header + "\n\n" + innerContent + "\n")
  }

  return transformedContent
}

const rule2 = (content: string): string => {
  // This regex captures the pattern :warning: followed by any text until a newline
  const regex = /:warning: (.*?)(\n|$)/gm

  // Replacement pattern: <Aside type="caution"> TEXT </Aside>
  const transformedContent = content.replace(regex, '<Aside type="caution">\n$1\n</Aside>\n\n')

  return transformedContent
}

const rule3 = (content: string): string => {
  // This regex matches the specific pattern to be removed
  const regex1 = /\[\/\/\]: # \(Documentation generated from docs(\/\*.toml)? - DO NOT EDIT.\)(\r\n|\n)/g
  const regex2 = /\[\/\/\]: # \(Documentation generated from docs\.toml - DO NOT EDIT\.\)(\r\n|\n)?/g

  // Remove the matched pattern
  const cleanedContent = content.replace(regex1, "").replace(regex2, "")

  return cleanedContent
}

export const rules = [rule1, rule2, rule3]
