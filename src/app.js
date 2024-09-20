import { tvGet, tvPost } from './services';
import { setAccessToken, getAccessToken } from './storage';
import { credentials } from '../config/credentials';
import { URLs } from '../config/urls';
import { connect } from './connect';

function updateDisplay(content) {
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML += content;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay('<h1>Tradovate API Project</h1>');
    updateDisplay('<p>Initializing...</p>');

    console.log('Tradovate API Project initialized');
    console.log('Credentials:', credentials);
    console.log('URLs:', URLs);

    connect()
        .then(result => {
            if (result.accessToken) {
                updateDisplay('<h2>Connection Successful</h2>');
                updateDisplay('<pre>Access Token: ' + result.accessToken.substring(0, 10) + '...' + '</pre>');
                updateDisplay('<pre>Expiration Time: ' + result.expirationTime + '</pre>');
                console.log('Connect result:', result);
                return tvGet('/account/list');
            } else {
                throw new Error('No access token received');
            }
        })
        .then(accounts => {
            updateDisplay('<h2>Account List</h2>');
            updateDisplay('<pre>' + JSON.stringify(accounts, null, 2) + '</pre>');
            console.log('Account list:', accounts);
        })
        .catch(error => {
            updateDisplay('<h2>Error</h2>');
            updateDisplay('<p>' + error.message + '</p>');
            console.error('Error:', error);
        });
});