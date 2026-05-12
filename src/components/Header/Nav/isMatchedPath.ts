export const isMatchedPath = (currentPath: string, targetHref: string) => {
  if (currentPath === "/" || targetHref === "/") {
    return currentPath === targetHref
  }
  if (currentPath === targetHref) {
    return true
  }
  // Match only when the next character is a path separator, so that e.g.
  // `/cre` does not falsely match `/crec/...`.
  return currentPath.startsWith(targetHref + "/")
}
