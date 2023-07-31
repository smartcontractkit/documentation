import nodesConfig from "./config.json"
import { Octokit } from "octokit"
import { createTokenAuth } from "@octokit/auth-token"
import fetch from "node-fetch"
import { writeFile, readFile, mkdir, access } from "fs/promises"
import path, { normalize } from "path"
import { format } from "prettier"
import { rules } from "./transformation"
import * as dotenv from "dotenv"

dotenv.config()

const chainlinkNodesAbsolute = "/chainlink-nodes"
const nodesPageDir = `./src/pages${chainlinkNodesAbsolute}`
const getTags = async () => {
  const PAT = process.env.PAT_PUBLIC_READ
  if (!PAT) throw new Error("PAT_PUBLIC_READ not found in .env")
  const auth = createTokenAuth(PAT)
  const authentication = await auth()
  const octokit = new Octokit({
    auth: authentication.token,
  })
  interface Node {
    tagName: string
  }

  interface Edge {
    node: Node
  }

  interface GetTagsResponse {
    repository: {
      releases: {
        edges: Edge[]
      }
    }
  }

  const response = (await octokit.graphql(`{
    repository(name: "${nodesConfig.repo}", owner: "${nodesConfig.owner}") {
      releases(last: 100) {
        edges {
          node {
            tagName
          }
        }
      }
    }
  }`)) as GetTagsResponse

  return response.repository.releases.edges.map((edge) => edge.node.tagName)
}

interface TagInfo {
  tag: string
  majorVersion: number
}

const filterTags = (tags: string[]): TagInfo[] => {
  const currentTags = nodesConfig["current-tags"] as string[]
  // Test to follow this pattern: v0.8.1 , v0.8.11 , v0.11.12...Etc
  const pattern = /^v(\d{1,2})\.\d{1,2}\.\d{1,2}$/
  const result: TagInfo[] = []

  tags.forEach((tag) => {
    const match = pattern.exec(tag)
    if (match && currentTags.indexOf(tag) === -1) {
      if (Number(match[1]) === 0) {
        // console.log("Skip tag:", tag) // no docs available for tags v0
      } else {
        result.push({
          tag,
          majorVersion: Number(match[1]),
        })
      }
    }
  })

  return result
}

const sortTags = (tags: TagInfo[]): TagInfo[] => {
  return tags.sort((a, b) => {
    // Extract tag value from the TagInfo object
    const tag1 = a.tag.slice(1)
    const tag2 = b.tag.slice(1)
    const version1 = tag1.split(".").map((x) => parseInt(x))
    const version2 = tag2.split(".").map((x) => parseInt(x))

    if (version1.length !== version2.length) throw new Error(`cannot sort tags ${a.tag},${b.tag}`)

    for (let i = 0; i < version1.length; i++) {
      if (version1[i] < version2[i]) {
        return -1
      } else if (version1[i] > version2[i]) {
        return 1
      }
    }

    return 0
  })
}

const updateIndex = async (results: { tagInfo: TagInfo; path: string }[]) => {
  if (results.length === 0) return

  const defaultContent = `---
layout: ../../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Configuring Chainlink Nodes"
---

**Topics**`

  // Group results by majorVersion
  const groupedByVersion: { [key: number]: { tagInfo: TagInfo; path: string }[] } = {}

  for (const result of results) {
    if (!groupedByVersion[result.tagInfo.majorVersion]) {
      groupedByVersion[result.tagInfo.majorVersion] = []
    }
    groupedByVersion[result.tagInfo.majorVersion].push(result)
  }

  for (const majorVersion in groupedByVersion) {
    const versionResults = groupedByVersion[majorVersion]

    // Build path for the current majorVersion's index.mdx
    const indexDirPath = normalize(`${nodesPageDir}/v${majorVersion}/config`)
    const indexPath = normalize(`${indexDirPath}/index.mdx`)

    // Ensure the directory and file exist
    await mkdir(indexDirPath, { recursive: true })
    try {
      await access(indexPath) // This will throw if file does not exist
    } catch (error) {
      await writeFile(indexPath, defaultContent)
    }

    let data = (await readFile(indexPath)).toString()

    for (const result of versionResults) {
      const entry = `- [${result.tagInfo.tag}](${result.path})`
      data = data.replace("**Topics**", `**Topics**\n${entry}`)
    }

    // Write updated data to the index.mdx
    await writeFile(
      indexPath,
      data,
      /*
      format(data, {
        parser: "markdown",
        semi: true,
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 120,
      }),
      */
      {
        flag: "w",
      }
    )
  }
}

