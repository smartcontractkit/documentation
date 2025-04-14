import { SectionContent } from "~/config/index.ts"

/**
 * Flattens a nested tree of sidebar items into a single-level array.
 * This is used by the sidebar to:
 * 1. Determine if a section should be expanded (by checking if any child is active)
 * 2. Calculate the active states of parent items based on their children
 *
 * Example input:
 * [
 *   {
 *     title: "Parent",
 *     url: "/parent",
 *     children: [
 *       { title: "Child", url: "/parent/child" }
 *     ]
 *   }
 * ]
 *
 * Example output:
 * [
 *   { title: "Parent", url: "/parent", children: [...] },
 *   { title: "Child", url: "/parent/child" }
 * ]
 *
 * @param arr - Array of SectionContent items that may contain nested children
 * @returns Flattened array containing all items and their descendants
 */
export const flattenChildren = function (arr) {
  const flattenedArray: SectionContent[] = []
  arr.forEach((item) => {
    flattenedArray.push(item)
    if (item.children) {
      flattenedArray.push(...item.children)
    }
  })
  return flattenedArray
}
