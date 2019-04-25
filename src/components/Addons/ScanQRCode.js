import React, {Component} from 'react';
import Camera from 'react-native-camera';
import {
    StyleSheet,
    View,
    Text,
    Button,
    TouchableNativeFeedback, Alert
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import * as util from '../../util';
import * as constants from '../../constants';
import * as globalStyles from '../../styles';


class ScanQRCode extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    };

    openSolicitud = (solicitud) => {
        Alert.alert("Abrir Solicitud", `¿Está seguro de abrir la solicitud (${solicitud.IdSolicitud}) ${solicitud.Nombre}?`, [
            {
                text: "ABRIR", onPress: () => {
                    let requestSolicitud = {
                        Cedula: solicitud.Cedula,
                        TipoPresamoId: solicitud.TipoPrestamoId,
                        TipoPrestamoCategoriaId: solicitud.TipoPrestamoCategoriaId,
                        SolicitudId: solicitud.IdSolicitud,
                        IsNewSolicitud: false
                    };
                    this.props.navigation.navigate('SolicitudDetails', requestSolicitud);
                }
            },
            {
                text: "CANCELAR", onPress: () => {
                }
            }
        ])
    };

    onBarCodeRead = (e) => {
        if (e.data) {
            if (e.data.toString().indexOf(constants.UNIQUE_KEY_CODE) > -1) {
                const tokenValue = e.data.toString();
                if (tokenValue) {
                    const token = tokenValue.substring(0, tokenValue.lastIndexOf('.'));
                    if (token) {
                        const tokenValue = util.DecryptQrCode(token);
                        if (tokenValue) {
                            const tokenObj = JSON.parse(tokenValue);
                            if (tokenObj) {
                                this.onGoBackHandler();
                                if (tokenObj.TipoPrestamoCategoriaId) {
                                    this.openSolicitud(tokenObj);
                                } else {
                                    Alert.alert("Categoria No Encontrada", "Esta solicitud no contiene ninguna categoría");
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    onGoBackHandler() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        Escanear el código “QR” que se muestra en la solicitud
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Camera
                        style={styles.preview}
                        barCodeTypes={['qr']}
                        aspect={Camera.constants.Aspect.fill}
                        ref={cam => this.camera = cam}
                        onBarCodeRead={this.onBarCodeRead.bind(this)}>
                    </Camera>
                </View>
                <View style={styles.footer}>
                    <Button
                        title={'CERRAR'}
                        onPress={() => this.onGoBackHandler()}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        padding: 20,
        backgroundColor: '#535c68',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        color: globalStyles.WhiteColor,
        fontSize: 15
    },
    footer: {
        padding: 20
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {}
});

export default ScanQRCode;