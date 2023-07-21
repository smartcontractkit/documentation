export function splitTextByHeadings(text) {
  const headingRegex = /^(#{2,4})\s+(.*)$/gm
  const sections: string[] = []
  let match
  let lastIndex = 0
  while ((match = headingRegex.exec(text))) {
    const sectionContent = text.substring(lastIndex, match.index).trim()
    const sectionText = sectionContent
    sections.push(sectionText)
    lastIndex = match.index
  }
  if (lastIndex < text.length) {
    const sectionContent = text.substring(lastIndex).trim()
    sections.push(sectionContent)
  }
  return sections
}
