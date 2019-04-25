import React, { Component } from 'react';
import {
    StyleSheet, View, Text, ScrollView, Picker, TouchableNativeFeedback, TouchableOpacity, Alert, BackHandler, TextInput
} from 'react-native';
import { List, ListItem, Container, Content } from 'native-base';
import { FormLabel, FormInput } from 'react-native-elements'
import ModalFilterPicker from 'react-native-modal-filter-picker'

//libs
import { ToolbarActionButton, LoadingIndicator } from '../../common';
import * as constants from '../../constants';
import * as util from '../../util';
import * as globalStyle from '../../styles';
import CoreService from '../../services/CoreService';
import DialogManager, { ScaleAnimation, DialogContent, DialogButton } from 'react-native-dialog-component';

class Details extends Component {


    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        let title = 'Nueva Solicitud';

        if (!params.IsNewSolicitud) {
            title = `Solicitud #${params.SolicitudId}`;
        }

        return {
            title: title,
            titleStyle: {
                textAlign: 'center'
            },
            headerRight: (
                !params.IsNewSolicitud && <ToolbarActionButton
                    onPress={() => {
                        DialogManager.show({
                            titleAlign: 'center',
                            animationDuration: 200,
                            width:'90%',
                            ScaleAnimation: new ScaleAnimation(),
                            children: (
                                <DialogContent>
                                    <View>
                                        <DialogButton text='Comentarios' align='center' onPress={()=>{navigation.navigate('Comentarios', params.SolicitudId); DialogManager.dismiss();}}/>
                                        <DialogButton text='Adjuntos' align='center' onPress={()=>{navigation.navigate('Adjuntos', params.SolicitudId); DialogManager.dismiss();}}/>
                                        <DialogButton text='Tasación' align='center' onPress={()=>{navigation.navigate('Tasacion', params.SolicitudId); DialogManager.dismiss();}}/>
                                        <DialogButton text='Relacionados' align='center' onPress={()=>{navigation.navigate('Relation', params.SolicitudId); DialogManager.dismiss();}}/>
                                    </View>
                                </DialogContent>
                            ),
                        });
                    }}
                    name={'ellipsis-v'}
                    color={'white'}
                    size={23} />)
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isNewSolicitud: false,
            isVehiculo: false,
            isLoading: false,
            hasPrioridadChanged: false,
            CurrentPrioridadCodigo: '',
            IsEnabledPriority: false,
            showSelectedDealer: false,

            //FILL
            prioridades: [],
            tiposEmpleo: [],
            tiemposEmpleado: [],
            dealers: [],
            marcasVehiculo: [],
            modelosVehiculo: [],
            anosVehiculo: [],

            solicitud: {

                //DEFAULT
                WorkflowEstado: '',
                FormaPagoCodigo: 'M',
                PrioridadCodigo: '',
                ComentarioPrioridad: '',
                PromotorId: '1',
                Gastos: 0,
                TipoGarantiaId: 0,
                DescripcionGarantia: '',
                ValorGarantia: 0,
                ValorGarantiaInmueble: 0,
                IsSolicitudGarante: false,
                TipoPrestamoCategoriaId: '',

                //SOLICITANTE
                TipoPrestamo: '',
                TipoPrestamoId: '',
                SolicitudId: '',
                Cedula: '',
                NombreCompleto: '',
                Salario: '',
                OtrosIngresos: '',
                DescripcionOtrosIngresos: '',
                TipoEmpleoId: '',
                TiempoEmpleandoId: '',
                LugarDeTrabajo: '',
                TelefonoCasa: '',
                TelefonoCelular: '',
                Email: '',

                //VEHICULO
                PrecioVehiculo: '',
                DealerId: '',
                DealerNombre: '',
                MarcaVehiculoId: 0,
                ModeloVehiculoId: 0,
                AnoVehiculoId: 0,


                //PRESTAMO Y GARANTIA
                MontoPrestamo: '',
                Meses: '',
                Tasa: '',
                Comentario: '',
                NombreEmpresa: ''
            }
        };

