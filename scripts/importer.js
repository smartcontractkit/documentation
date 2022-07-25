"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
/**
 * 1. Pulling all the .md files in [DONE]
 * 2. Put the files in some kind of editable abstraction e.g. for each file convert to an array of [fileLine: string]
 * 3. Do the editing
 * 4. Write the files out into another directory
 */
function prepareFileSystem() {
    var tempPath = "".concat(process.cwd(), "/temp/");
    if (fs.existsSync(tempPath)) {
        fs.rmdirSync(tempPath, { recursive: true });
    }
}
var getAllFiles = function (dirPath) {
    var files = fs.readdirSync(dirPath);
    var arrayOfFiles = [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles.push.apply(arrayOfFiles, getAllFiles(dirPath + "/" + file));
        }
        else {
            arrayOfFiles.push(path.join(dirPath + "/" + file));
        }
    });
    return arrayOfFiles;
};
function updateFrontmatter(fileAsLines, pathInProject) {
    var fileLines = fileAsLines;
    var normalizedPath = pathInProject.split("/11ty/")[1];
    var folderDepthToSrc = normalizedPath.split("/");
    var importPrefix = new Array(folderDepthToSrc.length - 1)
        .fill("../")
        .join("");
    for (var i = 0; i < fileLines.length; i++) {
        var currLine = fileLines[i];
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
var replaceBlockquotes = function (fileAsLines) {
    var emojis = {
        "> 📘": ":::info",
        "> ℹ️": ":::info",
        "> 👍": ":::okay",
        "> 🚧": ":::warn",
        "> ⚠️": ":::warn",
        "> ❗️": ":::error",
        // TODO: figure out what this maps to
        "> 🚰 ": ":::okay"
    };
    var directiveCloseTag = ":::";
    var fileLines = fileAsLines;
    var _loop_1 = function (i) {
        var currLine = fileLines[i];
        Object.keys(emojis).forEach(function (emoji) {
            if (currLine.indexOf(emoji) === 0) {
                // Brad approved this
                fileLines[i] = fileLines[i].replace(emoji, "".concat(emojis[emoji], "[")) + "]";
                console.log(fileLines[i]);
                var nexLineCounter = i + 1;
                while (fileLines[nexLineCounter].indexOf(">") === 0) {
                    fileLines[nexLineCounter] = fileLines[nexLineCounter].replace(">", "");
                    nexLineCounter++;
                }
                // add close tag to directive
                fileLines.splice(nexLineCounter, 0, "");
                fileLines.splice(nexLineCounter + 1, 0, directiveCloseTag);
            }
        });
    };
    for (var i = 0; i < fileLines.length; i++) {
        _loop_1(i);
    }
    return fileLines;
};
/**
 * This:
 * https://www.youtube.com/watch?v=ay4rXZhAefs
 * Becomes this:
 * <YouTube id="https://www.youtube.com/watch?v=ay4rXZhAefs" />
 */
var replaceYoutube = function (fileAsLines) {
    var fileLines = fileAsLines;
    for (var i = 0; i < fileLines.length; i++) {
        var currLine = fileLines[i];
        if (currLine.trim().indexOf("https://www.youtube.com/watch?v") === 0) {
            console.log("youtube match", currLine);
            fileLines[i] = "<YouTube id=\"".concat(currLine.trim(), "\" />");
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
var replaceRemixCode = function (fileAsLines) {
    var fileLines = fileAsLines;
    for (var i = 0; i < fileLines.length; i++) {
        var currLine = fileLines[i];
        if (currLine.indexOf("{% include 'samples/") > -1) {
            // remove triple-tilde from previous line and extract language code
            var languageCode = undefined;
            var prevLine = fileLines[i - 1];
            if (prevLine.indexOf("```") === 0) {
                languageCode = prevLine.replace("```", "").split(" ")[0];
                fileLines[i - 1] = "";
            }
            // remove triple-tilde from next line
            var nextLine = fileLines[i + 1];
            if (nextLine.indexOf("```") === 0) {
                fileLines[i + 1] = nextLine.replace("```", "");
            }
            // replace import for CodeSample component and add language code
            fileLines[i] = fileLines[i].replace("{% include '", "<CodeSample src='");
            if (!!languageCode) {
                fileLines[i] = fileLines[i].replace("%}", "lang=\"".concat(languageCode, "\" />"));
            }
            else {
                fileLines[i] = fileLines[i].replace("%}", "/>");
            }
        }
    }
    return fileLines;
};
function generateRedirect(fileAsLines) {
    var fileLines = fileAsLines;
    for (var i = 0; i < fileLines.length; i++) {
        if (fileLines[i].indexOf("permalink:") === 0) {
            console.log(fileLines[i]);
        }
    }
}
function convertToListOfStrings(path) {
    var data = fs.readFileSync(path, "utf8");
    var separateLines = data.split(/\r?\n|\r|\n/g);
    //   console.log(separateLines);
    return separateLines;
}
function writeToDestination(listOfLines, fileName) {
    var parsedFileName = fileName.toLowerCase().replace(/ /g, "-");
    console.log({ parsedFileName: parsedFileName });
    var newPath = "".concat(process.cwd(), "/temp").concat(parsedFileName);
    var tempPath = newPath.split("/");
    tempPath.pop();
    var targetDir = tempPath.join("/");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(newPath, listOfLines.join("\r\n"));
}
function importFiles() {
    prepareFileSystem();
    var pathToLook = path.join(process.cwd(), "11ty", "docs");
    var filePaths = getAllFiles(pathToLook);
    var redirects = [];
    // "redirects": [
    //   {
    //     "source": "/view-source",
    //     "destination": "https://github.com/vercel/vercel",
    //     "statusCode": 301
    //   }
    // ]
    filePaths.forEach(function (path) {
        // if the file is markdown
        // if (path.indexOf(".md") === -1) {
        //   return;
        // }
        var pathInProject = path.split(process.cwd())[1];
        // console.log({ pathInProject });
        var parsedFile = convertToListOfStrings(path);
        // update the frontmatter with the propper template reference
        parsedFile = updateFrontmatter(parsedFile, pathInProject);
        // replace blockquotes from ReadMe renderer with new generic directives
        parsedFile = replaceBlockquotes(parsedFile);
        // replace youtube urls with the Astro YouTube emmbed component
        parsedFile = replaceYoutube(parsedFile);
        // replace remix code examples with our custom CodeSample component
        parsedFile = replaceRemixCode(parsedFile);
        var redirect = generateRedirect(parsedFile);
        // remove permalink from frontmatter and create redirect object for vercel
        writeToDestination(parsedFile, pathInProject);
        // if its HTML, good luck
    });
}
importFiles();
module.exports = {};
