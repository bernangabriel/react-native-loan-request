import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableNativeFeedback,
    Dimensions
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import Pdf from 'react-native-pdf';

import * as constants from '../../constants';
import CoreService from '../../services/CoreService';
import * as util from "../../util";
import * as globalStyle from "../../styles";

class ViewPdf extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            base64: 'N/A'
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

    /**
     * Fetch Attachment
     * @param idSolicitud
     * @param idAdjunto
     * @returns {Promise<void>}
     */
    fetchAttachment = async (idSolicitud, idAdjunto) => {
        try {
            this.setLoadingState(true);
            const result = await CoreService
                .get(`${constants.FETCH_BASE_SOLICITUD_METHOD}/${idSolicitud}/attachments/${idAdjunto}`);

            if (result) {
                if (result.data) {
                    const file = result.data.ArchivoBase64;
                    if (file) {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                base64: file
                            }
                        });
                    }
                }
            }

        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }

        this.setLoadingState(false);
    };

    async componentDidMount() {
        const {params} = this.props.navigation.state;
        if (params) {
            if (params.idSolicitud && params.idAdjunto) {
                await this.fetchAttachment(params.idSolicitud, params.idAdjunto);
            }
        }
    }

    /**
     * Render Loading
     * @private
     */
    _renderLoading = () => (
        <View style={{flex: 1}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <MaterialIndicator size={40} color={'#3f5364'}/>
            </View>
        </View>
    );

    /**
     * Render File
     * @returns {*}
     * @private
     */
    _renderFile = (base64) => {
        return (
            <View style={{flex: 1}}>
                <View style={styles.fileContainer}>
                    <Pdf
                        style={styles.file}
                        source={{uri: base64}}/>
                </View>
            </View>
        );
    };

    render() {
        const {isLoading, base64} = this.state;
        return (
            <View style={styles.container}>
                {isLoading
                    ? this._renderLoading()
                    : this._renderFile(base64)}

                <View style={{justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback onPress={this.saveSolicitud}>
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
        flex: 1,
        padding: 5
    },
    file: {
        flex: 1,
        width: Dimensions.get('window').width
    },
    loading: {
        flex: 1
    }
});

export {ViewPdf};