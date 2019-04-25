import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    ToastAndroid,
    Linking
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';

//Libs
import * as globalStyles from '../../styles/index';
import * as constants from "../../constants";
import CoreService from "../../services/CoreService";
import * as util from "../../util";
import { SessionContext } from "../../context/SessionContext";

//Components
import Dashboard from '../../components/Dashboard/Dashboard';
import Signin from './Signin';
import ForceAutoUpdate from './ForceAutoUpdate';
import AutoSignin from './AutoSignin';
import LoadingOverlay from './LoadingOverlay';

//HardCore Constants
const user_doesnt_exists = 'user_doesnt_exists';


/**
 * Login Class Container
 */
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: true,
            isLogged: false,
            isLoadingDownloadingFile: false,
            user: {},
            autoSignin: false,
            onSignOut: this.onSignOutHandler,
            FORCE_APP_UPDATED: false,
            DOWNLOAD_APP_URL: '',
            actualVersion: constants.APP_VERSION,
            newVersion: ''
        };

        this.authenticateUser = this.authenticateUser.bind(this);
        this.onPressDownloadHandler = this.onPressDownloadHandler.bind(this);
        this.continueAutoSignin = this.continueAutoSignin.bind(this);
        this.accessWithAnotherAccount = this.accessWithAnotherAccount.bind(this);
    }


    /**
     * Set Loading State
     * @param isLoading
     */
    setLoadingState(isLoading) {
        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: isLoading
            };
        });
    }

    /**
     * Show Toast Error
     * @param message
     */
    showToastError = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            10,
            250
        );
    };

    /**
     * Fetch General User Info
     */
    fetchGeneralUserInfo = async () => {
        try {
            const infoResult = await CoreService
                .get(constants.FETCH_GENERAL_USER_DETAILS);

            if (infoResult) {
                if (infoResult.data) {
                    await util.SaveGeneralUserInfoInStorage(JSON.stringify(infoResult.data));
                }
            }
        } catch (ex) {

        }
    };

    /**
     * Verify Access Token
     * @returns {Promise<void>}
     */
    verifyAccessToken = async () => {
        let accessResult;
        try {
            const result = await CoreService
                .get(constants.VERIFY_ACCESS_TOKEN);

            if (result.data === "success") {
                accessResult = true;
            }
        } catch (ex) {
            accessResult = false;
        }

        return accessResult;
    };

    /**
     * OnChange Username
     * @param text
     */
    onChangeUsername = (text) => {
        this.setState(prevState => ({
            ...prevState,
            username: text
        }));
    };

    /**
     * OnChange Password
     * @param text
     */
    onChangePassword = (text) => {
        this.setState(prevState => ({
            ...prevState,
            password: text
        }));
    };


    /**
     * Authenticate User
     * @param username
     * @param password
     * @returns {Promise<void>}
     */
    authenticateUser = async () => {

        const { username, password } = this.state;
        if (username && password) {

            try {
                this.setLoadingState(true);

                await CoreService.authenticate(username, password, async (result) => {
                    if (result.error) {
                        switch (result.error) {
                            case user_doesnt_exists:
                                alert('Usuario y/o Contraseña Incorrectos');
                                this.setLoadingState(false);
                                break;
                        }
                    } else if (result.exception) {
                        this.showToastError(`Error al conectar con el servicio de la aplicación: ${result.message}`);
                        this.setLoadingState(false);
                    }
                    else {
                        if (result.access_token) {
                            await this.fetchGeneralUserInfo();
                            this.setState((prevState) => {
                                return {
                                    ...prevState,
                                    isLogged: true,
                                    isLoading: false
                                }
                            });
                        }
                    }
                });
            } catch (ex) {
                util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                this.setLoadingState(false);
            }
        } else {
            util.ShowAlert("Datos Requeridos", "Debe introducir su usuario y contraseña");
        }
    };

    /**
     * OnSign Out Handler
     * @returns {Promise<void>}
     */
    onSignOutHandler = async () => {
        await AsyncStorage.clear();
        this.setState({
            isLoading: false,
            isLogged: false,
            user: {},
            autoSignin: false
        });
    };

    /**
     * Continue Auto Signin
     */
    continueAutoSignin = () => {
        this.setState({
            isLogged: true,
            autoSignin: false
        });
    };

    /**
     * Access With Another Account
     * @returns {Promise<void>}
     */
    accessWithAnotherAccount = async () => {
        await AsyncStorage.clear();
        this.setState({
            isLoading: false,
            isLogged: false,
            user: {},
            autoSignin: false
        });
    };

    /**
     * Get App Version
     * @returns {Promise<Response>}
     */
    getAppVersion = async () => {
        let result = {};
        try {
            result = await fetch(constants.BASE_SERVICE_URL + constants.APP_VERSION_METHOD)
                .then(res => res.json());
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
        return result;
    };

    /**
     * Validate AutoSignin
     * @returns {Promise<void>}
     */
    validateAutoSignin = async () => {
        try {
            const resultVersion = await this.getAppVersion();
            if (resultVersion) {

                const actualVersion = util.extractNumberFromText(constants.APP_VERSION);
                const newVersion = util.extractNumberFromText(resultVersion.Version);

                if (newVersion > actualVersion) {
                    this.setState(prevState => ({
                        ...prevState,
                        isLoading: false,
                        newVersion: resultVersion.Version.toUpperCase(),
                        FORCE_APP_UPDATED: true,
                        DOWNLOAD_APP_URL: resultVersion.Url
                    }));
                } else {
                    const result = await util.GetGeneralUserInfoInStorage();
                    if (result) {
                        const user = JSON.parse(result).user;
                        if (user) {
                            const verifyResult = await this.verifyAccessToken();
                            if (verifyResult) {
                                this.setState({
                                    autoSignin: true,
                                    user: user,
                                    isLoading: false
                                });
                            } else {
                                await this.accessWithAnotherAccount();
                            }
                        }
                    } else {
                        this.setState({
                            isLoading: false,
                            isLogged: false,
                            user: {},
                            autoSignin: false
                        });
                    }
                }
            }

        } catch (ex) {
            this.setState({
                isLoading: false,
                isLogged: false,
                user: {},
                autoSignin: false
            });
        }
    };


    /**
     * OnPresHandler
     */
    onPressDownloadHandler() {
        try {

            Linking.openURL(this.state.DOWNLOAD_APP_URL, () => {
                alert('finish');
            }).catch(ex => alert(ex));

        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, "Ha ocurrido un error al descargar la nueva version");
            this.setState({ isLoadingDownloadingFile: false });
        }
    };


    /**
     * Component Did Mount
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        await this.validateAutoSignin();
    }


    /**
     * Render Component
     * @returns {*}
     */
    render() {
        let {
            isLogged, isLoading, username, password, autoSignin, user,
            actualVersion, newVersion, FORCE_APP_UPDATED, isLoadingDownloadingFile
        } = this.state;

        return (

            <SessionContext.Provider value={this.state}>
                <View style={styles.container}>
                    <LoadingOverlay isLoading={isLoading}>
                        {FORCE_APP_UPDATED
                            ? <View style={{ flex: 1 }}>
                                <ForceAutoUpdate
                                    isLoadingDownloadingFile={isLoadingDownloadingFile}
                                    actualVersion={actualVersion}
                                    newVersion={newVersion}
                                    onPressDownload={this.onPressDownloadHandler} />
                            </View>
                            : <View style={{ flex: 1 }}>
                                {autoSignin
                                    ? <AutoSignin
                                        user={user}
                                        continueAutoSignin={this.continueAutoSignin}
                                        accessWithAnotherAccount={this.accessWithAnotherAccount} />
                                    : <View style={{ flex: 1 }}>
                                        {isLogged
                                            ? <Dashboard />
                                            : <Signin
                                                username={username}
                                                password={password}
                                                onChangeUsername={this.onChangeUsername}
                                                onChangePassword={this.onChangePassword}
                                                authenticateUser={this.authenticateUser} />
                                        }
                                    </View>
                                }
                            </View>
                        }
                    </LoadingOverlay>
                </View>
            </SessionContext.Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.WhiteColor
    }
});

export default Login;