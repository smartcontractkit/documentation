export const isMatchedPath = (currentPath: string, targetHref: string) => {
  return currentPath === "/" || targetHref === "/" ? currentPath === targetHref : currentPath.startsWith(targetHref)
}
