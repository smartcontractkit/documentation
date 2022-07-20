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
var replaceBlockquotes = function () {
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
};
var replaceYoutube = function () {
    /**
     * This:
     * https://www.youtube.com/watch?v=ay4rXZhAefs
     * Becomes this:
     * <YouTube id="https://www.youtube.com/watch?v=ay4rXZhAefs" />
     */
};
var replaceRemixCode = function () {
    /**
     * This:
     * ```solidity
     *   {% include 'samples/PriceFeeds/PriceConsumerV3.sol' %}
     *  ```
     * Becomes this:
     * <CodeSample src='/samples/PriceFeeds/PriceConsumerV3.sol' />
     */
};
function convertToListOfStrings(path) {
    var data = fs.readFileSync(path, "utf8");
    var separateLines = data.split(/\r?\n|\r|\n/g);
    //   console.log(separateLines);
    return separateLines;
}
function writeToDestination(listOfLines, fileName) {
    var newPath = "".concat(process.cwd(), "/temp").concat(fileName);
    var tempPath = newPath.split("/");
    tempPath.pop();
    var targetDir = tempPath.join("/");
    console.log({ fileName: fileName, newPath: newPath, targetDir: targetDir });
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(newPath, listOfLines.join("\r\n"));
}
function importFiles() {
    prepareFileSystem();
    var pathToLook = path.join(process.cwd(), "11ty", "docs");
    //   console.log(pathToLook);
    var filePaths = getAllFiles(pathToLook);
    //   console.log(filePaths);
    filePaths.forEach(function (path) {
        // if the file is markdown
        if (path.indexOf(".md") === -1) {
            return;
        }
        var pathInProject = path.split(process.cwd())[1];
        console.log({ pathInProject: pathInProject });
        var fileLines = convertToListOfStrings(path);
        // replace the frontmatter with the propper template reference
        // replace blockquotes from ReadMe renderer with new generic directives
        //replaceBlockquotes();
        // replace youtube urls with the Astro YouTube emmbed component
        //replaceYoutube();
        // replace remix code examples with our custom CodeSample component
        //replaceRemixCode();
        // remove permalink from frontmatter and create redirect object for vercel
        writeToDestination(fileLines, pathInProject);
        // if its HTML, good luck
    });
}
importFiles();
module.exports = {};
