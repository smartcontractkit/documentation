document.addEventListener('DOMContentLoaded', () => {
  const notification = document.getElementById('notification');
  const key = notification.getAttribute('key');
  let state = JSON.parse(localStorage[`notification-${key}`] || 'false');
  if (!state) {
    setTimeout(() => {
      notification.style['max-height'] = '100px';
    }, 1000);
    // Change style to be fixed
    state = 'seen';
    localStorage[`notification-${key}`] = JSON.stringify(state);
  } else if (state === 'seen') {
    notification.style['max-height'] = '100px';
    notification.style['transition'] = 'none';
  }

  document.getElementById('notification-close').addEventListener('click',() => {
    state = 'dismissed';
    localStorage[`notification-${key}`] = JSON.stringify(state);
    notification.style['max-height'] = '0';
  });

});
