import { URLs } from '../config/urls';
import { credentials } from '../config/credentials';
import { setAccessToken, getAccessToken, tokenIsValid } from './storage';
import { tvPost } from './services';

const { DEMO_URL } = URLs;

export const connect = async () => {
    try {
        const { token, expiration } = getAccessToken();
        if (token && tokenIsValid(expiration)) {
            console.log('Already have a valid access token. Using existing token.');
            return { accessToken: token, expirationTime: expiration };
        }

        const data = await tvPost('/auth/accesstokenrequest', {
            name: credentials.name,
            password: credentials.password,
            appId: credentials.appId,
            appVersion: credentials.appVersion,
            cid: credentials.cid,
            sec: credentials.sec,
        }, false);

        if (data['p-ticket']) {
            throw new Error('Time Penalty: Too many login attempts. Please wait and try again later.');
        }

        if (data.errorText) {
            throw new Error(data.errorText);
        }

        setAccessToken(data.accessToken, data.expirationTime);
        console.log('Successfully connected and stored new access token');
        return data;
    } catch (error) {
        console.error('Error in connect function:', error);
        throw error;
    }
};