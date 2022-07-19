const NEWSLETTER_URL = 'https://hooks.zapier.com/hooks/catch/10015000/bb8efqc';
const tag1 = 'Developers';
const tag2 = 'Developer Docs';

function handleSubscribeSubmit(event: any) {
  const subscribeButton: HTMLButtonElement = <any>document.getElementById('subscribe-button');
  const subscribe = document.querySelector<HTMLElement>('.form-subscribe');
  const error = document.querySelector<HTMLElement>('.form-error-message');
  const success = document.querySelector<HTMLElement>('.form-success-message');

  if (subscribeButton?.value) {
    subscribeButton.value = 'Please Wait...';
  }

  var email = new FormData(event.target).get('Email');

  fetch(NEWSLETTER_URL, {
    mode: 'no-cors',
    method: 'POST',
    body: JSON.stringify({
      email,
      tag1,
      tag2,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.type !== 'opaque' && !response.ok) {
        throw Error(response.statusText);
      }

      if (subscribe && error && success) {
        subscribe.style.display = 'none';
        error.style.display = 'none';
        success.style.display = 'block';
      }
    })
    .catch((err) => {
      subscribeButton.value = 'Sign Up';
      if (error) {
        error.style.display = 'block';
      }
      console.error(err);
    });

  event.preventDefault();
}

document.addEventListener('DOMContentLoaded', () => {
  const subscribeForm = document.getElementById('wf-form-Chainlink-Newsletter');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', handleSubscribeSubmit);
  }
});
