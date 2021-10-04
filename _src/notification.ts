document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelectorAll<HTMLElement>('.notification');
  for (let notification of Array.from(list)) {
    const key = notification.getAttribute('key');

    // Dates are parsed as UTC, so let's offset them to match Eastern Time
    const start = Date.parse(notification.getAttribute('start') || '0') + 4 * 60 * 60 * 1000;
    const end =
      Date.parse(notification.getAttribute('end') || Date.now() + '') + 1000 * 60 * 60 * 24 + 4 * 60 * 60 * 1000;
    const now = Date.now();
    if (start < now && now < end) {
      let state = JSON.parse(localStorage[`notification-${key}`] || 'false');
      if (!state) {
        setTimeout(() => {
          notification.style['maxHeight'] = '100px';
        }, 1000);
        // Change style to be fixed
        state = 'seen';
        localStorage[`notification-${key}`] = JSON.stringify(state);
      } else if (state === 'seen') {
        notification.style['maxHeight'] = '100px';
        notification.style['transition'] = 'none';
      }

      const close = notification.querySelector('.notification-close');
      if (close) {
        close.addEventListener('click', () => {
          state = 'dismissed';
          localStorage[`notification-${key}`] = JSON.stringify(state);
          notification.style['maxHeight'] = '0';
        });
      }
    }
  }
});
