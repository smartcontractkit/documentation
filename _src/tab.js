document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelectorAll('code-tabs')
  for (let item of list) {
    const tabs = [...item.querySelectorAll('pre')]
    const tabBar = document.createElement('div');
    tabBar.classList.add('tab-bar');
    for(let tab of tabs) {
        const tabHandle = document.createElement('span');
        tabHandle.innerHTML = tab.querySelector('code').getAttribute('meta');
        tabBar.appendChild(tabHandle);
        tabHandle.addEventListener('click',(event) => {
            for(let node of tabs) {
              if(node === tab) {
                node.style['display'] = 'block';
              } else {
                node.style['display'] = 'none';
              }
            }
            for(handle of event.target.parentElement.children) {
              if(handle === tabHandle) {
                handle.classList.add('selected');
              } else {
                handle.classList.remove('selected');
              }
            }
        });
    }
    tabBar.children[0].click();
    item.prepend(tabBar);
  }

})