const updateTags = async (results: { tagInfo: TagInfo; path: string }[]) => {
  if (results.length === 0) return
  for (const result of results) {
    ;(nodesConfig["current-tags"] as string[]).push(result.tagInfo.tag)
  }

  const nodesConfigPath = normalize(path.join(__dirname, "config.json"))
  await writeFile(
    nodesConfigPath,
    format(JSON.stringify(nodesConfig), {
      parser: "json",
      semi: true,
      trailingComma: "es5",
      singleQuote: true,
      printWidth: 120,
    }),
    {
      flag: "w",
    }
  )
}

const writeConfigFile = async (tagInfo: TagInfo) => {
  const patternTagInFile = "__TAG__"
  const fileHeader = `
---
layout: ../../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Configuring Chainlink Nodes"
---
import { Aside } from "@components"
`

  const tagInPath = tagInfo.tag.replace(/\./g, "_")
  const clean = [
    {
      from: ":warning:",
      to: "⚠️",
    },
  ]
  const configDirPath = normalize(`${nodesPageDir}/v${tagInfo.majorVersion}/config`)
  await mkdir(configDirPath, { recursive: true }) // ensure the directory is created if not exist

  const path = normalize(`${configDirPath}/${tagInPath}.mdx`)
  const pathInPage = `${chainlinkNodesAbsolute}/v${tagInfo.majorVersion}/config/${tagInPath}`
  const url = normalize(
    `https://raw.githubusercontent.com/${nodesConfig.owner}/${nodesConfig.repo}/${tagInfo.tag}/${nodesConfig.path}`
  )
  const response = await fetch(url)
  if (response.status === 200) {
    let data = await (await fetch(url)).text()
    for (const rule of rules) {
      data = rule(data)
    }
    /*
    for (const key in clean) {
      data = data.replace(new RegExp(clean[key].from, "g"), clean[key].to)
    }
    */

    const content = fileHeader.replace(patternTagInFile, tagInPath) + data

    await writeFile(
      path,
      format(content, {
        parser: "markdown",
        semi: true,
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 120,
      }),
      {
        flag: "w",
      }
    )

    return { tagInfo, path: pathInPage }
  } else if (response.status !== 404) {
    throw new Error(`couldn't fetch ${url}. status ${response.status}`)
  }
  return { tagInfo: null, path: "" }
}

const writeConfigFiles = async (tags: TagInfo[]) => {
  interface Result {
    success: { tagInfo: TagInfo; path: string }[]
    error: {
      tag: string
      errorMessage: unknown
    }[]
  }
  const result: Result = { success: [], error: [] }

  for (const tagInfo of tags) {
    try {
      const successTag = await writeConfigFile(tagInfo)
      if (successTag.tagInfo) result.success.push(successTag)
    } catch (error) {
      result.error.push({ tag: tagInfo.tag, errorMessage: error })
    }
  }

  return result
}
getTags().then(async (w) => {
  const sortedTags = sortTags(filterTags(w))
  const result = await writeConfigFiles(sortedTags)
  console.log(`config files generated ${JSON.stringify(result)}`)
  await updateIndex(result.success)
  await updateTags(result.success)
  if (result.error.length > 0) throw new Error(`an error happened ${JSON.stringify(result.error)}`)
})
