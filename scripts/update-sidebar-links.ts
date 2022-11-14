import { SIDEBAR } from "../src/config/sidebar"
import * as fs from "fs"

// COPY AND PASTE YOU REDIRECT HERE, THIS IS BECAUSE I CANT GET TO OPEN .JSON FILE WHEN RUNNING THE SCRIPT FROM THE CLI
const redirects = []

/** remove leading and trailing slashes */
const removeSlashes = function (url: string) {
  let sanitizedUrl = url
  if (sanitizedUrl.charAt(0) == "/") sanitizedUrl = sanitizedUrl.substr(1)
  if (sanitizedUrl.charAt(sanitizedUrl.length - 1) == "/")
    sanitizedUrl = sanitizedUrl.substr(0, sanitizedUrl.length - 1)

  return sanitizedUrl
}
const updateSidebar = function () {
  const tempSidebar = {}
  for (const [key, value] of Object.entries(SIDEBAR)) {
    console.log(SIDEBAR[key], value)
    const sections = []
    value.forEach((section) => {
      const updatedContent = section.contents.map((entry) => ({
        ...entry,
        url: findRedirect(entry.url),
        //@ts-ignore
        children: entry?.children?.map((child) => ({
          ...child,
          url: findRedirect(child.url),
        })),
      }))
      sections.push({ ...section, contents: updatedContent })
    })

    tempSidebar[key] = sections
  }

  const newPath = `${process.cwd()}/temp/sidebar.json`

  fs.writeFileSync(newPath, JSON.stringify(tempSidebar))
}

const findRedirect = function (urlToCompare: string) {
  const result = redirects.find((redirect) => {
    return (
      removeSlashes(redirect.source).indexOf(removeSlashes(urlToCompare)) > -1 &&
      removeSlashes(redirect.source).length === removeSlashes(urlToCompare).length
    )
  })
  if (!!result) {
    console.log("redirect found", urlToCompare, result.destination)

    return result.destination
  }
  return urlToCompare
}

updateSidebar()

module.exports = {}
