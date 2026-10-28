export const isMatchedPath = (currentPath: string, targetHref: string) => {
  // Sidebar links can carry product context (`?parent=`) or anchors. Compare paths only.
  const current = currentPath.split(/[?#]/)[0]
  const target = targetHref.split(/[?#]/)[0]

  if (current === "/" || target === "/") {
    return current === target
  }
  if (current === target) {
    return true
  }
  // Match only when the next character is a path separator, so that e.g.
  // `/cre` does not falsely match `/crec/...`.
  return current.startsWith(target + "/")
}
