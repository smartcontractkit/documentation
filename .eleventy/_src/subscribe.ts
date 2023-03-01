const HUBSPOT_URL = 'https://api.hsforms.com/submissions/v3/integration/submit/20755222/1e05f501-add0-4736-a1d3-9cb24b9cad3f';

function handleSubscribeSubmit(event: any) {
  const subscribeButton: HTMLButtonElement = <any>document.getElementById('subscribe-button');
  const subscribe = document.querySelector<HTMLElement>('.form-subscribe');
  const error = document.querySelector<HTMLElement>('.form-error-message');
  const success = document.querySelector<HTMLElement>('.form-success-message');

  if (subscribeButton?.value) {
    subscribeButton.value = 'Please Wait...';
  }

  var email = new FormData(event.target).get('Email');

  fetch(HUBSPOT_URL, {
    method: 'POST',
    body: JSON.stringify({
      "fields": [
        {
          "name": "email",
          "value": email
        },
        {
          "name":"mailchimp_tags",
          "value":"Developers, Developer Docs"
        }
      ]
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
