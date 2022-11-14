// TEMPORARY SCRIPT - WILL be deleted
import * as fs from "fs"
import * as path from "path"

function prepareFileSystem() {
  const tempPath = `${process.cwd()}/temp/`
  if (fs.existsSync(tempPath)) {
    fs.rmdirSync(tempPath, { recursive: true })
  }
}

const getAllFiles = function (dirPath: string) {
  const files = fs.readdirSync(dirPath)

  let arrayOfFiles = []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles.push(...getAllFiles(dirPath + "/" + file))
    } else {
      arrayOfFiles.push(path.join(dirPath + "/" + file))
    }
  })

  return arrayOfFiles
}

function updateFrontmatter(fileAsLines: string[], pathInProject: string) {
  const fileLines = fileAsLines
  const normalizedPath = pathInProject
  const folderDepthToSrc = normalizedPath.split("/")
  const importPrefix = new Array(folderDepthToSrc.length - 1).fill("../").join("")

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i]
    if (currLine.indexOf("layout: nodes.liquid") === 0) {
      fileLines[i] = ["layout: ", importPrefix, "layouts/MainLayout.astro"].join("")
    }
  }

  return fileLines
}

/**
 * This:
      > 👍 Requirements
      >
      > This guide requires basic knowledge about smart contracts. If you are new to smart contract development, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) and [Random Numbers](/docs/intermediates-tutorial/) guides before you begin.

  * Becomes this:
      :::notes [Requirements]
      This guide requires basic knowledge about smart contracts. If you are new to smart contract development, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) and [Random Numbers](/docs/intermediates-tutorial/) guides before you begin.
      :::
  */
const replaceBlockquotes = (fileAsLines: string[]) => {
  const emojis = {
    "> 📘": ":::note",
    "> ℹ️": ":::note",
    "> 👍": ":::tip",
    "> 🚧": ":::caution",
    "> ⚠️": ":::caution",
    "> ❗️": ":::danger",
    // TODO: figure out what this maps to
    "> 🚰 ": ":::tip",
  }
  const directiveCloseTag = ":::"

  const fileLines = fileAsLines

  // TODO: update this to handle indentation
  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i]
    Object.keys(emojis).forEach((emoji) => {
      const padding = currLine.indexOf(emoji)
      if (currLine.indexOf(emoji) > -1) {
        // Brad approved this
        fileLines[i] = fileLines[i].replace(emoji, `${emojis[emoji]}[`) + "]"
        // console.log(fileLines[i]);

        let nexLineCounter = i + 1
        while (fileLines[nexLineCounter].indexOf(">") > -1) {
          fileLines[nexLineCounter] = fileLines[nexLineCounter].replace(">", "")
          nexLineCounter++
        }

        // add close tag to directive
        fileLines.splice(nexLineCounter, 0, "")
        fileLines.splice(nexLineCounter + 1, 0, " ".repeat(padding) + directiveCloseTag)
      }
    })
  }
  return fileLines
}

/**
 * This:
 * https://www.youtube.com/watch?v=ay4rXZhAefs
 * Becomes this:
 * <YouTube id="https://www.youtube.com/watch?v=ay4rXZhAefs" />
 */
const replaceYoutube = (fileAsLines: string[]) => {
  const fileLines = fileAsLines

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i]
    if (currLine.trim().indexOf("https://www.youtube.com/watch?v") === 0) {
      // console.log("youtube match", currLine);
      fileLines[i] = `<YouTube id="${currLine.trim()}" />`
      // console.log("youtube converted", fileLines[i]);
    }
  }
  return fileLines
}

/**
 * This:
 * [sometext](../url-in-same-dir)
 * Becomes this:
 * [sometext](./url-in-same-dir)
 */
const replaceUrlsToSameDirectory = (fileAsLines: string[]) => {
  const fileLines = fileAsLines

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i]
    if (currLine.trim().indexOf("](..") > -1) {
      fileLines[i] = currLine.replace("](../", "](./")
    }
  }
  return fileLines
}

/**
 * This:
 * ```solidity
 *   {% include 'samples/PriceFeeds/PriceConsumerV3.sol' %}
 *  ```
 * Becomes this:
 * <CodeSample src='/samples/PriceFeeds/PriceConsumerV3.sol' />
 */
