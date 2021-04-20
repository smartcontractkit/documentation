module.exports = function (eleventyConfig) {
  const rdmd = require('@readme/markdown');
  const embedYouTube = require('eleventy-plugin-youtube-embed');
  eleventyConfig.setLibrary('md', { render: rdmd.html });

  eleventyConfig.addFilter('squash', require('./_includes/squash.js'));
  eleventyConfig.addPlugin(embedYouTube);
  eleventyConfig.addPassthroughCopy({ _src: '/' });

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return rdmd.html(content);
  });
};
