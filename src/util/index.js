import {
    AsyncStorage,
    Alert
} from 'react-native';
//import timestampNow from 'performance-now';
import Moment from 'moment';
import CryptoJS from 'crypto-js';
import * as constants from '../constants';

/**
 * Save Token in Storage
 * @param token
 * @constructor
 */
export const SaveTokenInStorage = async (token) => {
    await AsyncStorage.setItem(constants.ACCESS_TOKEN_KEY, token);
};


/**
 * Get Token In Storage
 * @returns {Promise<*>}
 * @constructor
 */
export const GetTokenInStorage = async () => {
    return await AsyncStorage.getItem(constants.ACCESS_TOKEN_KEY);
};


/**
 * Save General-User-Info in storage
 * @param {*} info
 */
export const SaveGeneralUserInfoInStorage = async (info) => {
    await AsyncStorage.setItem(constants.GENERAL_USER_DETAILS_KEY, info);
};

/**
 * Get General-User-Info in storage
 * @returns {Promise<*>}
 * @constructor
 */
export const GetGeneralUserInfoInStorage = async () => {
    return await AsyncStorage.getItem(constants.GENERAL_USER_DETAILS_KEY);
};

/**
 * Show Alert
 * @param title
 * @param message
 * @constructor
 */
export const ShowAlert = (title, message) => {
    Alert.alert(title, message);
}

/**
 * Trim Fullname
 * @param fullname
 * @returns {*}
 * @constructor
 */
export const TrimFullname = (fullname) => {
    if (fullname) {
        if (fullname.length > 22) {
            return fullname.substr(0, 22) + "...";
        }
        return fullname;
    }
    return "N/A";
};

/**
 * Formate Datetime
 * @param strDate
 * @returns {string}
 */
export const formatDateTime = (strDate) => {
    return Moment(strDate).format('DD/MM/YYYY hh:mm');
};


/**
 * Validate Cedula
 * @param cedula
 * @returns {boolean}
 */
export const validateCedula = (cedula) => {
    let suma = 0;
    let division = 0;
    let mult = 0;
    let verificador = "";
    let peso = "1212121212";

    cedula = cedula.replace("-", "").replace("/", "");
    cedula = cedula.replace("-", "").replace(";0", "");

    if (cedula.length !== 11) {
        return false;
    } else {
        for (let i = 0; i <= 9; i++) {

            let a = parseInt(cedula[i]);
            let b = parseInt(peso[i]);
            mult = a * b;

            if (mult > 9) {
                suma = suma + (mult % 10) + 1;
            } else {
                suma = suma + mult;
            }
        }
        division = parseInt(((Math.trunc(parseFloat(suma / 10)) * 10) + 10) - suma);

        if (division === 10) {
            division = 0;
        }

        verificador = division.toString();

        if (verificador === cedula[cedula.length - 1]) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * Convert null to blank value
 * @param value
 * @returns {*}
 */
export const returnBlankValue = (value) => {
    if (value == null) {
        return "";
    } else {
        return value;
    }
};

export const DecryptQrCode = (encrypted) => {
    let data;
    const decrypted = CryptoJS.AES
        .decrypt(encrypted, constants.AES_PASSWORD);

    if (decrypted) {
        data = decrypted.toString(CryptoJS.enc.Utf8);
    }
    return data;
};

/**
 * Format Number String with Commas
 * @param {*} x
 */
export const FormatNumberWithCommas = (number) => {
    if (number) {
        const new_number = (Math.round(number * 100) / 100).toFixed(2);;
        let parts = new_number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    } else {
        return 0;
    }
};

/**
 * Throttle function to prevent severals taps
 * @param func
 * @param wait
 * @param ctx
 * @param immediate
 * @returns {function()}
 */

/*
export function throttle(func, wait, ctx, immediate = true) {
    let timeoutRefId;
    let args;
    let context;
    let timestamp;
    let result;

    const later = () => {
        const last = timestampNow() - timestamp;

        if (last < wait && last >= 0) {
            timeoutRefId = setTimeout(later, wait - last);
        } else {
            timeoutRefId = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeoutRefId) context = args = null;
            }
        }
    };

    return () => {
        context = ctx || this;
        args = arguments;
        timestamp = timestampNow();
        const callNow = immediate && !timeoutRefId;
        if (!timeoutRefId) timeoutRefId = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}*/

/**
 * Extract number from text
 * @param str
 * @returns {*|void|string}
 */
export const extractNumberFromText = (str) => {
    return str.replace(/\D/g, '');
}