        this.saveSolicitud = this.saveSolicitud.bind(this);
    }

    onOpenSelectDealer = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                showSelectedDealer: true
            };
        });
    };

    onSelect = (picked) => {
        if (picked) {
            const dealerItem = this.state.dealers.filter(item => item.key === picked)[0];
            if (dealerItem) {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        solicitud: {
                            ...prevState.solicitud,
                            DealerId: dealerItem.key,
                            DealerNombre: dealerItem.label
                        },
                        showSelectedDealer: false
                    };
                });
            }
        }
    };

    onCancel = () => {
        this.setState({
            showSelectedDealer: false
        });
    };

    /**
     * Validate required fields
     * @param solicitud
     * @returns {boolean}
     */
    validateRequiredFields = (solicitud, hasPrioridadChanged) => {
        let valid = true;
        let validationMessage = '';

        if (solicitud.TipoPrestamoCategoriaId) {

            //categoria-vehiculo
            if (solicitud.TipoPrestamoCategoriaId === "1") {

                if (hasPrioridadChanged && !solicitud.ComentarioPrioridad) {
                    validationMessage += "(*)Motivo Cambio Prioridad\n";
                    valid = false;
                }

                if (!solicitud.Salario || solicitud.Salario == "0") {
                    validationMessage += "(*)Salario\n";
                    valid = false;
                }

                if (!solicitud.DescripcionOtrosIngresos) {
                    validationMessage += "(*)DescripciÃ³n Ingresos\n";
                    valid = false;
                }

                if (solicitud.OtrosIngresos === "") {
                    validationMessage += "(*)Otros Ingresos\n";
                    valid = false;
                }

                if (!solicitud.TipoEmpleoId) {
                    validationMessage += "(*)Tipo Empleo\n";
                    valid = false;
                }

                if (!solicitud.TiempoEmpleandoId) {
                    validationMessage += "(*)Tiempo Empleando\n";
                    valid = false;
                }

                if (!solicitud.TelefonoCasa) {
                    validationMessage += "(*)Telefono Casa\n";
                    valid = false;
                }

                if (!solicitud.TelefonoCelular) {
                    validationMessage += "(*)Telefono Celular\n";
                    valid = false;
                }

                if (!solicitud.PrecioVehiculo || solicitud.PrecioVehiculo == "0") {
                    validationMessage += "(*)Precio VehÃ­culo\n";
                    valid = false;
                }
                if (!solicitud.DealerId) {
                    validationMessage += "(*)Dealer\n";
                    valid = false;
                }

                if (!solicitud.AnoVehiculoId) {
                    validationMessage += "(*)AÃ±o VehÃ­culo\n";
                    valid = false;
                }

                if (!solicitud.MarcaVehiculoId) {
                    validationMessage += "(*)Marca VehÃ­culo\n";
                    valid = false;
                }

                if (!solicitud.ModeloVehiculoId) {
                    validationMessage += "(*)Modelo VehÃ­culo\n";
                    valid = false;
                }

                if (!solicitud.MontoPrestamo || solicitud.MontoPrestamo == "0") {
                    validationMessage += "(*)Monto Prestamo\n";
                    valid = false;
                }

                if (!solicitud.Meses || solicitud.Meses == "0") {
                    validationMessage += "(*)Meses\n";
                    valid = false;
                }

                if (!solicitud.Tasa || solicitud.Tasa == "0") {
                    validationMessage += "(*)Tasa\n";
                    valid = false;
                } else {
                    if (isNaN(solicitud.Tasa)) {
                        validationMessage += "(*)Tasa no Valida\n";
                        valid = false;
                    }
                }
            }

            //categoria-personal
            if (solicitud.TipoPrestamoCategoriaId === "2") {

                if (hasPrioridadChanged && !solicitud.ComentarioPrioridad) {
                    validationMessage += "(*)Motivo Cambio Prioridad\n";
                    valid = false;
                }

                if (!solicitud.Salario || solicitud.Salario == "0") {
                    validationMessage += "(*)Salario\n";
                    valid = false;
                }

                if (solicitud.OtrosIngresos === "") {
                    validationMessage += "(*)Otros Ingresos\n";
                    valid = false;
                }

                if (!solicitud.DescripcionOtrosIngresos) {
                    validationMessage += "(*)DescripciÃ³n Ingresos\n";
                    valid = false;
                }


                if (!solicitud.TipoEmpleoId) {
                    validationMessage += "(*)Tipo Empleo\n";
                    valid = false;
                }

                if (!solicitud.TiempoEmpleandoId) {
                    validationMessage += "(*)Tiempo Empleando\n";
                    valid = false;
                }

                if (!solicitud.TelefonoCasa) {
                    validationMessage += "(*)Telefono Casa\n";
                    valid = false;
                }

                if (!solicitud.TelefonoCelular) {
                    validationMessage += "(*)Telefono Celular\n";
                    valid = false;
                }

                if (!solicitud.MontoPrestamo || solicitud.MontoPrestamo == "0") {
                    validationMessage += "(*)Monto Prestamo\n";
                    valid = false;
                }

                if (!solicitud.Meses || solicitud.Meses == "0") {
                    validationMessage += "(*)Meses\n";
                    valid = false;
                }

                if (!solicitud.Tasa || solicitud.Tasa == "0") {
                    validationMessage += "(*)Tasa\n";
                    valid = false;
                }
                else {
                    if (isNaN(solicitud.Tasa)) {
                        validationMessage += "(*)Tasa no Valida\n";
                        valid = false;
                    }
                }
            }
        }

        if (!valid) {
            validationMessage = `Los siguientes campos son requeridos o no estÃ¡n correctos:\n${validationMessage}`;
        }

        return {
            valid: valid,
            message: validationMessage
        };
    }

    cancelSolicitud = () => {
        Alert.alert("Cerrar Formulario Solicitud", "Â¿EstÃ¡ seguro de cerrar el formulario de solicitud?", [
            {
                text: "CERRAR", onPress: () => {
                    this.props.navigation.goBack(null);
                }
            },
            {
                text: "CANCELAR", onPress: () => {
                }
            }
        ])
    };

    /**
     * Save Solicitud
     */
    saveSolicitud = async () => {
        let { solicitud, hasPrioridadChanged } = this.state;
        if (solicitud) {
            const { valid, message } = this.validateRequiredFields(solicitud, hasPrioridadChanged);
            if (!valid) {
                Alert.alert("InformaciÃ³n Requerida", message);
            } else {
                try {
                    this.setLoadingState(true);
                    let result = await CoreService
                        .post(constants.SAVE_SOLICITUD, solicitud);

                    if (result.data) {
                        const code = result.data.Code;
                        const message = result.data.Message;

                        switch (code) {
                            case "success":
                                util.ShowAlert("Solicitud Guardada", "Su solicitud ha sido guardada correctamente!");
                                this.props.navigation.goBack(null);
                                break;

                            case "error":
                                util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                                break;
                        }
                    }
                } catch (ex) {
                    util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                }
                this.setLoadingState(false);
            }
        }
    }

    /**
     * On Marca ValueChange
     * @param itemValue
     * @returns {Promise<void>}
     */
    onMarcaValueChange = async (itemValue) => {
        if (itemValue) {
            this.setState((prevSolicitud) => {
                return {
                    solicitud: {
                        ...prevSolicitud.solicitud,
                        MarcaVehiculoId: itemValue
                    }
                }
            });

            try {
                let resultModelosVehiculo = await CoreService
                    .get(`${constants.FETCH_MODELOS_VEHICULO_BY_MARCA_ID}/${itemValue}`);

                if (resultModelosVehiculo) {
                    if (resultModelosVehiculo.data) {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                modelosVehiculo: resultModelosVehiculo.data
                            };
                        });
                    }
                }
            } catch (ex) {
                util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
            }
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

    prepareNewSolicitud = async (params) => {
        const TipoPrestamoCategoriaId = params.TipoPrestamoCategoriaId;

        if (TipoPrestamoCategoriaId) {
            try {
                this.setLoadingState(true);

                //Do Fetch to Load all Pickers
                if (TipoPrestamoCategoriaId === '1') //VEHICULO
                {
                    let resultFill = await CoreService
                        .get(constants.FETCH_FILL_TIPO_PRESTAMO_VEHICULO);

                    if (resultFill) {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                isNewSolicitud: true,
                                isVehiculo: true,
                                isLoading: false,

                                //FILL
                                prioridades: resultFill.data.prioridades,
                                tiposEmpleo: resultFill.data.tiposEmpleo,
                                tiemposEmpleado: resultFill.data.tiemposEmpleado,
                                dealers: resultFill.data.dealers.map(item => {
                                    return { key: item.IdDealer, label: item.Nombre }
                                }),
                                marcasVehiculo: resultFill.data.marcasVehiculo,
                                anosVehiculo: resultFill.data.anosVehiculo,
                                modelosVehiculo: [],


                                //SOLICITUD
                                solicitud: {
                                    ...prevState.solicitud,
                                    Cedula: params.Cedula,
                                    TipoPrestamoCategoriaId: params.TipoPrestamoCategoriaId,
                                    TipoPrestamoId: params.TipoPresamoId,
                                    TipoPrestamo: params.TipoPresamo
                                }
                            }
                        });
                    }
                }

                if (TipoPrestamoCategoriaId === '2') //PERSONAL
                {
                    let resultFill = await CoreService
                        .get(constants.FETCH_FILL_TIPO_PRESTAMO_PERSONAL);

                    if (resultFill) {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                isNewSolicitud: true,
                                isVehiculo: false,
                                isLoading: false,

                                //FILL
                                prioridades: resultFill.data.prioridades,
                                tiposEmpleo: resultFill.data.tiposEmpleo,
                                tiemposEmpleado: resultFill.data.tiemposEmpleado,

                                //SOLICITUD
                                solicitud: {
                                    ...prevState.solicitud,
                                    Cedula: params.Cedula,
                                    TipoPrestamoCategoriaId: params.TipoPrestamoCategoriaId,
                                    TipoPrestamoId: params.TipoPresamoId,
                                    TipoPrestamo: params.TipoPresamo
                                }
                            }
                        });
                    }
                }
            } catch (ex) {
                util.ShowAlert(constants.ERROR_TITLE, ex);
                this.setLoadingState(false);
            }
            this.setLoadingState(false);
        }
    };

    /**
     * Fetch Solicitud
     * @param solicitudId
     * @returns {Promise<void>}
     */
    async fetchSolicitud(solicitudId, TipoPrestamoCategoriaId, IsEnabledPriority) {
        try {
            this.setLoadingState(true);
            const result = await CoreService
                .get(`${constants.FETCH_SOLICITUD_BY_SOLICITUD_ID}/${solicitudId}`);

            if (result) {
                if (result.data) {
                    let data = result.data[0];
                    if (data) {

                        //Do Fetch to Load all Pickers
                        if (TipoPrestamoCategoriaId === '1') //VEHICULO
                        {
                            let resultFill = await CoreService
                                .get(constants.FETCH_FILL_TIPO_PRESTAMO_VEHICULO);

                            if (resultFill) {

                                //Fetch modelos by marcaID
                                let resultModelosVehiculo = await CoreService
                                    .get(`${constants.FETCH_MODELOS_VEHICULO_BY_MARCA_ID}/${data.MarcaVehiculoId}`);

                                if (resultModelosVehiculo) {
                                    if (resultModelosVehiculo.data) {
                                        this.setState((prevState) => {
                                            return {
                                                ...prevState,
                                                modelosVehiculo: resultModelosVehiculo.data
                                            };
                                        });
                                    }
                                }

                                this.setState((prevState) => {
                                    return {
                                        ...prevState,
                                        isVehiculo: true,
                                        isLoading: false,
                                        CurrentPrioridadCodigo: data.PrioridadCodigo,
                                        IsEnabledPriority: IsEnabledPriority,

                                        //FILL
                                        prioridades: resultFill.data.prioridades,
                                        tiposEmpleo: resultFill.data.tiposEmpleo,
                                        tiemposEmpleado: resultFill.data.tiemposEmpleado,
                                        //dealers: resultFill.data.dealers,
                                        dealers: resultFill.data.dealers.map(item => {
                                            return { key: item.IdDealer, label: item.Nombre }
                                        }),
                                        marcasVehiculo: resultFill.data.marcasVehiculo,
                                        anosVehiculo: resultFill.data.anosVehiculo,

                                        //SOLICITUD
                                        solicitud: {
                                            ...prevState.solicitud,
                                            WorkflowEstado: data.WorkflowEstado,
                                            PrioridadCodigo: data.PrioridadCodigo,
                                            TipoPrestamoCategoriaId: data.TipoPrestamoCategoriaID,
                                            TipoPrestamo: data.TipoPrestamo,
                                            TipoPrestamoId: data.TipoPrestamoId,
                                            SolicitudId: data.SolicitudId,
                                            Cedula: data.Cedula,
                                            NombreCompleto: data.NombreCompleto,
                                            Salario: data.Salario,
                                            OtrosIngresos: data.OtrosIngresos,
                                            DescripcionOtrosIngresos: data.DescripcionOtrosIngresos,
                                            TipoEmpleoId: data.TipoEmpleoId,
                                            TiempoEmpleandoId: data.TiempoEmpleadoId,
                                            LugarDeTrabajo: data.LugarDeTrabajo,
                                            TelefonoCasa: data.TelefonoCasa,
                                            TelefonoCelular: data.TelefonoCelular,
                                            Email: data.Email,
                                            NombreEmpresa: data.NombreEmpresa,

                                            //VEHICULO
                                            PrecioVehiculo: data.ValorVehiculo,
                                            DealerId: data.DealerVehiculoId,
                                            DealerNombre: data.DealerVehiculoNombre,
                                            MarcaVehiculoId: data.MarcaVehiculoId,
                                            ModeloVehiculoId: data.ModeloVehiculoId,
                                            AnoVehiculoId: data.AnoVehiculoId,

                                            //PRESTAMO Y GARANTIA
                                            MontoPrestamo: data.MontoPrestamo,
                                            Meses: data.Meses,
                                            Tasa: data.TasaInteres,
                                            Comentario: data.Comentario
                                        }
                                    }
                                });
                            }
                        }

                        if (TipoPrestamoCategoriaId === '2') //PERSONAL
                        {
                            let resultFill = await CoreService
                                .get(constants.FETCH_FILL_TIPO_PRESTAMO_PERSONAL);

                            if (resultFill) {

                                this.setState((prevState) => {
                                    return {
                                        ...prevState,
                                        isVehiculo: false,
                                        isLoading: false,
                                        CurrentPrioridadCodigo: data.PrioridadCodigo,
                                        IsEnabledPriority: IsEnabledPriority,

                                        //FILL
                                        prioridades: resultFill.data.prioridades,
                                        tiposEmpleo: resultFill.data.tiposEmpleo,
                                        tiemposEmpleado: resultFill.data.tiemposEmpleado,

                                        //SOLICITUD
                                        solicitud: {
                                            ...prevState.solicitud,
                                            WorkflowEstado: data.WorkflowEstado,
                                            PrioridadCodigo: data.PrioridadCodigo,
                                            TipoPrestamoCategoriaId: data.TipoPrestamoCategoriaID,
                                            TipoPrestamo: data.TipoPrestamo,
                                            TipoPrestamoId: data.TipoPrestamoId,
                                            SolicitudId: data.SolicitudId,
                                            Cedula: data.Cedula,
                                            NombreCompleto: data.NombreCompleto,
                                            Salario: data.Salario,
                                            OtrosIngresos: data.OtrosIngresos,
                                            DescripcionOtrosIngresos: data.DescripcionOtrosIngresos,
                                            TipoEmpleoId: data.TipoEmpleoId,
                                            TiempoEmpleandoId: data.TiempoEmpleadoId,
                                            LugarDeTrabajo: data.LugarDeTrabajo,
                                            TelefonoCasa: data.TelefonoCasa,
                                            TelefonoCelular: data.TelefonoCelular,
                                            Email: data.Email,
                                            NombreEmpresa: data.NombreEmpresa,

                                            //PRESTAMO Y GARANTIA
                                            MontoPrestamo: data.MontoPrestamo,
                                            Meses: data.Meses,
                                            Tasa: data.TasaInteres,
                                            Comentario: data.Comentario,
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
            this.setLoadingState(false);
        }
        this.setLoadingState(false);
    }

    _renderWorkflowEstadoView = () => {
        const { WorkflowEstado } = this.state.solicitud;
        let viewStyle = {
            flex: 1,
            backgroundColor: '#ecf0f1',
            borderBottomColor: '#b2bec3',
            borderBottomWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
        };
        let textStyle = {};
        let textText = '';

        switch (WorkflowEstado) {
            case "1":
                textText = "RECIBIDO";
                textStyle = { color: '#3c8dbc', fontWeight: 'bold', fontSize: 12 };
                break;

            case "2":
                textText = "EN TRAMITE";
                textStyle = { color: '#e67e22', fontWeight: 'bold', fontSize: 12 };
                break;

            case "3":
                textText = "DETENIDA";
                textStyle = { color: '#7f8c8d', fontWeight: 'bold', fontSize: 12 };
                break;

            case "4":
                textText = "DESEMBOLSADA";
                textStyle = { color: '#7cb6c3', fontWeight: 'bold', fontSize: 12 };
                break;

            case "5":
                textText = "APROBADA";
                textStyle = { color: '#00a65a', fontWeight: 'bold', fontSize: 12 };
                break;

            case "6":
                textText = "RECHAZADA";
                textStyle = { color: '#dd4b39', fontWeight: 'bold', fontSize: 12 };
                break;

            case "7":
                textText = "EN REVISION";
                textStyle = { color: '#e67e22', fontWeight: 'bold', fontSize: 12 };
                break;

            case "8":
                textText = "ANULADA";
                textStyle = { color: '#7f8c8d', fontWeight: 'bold', fontSize: 12 };
                break;

            case "9":
                textText = "DECLINADA";
                textStyle = { color: '#eca465', fontWeight: 'bold', fontSize: 12 };
                break;

            case "10":
                textText = "PRE-APROBADA";
                textStyle = { color: '#00a65a', fontWeight: 'bold', fontSize: 12 };
                break;

            case "11":
                textText = "RECHAZADA POR COMITE";
                textStyle = { color: '#dd4b39', fontWeight: 'bold', fontSize: 12 };
                break;

            case "14":
                textText = "COMPLETADO";
                textStyle = { color: '#7cb6c3', fontWeight: 'bold', fontSize: 12 };
                break;

            default:
                textText = "N/A";
                textStyle = { color: '#7f8c8d', fontWeight: 'bold', fontSize: 12 };
                break;
        }

        return (<View style={viewStyle}>
            <Text style={textStyle}>{textText}</Text>
        </View>
        );
    };

    enabledPrioridadComentario = (itemValue) => {
        if (itemValue !== util.returnBlankValue(this.state.CurrentPrioridadCodigo)) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    hasPrioridadChanged: true
                };
            });
        } else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    hasPrioridadChanged: false,
                    solicitud: {
                        ...prevState.solicitud,
                        ComentarioPrioridad: ''
                    }
                };
            });
        }
    };


    _renderForm = (solicitud, isVehiculo, dealersList) => {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps={'always'}>

                    {/*****SOLICITANTE******/}
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.headerTitle}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.headerTitleText}>SOLICITANTE</Text>
                                </View>
                            </View>
                            {!this.state.isNewSolicitud && this._renderWorkflowEstadoView()}
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}>CEDULA</FormLabel>
                                    <FormInput
                                        value={this.state.solicitud.Cedula}
                                        editable={false} />
                                </View>

                                {!this.state.isNewSolicitud && <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}># SOLICITUD</FormLabel>
                                    <FormInput
                                        value={`${this.state.solicitud.SolicitudId}`}
                                        keyboardType={'numeric'}
                                        editable={false} />
                                </View>}
                            </View>
                            {!this.state.isNewSolicitud && <View>
                                <FormLabel labelStyle={styles.labelStyle}>NOMBRE</FormLabel>
                                <FormInput
                                    value={this.state.solicitud.NombreCompleto}
                                    editable={false} />
                            </View>}
                            {(!this.state.isNewSolicitud && this.state.IsEnabledPriority) &&
                                <View>
                                    <View>
                                        <FormLabel labelStyle={styles.labelStyle}>PRIORIDAD</FormLabel>
                                        <Picker
                                            style={{ marginLeft: 10 }}
                                            selectedValue={this.state.solicitud.PrioridadCodigo}
                                            onValueChange={(itemValue) => {
                                                this.enabledPrioridadComentario(itemValue);
                                                this.setState(prevState => ({
                                                    solicitud: {
                                                        ...prevState.solicitud,
                                                        PrioridadCodigo: itemValue
                                                    }
                                                }))
                                            }}>
                                            <Picker.Item label='N/A' value='' />
                                            {this.state.prioridades.map((item, index) => (
                                                <Picker.Item label={item.DESCRIPCION} value={item.CODIGO} key={index} />)
                                            )}
                                        </Picker>
                                    </View>
                                    {this.state.hasPrioridadChanged &&
                                        <View style={{ flex: 1 }}>
                                            <FormLabel labelStyle={{ color: '#e74c3c' }}>Motivo Cambio Prioridad (*)</FormLabel>
                                            <FormInput
                                                value={`${this.state.solicitud.ComentarioPrioridad}`}
                                                keyboardType={'default'}
                                                onChangeText={(text) => {
                                                    this.setState(prevState => ({
                                                        solicitud: {
                                                            ...prevState.solicitud,
                                                            ComentarioPrioridad: text
                                                        }
                                                    }))
                                                }} />
                                        </View>
                                    }
                                </View>
                            }
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}>SALARIO (*)</FormLabel>
                                    <FormInput
                                        value={`${this.state.solicitud.Salario}`}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => {
                                            this.setState(prevState => ({
                                                solicitud: {
                                                    ...prevState.solicitud,
                                                    Salario: text
                                                }
                                            }))
                                        }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}>OTROS INGRESOS (*)</FormLabel>
                                    <FormInput
                                        value={`${this.state.solicitud.OtrosIngresos}`}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => {
                                            this.setState(prevState => ({
                                                solicitud: {
                                                    ...prevState.solicitud,
                                                    OtrosIngresos: text
                                                }
                                            }))
                                        }} />
                                </View>
                            </View>
                            <View>
                                <FormLabel labelStyle={styles.labelStyle}>DESCRIPCION INGRESOS (*)</FormLabel>
                                <FormInput
                                    value={`${this.state.solicitud.DescripcionOtrosIngresos}`}
                                    keyboardType={'default'}
                                    onChangeText={(text) => {
                                        this.setState(prevState => ({
                                            solicitud: {
                                                ...prevState.solicitud,
                                                DescripcionOtrosIngresos: text
                                            }
                                        }))
                                    }} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}>TIPO EMPLEO (*)</FormLabel>
                                    <Picker
                                        style={{ marginLeft: 10 }}
                                        selectedValue={this.state.solicitud.TipoEmpleoId}
                                        onValueChange={(itemValue) =>
                                            this.setState(prevState => ({
                                                solicitud: {
                                                    ...prevState.solicitud,
                                                    TipoEmpleoId: itemValue
                                                }
                                            }))}>
                                        <Picker.Item label='[ SELECCIONE ]' value='' />
                                        {this.state.tiposEmpleo.map((item, index) => (
                                            <Picker.Item label={item.Descripcion} value={item.IdEmpleo}
                                                key={index} />)
                                        )}
                                    </Picker>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}>TIEMPO EMPLEADO (*)</FormLabel>
                                    <Picker
                                        style={{ marginLeft: 10 }}
                                        selectedValue={this.state.solicitud.TiempoEmpleandoId}
                                        onValueChange={(itemValue) =>
                                            this.setState(prevState => ({
                                                solicitud: {
                                                    ...prevState.solicitud,
                                                    TiempoEmpleandoId: itemValue
                                                }
                                            }))}>
                                        <Picker.Item label='[ SELECCIONE ]' value='' />
                                        {this.state.tiemposEmpleado.map((item, index) => (
                                            <Picker.Item label={item.Descripcion} value={item.IdTiempoLaborando}
                                                key={index} />)
                                        )}
                                    </Picker>
                                </View>
                            </View>
                            <View>
                                <FormLabel labelStyle={styles.labelStyle}>LUGAR DE TRABAJO</FormLabel>
                                <FormInput
                                    value={`${this.state.solicitud.NombreEmpresa}`}
                                    keyboardType={'default'}
                                    onChangeText={(text) => {
                                        this.setState(prevState => ({
                                            solicitud: {
                                                ...prevState.solicitud,
                                                NombreEmpresa: text
                                            }
                                        }))
                                    }} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}>TELEFONO CASA (*)</FormLabel>
                                    <FormInput
                                        value={`${this.state.solicitud.TelefonoCasa}`}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => {
                                            this.setState(prevState => ({
                                                solicitud: {
                                                    ...prevState.solicitud,
                                                    TelefonoCasa: text
                                                }
                                            }))
                                        }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FormLabel labelStyle={styles.labelStyle}>TELEFONO CELULAR (*)</FormLabel>
                                    <FormInput
                                        value={`${this.state.solicitud.TelefonoCelular}`}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => {
                                            this.setState(prevState => ({
                                                solicitud: {
                                                    ...prevState.solicitud,
                                                    TelefonoCelular: text
                                                }
                                            }))
                                        }} />
                                </View>
                            </View>
                        </View>
                    </View>


                    {/*****VEHICULO******/}
                    {isVehiculo &&
                        <View>
                            <View>
                                <View style={styles.headerTitle_2}>
                                    <Text style={styles.headerTitleText}>VEHICULO</Text>
                                </View>
                                <View>
                                    <FormLabel labelStyle={styles.labelStyle}>TIPO PRESTAMO</FormLabel>
                                    <FormInput
                                        value={this.state.solicitud.TipoPrestamo}
                                        editable={false} />
                                </View>
                                <View>
                                    <FormLabel labelStyle={styles.labelStyle}>PRECIO VEHICULO (*)</FormLabel>
                                    <FormInput
                                        value={`${this.state.solicitud.PrecioVehiculo}`}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => {
                                            this.setState(prevState => ({
                                                solicitud: {
                                                    ...prevState.solicitud,
                                                    PrecioVehiculo: text
                                                }
                                            }))
                                        }} />
                                </View>
                                <View>
                                    <FormLabel labelStyle={styles.labelStyle}>DEALER (*)</FormLabel>
                                    <TouchableOpacity onPress={this.onOpenSelectDealer}>
                                        <FormInput
                                            value={this.state.solicitud.DealerNombre}
                                            editable={false} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <FormLabel labelStyle={styles.labelStyle}>AÃ‘O VEHICULO (*)</FormLabel>
                                        <Picker
                                            style={{ marginLeft: 10 }}
                                            selectedValue={this.state.solicitud.AnoVehiculoId}
                                            onValueChange={(itemValue) =>
                                                this.setState(prevState => ({
                                                    solicitud: {
                                                        ...prevState.solicitud,
                                                        AnoVehiculoId: itemValue
                                                    }
                                                }))
                                            }>
                                            <Picker.Item label='[ SELECCIONE ]' value='' />
                                            {this.state.anosVehiculo.map((item, index) => (
                                                <Picker.Item label={item.Descripcion} value={item.IdAnoVehiculo}
                                                    key={index} />)
                                            )}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <FormLabel labelStyle={styles.labelStyle}>MARCA VEHICULO (*)</FormLabel>
                                        <Picker
                                            style={{ marginLeft: 10 }}
                                            selectedValue={this.state.solicitud.MarcaVehiculoId}
                                            onValueChange={(itemValue) => this.onMarcaValueChange(itemValue)}>
                                            <Picker.Item label='[ SELECCIONE ]' value='' />
                                            {this.state.marcasVehiculo.map((item, index) => (
                                                <Picker.Item label={item.Descripcion}
                                                    value={item.IdMarcaVehiculo}
                                                    key={index} />)
                                            )}
                                        </Picker>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <FormLabel labelStyle={styles.labelStyle}>MODELO VEHICULO (*)</FormLabel>
                                        <Picker
                                            style={{ marginLeft: 10 }}
                                            selectedValue={this.state.solicitud.ModeloVehiculoId}
                                            onValueChange={(itemValue) =>
                                                this.setState(prevState => ({
                                                    solicitud: {
                                                        ...prevState.solicitud,
                                                        ModeloVehiculoId: itemValue
                                                    }
                                                }))
                                            }>
                                            <Picker.Item label='[ SELECCIONE ]' value='' />
                                            {this.state.modelosVehiculo.map((item, index) => (
                                                <Picker.Item label={item.Descripcion}
                                                    value={item.IdModeloVehiculo}
                                                    key={index} />)
                                            )}
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }

                    {/*****PESTAMO Y GARANTIA******/}
                    <View>
                        <View style={styles.headerTitle_2}>
                            <Text style={styles.headerTitleText}>PESTAMO Y GARANTIA</Text>
                        </View>
                        <View>
                            <FormLabel labelStyle={styles.labelStyle}>TIPO PRESTAMO</FormLabel>
                            <FormInput
                                value={this.state.solicitud.TipoPrestamo}
                                editable={false} />
                        </View>
                        <View>
                            <FormLabel labelStyle={styles.labelStyle}>MONTO PRESTAMO (*)</FormLabel>
                            <FormInput
                                value={`${this.state.solicitud.MontoPrestamo}`}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    this.setState(prevState => ({
                                        solicitud: {
                                            ...prevState.solicitud,
                                            MontoPrestamo: text
                                        }
                                    }))
                                }} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <FormLabel labelStyle={styles.labelStyle}>MESES (*)</FormLabel>
                                <FormInput
                                    value={`${this.state.solicitud.Meses}`}
                                    keyboardType={'numeric'}
                                    onChangeText={(text) => {
                                        this.setState(prevState => ({
                                            solicitud: {
                                                ...prevState.solicitud,
                                                Meses: text
                                            }
                                        }))
                                    }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormLabel labelStyle={styles.labelStyle}>TASA (*)</FormLabel>
                                <FormInput
                                    value={`${this.state.solicitud.Tasa}`}
                                    keyboardType={'default'}
                                    onChangeText={(text) => {
                                        this.setState(prevState => ({
                                            solicitud: {
                                                ...prevState.solicitud,
                                                Tasa: text
                                            }
                                        }))
                                    }} />
                            </View>
                        </View>
                        <View>
                            <FormLabel labelStyle={styles.labelStyle}>COMENTARIO</FormLabel>
                            <FormInput
                                value={`${this.state.solicitud.Comentario}`}
                                keyboardType={'default'}
                                onChangeText={(text) => {
                                    this.setState(prevState => ({
                                        solicitud: {
                                            ...prevState.solicitud,
                                            Comentario: text
                                        }
                                    }))
                                }} />
                        </View>
                    </View>


                    {/*****ACTION BUTTONS******/}
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableNativeFeedback onPress={() => this.cancelSolicitud()}>
                                    <View style={{
                                        padding: 13,
                                        backgroundColor: '#999',
                                        elevation: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14 }}>CANCELAR</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableNativeFeedback onPress={this.saveSolicitud}>
                                    <View style={{
                                        padding: 13,
                                        backgroundColor: '#16a085',
                                        elevation: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14 }}>
                                            GUARDAR CAMBIOS
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    };

    async componentDidMount() {
        const { params } = this.props.navigation.state;
        if (params) {
            if (!params.IsNewSolicitud) {
                await this.fetchSolicitud(params.SolicitudId, params.TipoPrestamoCategoriaId, params.IsEnabledPriority);
            } else {
                await this.prepareNewSolicitud(params);
            }
        }
    }

    render() {
        const { isLoading, solicitud = {}, isVehiculo } = this.state;
        const dealersList = [
            { key: 1, label: 'Bernan' },
            { key: 2, label: 'Gabriel' },
            { key: 3, label: 'Cordero' },
            { key: 4, label: 'Benitez' },
        ];
        return (
            <View style={styles.container}>
                {isLoading
                    ? (<LoadingIndicator />)
                    : this._renderForm(solicitud, isVehiculo, dealersList)}

                {/*Select Dealer Modal    */}
                <ModalFilterPicker
                    visible={this.state.showSelectedDealer}
                    onSelect={this.onSelect}
                    onCancel={this.onCancel}
                    options={this.state.dealers} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyle.WhiteColor
    },
    headerTitle: {
        backgroundColor: '#7f8c8d',
        padding: 10,
        justifyContent: 'center',
        flex: 2
    },
    headerTitle_2: {
        backgroundColor: '#7f8c8d',
        padding: 10,
        marginTop: 10,
    },
    headerTitleText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ecf0f1'
    },
    labelStyle: {
        color: '#5b6e7a'
    },
    inputStyle: {
        borderColor: '#eee',
        borderWidth: 1
    }
});

export { Details };