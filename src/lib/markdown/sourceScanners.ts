const HIGHLIGHTER_MARKERS = ["highlight-line", "highlight-start", "highlight-end"] as const

function isWhitespace(code: number): boolean {
  return code === 9 || code === 10 || code === 11 || code === 12 || code === 13 || code === 32
}

function isIdentifierStart(code: number): boolean {
  return code === 36 || code === 95 || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
}

function isIdentifierPart(code: number): boolean {
  return isIdentifierStart(code) || (code >= 48 && code <= 57)
}

function skipWhitespace(source: string, cursor: number): number {
  while (cursor < source.length && isWhitespace(source.charCodeAt(cursor))) cursor += 1
  return cursor
}

function findIdentifierToken(source: string, token: string, cursor: number): number {
  while (cursor < source.length) {
    const start = source.indexOf(token, cursor)
    if (start < 0) return -1
    const end = start + token.length
    if (
      (start === 0 || !isIdentifierPart(source.charCodeAt(start - 1))) &&
      (end === source.length || !isIdentifierPart(source.charCodeAt(end)))
    ) {
      return start
    }
    cursor = end
  }
  return -1
}

function readIdentifier(source: string, cursor: number): { value: string; end: number } | undefined {
  if (!isIdentifierStart(source.charCodeAt(cursor))) return
  const start = cursor
  cursor += 1
  while (cursor < source.length && isIdentifierPart(source.charCodeAt(cursor))) cursor += 1
  return { value: source.slice(start, cursor), end: cursor }
}

function quotedEndOnLine(source: string, cursor: number, quote: number): number {
  while (cursor < source.length && source.charCodeAt(cursor) !== 10) {
    if (source.charCodeAt(cursor) === quote) return cursor
    cursor += 1
  }
  return -1
}

export function readStaticDefaultImports(source: string): Map<string, string> {
  const imports = new Map<string, string>()
  let cursor = 0

  while (cursor < source.length) {
    const start = findIdentifierToken(source, "import", cursor)
    if (start < 0) break
    cursor = start + "import".length
    if (!isWhitespace(source.charCodeAt(cursor))) continue

    cursor = skipWhitespace(source, cursor)
    const identifier = readIdentifier(source, cursor)
    if (!identifier) continue
    cursor = identifier.end
    if (!isWhitespace(source.charCodeAt(cursor))) continue

    cursor = skipWhitespace(source, cursor)
    if (!source.startsWith("from", cursor) || isIdentifierPart(source.charCodeAt(cursor + "from".length))) {
      continue
    }
    cursor += "from".length
    if (!isWhitespace(source.charCodeAt(cursor))) continue

    cursor = skipWhitespace(source, cursor)
    const quote = source.charCodeAt(cursor)
    if (quote !== 34 && quote !== 39) continue
    cursor += 1
    const end = quotedEndOnLine(source, cursor, quote)
    if (end < 0) {
      const lineEnd = source.indexOf("\n", cursor)
      cursor = lineEnd < 0 ? source.length : lineEnd + 1
      continue
    }
    if (end > cursor) imports.set(identifier.value, source.slice(cursor, end))
    cursor = end + 1
  }

  return imports
}

export function readStaticJsxSelectorConditions(source: string, attribute: string): Map<string, string> {
  const conditions = new Map<string, string>()
  if (attribute.length === 0) return conditions
  let cursor = 0

  while (cursor < source.length) {
    const start = findIdentifierToken(source, attribute, cursor)
    if (start < 0) break
    cursor = start + attribute.length
    cursor = skipWhitespace(source, cursor)
    if (!source.startsWith("===", cursor)) continue

    cursor += 3
    cursor = skipWhitespace(source, cursor)
    const quote = source.charCodeAt(cursor)
    if (quote !== 34 && quote !== 39) continue
    cursor += 1
    const selectorEnd = quotedEndOnLine(source, cursor, quote)
    if (selectorEnd < 0) {
      const lineEnd = source.indexOf("\n", cursor)
      cursor = lineEnd < 0 ? source.length : lineEnd + 1
      continue
    }
    const selector = source.slice(cursor, selectorEnd)
    cursor = skipWhitespace(source, selectorEnd + 1)
    if (!source.startsWith("&&", cursor)) continue

    cursor += 2
    cursor = skipWhitespace(source, cursor)
    if (source.charCodeAt(cursor) !== 60) continue
    cursor += 1
    const component = readIdentifier(source, cursor)
    if (!component) continue
    cursor = component.end
    if (selector.length > 0) conditions.set(selector, component.value)
  }

  return conditions
}

function isFenceLine(source: string, start: number, end: number): boolean {
  if (source.charCodeAt(start) !== 45 || source.charCodeAt(start + 1) !== 45 || source.charCodeAt(start + 2) !== 45) {
    return false
  }
  for (let cursor = start + 3; cursor < end; cursor += 1) {
    if (!isWhitespace(source.charCodeAt(cursor))) return false
  }
  return true
}

export function removeLeadingMdxFrontmatter(source: string): string {
  const firstLineEnd = source.indexOf("\n")
  if (firstLineEnd < 0 || !isFenceLine(source, 0, firstLineEnd)) return source

  let cursor = firstLineEnd + 1
  while (cursor < source.length) {
    const lineEnd = source.indexOf("\n", cursor)
    if (lineEnd < 0) return source
    if (isFenceLine(source, cursor, lineEnd)) return source.slice(lineEnd + 1)
    cursor = lineEnd + 1
  }
  return source
}

function highlighterMarkerLength(line: string, cursor: number): number {
  for (const marker of HIGHLIGHTER_MARKERS) {
    if (line.startsWith(marker, cursor)) return marker.length
  }
  return 0
}

function stripHighlighterCommentLine(line: string): string {
  let cursor = 0
  let whitespaceStart = 0

  while (cursor < line.length) {
    if (isWhitespace(line.charCodeAt(cursor))) {
      cursor += 1
      continue
    }
    if (line.charCodeAt(cursor) === 47 && line.charCodeAt(cursor + 1) === 47) {
      const markerStart = skipWhitespace(line, cursor + 2)
      const markerLength = highlighterMarkerLength(line, markerStart)
      if (markerLength > 0) {
        return line.slice(0, whitespaceStart) + line.slice(markerStart + markerLength)
      }
    }
    cursor += 1
    whitespaceStart = cursor
  }

  return line
}

export function stripHighlighterComments(code: string): string {
  const chunks: string[] = []
  for (const line of code.split("\n")) chunks.push(stripHighlighterCommentLine(line))
  return chunks.join("\n")
}
