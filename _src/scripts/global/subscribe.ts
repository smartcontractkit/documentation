const NEWSLETTER_URL = 'https://hooks.zapier.com/hooks/catch/10015000/bb8efqc';
const tag1 = 'Developers';
const tag2 = 'Developer Docs';

function handleSubscribeSubmit(event) {

    document.getElementById('subscribe-button').value = 'Please Wait...';
    
    var email = new FormData(event.target).get('Email');

    fetch(NEWSLETTER_URL, {
        mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify({
            email,
            tag1,
            tag2
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (response.type !== 'opaque' && !response.ok) {
            throw Error(response.statusText)
        }
        document.querySelector('.form-subscribe').style.display = 'none';
        document.querySelector('.form-error-message').style.display = 'none';
        document.querySelector('.form-success-message').style.display = 'block';
    }).catch((error) => {
        document.getElementById('subscribe-button').value = 'Sign Up';
        document.querySelector('.form-error-message').style.display = 'block';
        console.error(error);
    });

    event.preventDefault();
}

document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('wf-form-Chainlink-Newsletter');
    subscribeForm.addEventListener('submit', handleSubscribeSubmit);
});