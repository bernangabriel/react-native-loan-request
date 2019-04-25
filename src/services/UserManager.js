import * as util from '../util';

export default class UserManager {

    static myInstance = null;


    static getInstance() {
        if (this.myInstance == null)
            this.myInstance = new UserManager();
    }

    /**
     * Get tipo usuarioID
     * @returns {Promise<*>}
     */
    async getUser() {
        const result = await util.GetGeneralUserInfoInStorage();
        return result.user;
    }
}