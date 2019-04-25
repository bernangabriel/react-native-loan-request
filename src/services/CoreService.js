import {
    AsyncStorage
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import * as constants from '../constants';


/**
 * JsonPlaceHolder Service
 */
class CoreService {
    constructor() {
        axios.defaults.baseURL = constants.BASE_SERVICE_URL;

        axios.interceptors.request.use(
            async (req) => {
                    if (req.url.indexOf('mobile') > -1) {
                        const tokenValue = await this.getAccessToken();
                        if (tokenValue) {
                            req.headers.Authorization = `Bearer ${tokenValue}`;
                        } else {
                            alert('Token not present...');
                        }
                    }
                    return req;
                },
                (error) => {
                    if (error.response.status === constants.AUAUTHORIZED) {
                        alert(`Acceso no Autorizado: ${error}`);
                    }
                }
        );

        axios.interceptors.response.use(
            (res) => {
                return res;
            },
            (err) => {
                if (err) {
                    if (err.response.status === constants.AUAUTHORIZED) {
                        alert(`Response Error: ${err.response.data.Message}`);
                    }
                }
            }
        )
    }

    /**
     * Save AccessToken
     * @param token
     * @returns {Promise<void>}
     */
    saveAccessToken = async (token) => {
        await AsyncStorage.setItem(constants.ACCESS_TOKEN_STORAGE_KEY, token);
    };

    /**
     * Get AccessToken
     * @returns {Promise<void>}
     */
    getAccessToken = async () => {
        return await AsyncStorage.getItem(constants.ACCESS_TOKEN_STORAGE_KEY);
    };

    /**
     * Clear Stored Token
     */
    clearToken = () => {
        AsyncStorage.clear();
    };

    /**
     * Authenticate User
     * @param username
     * @param password
     * @returns {Promise<any>}
     */
    authenticate = async (username, password, callback) => {
        axios.post(constants.AUTHENTICATE_METHOD,
                qs.stringify({
                    username: username,
                    password: password,
                    grant_type: 'password'
                }))
            .then(async (res) => {
                if (res) {
                    const result = res.data;
                    if (result) {
                        if (result.access_token) {
                            this.clearToken();
                            await this.saveAccessToken(result.access_token);
                            callback(result);
                        } else {
                            callback(result);
                        }
                    } else {
                        callback({
                            error: 'user_doesnt_exists'
                        });
                    }
                } else {
                    callback({
                        error: 'user_doesnt_exists'
                    });
                }
            })
            .catch(ex => {
                callback({
                    exception: 'exception',
                    message: ex
                });
            });
    };


    /**
     * Execute Get Function
     * @returns {Promise<any>}
     */
    get = async (serviceMethod) => {
        return await axios.get(serviceMethod);
    };

    /**
     * Execute Post Function
     * @param serviceMethod
     * @param data
     * @returns {Promise<any>}
     */
    post = async (serviceMethod, data) => {
        if (data) {
            return await axios.post(serviceMethod, qs.stringify(data));
        } else {
            return await axios.post(serviceMethod);
        }
    };

    /**
     * Execute Post with body
     * @param serviceMethod
     * @param data
     * @returns {Promise<any>}
     */
    post_body = async (serviceMethod, data) => {
        return await axios.post(serviceMethod, data);
    };

    /**
     * Execute Delete Function
     * @param serviceMethod
     * @returns {Promise<*>}
     */
    delete = async (serviceMethod) => {
        return await axios.delete(serviceMethod);
    }
}

export default new CoreService();