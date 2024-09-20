import { URLs } from '../config/urls';
import { credentials } from '../config/credentials';
import { setAccessToken } from './storage';

const { DEMO_URL } = URLs;

export const connect = async () => {
    try {
        const response = await fetch(`${DEMO_URL}/auth/accesstokenrequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: credentials.name,
                password: credentials.password,
                appId: credentials.appId,
                appVersion: credentials.appVersion,
                cid: credentials.cid,
                sec: credentials.sec,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errorText) {
            throw new Error(data.errorText);
        }

        setAccessToken(data.accessToken, data.expirationTime);
        console.log('Successfully connected and got access token');
        return data;
    } catch (error) {
        console.error('Error in connect function:', error);
        throw error;
    }
};