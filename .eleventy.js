module.exports = function (eleventyConfig) {
  const rdmd = require('@readme/markdown')
  eleventyConfig.setLibrary('md', { render: rdmd.html })

  eleventyConfig.addFilter('squash', require('./_includes/squash.js'))
  eleventyConfig.addPassthroughCopy({ _src: '/' })
}
