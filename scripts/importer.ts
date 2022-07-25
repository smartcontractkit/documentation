import * as fs from "fs";
import * as path from "path";

/**
 * 1. Pulling all the .md files in [DONE]
 * 2. Put the files in some kind of editable abstraction e.g. for each file convert to an array of [fileLine: string]
 * 3. Do the editing
 * 4. Write the files out into another directory
 */

function prepareFileSystem() {
  const tempPath = `${process.cwd()}/temp/`;
  if (fs.existsSync(tempPath)) {
    fs.rmdirSync(tempPath, { recursive: true });
  }
}

const getAllFiles = function (dirPath: string) {
  const files = fs.readdirSync(dirPath);

  let arrayOfFiles = [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles.push(...getAllFiles(dirPath + "/" + file));
    } else {
      arrayOfFiles.push(path.join(dirPath + "/" + file));
    }
  });

  return arrayOfFiles;
};

function updateFrontmatter(fileAsLines: string[], pathInProject: string) {
  const fileLines = fileAsLines;
  const normalizedPath = pathInProject.split("/11ty/")[1];
  const folderDepthToSrc = normalizedPath.split("/");
  const importPrefix = new Array(folderDepthToSrc.length - 1)
    .fill("../")
    .join("");

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i];
    if (currLine.indexOf("layout: nodes.liquid") === 0) {
      fileLines[i] = [
        "layout: ",
        importPrefix,
        "layouts/MainLayout.astro",
      ].join("");
    }
  }

  return fileLines;
}

/**
 * This:
      > 👍 Requirements
      >
      > This guide requires basic knowledge about smart contracts. If you are new to smart contract development, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) and [Random Numbers](/docs/intermediates-tutorial/) guides before you begin.

  * Becomes this:
      :::notes Requirements
      This guide requires basic knowledge about smart contracts. If you are new to smart contract development, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) and [Random Numbers](/docs/intermediates-tutorial/) guides before you begin.
      :::
  */
const replaceBlockquotes = (fileAsLines: string[]) => {
  const emojis = {
    "> 📘": ":::info",
    "> ℹ️": ":::info",
    "> 👍": ":::okay",
    "> 🚧": ":::warn",
    "> ⚠️": ":::warn",
    "> ❗️": ":::error",
    // TODO: figure out what this maps to
    "> 🚰 ": ":::okay",
  };
  const directiveCloseTag = ":::";

  const fileLines = fileAsLines;

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i];
    Object.keys(emojis).forEach((emoji) => {
      if (currLine.indexOf(emoji) === 0) {
        // Brad approved this
        fileLines[i] = fileLines[i].replace(emoji, emojis[emoji]);

        let nexLineCounter = i + 1;
        while (fileLines[nexLineCounter].indexOf(">") === 0) {
          fileLines[nexLineCounter] = fileLines[nexLineCounter].replace(
            ">",
            ""
          );
          nexLineCounter++;
        }

        // add close tag to directive
        fileLines.splice(nexLineCounter, 0, directiveCloseTag);
      }
    });
  }
  return fileLines;
};

/**
 * This:
 * https://www.youtube.com/watch?v=ay4rXZhAefs
 * Becomes this:
 * <YouTube id="https://www.youtube.com/watch?v=ay4rXZhAefs" />
 */
const replaceYoutube = (fileAsLines: string[]) => {
  const fileLines = fileAsLines;

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i];
    if (currLine.trim().indexOf("https://www.youtube.com/watch?v") === 0) {
      console.log("youtube match", currLine);
      fileLines[i] = `<YouTube id="${currLine.trim()}" />`;
      console.log("youtube converted", fileLines[i]);
    }
  }
  return fileLines;
};

/**
 * This:
 * ```solidity
 *   {% include 'samples/PriceFeeds/PriceConsumerV3.sol' %}
 *  ```
 * Becomes this:
 * <CodeSample src='/samples/PriceFeeds/PriceConsumerV3.sol' />
 */
const replaceRemixCode = (fileAsLines: string[]) => {
  const fileLines = fileAsLines;

  for (let i = 0; i < fileLines.length; i++) {
    const currLine = fileLines[i];

    if (currLine.indexOf("{% include 'samples/") > -1) {
      // remove triple-tilde from previous line and extract language code
      let languageCode = undefined;
      const prevLine = fileLines[i - 1];
      if (prevLine.indexOf("```") === 0) {
        languageCode = prevLine.replace("```", "").split(" ")[0];
        fileLines[i - 1] = "";
      }

      // remove triple-tilde from next line
      const nextLine = fileLines[i + 1];
      if (nextLine.indexOf("```") === 0) {
        fileLines[i + 1] = nextLine.replace("```", "");
      }

      // replace import for CodeSample component and add language code
      fileLines[i] = fileLines[i].replace("{% include '", "<CodeSample src='");
      if (!!languageCode) {
        fileLines[i] = fileLines[i].replace("%}", `lang="${languageCode}" />`);
      } else {
        fileLines[i] = fileLines[i].replace("%}", `/>`);
      }
    }
  }
  return fileLines;
};

function convertToListOfStrings(path: string) {
  const data = fs.readFileSync(path, "utf8");
  const separateLines = data.split(/\r?\n|\r|\n/g);
  //   console.log(separateLines);
  return separateLines;
}

function writeToDestination(listOfLines: string[], fileName?: string) {
  const parsedFileName = fileName.toLowerCase().replace(/ /g, "-");
  console.log({ parsedFileName });

  const newPath = `${process.cwd()}/temp${parsedFileName}`;

  let tempPath = newPath.split("/");
  tempPath.pop();

  const targetDir = tempPath.join("/");

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(newPath, listOfLines.join("\r\n"));
}

function importFiles() {
  prepareFileSystem();
  const pathToLook = path.join(process.cwd(), "11ty", "docs");
  const filePaths = getAllFiles(pathToLook);

  filePaths.forEach(function (path) {
    // if the file is markdown
    // if (path.indexOf(".md") === -1) {
    //   return;
    // }
    const pathInProject = path.split(process.cwd())[1];
    // console.log({ pathInProject });

    let parsedFile = convertToListOfStrings(path);

    // update the frontmatter with the propper template reference
    parsedFile = updateFrontmatter(parsedFile, pathInProject);

    // replace blockquotes from ReadMe renderer with new generic directives
    parsedFile = replaceBlockquotes(parsedFile);

    // replace youtube urls with the Astro YouTube emmbed component
    parsedFile = replaceYoutube(parsedFile);

    // replace remix code examples with our custom CodeSample component
    parsedFile = replaceRemixCode(parsedFile);

    // remove permalink from frontmatter and create redirect object for vercel
    writeToDestination(parsedFile, pathInProject);
    // if its HTML, good luck
  });
}

importFiles();

module.exports = {};
