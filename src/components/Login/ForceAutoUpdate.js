import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableNativeFeedback
} from 'react-native';

const ForceAutoUpdate = (props) => {
    const { actualVersion, newVersion, onPressDownload, isLoadingDownloadingFile } = props;
    return (
        <View style={{ flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, padding: 20 }}>
                <Image style={{ width: 160, height: 160 }} source={require('../../images/little_logo.png')} />
            </View>
            <View style={{ flex: 1, padding: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>
                    Lo sentimos, esta versión ({actualVersion}) de la aplicación ha caducado.
                    Por favor, descargue la última actualización para acceder al App.
                </Text>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TouchableNativeFeedback onPress={onPressDownload}
                            disabled={isLoadingDownloadingFile}>
                            <View style={{
                                padding: 13,
                                backgroundColor: '#16a085',
                                elevation: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14 }}>
                                    DESCARGAR {newVersion}
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ForceAutoUpdate;