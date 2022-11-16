document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelectorAll<HTMLElement>('code-tabs');
  for (let item of Array.from(list)) {
    const tabs = Array.from(item.querySelectorAll('pre'));
    const tabBar = document.createElement('div');
    tabBar.classList.add('tab-bar');
    for (let tab of tabs) {
      const tabHandle = document.createElement('span');
      const code = tab.querySelector('code');
      const meta = code?.getAttribute('meta');
      if (meta) {
        tabHandle.innerHTML = meta;
      }
      tabBar.appendChild(tabHandle);
      tabHandle.addEventListener('click', (event) => {
        for (let node of tabs) {
          if (node === tab) {
            node.style['display'] = 'block';
          } else {
            node.style['display'] = 'none';
          }
        }
        const children = (<HTMLElement>event?.target)?.parentElement?.children;
        if (children) {
          for (const handle of Array.from(children)) {
            if (handle === tabHandle) {
              handle.classList.add('selected');
            } else {
              handle.classList.remove('selected');
            }
          }
        }
      });
    }
    (<HTMLElement>tabBar.children[0]).click();
    item.prepend(tabBar);
  }
});
