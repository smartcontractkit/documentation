// NOTE: THIS DOESN'T WORK, currently hardcoding in .eleventy.js
/**
 * Make a search index string by removing duplicated words
 * and removing less useful, common short words
 *
 * @param {String} text
 */

 module.exports = function(text) {
    var content = new String(text);
  
    // all lower case, please
    var content = content.toLowerCase();
  
    // remove all html elements and new lines
    var re = /(&lt;.*?&gt;)/gi;
    var plain = unescape(content.replace(re, ''));
  
    // remove duplicated words
    var words = plain.split(' ');
    var deduped = [...(new Set(words))];
    var dedupedStr = deduped.join(' ')
  
    // remove short and less meaningful words
    var result = dedupedStr.replace(/\b(\.|\,|the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for)\b/gi, '');
    //remove newlines, and punctuation
    result = result.replace(/\.|\,|\?|-|—|\n/g, '');
    //remove repeated spaces
    result = result.replace(/[ ]{2,}/g, ' ');
  
    return result;
  }