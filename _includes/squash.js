/**
 * Make a search index string by removing duplicated words
 * and removing less useful, common words
 *
 * @param {String} text
 */

module.exports = function (text) {
  let content = new String(text);

  content = content.toLowerCase();

  // remove all html elements and new lines
  let re = /(&lt;.*?&gt;)/gi;
  let plain = unescape(content.replace(re, ''));

  // remove html entities and code
  let stripped = plain.replace(/&quot;/g, '');
  stripped = stripped.match(/(\b[a-zA-Z'-]{3,}\b)/g).join(' ');

  // remove duplicated words
  let words = stripped.split(' ');
  let deduped = [...new Set(words)];
  let dedupedStr = deduped.join(' ');

  // remove short and less meaningful words
  let result = dedupedStr.replace(
    /\b(\.|\,|the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for)\b/gi,
    ''
  );

  // Remove newlines, and punctuation
  result = result.replace(/\.|\,|\?|-|—|\n/g, '');

  // Remove repeated spaces
  result = result.replace(/[ ]{2,}/g, ' ');

  // Remove slashes that were not being properly escaped by nunjucks.
  result = result.replace(/\\/g, '');

  return result;
};
