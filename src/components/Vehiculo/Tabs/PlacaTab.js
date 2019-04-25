import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView
} from 'react-native';
import {FormLabel, FormInput} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LoadingIndicator} from '../../../common';

const PlacaTab = (props) => {
    const {
        documento,
        placa,
        onChangeTextDocumento,
        onChangeTextPlaca,
        onSearch,
        isLoading,
        placaResult,
        oposicionesResult = []
    } = props;

    return (
        <View style={styles.container}>
            {isLoading === true
                ? <LoadingIndicator/>
                : <View style={{flex: 1}}>
                    <View style={styles.searchPanel}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 3}}>
                                <FormInput
                                    placeholder={'RNC/Cédula'}
                                    value={documento}
                                    onChangeText={(text) => onChangeTextDocumento(text)}
                                    autoCorrect={false}
                                    keyboardType={'numeric'}/>
                            </View>
                            <View style={{flex: 3}}>
                                <FormInput
                                    placeholder={'Placa'}
                                    value={placa}
                                    autoCorrect={false}
                                    autoCapitalize={'characters'}
                                    onChangeText={(text) => onChangeTextPlaca(text)}/>
                            </View>
                            <View style={{flex: 1}}>
                                <View style={{marginTop: 11, marginRight: 7}}>
                                    <Icon.Button
                                        iconStyle={{marginLeft: 5}}
                                        name={'search'}
                                        backgroundColor={'#16a085'}
                                        size={14}
                                        onPress={onSearch}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <ScrollView keyboardShouldPersistTaps={'always'}>
                        <View style={{flex: 1, padding: 10}}>
                            <View style={{flex: 1}}>
                                {placaResult.PLACA
                                    ? <View style={{elevation: 2, borderRadius: 5}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>No. Placa</FormLabel>
                                                <FormInput
                                                    value={placaResult.PLACA}
                                                    editable={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>Estado</FormLabel>
                                                <FormInput
                                                    value={placaResult.ESTADO}
                                                    editable={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>Marca</FormLabel>
                                                <FormInput
                                                    value={placaResult.MARCA_VEHICULO}
                                                    editable={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>Modelo</FormLabel>
                                                <FormInput
                                                    value={placaResult.MODELO_VEHICULO}
                                                    editable={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>Año</FormLabel>
                                                <FormInput
                                                    value={placaResult.ANO_FABRICACION}
                                                    editable={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>Color</FormLabel>
                                                <FormInput
                                                    value={placaResult.COLOR}
                                                    editable={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>Cédula Propietario</FormLabel>
                                                <FormInput
                                                    value={placaResult.RNC_CEDULA_PROPIETARIO}
                                                    editable={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <FormLabel labelStyle={styles.labelStyle}>Oposiciones</FormLabel>
                                                <FormInput
                                                    value={oposicionesResult.length.toString()}
                                                    editable={false}/>
                                            </View>
                                        </View>
                                    </View>
                                    : <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
                                        <Text style={{fontSize: 20, color: "#bdc3c7", fontWeight: '400'}}>
                                            Resultados No Encontrados
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
            }

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchPanel: {
        backgroundColor: '#fff'
    },
    labelStyle: {
        color: '#5b6e7a'
    },
    inputStyle: {
        borderColor: '#eee',
        borderWidth: 1
    }
});

export {PlacaTab};