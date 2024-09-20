import { tvGet, tvPost } from './services';
import { setAccessToken, getAccessToken } from './storage';
import { credentials } from '../config/credentials';
import { URLs } from '../config/urls';
import { connect } from './connect';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = '<h1>Hello World! Tradovate API Project is running.</h1>';
    }

    console.log('Tradovate API Project initialized');
    console.log('Credentials:', credentials);
    console.log('URLs:', URLs);

    // Test connect function
    connect().then(result => {
        console.log('Connect result:', result);
    }).catch(error => {
        console.error('Connect error:', error);
    });
});