export {}
window.addEventListener("load", () => {
  const url = `${window.location.href}`
  const searchRegex = /search.*?(?==)/
  const searchElementId = url.match(searchRegex)
  const queryParams = new URLSearchParams(window.location.search)

  if (searchElementId) {
    const searchElement = document.getElementById(searchElementId[0]) as HTMLInputElement
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: "smooth" })
      const input = queryParams.get(searchElementId[0])
      if (input) {
        searchElement.placeholder = input
      }
    }
  }
})
