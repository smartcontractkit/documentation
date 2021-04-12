// const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
// require("eleventy-plugin-highlightjs");


module.exports = function(eleventyConfig) {
  // eleventyConfig.addPlugin(eleventyNavigationPlugin);
  const rdmd = require( '@readme/markdown' ); 
  //eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary('md', {render: rdmd.html,set: console.log});

  eleventyConfig.addFilter('squash', require('./_filters/squash.js'));
  eleventyConfig.addPassthroughCopy({"_src": "/"});
};
