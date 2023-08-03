export const flattenChildren = function (arr) {
  const flattenedArray = []
  arr.forEach((item) => {
    flattenedArray.push(item)
    if (item.children) {
      flattenedArray.push(...item.children)
    }
  })
  return flattenedArray
}
