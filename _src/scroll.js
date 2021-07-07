const fixNavHeight = () => {
  const remainingVisibleTopBar =
    document.querySelector('navigation').getBoundingClientRect().top -
    window.scrollY;
  if (remainingVisibleTopBar > 0) {
    document.querySelector('navigation').style[
      'height'
    ] = `calc( 100vh - ${remainingVisibleTopBar}px)`;
  } else {
    document.querySelector('navigation').style['height'] = '';
  }
};
document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector('navigation .active');
  if (element.scrollIntoViewIfNeeded) {
    element.scrollIntoViewIfNeeded();
  } else {
    element.scrollIntoView();
  }
  fixNavHeight();
});
document.addEventListener('scroll', (event) => {
  window.requestAnimationFrame(fixNavHeight);
  console.log(event, window.scrollY);
});
