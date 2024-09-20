import { URLs } from '../config/urls';
import { credentials } from '../config/credentials';
import { setAccessToken, getAccessToken, tokenIsValid } from './storage';
import { tvPost } from './services';
import { waitForMs } from './utils/waitForMs';

const { DEMO_URL } = URLs;

let authRetryCount = 0;
const MAX_AUTH_RETRIES = 5;
const INITIAL_RETRY_DELAY = 60 * 60 * 1000; // 1 hour in milliseconds

const handleAuthRetry = async (error) => {
    authRetryCount++;
    if (authRetryCount > MAX_AUTH_RETRIES) {
        throw new Error('Max authentication retries reached. Manual intervention required.');
    }

    const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, authRetryCount - 1);
    console.log(`Authentication failed. Retrying in ${retryDelay / 60000} minutes. Attempt ${authRetryCount} of ${MAX_AUTH_RETRIES}`);
    
    await waitForMs(retryDelay);
    return connect();
};

export const connect = async (data = credentials) => {
    try {
        const { token, expiration } = getAccessToken();
        if (token && tokenIsValid(expiration)) {
            console.log('Using existing valid access token.');
            authRetryCount = 0; // Reset retry count on successful use of existing token
            return { accessToken: token, expirationTime: expiration };
        }

        const authResponse = await tvPost('/auth/accesstokenrequest', {
            name: data.name,
            password: data.password,
            appId: data.appId,
            appVersion: data.appVersion,
            cid: data.cid,
            sec: data.sec,
        }, false);

        if (authResponse['p-ticket'] || authResponse.errorText) {
            throw new Error('Authentication failed: ' + (authResponse.errorText || 'Time penalty enforced'));
        }

        setAccessToken(authResponse.accessToken, authResponse.expirationTime);
        console.log('Successfully connected and stored new access token');
        authRetryCount = 0; // Reset retry count on successful authentication
        return authResponse;
    } catch (error) {
        console.error('Error in connect function:', error);
        return handleAuthRetry(error);
    }
};