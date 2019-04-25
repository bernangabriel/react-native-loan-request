import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
    ScrollView,
    TouchableOpacity,
    TouchableNativeFeedback,
    Modal,
    FlatList,
    Image
} from 'react-native';
import {FormLabel, FormInput, Badge} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


//libs
import * as util from '../../../util';
import {LoadingIndicator} from '../../../common';
import {VehicleContext} from '../../../context/VehicleContext';
import SupercarrosListPanel from '../SupercarrosListPanel';
import _ from "underscore";

const TasacionTabExtended = (props) => {
    const {
        searchedTasacion,
        isLoadingTasacion,
        tasacionData,
        marca,
        modelo,
        ano,
        anos_vehiculo = [],
        modelos_vehiculo = [],
        marcas_vehiculo = [],
        onChangeMarca,
        onChangeModelo,
        onChangeAno,
        onSearch,
        onClear,

        //supercarros
        modalSupercarrosVisible,
        onOpenModalSupercarros,
        onCloseModalSupercarros,
        onSelectItemSupercarros,

        //asocivu
        modalAsocivuVisible,
        onOpenModalAsocivu,
        onCloseModalAsocivu,
        onSelectItemAsocivu
    } = props;

    onPresentVehicleValue = (data) => {
        if (data.vehiculos_analizados) {
            return {
                vehiculo: data.vehiculo,
                tasacion: {
                    valor_mercado: get_vehicle_valor_mercado(data.vehiculos_analizados),
                    valor_recepcion: 'N/A',
                    rango_recepcion_min: _.min(data.vehiculos_analizados.filter(item => !item.exclude), (i) => i.price).price,
                    rango_recepcion_max: _.max(data.vehiculos_analizados.filter(item => !item.exclude), (i) => i.price).price,
                    total_vehiculos: data.tasacion.total_vehiculos,
                    total_vehiculos_with_exclude: (data.tasacion.total_vehiculos - data.vehiculos_analizados.filter(item => item.exclude === true).length)
                }
            };
        } else {
            return {
                vehiculo: {},
                tasacion: {
                    valor_mercado: 0
                }
            };
        }
    };

    onGetAvg = () => {
        const percentage = tasacionData.info.percentage;
        const valorMercadoMyDealer = tasacionData.myDealerNetwork.tasacion ? tasacionData.myDealerNetwork.tasacion.valor_mercado : 0;
        const valorMercadoSupercarros = onPresentVehicleValue(tasacionData.supercarros).tasacion.valor_mercado;
        const valorMercadoAsocivu = onPresentVehicleValue(tasacionData.asocivu).tasacion.valor_mercado;

        let divider = 0;
        if (valorMercadoMyDealer > 0) divider++;
        if (valorMercadoSupercarros > 0) divider++;
        if (valorMercadoAsocivu > 0) divider++;

        const avg = (valorMercadoMyDealer + valorMercadoSupercarros + valorMercadoAsocivu) / divider;

        return {
            value: avg === 0 ? 0 : (avg * percentage / 100)
        };
    };


    get_vehicle_valor_mercado = (vehicles) => {
        let _result = 0;
        if (vehicles) {
            _result = this.get_total_price(vehicles) / (vehicles.length - vehicles.filter(item => item.exclude === true).length);

            if (isNaN(_result)) {
                _result = 0;
            }
        }
        return _result;
    };

    get_total_price = (vehicles) => {
        let total = 0;
        for (i in vehicles) {
            if (!vehicles[i].exclude) {
                total += vehicles[i].price;
            }
        }
        return total;
    };

    return (
        <View style={styles.container}>
            {isLoadingTasacion
                ? <View style={{flex: 1}}>
                    <LoadingIndicator/>
                </View>
                : <View style={styles.container}>
                    <View style={{flex: 1}}>
                        {isLoadingTasacion
                            ? <LoadingIndicator/>
                            : <ScrollView keyboardShouldPersistTaps={'always'}>
                                {searchedTasacion &&
                                <View style={{flex: 1, padding: 10}}>
                                    <View style={{flex: 1}}>

                                        {/*MY DEALER NETWORK INFO*/}
                                        <View style={{elevation: 2, borderRadius: 5, marginBottom: 10}}>
                                            <View style={{backgroundColor: '#40739e', padding: 5, borderRadius: 2}}>
                                                <Text style={{color: '#fff', fontWeight: '500'}}>My Dealer Network
                                                    Info</Text>
                                            </View>
                                            {tasacionData.myDealerNetwork.tasacion
                                                ? <View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>Valor de
                                                                Mercado</FormLabel>
                                                            <FormInput
                                                                value={`RD$ ${util.FormatNumberWithCommas(tasacionData.myDealerNetwork.tasacion.valor_mercado)}`}
                                                                editable={false}/>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>Valor de
                                                                Recepción</FormLabel>
                                                            <FormInput
                                                                value={`RD$ ${util.FormatNumberWithCommas(tasacionData.myDealerNetwork.tasacion.valor_recepcion)}`}
                                                                editable={false}/>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>Valor
                                                                Recepción
                                                                Min</FormLabel>
                                                            <FormInput
                                                                value={`RD$ ${util.FormatNumberWithCommas(tasacionData.myDealerNetwork.tasacion.rango_recepcion_min)}`}
                                                                editable={false}/>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>Valor
                                                                Recepción
                                                                Max</FormLabel>
                                                            <FormInput
                                                                value={`RD$ ${util.FormatNumberWithCommas(tasacionData.myDealerNetwork.tasacion.rango_recepcion_max)}`}
                                                                editable={false}/>
                                                        </View>
                                                    </View>
                                                </View>
                                                : <View style={{
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 10
                                                }}>
                                                    <Text>Resultados No Encontrados</Text>
                                                </View>
                                            }
                                        </View>

                                        {/*SUPERCARROS INFO*/}
                                        <View style={{elevation: 2, borderRadius: 5, marginBottom: 5}}>
                                            <View style={{
                                                backgroundColor: '#40739e',
                                                padding: 5,
                                                borderRadius: 2,
                                                flexDirection: 'row'
                                            }}>
                                                <View style={{flex: 1}}>
                                                    <Text style={{color: '#fff', fontWeight: '500'}}>
                                                        Supercarros Info
                                                    </Text>
                                                </View>
                                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                    {tasacionData.supercarros.tasacion &&
                                                    <TouchableOpacity
                                                        onPress={onOpenModalSupercarros}>
                                                        <Badge
                                                            value={onPresentVehicleValue(tasacionData.supercarros).tasacion.total_vehiculos_with_exclude}
                                                            containerStyle={{backgroundColor: '#c0392b'}}/>
                                                    </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                            {
                                                tasacionData.supercarros.tasacion
                                                    ? <View>
                                                        <View style={{flexDirection: 'row'}}>
                                                            <View style={{flex: 1}}>
                                                                <FormLabel labelStyle={styles.labelStyle}>
                                                                    Valor de Mercado
                                                                </FormLabel>
                                                                <FormInput
                                                                    value={`RD$ ${util.FormatNumberWithCommas(onPresentVehicleValue(tasacionData.supercarros).tasacion.valor_mercado)}`}
                                                                    editable={false}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <FormLabel
                                                                    labelStyle={styles.labelStyle}>
                                                                    Valor de Recepción
                                                                </FormLabel>
                                                                <FormInput
                                                                    value={`RD$ N.A`}
                                                                    editable={false}/>
                                                            </View>
                                                        </View>
                                                        <View style={{flexDirection: 'row'}}>
                                                            <View style={{flex: 1}}>
                                                                <FormLabel labelStyle={styles.labelStyle}>Valor
                                                                    Recepción
                                                                    Min</FormLabel>
                                                                <FormInput
                                                                    value={`RD$ ${util.FormatNumberWithCommas(onPresentVehicleValue(tasacionData.supercarros).tasacion.rango_recepcion_min)}`}
                                                                    editable={false}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <FormLabel labelStyle={styles.labelStyle}>Valor
                                                                    Recepción
                                                                    Max</FormLabel>
                                                                <FormInput
                                                                    value={`RD$ ${util.FormatNumberWithCommas(onPresentVehicleValue(tasacionData.supercarros).tasacion.rango_recepcion_max)}`}
                                                                    editable={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    : <View style={{
                                                        flex: 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 10
                                                    }}>
                                                        <Text>Resultados No Encontrados</Text>
                                                    </View>
                                            }
                                        </View>

                                        {/*ASOCIVU INFO*/}
                                        <View style={{elevation: 2, borderRadius: 5, marginBottom: 5}}>
                                            <View style={{
                                                backgroundColor: '#40739e',
                                                padding: 5,
                                                borderRadius: 2,
                                                flexDirection: 'row'
                                            }}>
                                                <View style={{flex: 1}}>
                                                    <Text style={{color: '#fff', fontWeight: '500'}}>
                                                        Asocivu Info
                                                    </Text>
                                                </View>
                                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                    {tasacionData.asocivu.tasacion &&
                                                    <TouchableOpacity
                                                        onPress={onOpenModalAsocivu}>
                                                        <Badge
                                                            value={onPresentVehicleValue(tasacionData.asocivu).tasacion.total_vehiculos_with_exclude}
                                                            containerStyle={{backgroundColor: '#c0392b'}}/>
                                                    </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                            {tasacionData.asocivu.tasacion
                                                ? <View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>
                                                                Valor de Mercado
                                                            </FormLabel>
                                                            <FormInput
                                                                value={`RD$ ${util.FormatNumberWithCommas(onPresentVehicleValue(tasacionData.asocivu).tasacion.valor_mercado)}`}
                                                                editable={false}/>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>
                                                                Valor de Recepción
                                                            </FormLabel>
                                                            <FormInput
                                                                value={`RD$ N.A`}
                                                                editable={false}/>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>
                                                                Valor Recepción Min
                                                            </FormLabel>
                                                            <FormInput
                                                                value={`RD$ ${util.FormatNumberWithCommas(onPresentVehicleValue(tasacionData.asocivu).tasacion.rango_recepcion_min)}`}
                                                                editable={false}/>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <FormLabel labelStyle={styles.labelStyle}>
                                                                Valor Recepción Max
                                                            </FormLabel>
                                                            <FormInput
                                                                value={`RD$ ${util.FormatNumberWithCommas(onPresentVehicleValue(tasacionData.asocivu).tasacion.rango_recepcion_max)}`}
                                                                editable={false}/>
                                                        </View>
                                                    </View>
                                                </View>
                                                : <View style={{
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 10
                                                }}>
                                                    <Text>Resultados No Encontrados</Text>
                                                </View>
                                            }
                                        </View>

                                        {/*AVG INFO*/}
                                        <View style={{elevation: 2, borderRadius: 5}}>
                                            <View style={{
                                                backgroundColor: '#16a085',
                                                padding: 5,
                                                borderRadius: 2,
                                                flexDirection: 'row'
                                            }}>
                                                <View style={{flex: 1}}>
                                                    <Text style={{color: '#fff', fontWeight: '500'}}>Avg Info</Text>
                                                </View>
                                            </View>
                                            {tasacionData.avg.value
                                                ? <View style={{flexDirection: 'row'}}>
                                                    <View style={{flex: 1}}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Valor</FormLabel>
                                                        <FormInput
                                                            value={`RD$ ${util.FormatNumberWithCommas(onGetAvg().value)}`}
                                                            editable={false}/>
                                                    </View>
                                                </View>
                                                : <View style={{
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 10
                                                }}>
                                                    <Text>Resultados No Encontrados</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>
                                }
                            </ScrollView>}
                    </View>
                </View>
            }

            {/*MODAL SUPERCARROS*/}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalSupercarrosVisible}
                onRequestClose={onCloseModalSupercarros}>
                <View style={{flex: 1}}>
                    <View style={styles.modalHeader}>
                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback
                                onPress={onCloseModalSupercarros}>
                                <View style={{
                                    justifyContent: 'center',
                                    width: 50,
                                    height: 50,
                                    paddingLeft: 15
                                }}>
                                    <Icon name={'arrow-left'} size={15} color={'#fff'}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 20, fontWeight: '600', color: '#fff'}}>Supercarros</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Text style={{fontSize: 15, fontWeight: '600', color: '#fff'}}>
                                {tasacionData.supercarros.vehiculos_analizados &&
                                tasacionData.supercarros.vehiculos_analizados.filter(item => item.exclude === true).length}/
                                {tasacionData.supercarros.vehiculos_analizados && tasacionData.supercarros.vehiculos_analizados.length}
                            </Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <FlatList
                                data={tasacionData.supercarros.vehiculos_analizados}
                                extraData={tasacionData.supercarros}
                                keyExtractor={item => item.url}
                                numColumns={2}
                                renderItem={({item}) => {
                                    return (<TouchableOpacity
                                        style={{flex: 1}}
                                        onPress={onSelectItemSupercarros.bind(this, item)}>
                                        <View style={{flex: 1, margin: 5}}>
                                            <View style={item.exclude ? styles.excludeItem : styles.includeItem}>
                                                <View>
                                                    <Image style={{height: 100, width: '100%'}}
                                                           resizeMode={'stretch'}
                                                           source={{uri: item.image}}/>
                                                </View>
                                                <View style={{padding: 10}}>
                                                    <Text style={{
                                                        fontSize: 12,
                                                    }}>{item.info}</Text>
                                                    <Text style={{
                                                        fontSize: 11,
                                                        fontWeight: '600'
                                                    }}>RD$ {util.FormatNumberWithCommas(item.price)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>)
                                }}/>
                        </View>
                    </View>
                </View>
            </Modal>

            {/*MODAL ASOCIVU*/}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalAsocivuVisible}
                onRequestClose={onCloseModalAsocivu}>
                <View style={{flex: 1}}>
                    <View style={styles.modalHeader}>
                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback
                                onPress={onCloseModalAsocivu}>
                                <View style={{
                                    justifyContent: 'center',
                                    width: 50,
                                    height: 50,
                                    paddingLeft: 15
                                }}>
                                    <Icon name={'arrow-left'} size={15} color={'#fff'}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 20, fontWeight: '600', color: '#fff'}}>Asocivu</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Text style={{fontSize: 15, fontWeight: '600', color: '#fff'}}>
                                {tasacionData.asocivu.vehiculos_analizados &&
                                tasacionData.asocivu.vehiculos_analizados.filter(item => item.exclude === true).length}/
                                {tasacionData.asocivu.vehiculos_analizados && tasacionData.asocivu.vehiculos_analizados.length}
                            </Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <FlatList
                                data={tasacionData.asocivu.vehiculos_analizados}
                                extraData={tasacionData.asocivu}
                                keyExtractor={item => item.url}
                                numColumns={2}
                                renderItem={({item}) => {
                                    return (<TouchableOpacity
                                        style={{flex: 1}}
                                        onPress={onSelectItemAsocivu.bind(this, item)}>
                                        <View style={{flex: 1, margin: 5}}>
                                            <View style={item.exclude ? styles.excludeItem : styles.includeItem}>
                                                <View>
                                                    <Image style={{height: 100, width: '100%'}}
                                                           resizeMode={'stretch'}
                                                           source={{uri: item.image}}/>
                                                </View>
                                                <View style={{padding: 10}}>
                                                    <Text style={{
                                                        fontSize: 12,
                                                    }}>{item.info}</Text>
                                                    <Text style={{
                                                        fontSize: 11,
                                                        fontWeight: '600'
                                                    }}>RD$ {util.FormatNumberWithCommas(item.price)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>)
                                }}/>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    includeItem: {
        elevation: 3,
        borderRadius: 3,
        backgroundColor: '#fff'
    },
    excludeItem: {
        elevation: 3,
        borderRadius: 3,
        backgroundColor: '#838383'
    },
    modalHeader: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#415262',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchPanel: {
        backgroundColor: '#fff'
    }
});

export {TasacionTabExtended};