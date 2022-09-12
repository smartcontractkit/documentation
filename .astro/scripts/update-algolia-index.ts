require("dotenv").config()
const fs = require("fs")

const algoliasearch = require("algoliasearch")

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_API_KEY
)

let objects = {} // Fetch your objects

try {
  const data = JSON.parse(
    fs.readFileSync(process.cwd() + "/dist/search-index.json", "utf-8")
  )
  objects = data
} catch (err) {
  console.error(err)
}

const index = client.initIndex("docs-test")

index
  .replaceAllObjects(objects.index, { autoGenerateObjectIDIfNotExist: true })
  .then(({ objectIDs }) => {
    console.log(objectIDs)
  })
  .catch((e) => console.log(e))
