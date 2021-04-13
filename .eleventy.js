module.exports = function (eleventyConfig) {
  const rdmd = require('@readme/markdown')
  eleventyConfig.setLibrary('md', { render: rdmd.html })

  eleventyConfig.addFilter('squash', require('./_filters/squash.js'))
  eleventyConfig.addPassthroughCopy({ _src: '/' })
}
