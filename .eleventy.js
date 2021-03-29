const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");


module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  const rdmd = require( '@readme/markdown' ); 
  eleventyConfig.setLibrary('md', {render: rdmd.html});
};

console.log('worked!');