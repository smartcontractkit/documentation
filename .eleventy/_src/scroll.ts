const fixNavHeight = () => {
  const nav = document.querySelector<HTMLElement>('navigation')
  if (nav) {
    const remainingVisibleTopBar =
      nav.getBoundingClientRect().top -
      window.scrollY;
    if (remainingVisibleTopBar > 0) {
      nav.style[
        'height'
      ] = `calc( 100vh - ${remainingVisibleTopBar}px)`;
    } else {
      nav.style['height'] = '';
    }
  }
};
document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector<HTMLElement>('navigation .active');
  if (element) {
    if ((<any>element).scrollIntoViewIfNeeded) {
      (<any>element).scrollIntoViewIfNeeded();
    } else {
      element.scrollIntoView();
    }
    fixNavHeight();
  }
});
document.addEventListener('scroll', (event) => {
  window.requestAnimationFrame(fixNavHeight);
});