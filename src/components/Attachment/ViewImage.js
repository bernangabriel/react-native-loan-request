import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableNativeFeedback
} from 'react-native';
import {BarIndicator} from 'react-native-indicators';

import * as constants from '../../constants';
import CoreService from '../../services/CoreService';
import * as util from "../../util";
import * as globalStyle from "../../styles";

class ViewImage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            base64: 'N/A',
            uri: 'N/A'
        };
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


    downloadFile = () => {

    };

    /**
     * Fetch Attachment
     * @param idSolicitud
     * @param idAdjunto
     * @returns {Promise<void>}
     */
    fetchAttachment = async (hash) => {
        try {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    uri: `${constants.BASE_SERVICE_URL}/${constants.DOWNLOAD_FILE_METHOD}/${hash}`
                }
            });
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }

        this.setLoadingState(false);
    };

    async componentDidMount() {
        const {params} = this.props.navigation.state;
        if (params) {
            if (params.hash) {
                await this.fetchAttachment(params.hash);
            }
        }
    }

    /**
     * Render Loading
     * @private
     */
    _renderLoading = () => (
        <View style={styles.loading}>
            <BarIndicator size={12} color={'#3f5364'}/>
        </View>
    );

    /**
     * Render File
     * @returns {*}
     * @private
     */
    _renderFile = (uri) => {
        return (
            <View style={{flex: 1}}>
                <View style={styles.fileContainer}>
                    <Image
                        style={styles.file}
                        source={{uri: uri}}
                        resizeMode={'stretch'}/>
                </View>
            </View>
        );
    };

    render() {
        const {isLoading, uri} = this.state;
        return (
            <View style={styles.container}>
                {isLoading
                    ? this._renderLoading()
                    : this._renderFile(uri)}

                <View style={{justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback onPress={() => this.props.navigation.goBack(null)}>
                                <View style={{
                                    padding: 13,
                                    backgroundColor: '#999',
                                    elevation: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>CANCELAR</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback onPress={this.downloadFile}>
                                <View style={{
                                    padding: 13,
                                    backgroundColor: '#16a085',
                                    elevation: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>
                                        DESCARGAR
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    fileContainer: {
        flex: 1
    },
    file: {
        flex: 1,
        width: undefined,
        height: undefined,
        alignSelf: 'stretch'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalStyle.WhiteColor
    }
});

export {ViewImage};