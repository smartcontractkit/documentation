module.exports = function (eleventyConfig) {
  const rdmd = require('@readme/markdown');
  const format = require('date-fns/format');
  const htmlmin = require('html-minifier');

  const embedYouTube = require('eleventy-plugin-youtube-embed');
  eleventyConfig.setLibrary('md', { render: rdmd.html });

  eleventyConfig.addFilter('squash', require('./_includes/squash.js'));
  eleventyConfig.addFilter('date', (date, dateFormat) =>
    format(date, dateFormat)
  );
  eleventyConfig.addPlugin(embedYouTube);
  eleventyConfig.addPassthroughCopy({ _src: '/' });

  eleventyConfig.addPassthroughCopy( {"_includes/samples": "samples"} );

  // Allow us to put rendered markdown in HTML
  eleventyConfig.addPairedShortcode('markdown', (content) => {
    return rdmd.html(content);
  });

  // Only for prod environments
  if (process.env.NODE_ENV !== 'development') {
    // Minify our build to save the bits
    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
      if (outputPath?.endsWith('.html')) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        });
        return minified;
      }

      return content;
    });
  }

  eleventyConfig.setUseGitIgnore(false);
};
