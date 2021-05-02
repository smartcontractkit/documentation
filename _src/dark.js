(() => {
  const render = (dark, toggle) => {
    if (dark) {
      document.body.classList.add('dark-theme');
      toggle.innerHTML = 'Light Mode';
    } else {
      document.body.classList.remove('dark-theme');
      toggle.innerHTML = 'Dark Mode';
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('dark-toggle');
    let prefersDarkScheme =
      JSON.parse(localStorage['darkMode'] || 'null') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
      render(prefersDarkScheme, toggle);

    toggle.addEventListener('click', (event) => {
      console.log('toggling');
      event.preventDefault();
      prefersDarkScheme = !prefersDarkScheme;
      localStorage['darkMode'] = prefersDarkScheme;
      render(prefersDarkScheme, toggle);
    });
  });
})();
