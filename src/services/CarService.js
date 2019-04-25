import axios from 'axios';
import qs from 'qs';
import * as constants from '../constants';


/**
 * Car Service
 */
class CarService {

    /**
     * Execute Get Function
     * @returns {Promise<any>}
     */
    get = async(serviceMethod) => {
        return await axios.get(`${constants.BASE_CAR_SERVICE_URL}/${serviceMethod}`);
    };

    /**
     * Execute Post with body
     * @param serviceMethod
     * @param data
     * @returns {Promise<any>}
     */
    post = async(serviceMethod, data) => {
        return await axios.post(`${constants.BASE_CAR_SERVICE_URL}/${serviceMethod}`, qs.stringify(data))
            .catch(ex => {
                return ex;
            });
    };
}

export default new CarService();