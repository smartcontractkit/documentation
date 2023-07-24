export {}
window.addEventListener("load", () => {
  const url = `${window.location.href}`
  const searchRegex = /search.*?(?==)/
  const searchQuery = url.match(searchRegex)
  if (searchQuery) {
    const searchElement = document.getElementById(searchQuery[0])
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: "smooth" })
    }
  }
})
