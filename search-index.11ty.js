// NONE OF THIS WORKS CORRECTLY BECUASE THIS PAGE IS GENERATED FIRST, WHEN IT SHOULD BE GENERATED LAST
// See: https://www.11ty.dev/docs/advanced-order/


class SearchIndex {
  data() {
    return {
      permalink: '/search-index2.json',
      eleventyExcludeFromCollections: true,
      
    }
  }
  async render(data, extra) {
    let posts = data.collections.all;
    // templateContent is undefined because @11ty is doing this in the wrong order.
    return posts.map(post => `<li>${post.data.title} - ${post.data.templateContent}</li>`).join("\n");
    
    // This doesn't work like it's supposed to...
    let result = Object.keys(data.collections.all) + "\n";
     for(let item of data.collections.all) {
      result += Object.keys(item) + "\n" +
      Object.keys(item.template) + "\n" +
      item.url + "\n" +
      item.inputPath + "\n" +
      item.data.title + "\n" +
      item._templateContent + "\n" +
      item.templateContent + "\n";
     } 
     

      

      // Object.keys(item.data) + "\n";

  }
}
module.exports = SearchIndex
