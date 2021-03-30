// NONE OF THIS WORKS CORRECTLY BECUASE THIS PAGE IS GENERATED FIRST, WHEN IT SHOULD BE GENERATED LAST
// See: https://www.11ty.dev/docs/advanced-order/


// function render(obj, depth = 2, dest = {}) {
//   if (depth < 0) {
//     return 'too deep'
//   }
//   if (typeof obj[Symbol.iterator] === 'function') {
//     console.log('found an iterable with keys !' + Object.keys(obj));
//     for (const key of obj) {
//       dest.key = {}
//       dest[key] = render(obj[key], depth - 1, dest[key])
//     }
//     return JSON.stringify(dest)
//   } else {
//     console.log('found a non-iterable!');
//     return JSON.stringify(obj);
//   }
// }

function depthRender(obj, depth =2) {
  if(depth === 0) {
    return JSON.stringify(Object.keys(obj));
  } else {
    const result = '';
    for(let key of obj) {
      result += depthRender(obj[key],depth-1);
    }
    return result;
  }
}

class SearchIndex {
  data() {
    return {
      permalink: '/search-index2.json',
      tags: 'test',
    }
  }
  async render(data, extra) {
    let posts = data.collections.all;
    return posts.map(post => `<li>${post.data.title} - ${post.data.templateContent}</li>`).join("\n");

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
