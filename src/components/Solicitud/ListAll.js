import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableNativeFeedback,
    Alert,
    Modal,
    Picker
} from 'react-native';
import { Card, CardItem, Right, Fab } from 'native-base';
import { FormLabel, FormInput, SearchBar, colors } from 'react-native-elements'
import { DotIndicator, MaterialIndicator, BarIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/FontAwesome';

//Libs
import * as constants from '../../constants';
import * as util from '../../util';
import * as globalStyle from '../../styles';
import CoreService from '../../services/CoreService';
import { ToolbarActionButton, LoadingIndicator } from '../../common';

class ListAll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            isLoading: false,
            isLoadingMore: false,
            isActive: true,
            solicitudes: [],
            isRefresing: false,
            filteredText: '',

            //New Solicitud
            isModalNewSolicitud: false,
            isModalFilterSolicitud: false,
            isModalSearchSolicitud: false,
            isModalNewLoading: false,
            tipoPrestamoId: '',
            cedula: '',
            tipoPrestamos: [],
            user: {}
        };

        this.props.navigation.setParams({ openFilterSolicitud: this.openFilterSolicitud });
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {
            title: 'Solicitudes',
            headerTitleStyle: {
                alignSelf: 'center'
            },
            headerRight: (<ToolbarActionButton name={'search'}
                color={'white'}
                onPress={params.openFilterSolicitud}
                size={23} />)
        }
    };


    openFilterSolicitud = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isModalFilterSolicitud: true
            };
        });
    };

    onApplyFilterToSearch = async () => {
        const { filteredText } = this.state;
        if (filteredText) {
            const filteredTextExtended = `NombreCompleto=${filteredText.toLowerCase()}&`;
            this.setState((prevState) => {
                return {
                    ...prevState,
                    isModalFilterSolicitud: false
                };
            }, async () => {
                await this.fetchSolicitudByFilter(filteredTextExtended);
            });
        } else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    isModalFilterSolicitud: false
                };
            }, async () => {
                await this.fetchSolicitud();
            });
        }
    };

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
     * Fetch all solicitudes
     * @returns {Promise<void>}
     */
    async fetchSolicitud() {
        try {
            this.setLoadingState(true);
            const result = await CoreService
                .post_body(constants.FETCH_SOLICITUD_ALL_OFFSET_METHOD, {
                    PageNumber: 1,
                    PageSize: 100
                });

            if (result) {
                const data = result.data;
                if (data.solicitudes) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            isLoading: false,
                            isRefresing: false,
                            solicitudes: data.solicitudes
                        };
                    });
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
            this.setLoadingState(false);
        }
    }

    async fetchSolicitudByFilter(filteredText) {
        try {
            this.setLoadingState(true);
            const result = await CoreService
                .post_body(constants.FETCH_SOLICITUD_ALL_OFFSET_METHOD, {
                    PageNumber: 1,
                    PageSize: 100,
                    Filters: filteredText,
                    SortDirection: 'desc'
                });

            if (result) {
                const data = result.data;
                if (data.solicitudes) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            isLoading: false,
                            isRefresing: false,
                            solicitudes: data.solicitudes
                        };
                    });
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
            this.setLoadingState(false);
        }
    }

    /**
     * Fetch all solicitudes
     * @returns {Promise<void>}
     */
    async fetchSolicitudMore() {
        const { page } = this.state;
        try {
            const result = await CoreService
                .post_body(constants.FETCH_SOLICITUD_ALL_OFFSET_METHOD, {
                    PageNumber: page,
                    PageSize: 10
                });

            if (result) {
                const data = result.data;
                if (data.solicitudes) {
                    this.setState({
                        solicitudes: [...this.state.solicitudes, ...data.solicitudes],
                        isLoadingMore: false
                    });
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
    }

    onRefresh = async () => {
        await this.fetchSolicitud();
    };

    onGoToDetails = (solicitud) => {
        const tipoUsuario = this.state.user.TipoUsuario;

        if (solicitud.TipoPrestamoCategoriaID) {
            let requestSolicitud = {
                Cedula: solicitud.IdNumero,
                TipoPresamoId: solicitud.TipoPrestamoId,
                TipoPresamo: solicitud.TipoPrestamo,
                TipoPrestamoCategoriaId: solicitud.TipoPrestamoCategoriaID,
                SolicitudId: solicitud.IdSolicitud,
                IsNewSolicitud: false,
                IsEnabledPriority: (tipoUsuario === "Administrador" || tipoUsuario === "Analista")
            };

            this.props.navigation.navigate('SolicitudDetails', requestSolicitud);
        } else {
            Alert.alert('Sin Categoría', 'El tipo de préstamo de esta solicitud no tiene asignada ninguna categoría, favor contacte con el administrador.');
        }
    };

    addNewSolicitud = async () => {
        this.setState({
            isModalNewSolicitud: true,
            cedula: ''
        });

        await this.fetchTipoPrestamo();
    };

    /**
     * Go to New Solicitud
     */
    goToNewSolicitud = () => {
        let { tipoPrestamoId, cedula } = this.state;
        if (tipoPrestamoId && cedula) {
            const isCedulaValida = util.validateCedula(cedula)
            if (isCedulaValida) {
                if (tipoPrestamoId.ProcesoCategoriaID) {
                    let requestSolicitud = {
                        Cedula: cedula,
                        TipoPresamoId: tipoPrestamoId.CodigoProceso,
                        TipoPresamo: tipoPrestamoId.Descripcion,
                        TipoPrestamoCategoriaId: tipoPrestamoId.ProcesoCategoriaID,
                        SolicitudId: '',
                        IsNewSolicitud: true
                    };
                    this.setModalNewSolicitudVisible(!this.state.isModalNewSolicitud);
                    this.props.navigation.navigate('SolicitudDetails', requestSolicitud);
                } else {
                    Alert.alert("Categoria No Encontrada", "El tipo de préstamo seleccionado no contiene ninguna categoría")
                }
            } else {
                Alert.alert("Cédula Invalida", "La cédula introducida no es válida");
            }
        } else {
            Alert.alert("Completar Campos (*)", "Debe seleccionar el tipo de préstamo e introducir una cedula de identidad valida")
        }
    };

    _renderListItem = (item) => {
        return (
            <TouchableNativeFeedback
                ref={button => this.button = button}
                onPress={() => this.onGoToDetails(item)}>
                <Card style={{ padding: 0 }}>
                    <CardItem>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                        marginRight: 2
                                    }}>({item.IdSolicitud})</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '400'
                                    }}>{util.TrimFullname(item.NombreCompleto)}</Text>
                                </View>
                                <View>
                                    {this._view_puntaje(item)}
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 11 }}>{item.IdNumero}</Text>
                                <Text style={{ fontSize: 11, marginLeft: 2, marginRight: 2 }}>/</Text>
                                <Text style={{ fontSize: 11 }}>{item.TipoPrestamo}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>RD${item.MontoPrestamo}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection:'row'}}>
                                    <View>{this._view_estado(item)}</View> 
                                    <View>{this._view_assignUser(item)}</View>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 9 }}>{util.formatDateTime(item.Fecha)}</Text>
                                </View>
                            </View>
                        </View>
                    </CardItem>
                </Card>
            </TouchableNativeFeedback>
        );
    };

    _view_assignUser = (item) => {
        return (
            <Text style={{ fontSize: 12, color:'#718093'}}> / ({item.USUARIOASIGNADO.toUpperCase()})</Text>
        );
    };

    _view_estado = (item) => {
        let color = '#000';
        if (item.WORKFLOW_ESTADO) {
            switch (item.WORKFLOW_ESTADO.toLowerCase()) {
                case "recibido":
                    color = "#337ab7";
                    break;
                case "en tramite":
                    color = "#e67e22";
                    break;
                case "pre-aprobada":
                    color = "#00a65a";
                    break;
                case "detenida":
                    color = "#7f8c8d";
                    break;
                case "desembolsada":
                    color = "#0B7891";
                    break;
                case "aprobada":
                    color = "#00a65a";
                    break;
                case "rechazada":
                    color = "#d9534f";
                    break;
                case "en revision":
                    color = "#767624";
                    break;
                case "declinada":
                    color = "#e67e22";
                    break;
                default:
                    color = "#7f8c8d"
                    break;
            }
        }

        return (
            <Text style={{
                fontSize: 13,
                color: color
            }}>{item.WORKFLOW_ESTADO === null ? "N/A" : item.WORKFLOW_ESTADO}</Text>
        );
    }

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

    /**
     * Render FlatList Footer
     * @returns {*}
     * @private
     */
    _renderFooter = () => {
        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoadingMore &&
                    (<View style={{ flex: 1, padding: 10 }}>
                        <BarIndicator size={20} />
                    </View>)}
            </View>
        );
    };

    handleLoadMore = () => {
        this.setState({
            isLoadingMore: true,
            page: this.state.page + 1
        },
            async () => {
                await this.fetchSolicitudMore();
            })
    };

    onChangeSearchText = (text) => {
        this.setState({ filteredText: text });
    };

    _renderList = (solicitudes) => {
        return (
            <View style={{ flex: 1 }}>

                <FlatList
                    removeClippedSubviews
                    data={solicitudes}
                    keyExtractor={(item) => item.IdSolicitud.toString()}
                    renderItem={({ item }) => this._renderListItem(item)}
                    refreshing={this.state.isRefresing}
                    onRefresh={this.onRefresh} />

                <Fab
                    style={{ backgroundColor: '#5b6e7a' }}
                    position={'bottomRight'}
                    onPress={() => this.addNewSolicitud()}>
                    <Icon name={'plus-circle'} />
                </Fab>
            </View>
        )
    };


    setLoadingNeSolicitudState(isLoading) {
        this.setState((prevState) => {
            return {
                ...prevState,
                isModalNewLoading: isLoading
            };
        });
    }

    /**
     * Fetch Tipo Prestamo
     * @returns {Promise<void>}
     */
    fetchTipoPrestamo = async () => {
        try {
            this.setLoadingNeSolicitudState(true);

            const result = await CoreService
                .get(constants.FETCH_TIPO_PRESTAMOS);

            if (result) {
                if (result.data) {
                    const arr = result.data;
                    if (arr.length > 0) {
                        this.setState({
                            tipoPrestamos: result.data
                        })
                    }
                }
            }

        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
        this.setLoadingNeSolicitudState(false);
    };

    /**
     * Render Modal Loading
     * @returns {*}
     * @private
     */
    _renderModalLoading = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <DotIndicator size={10} />
            </View>
        );
    };

    /**
     * Render Modal View
     * @private
     */
    _renderModalView = () => {

        let { isModalNewLoading } = this.state;

        return (
            <View style={{ flex: 1 }}>
                {isModalNewLoading
                    ? this._renderModalLoading()
                    : (<View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{
                                marginTop: 30,
                                marginBottom: 10,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 30, color: '#eb008b' }}>(Crear Nueva Solicitud)</Text>
                            </View>
                            <View>
                                <FormLabel labelStyle={styles.labelStyle}>TIPO PRESTAMO(*)</FormLabel>
                                <Picker
                                    style={{ marginLeft: 10 }}
                                    selectedValue={this.state.tipoPrestamoId}
                                    onValueChange={(itemValue) =>
                                        this.setState(prevState => ({
                                            ...prevState,
                                            tipoPrestamoId: itemValue
                                        }))
                                    }>
                                    {this.state.tipoPrestamos.map((item, index) => (
                                        <Picker.Item label={item.Descripcion} value={item}
                                            key={index} />)
                                    )}
                                </Picker>
                            </View>
                            <View>
                                <FormLabel labelStyle={styles.labelStyle}>CEDULA DE IDENTIDAD(*)</FormLabel>
                                <FormInput
                                    keyboardType={'numeric'}
                                    placeholder={'Introduzca su número de cedula'}
                                    onChangeText={(text) => {
                                        this.setState(prevState => ({
                                            ...prevState,
                                            cedula: text
                                        }))
                                    }} />
                            </View>
                        </View>
                        <View style={{ justifyContent: 'flex-end' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <TouchableNativeFeedback
                                        onPress={() => this.setModalNewSolicitudVisible(!this.state.isModalNewSolicitud)}>
                                        <View style={{
                                            padding: 13,
                                            backgroundColor: '#999',
                                            elevation: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: '#fff',
                                                fontWeight: '500',
                                                fontSize: 14
                                            }}>CANCELAR</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableNativeFeedback onPress={() => this.goToNewSolicitud()}>
                                        <View style={{
                                            padding: 13,
                                            backgroundColor: '#eb008b',
                                            elevation: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: '#fff',
                                                fontWeight: '500',
                                                fontSize: 14
                                            }}>CONTINUAR</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                            </View>
                        </View>
                    </View>
                    )}
            </View>
        );
    };

    _rederModalNewSolicitud = () => {
        return (
            <Modal
                style={{ alignItems: 'center' }}
                transparent={false}
                visible={this.state.isModalNewSolicitud}
                onRequestClose={() => {
                    this.setModalNewSolicitudVisible(!this.state.isModalNewSolicitud);
                }}>
                <View style={{ flex: 1 }}>
                    {this._renderModalView()}
                </View>
            </Modal>
        );
    };

    _rederModalFilterSolicitud = () => {
        return (
            <Modal
                style={{ alignItems: 'center' }}
                transparent={false}
                visible={this.state.isModalFilterSolicitud}
                onRequestClose={() => {
                    this.setModalFilterSolicitudVisible(!this.state.isModalFilterSolicitud);
                }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <SearchBar
                                round
                                lightTheme
                                searchIcon={{ size: 24 }}
                                platform="android"
                                cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
                                value={this.state.filteredText}
                                onChangeText={this.onChangeSearchText}
                                cancelButtonTitle="Cancel"
                                onClear={() => {
                                }}
                                placeholder='Search' />
                        </View>
                        <View style={{ justifyContent: 'flex-end' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <TouchableNativeFeedback
                                        onPress={() => this.setModalFilterSolicitudVisible(!this.state.isModalFilterSolicitud)}>
                                        <View style={{
                                            padding: 13,
                                            backgroundColor: '#999',
                                            elevation: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: '#fff',
                                                fontWeight: '500',
                                                fontSize: 14
                                            }}>CANCELAR</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableNativeFeedback onPress={() => this.onApplyFilterToSearch()}>
                                        <View style={{
                                            padding: 13,
                                            backgroundColor: '#16a085',
                                            elevation: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: '#fff',
                                                fontWeight: '500',
                                                fontSize: 14
                                            }}>FILTRAR</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>

            </Modal>
        );
    };

    setModalNewSolicitudVisible(visible) {
        this.setState({ isModalNewSolicitud: visible });
    }

    setModalFilterSolicitudVisible(visible) {
        this.setState({ isModalFilterSolicitud: visible });
    }

    loadUserInfo = async () => {
        const result = await util.GetGeneralUserInfoInStorage();
        if (result) {
            const obj = JSON.parse(result).user;
            if (obj) {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        user: obj
                    }
                });
            }
        }
    };

    /**
     * Component Did Mount
     * @returns {Promise<void>}
     */
    async componentDidMount() {

        //fetch solicitud
        await this.fetchSolicitud();

        //user-info
        await this.loadUserInfo()
    }

    /**
     * Render Component
     * @returns {*}
     */
    render() {
        const { isLoading, solicitudes = [], isModalNewSolicitud, isModalFilterSolicitud } = this.state;
        return (
            <View style={styles.container}>
                {isLoading
                    ? (<LoadingIndicator />)
                    : this._renderList(solicitudes)}

                {isModalNewSolicitud && this._rederModalNewSolicitud()}
                {isModalFilterSolicitud && this._rederModalFilterSolicitud()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    labelStyle: {
        color: '#5b6e7a'
    },
});

export { ListAll };