const replaceRemixCode = (fileAsLines: string[]) => {
  const fileLines = fileAsLines

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i]

    if (currLine.indexOf("{% include 'samples/") > -1) {
      // remove triple-tilde from previous line and extract language code
      let languageCode = undefined
      const prevLine = fileLines[i - 1]
      if (prevLine.indexOf("```") === 0) {
        languageCode = prevLine.replace("```", "").split(" ")[0]
        fileLines[i - 1] = ""
      }

      // remove triple-tilde from next line
      const nextLine = fileLines[i + 1]
      if (nextLine.indexOf("```") === 0) {
        fileLines[i + 1] = nextLine.replace("```", "")
      }

      // replace import for CodeSample component and add language code
      fileLines[i] = fileLines[i].replace("{% include '", "::solidity-remix[")
      fileLines[i] = fileLines[i].replace(`' %}`, `]`)
    }
  }
  return fileLines
}

type Redirect = {
  source: string
  destination: string
  statusCode: number
}
function generateRedirect(fileAsLines: string[], fileName?: string) {
  const parsedFileName = fileName
    .toLowerCase()
    .replace(/ /g, "-")
    .split("docs/")[1]
    .replace(".md", "")
    .replace(".html", "")

  const fileLines = fileAsLines
  for (let i = 0; i < fileLines.length; i++) {
    if (fileLines[i].indexOf("permalink:") === 0) {
      const permalink = fileLines[i].split("permalink:")[1].trim().replace(/['"]+/g, "")

      return {
        source: permalink,
        destination: parsedFileName,
        statusCode: 301,
      } as Redirect
    }
  }
  // if we dont find a permalink the file was using file based routing
  return {
    source: `docs/${parsedFileName}`,
    destination: parsedFileName,
    statusCode: 301,
  } as Redirect
}

function convertToListOfStrings(path: string) {
  const data = fs.readFileSync(path, "utf8")
  const separateLines = data.split(/\r?\n|\r|\n/g)
  return separateLines
}

function writeToDestination(listOfLines: string[], fileName?: string) {
  const parsedFileName = fileName.toLowerCase().replace(/ /g, "-")

  const newPath = `${process.cwd()}/temp/${parsedFileName}`

  let tempPath = newPath.split("/")
  tempPath.pop()

  const targetDir = tempPath.join("/")

  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(newPath, listOfLines.join("\r\n"))
}

function writeRedirects(redirects: Redirect[]) {
  const newPath = `${process.cwd()}/temp/redirects.json`

  let tempPath = newPath.split("/")
  tempPath.pop()

  const targetDir = tempPath.join("/")

  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(newPath, JSON.stringify({ redirects }))
}

type FileMeta = {
  filePath: string
  fileName: string
  fileExtension: string
  pathInProject: string
  permalink: string
  content: string[]
}

function importFiles() {
  prepareFileSystem()
  const pathToLook = path.join(process.cwd(), "../docs")

  const filePaths = getAllFiles(pathToLook)
  const redirects = []

  filePaths.forEach(function (filePath) {
    const fileMeta = {
      filePath: filePath,
      pathInProject: filePath.split(path.join(process.cwd(), "../"))[1],
      fileName: path.basename(filePath),
      content: convertToListOfStrings(filePath),
      fileExtension: path.extname(filePath),
      permalink: filePath.split(path.join(process.cwd(), "../"))[1],
    } as FileMeta
    // console.log({ fileMeta })

    // update the frontmatter with the propper template reference
    fileMeta.content = updateFrontmatter(fileMeta.content, fileMeta.pathInProject)

    // replace blockquotes from ReadMe renderer with new generic directives
    fileMeta.content = replaceBlockquotes(fileMeta.content)

    // replace youtube urls with the Astro YouTube emmbed component
    fileMeta.content = replaceYoutube(fileMeta.content)

    fileMeta.content = replaceUrlsToSameDirectory(fileMeta.content)

    // replace remix code examples with our custom CodeSample component
    fileMeta.content = replaceRemixCode(fileMeta.content)

    const redirect = generateRedirect(fileMeta.content, fileMeta.pathInProject)
    redirects.push(redirect)
    writeRedirects(redirects)

    writeToDestination(fileMeta.content, fileMeta.pathInProject)
    // if its HTML, good luck
  })

  console.log(redirects)
}

importFiles()

module.exports = {}
