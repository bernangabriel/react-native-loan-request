import React, { Component } from 'react';
import { StyleSheet, View, Text, Picker, FlatList, TouchableNativeFeedback, Alert } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import { Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

//Libs
import * as util from '../../util';
import * as constants from '../../constants';
import CoreService from '../../services/CoreService';

class Relations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefresing:true,
            tipoRelacion: '',
            cedula: '',
            relacionados: [],
            solicitud: {},
            relations: [
                { id: '', description: '[Seleccione]' },
                { id: 'GARANTE', description: 'Garante' },
                { id: 'CO-DEUDOR', description: 'Co-Deudor' },
                { id: 'FIADOR', description: 'Fiador' }
            ]
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {
            title: 'Relacionados',
            headerTitleStyle: {
                alignSelf: 'center'
            }
        }
    };

    /**
    * Fetch all relations
    * @returns {Promise<void>}
    */
    async fetchSolicitud(id) {
        try {
            const result = await CoreService
                .get(`${constants.FETCH_RELATIONS}/${id}`);

            if (result) {
                const data = result.data;
                if (data) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            isRefresing: false,
                            relacionados: data
                        };
                    }, async () => {
                        await this.fetchSolicitudById(id);
                    });
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
    }

    fetchSolicitudById = async (id) => {
        const result = await CoreService
            .get(`${constants.FETCH_SOLICITUD_BY_SOLICITUD_ID}/${id}`);

        if (result.data) {
            const data = result.data[0];
            if (data) {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        solicitud: data
                    }
                });
            }
        }
    };

    onGoToDetails = (item) => {
        if (item) {
            let requestSolicitud = {
                Cedula: item.IdNumero,
                TipoPresamoId: item.TipoPrestamoId,
                TipoPresamo: item.TipoPrestamo,
                TipoPrestamoCategoriaId: item.TipoPrestamoCategoriaId,
                SolicitudId: item.IdSolicitud,
                IsNewSolicitud: false,
                IsEnabledPriority: false,
                IsNewRelacionado: false,
                IsSolicitudRelacionado: true,
                Relacion: item.TipoSolicitud.toLowerCase(),
                IsSolicitudGarante: item.TipoSolicitud.toLowerCase() == "garante",
                IsSolicitudCoDeudor: item.TipoSolicitud.toLowerCase() == "co-deudor",
                IsSolicitudFiador: item.TipoSolicitud.toLowerCase() == "fiador",
                IdSolicitudDeudor: ''
            };
            this.props.navigation.navigate('SolicitudDetailsRelation', requestSolicitud);
        }
    };

    onGoToCreateRelation = () => {
        const { solicitud } = this.state;
        if (solicitud) {

            if (this.state.tipoRelacion.trim() == '' || !util.validateCedula(this.state.cedula)) {
                Alert.alert("Información Requerida", "Por favor seleccione un tipo de relacionado e introduzca un numero de cédula valido");
            } else {
                if (solicitud.TipoPrestamoCategoriaID) {
                    let requestSolicitud = {
                        Cedula: this.state.cedula,
                        TipoPresamoId: solicitud.TipoPrestamoId,
                        TipoPresamo: solicitud.TipoPrestamo,
                        TipoPrestamoCategoriaId: solicitud.TipoPrestamoCategoriaID,
                        SolicitudId: solicitud.SolicitudId,
                        IsNewSolicitud: true,
                        IsEnabledPriority: false,
                        IsSolicitudRelacionado: true,
                        IsNewRelacionado: true,
                        Relacion: this.state.tipoRelacion.toLowerCase(),
                        IsSolicitudGarante: this.state.tipoRelacion.toLowerCase() == "garante",
                        IsSolicitudCoDeudor: this.state.tipoRelacion.toLowerCase() == "co-deudor",
                        IsSolicitudFiador: this.state.tipoRelacion.toLowerCase() == "fiador",
                        IdSolicitudDeudor: solicitud.SolicitudId
                    };
                    this.props.navigation.navigate('SolicitudDetailsRelation', requestSolicitud);
                } else {
                    Alert.alert('Sin Categoría', 'El tipo de préstamo de esta solicitud no tiene asignada ninguna categoría, favor contacte con el administrador.');
                }
            }
        }
    };

    _view_puntaje = (item) => {
        let color = '#000';
        switch (item.INDICADOR) {
            case "black":
                color = "#000";
                break;
            case "red":
                color = "#ff0000";
                break;
            case "yellow":
                color = "#ffff33";
                break;
            case "green":
                color = "#27ae60";
                break;
        }

        return (
            <View style={{ flexDirection: 'row' }}>
                <Icon style={{ marginRight: 3 }} name={'circle'} color={color} size={18} />
                <Text style={{ fontSize: 13.4, fontWeight: '500' }}>{item.PuntajePreliminar}</Text>
            </View>
        );
    };

    _renderListItem = (item) => {
        return (
            <TouchableNativeFeedback
                ref={button => this.button = button}
                onPress={() => this.onGoToDetails(item)}>
                <Card style={{ padding: 0, margin: 0 }}>
                    <CardItem style={{ padding: 0, margin: 0 }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '500',
                                        marginRight: 2
                                    }}>({item.IdSolicitud})</Text>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '400'
                                    }}>{util.TrimFullname(item.Nombre1)} {util.TrimFullname(item.Apellido1)}</Text>
                                </View>
                                <View>
                                    {this._view_puntaje(item)}
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 11 }}>{item.IdNumero}</Text>
                                <Text style={{ fontSize: 11, marginLeft: 2, marginRight: 2 }}>/</Text>
                                <Text style={{ fontSize: 10, color: '#d35400' }}>{item.TipoSolicitud}</Text>
                            </View>
                        </View>
                    </CardItem>
                </Card>
            </TouchableNativeFeedback>
        );
    };

    async componentDidMount() {
        const { params } = this.props.navigation.state;
        if (params) {
            await this.fetchSolicitud(params);
        }
    }

    onRefresh = async () => {
        const { params } = this.props.navigation.state;
        await this.fetchSolicitud(params);
    };

    render() {
        const { relacionados } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={{ flex: 3 }}>
                        <Picker
                            style={{ marginLeft: 10 }}
                            selectedValue={this.state.tipoRelacion}
                            onValueChange={(itemValue) =>
                                this.setState(prevState => ({
                                    ...prevState,
                                    tipoRelacion: itemValue
                                }))
                            }>
                            {this.state.relations.map((item, index) => (
                                <Picker.Item label={item.description} value={item.id}
                                    key={index} />)
                            )}
                        </Picker>
                    </View>
                    <View style={{ flex: 3 }}>
                        <FormInput
                            keyboardType={'numeric'}
                            placeholder={'Número de Cedula'}
                            value={this.state.cedula}
                            onChangeText={(text) => {
                                this.setState(prevState => ({
                                    ...prevState,
                                    cedula: text
                                }))
                            }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 11, marginRight: 7 }}>
                            <Icon.Button
                                iconStyle={{ marginLeft: 5 }}
                                name={'search'}
                                backgroundColor={'#16a085'}
                                size={14}
                                onPress={this.onGoToCreateRelation} />
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        removeClippedSubviews
                        data={relacionados}
                        keyExtractor={(item) => item.IdSolicitud.toString()}
                        renderItem={({ item }) => this._renderListItem(item)} 
                        refreshing={this.state.isRefresing}
                        onRefresh={this.onRefresh} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    box: {
        flexDirection: 'row',
        padding: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#95a5a6'
    }
});

export { Relations };