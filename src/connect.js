import { URLs } from '../config/urls';
import { credentials } from '../config/credentials';
import { setAccessToken } from './storage';
import { tvPost } from './services';

const { DEMO_URL } = URLs;

export const connect = async () => {
    try {
        const data = await tvPost('/auth/accesstokenrequest', {
            name: credentials.name,
            password: credentials.password,
            appId: credentials.appId,
            appVersion: credentials.appVersion,
            cid: credentials.cid,
            sec: credentials.sec,
        }, false);

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