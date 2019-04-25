import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
    ScrollView,
    Button,
    TouchableNativeFeedback,
    Alert
} from 'react-native';
import {
    FormLabel,
    FormInput
} from 'react-native-elements'

//Libs
import * as constants from '../../constants';
import * as util from '../../util';
import {
    ToolbarActionButton,
    ImageLoader, LoadingIndicator
} from '../../common';
import CoreService from "../../services/CoreService";
import ImagePicker from "react-native-image-picker";
import { Icon, Tab, TabHeading, Tabs } from "native-base";
import { TasacionTabExtended } from "../Vehiculo/Tabs";
import _ from "underscore";
import CarService from "../../services/CarService";


class TasacionPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: '',
            solicitud: {
                marca: '',
                modelo: '',
                ano: '',
                color: '',
                placa: '',
                chasis: '',
                carroceriaEstadoId: '',
                interiorEstadoId: '',
                motorEstadoId: '',
                gomaEstadoId: '',
            },
            vehiculoEstados: ["Excelente", "Bueno", "Aceptable", "Regular", "Problemas", "Malo"],
            imagenes: {
                FotoDelantera: '',
                FotoDelanteraIzquierda: '',
                FotoDelanteraDerecha: '',
                FotoTrasera: '',
                FotoTraseraDerecha: '',
                FotoTraseraIzquierda: '',
                FotoBaulExterior: '',
                FotoBaulInterior: '',
                FotoInterior1: '',
                FotoInterior2: '',
                FotoInterior3: '',
                FotoInterior4: '',
                FotoRepuestos: '',
                FotoMotorExterior: '',
                FotoMontoInterior: '',
                FotoKilometraje: '',
                FotoChasis1: '',
                FotoChasis2: '',
                FotoTecho: ''
            },
            images: {
                FotoDelantera: '',
                FotoDelanteraIzquierda: '',
                FotoDelanteraDerecha: '',
                FotoTrasera: '',
                FotoTraseraDerecha: '',
                FotoTraseraIzquierda: '',
                FotoBaulExterior: '',
                FotoBaulInterior: '',
                FotoInterior1: '',
                FotoInterior2: '',
                FotoInterior3: '',
                FotoInterior4: '',
                FotoRepuestos: '',
                FotoMotorExterior: '',
                FotoMotorInterior: '',
                FotoMontoInterior: '',
                FotoKilometraje: '',
                FotoChasis1: '',
                FotoChasis2: '',
                FotoTecho: ''
            },

            //tasacion
            modelo: '',
            marca: '',
            ano: '',
            modelos_vehiculo: [],
            marcas_vehiculo: [],
            anos_vehiculo: [],
            isLoadingTasacion: true,
            searchedTasacion: false,
            tasacionData: {
                myDealerNetwork: {},
                supercarros: {},
                asocivu: {},
                avg: {},
                info: {}
            },

            //modal
            modalSupercarrosVisible: false,
            modalAsocivuVisible: false
        };

        //supercarros
        this.onOpenModalSupercarrosHandler = this.onOpenModalSupercarrosHandler.bind(this);
        this.onCloseModalSupercarrosHandler = this.onCloseModalSupercarrosHandler.bind(this);
        this.onSelectItemSupercarrosHandler = this.onSelectItemSupercarrosHandler.bind(this);

        //asocivu
        this.onOpenModalAsocivuHandler = this.onOpenModalAsocivuHandler.bind(this);
        this.onCloseModalAsocivuHandler = this.onCloseModalAsocivuHandler.bind(this);
        this.onSelectItemAsocivuHandler = this.onSelectItemAsocivuHandler.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
        const {
            params = {}
        } = navigation.state
        return {
            title: 'Tasación Vehículo',
            headerTitleStyle: {
                alignSelf: 'center'
            }
        }
    };


    /**
     * ***************************************************
     * ********** SUPERCARROS EVENT HANDLERS *************
     * ***************************************************
     * */

    onOpenModalSupercarrosHandler = () => {
        this.setState(prev => ({
            ...prev,
            modalSupercarrosVisible: true
        }));
    };

    onCloseModalSupercarrosHandler = () => {
        this.setState(prev => ({
            ...prev,
            modalSupercarrosVisible: false
        }));
    };

    onSelectItemSupercarrosHandler = (item) => {
        const { vehiculos_analizados } = this.state.tasacionData.supercarros;
        if (vehiculos_analizados.length > 0) {
            const newCollection = vehiculos_analizados.map(car => {
                if (_.isEqual(car, item))
                    car.exclude = !car.exclude;
                return car;
            });

            if (newCollection.length > 0) {
                this.setState(prevState => ({
                    ...prevState,
                    tasacionData: {
                        ...prevState.tasacionData,
                        supercarros: {
                            ...prevState.tasacionData.supercarros,
                            vehiculos_analizados: newCollection
                        }
                    }
                }));
            }
        }
    };


    /**
     * ***************************************************
     * ********** ASOCIVU EVENT HANDLERS *************
     * ***************************************************
     * */

    onOpenModalAsocivuHandler = () => {
        this.setState(prev => ({
            ...prev,
            modalAsocivuVisible: true
        }));
    };

    onCloseModalAsocivuHandler = () => {
        this.setState(prev => ({
            ...prev,
            modalAsocivuVisible: false
        }));
    };

    onSelectItemAsocivuHandler = (item) => {
        const { vehiculos_analizados } = this.state.tasacionData.asocivu;
        if (vehiculos_analizados.length > 0) {
            const newCollection = vehiculos_analizados.map(car => {
                if (_.isEqual(car, item))
                    car.exclude = !car.exclude;
                return car;
            });

            if (newCollection.length > 0) {
                this.setState(prevState => ({
                    ...prevState,
                    tasacionData: {
                        ...prevState.tasacionData,
                        asocivu: {
                            ...prevState.tasacionData.asocivu,
                            vehiculos_analizados: newCollection
                        }
                    }
                }));
            }
        }
    };


    /**
     * On Search Tasacion Handler
     * @param marca
     * @param modelo
     * @param ano
     * @returns {Promise<void>}
     */
    onSearchTasacionHandler = async () => {

        let { marca, modelo, ano } = this.state;

        if (marca && modelo && ano) {
            try {
                this.setState({ isLoadingTasacion: true });
                const result = await CarService
                    .post('tasacion', { marca: marca, modelo: modelo, ano: ano.toString() });

                if (result.data) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            searchedTasacion: true,
                            tasacionData: result.data
                        }
                    });
                }
                this.setState({ isLoadingTasacion: false });

            } catch (ex) {
                util.ShowAlert(constants.ERROR_TITLE, JSON.stringify(ex));
                this.setState({ isLoadingTasacion: false });
            }
        }
    };


    cancelSolicitud = () => {
        Alert.alert("Cerrar", "¿Está seguro de cerrar esta pantalla?", [
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

    uploadImage = (photo) => {
        const data = new FormData();
        data.append('tailor_file_', {
            uri: photo.uri,
            type: 'image/jpeg',
            name: 'testPhotoName'
        });
        fetch(url, {
            method: 'post',
            body: data
        }).then(res => {
            console.log(res)
        });
    };

    saveTasacion = async () => {
        const { id, solicitud, imagenes, } = this.state;

        const dataToSend = {
            id: id,
            color: solicitud.color,
            placa: solicitud.placa,
            chasis: solicitud.chasis,
            carroceria: solicitud.carroceriaEstadoId,
            interior: solicitud.interiorEstadoId,
            motor: solicitud.motorEstadoId,
            gomas: solicitud.gomaEstadoId
        };

        try {
            const result = await CoreService
                .post_body(constants.SAVE_TASACION, dataToSend);

            if (result.data) {
                if (result.data === 'success') {
                    util.ShowAlert("Datos Guardados", "Los datos han sido guardados correctamente...");
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
    };

    fetchTasacionData = async (id) => {
        const response = await CoreService
            .get(`${constants.FETCH_TASACION_BY_ID}/${id}`);

        if (response) {
            const _result = response.data;
            this.setState((prevState) => {
                return {
                    ...prevState,
                    marca: _result.vehiculo.marca,
                    modelo: _result.vehiculo.modelo,
                    ano: _result.vehiculo.ano,
                    solicitud: {
                        ...prevState.solicitud,

                        //vehiculo
                        marca: _result.vehiculo.marca,
                        modelo: _result.vehiculo.modelo,
                        ano: _result.vehiculo.ano,

                        //estructura
                        chasis: _result.datos.chasis,
                        color: _result.datos.color,
                        placa: _result.datos.placa,

                        //estados
                        carroceriaEstadoId: _result.estados.carroceria,
                        interiorEstadoId: _result.estados.interior,
                        motorEstadoId: _result.estados.motor,
                        gomaEstadoId: _result.estados.gomas,
                    }
                }
            });
        }
    };

    fetchTasacionImagenes = async (id) => {
        const _result = await CoreService
            .get(`${constants.FETCH_TASACION_IMAGENES_BY_ID}/${id}`);

        if (_result) {
            if (_result.data.length > 0) {
                const images = _result.data[0];
                if (images) {
                    Object.keys(images).map(function (key, index) {
                        if (images[key])
                            images[key] = `${constants.BASE_SERVICE_URL}${constants.VIEW_IMAGE_JPG}/${images[key].trim()}`
                    });
                    this.setState({ images });
                }
            }
        }
    };

    /**
     * Open Add File (Gallery or Camera)
     */
    onTakePhoto = (imageCode) => {
        try {
            const options = {
                title: 'Seleccionar Acción',
                cancelButtonTitle: 'Cancelar',
                takePhotoButtonTitle: 'Tomar Foto',
                chooseFromLibraryButtonTitle: 'Seleccionar desde Galería',
                allowsEditing: true,
                quality: 1,
                maxWidth: 500,
                maxHeight: 800,
                storageOptions: {
                    skipBackup: true,
                    path: 'images'
                }
            };

            ImagePicker.showImagePicker(options, (response) => {
                if (response.error) {
                    util.ShowAlert('Error Cargar Archivo', "Error al cargar archivo");
                } else {
                    if (response.uri) {
                        this.onRenderPhoto(imageCode, response.fileName, response.type, response.uri);
                    }
                }
            });
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
    };


    onRenderPhoto = (imageCode, filename, extension, uri) => {

        let obj = {};
        obj[imageCode] = uri;

        this.setState((prevState) => {
            return {
                ...prevState,
                images: {
                    ...prevState.images,
                    ...obj
                }
            }
        }, () => {
            this.onSavePhoto(uri, filename, extension, imageCode);
        });
    };


    onSavePhoto = (uri, filename, extension, imageCode) => {
        this.onUploadFile(uri, filename, extension, async (callbackResult) => {
            if (callbackResult) {
                const hash = callbackResult[0].hash;
                if (hash) {
                    const { params } = this.props.navigation.state;
                    const dataToSend = {
                        idSolicitud: params,
                        imageId: imageCode,
                        hash: hash
                    };

                    try {
                        const result = await CoreService
                            .post_body(constants.SAVE_TASACION_IMAGENES, dataToSend);

                        if (result.data) {
                            if (result.data === 'success') {
                                util.ShowAlert("Archivo Agregado", "Su archivo ha sido agregado correctamente");
                            }
                        }
                    } catch (ex) {
                        util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                    }
                }
            }
        });
    };

    onUploadFile = (uri, filename, extension, callback) => {
        if (uri) {
            try {
                const data = new FormData();
                data.append('photo', {
                    uri: uri,
                    type: extension,
                    name: filename
                });

                fetch(`${constants.BASE_SERVICE_URL}${constants.UPLOAD_FILE_METHOD}`, {
                    method: 'post',
                    body: data
                }).then(res => res.json()).then(res => callback(res));

            } catch (ex) {
                alert(`Error trying to upload file ${ex}`);
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

    /**
     * Component Did Mount
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        const { params } = this.props.navigation.state;
        if (params) {
            this.setState({
                id: params
            }, async () => {
                await this.fetchTasacionData(params);
                await this.fetchTasacionImagenes(params);
                await this.onSearchTasacionHandler();
                this.setState({
                    isLoading: false
                });
            });
        }
    }


    /**
     * Render Component
     * @returns {*}
     */
    render() {
        const { isLoading } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {isLoading
                    ? (<LoadingIndicator />)
                    : (
                        <View style={{ flex: 1 }}>

                            <Tabs>

                                {/*Datos Generales*/}
                                <Tab tabStyle={{ flex: 1, backgroundColor: '#eee' }} heading={
                                    <TabHeading style={{ backgroundColor: "#415262" }}>
                                        <Icon name="car" color={'#fff'} />
                                        <Text style={{ color: '#fff', marginLeft: 5 }}>Datos</Text>
                                    </TabHeading>}>
                                    <View style={{ flex: 1 }}>
                                        <ScrollView keyboardShouldPersistTaps={'always'}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Marca (*)</FormLabel>
                                                        <FormInput
                                                            value={`${this.state.solicitud.marca}`}
                                                            keyboardType={'default'}
                                                            editable={false}
                                                            onChangeText={(text) => {
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        marca: text
                                                                    }
                                                                }))
                                                            }} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Modelo (*)</FormLabel>
                                                        <FormInput
                                                            value={`${this.state.solicitud.modelo}`}
                                                            keyboardType={'default'}
                                                            editable={false}
                                                            onChangeText={(text) => {
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        modelo: text
                                                                    }
                                                                }))
                                                            }} />
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Año (*)</FormLabel>
                                                        <FormInput
                                                            value={`${this.state.solicitud.ano}`}
                                                            keyboardType={'default'}
                                                            editable={false}
                                                            onChangeText={(text) => {
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        ano: text
                                                                    }
                                                                }))
                                                            }} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Color (*)</FormLabel>
                                                        <FormInput
                                                            value={`${this.state.solicitud.color}`}
                                                            keyboardType={'default'}
                                                            onChangeText={(text) => {
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        color: text
                                                                    }
                                                                }))
                                                            }} />
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Placa (*)</FormLabel>
                                                        <FormInput
                                                            value={`${this.state.solicitud.placa}`}
                                                            keyboardType={'default'}
                                                            onChangeText={(text) => {
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        placa: text
                                                                    }
                                                                }))
                                                            }} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Chasis (*)</FormLabel>
                                                        <FormInput
                                                            value={`${this.state.solicitud.chasis}`}
                                                            keyboardType={'default'}
                                                            onChangeText={(text) => {
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        chasis: text
                                                                    }
                                                                }))
                                                            }} />
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Carrocería
                                                            (*)</FormLabel>
                                                        <Picker
                                                            style={{ marginLeft: 10 }}
                                                            selectedValue={this.state.solicitud.carroceriaEstadoId}
                                                            onValueChange={(itemValue) =>
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        carroceriaEstadoId: itemValue
                                                                    }
                                                                }))}>
                                                            <Picker.Item label='[ SELECCIONE ]' value='' />
                                                            {this.state.vehiculoEstados.map((item, index) => (
                                                                <Picker.Item label={item} value={item}
                                                                    key={index} />)
                                                            )}
                                                        </Picker>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Interior
                                                            (*)</FormLabel>
                                                        <Picker
                                                            style={{ marginLeft: 10 }}
                                                            selectedValue={this.state.solicitud.interiorEstadoId}
                                                            onValueChange={(itemValue) =>
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        interiorEstadoId: itemValue
                                                                    }
                                                                }))}>
                                                            <Picker.Item label='[ SELECCIONE ]' value='' />
                                                            {this.state.vehiculoEstados.map((item, index) => (
                                                                <Picker.Item label={item} value={item}
                                                                    key={index} />)
                                                            )}
                                                        </Picker>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Motor (*)</FormLabel>
                                                        <Picker
                                                            style={{ marginLeft: 10 }}
                                                            selectedValue={this.state.solicitud.motorEstadoId}
                                                            onValueChange={(itemValue) =>
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        motorEstadoId: itemValue
                                                                    }
                                                                }))}>
                                                            <Picker.Item label='[ SELECCIONE ]' value='' />
                                                            {this.state.vehiculoEstados.map((item, index) => (
                                                                <Picker.Item label={item} value={item}
                                                                    key={index} />)
                                                            )}
                                                        </Picker>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <FormLabel labelStyle={styles.labelStyle}>Gomas (*)</FormLabel>
                                                        <Picker
                                                            style={{ marginLeft: 10 }}
                                                            selectedValue={this.state.solicitud.gomaEstadoId}
                                                            onValueChange={(itemValue) =>
                                                                this.setState(prevState => ({
                                                                    solicitud: {
                                                                        ...prevState.solicitud,
                                                                        gomaEstadoId: itemValue
                                                                    }
                                                                }))}>
                                                            <Picker.Item label='[ SELECCIONE ]' value='' />
                                                            {this.state.vehiculoEstados.map((item, index) => (
                                                                <Picker.Item label={item} value={item}
                                                                    key={index} />)
                                                            )}
                                                        </Picker>
                                                    </View>
                                                </View>

                                                {/*****ACTION BUTTONS******/}
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ justifyContent: 'flex-end' }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ flex: 1 }}>
                                                                <TouchableNativeFeedback
                                                                    onPress={() => this.cancelSolicitud()}>
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
                                                                <TouchableNativeFeedback onPress={this.saveTasacion}>
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
                                                                        }}>
                                                                            GUARDAR CAMBIOS
                                                                        </Text>
                                                                    </View>
                                                                </TouchableNativeFeedback>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </Tab>

                                {/*Imagenes*/}
                                <Tab tabStyle={{ flex: 1, backgroundColor: '#eee' }} heading={
                                    <TabHeading style={{ backgroundColor: "#415262" }}>
                                        <Icon name="images" color={'#fff'} />
                                        <Text style={{ color: '#ffff', marginLeft: 5 }}>Imagenes</Text>
                                    </TabHeading>}>
                                    <View style={{ flex: 1 }}>
                                        <ScrollView keyboardShouldPersistTaps={'always'}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Delantera'}
                                                        photoUri={this.state.images.FotoDelantera}
                                                        onTakePhoto={() => this.onTakePhoto('FotoDelantera')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Delantera Izquierda'}
                                                        photoUri={this.state.images.FotoDelanteraIzquierda}
                                                        onTakePhoto={() => this.onTakePhoto('FotoDelanteraIzquierda')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Delantera Derecha'}
                                                        photoUri={this.state.images.FotoDelanteraDerecha}
                                                        onTakePhoto={() => this.onTakePhoto('FotoDelanteraDerecha')} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Trasera'}
                                                        photoUri={this.state.images.FotoTrasera}
                                                        onTakePhoto={() => this.onTakePhoto('FotoTrasera')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Trasera Derecha'}
                                                        photoUri={this.state.images.FotoTraseraDerecha}
                                                        onTakePhoto={() => this.onTakePhoto('FotoTraseraDerecha')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Trasera Izquierda'}
                                                        photoUri={this.state.images.FotoTraseraIzquierda}
                                                        onTakePhoto={() => this.onTakePhoto('FotoTraseraIzquierda')} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Baúl Exterior'}
                                                        photoUri={this.state.images.FotoBaulExterior}
                                                        onTakePhoto={() => this.onTakePhoto('FotoBaulExterior')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Baúl Interior'}
                                                        photoUri={this.state.images.FotoBaulInterior}
                                                        onTakePhoto={() => this.onTakePhoto('FotoBaulInterior')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Interior 1'}
                                                        photoUri={this.state.images.FotoInterior1}
                                                        onTakePhoto={() => this.onTakePhoto('FotoInterior1')} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Interior 2'}
                                                        photoUri={this.state.images.FotoInterior2}
                                                        onTakePhoto={() => this.onTakePhoto('FotoInterior2')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Interior 3'}
                                                        photoUri={this.state.images.FotoInterior3}
                                                        onTakePhoto={() => this.onTakePhoto('FotoInterior3')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Interior 4'}
                                                        photoUri={this.state.images.FotoInterior4}
                                                        onTakePhoto={() => this.onTakePhoto('FotoInterior4')} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Repuestos'}
                                                        photoUri={this.state.images.FotoRepuestos}
                                                        onTakePhoto={() => this.onTakePhoto('FotoRepuestos')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Motor Exterior'}
                                                        photoUri={this.state.images.FotoMotorExterior}
                                                        onTakePhoto={() => this.onTakePhoto('FotoMotorExterior')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Motor Interior'}
                                                        photoUri={this.state.images.FotoMotorInterior}
                                                        onTakePhoto={() => this.onTakePhoto('FotoMotorInterior')} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Kilometraje'}
                                                        photoUri={this.state.images.FotoKilometraje}
                                                        onTakePhoto={() => this.onTakePhoto('FotoKilometraje')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Chasis 1'}
                                                        photoUri={this.state.images.FotoChasis1}
                                                        onTakePhoto={() => this.onTakePhoto('FotoChasis1')} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Chasis 2'}
                                                        photoUri={this.state.images.FotoChasis2}
                                                        onTakePhoto={() => this.onTakePhoto('FotoChasis2')} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <ImageLoader title={'Techo'} photoUri={this.state.images.FotoTecho}
                                                        onTakePhoto={() => this.onTakePhoto('FotoTecho')} />
                                                </View>
                                                <View style={{ flex: 1 }}>

                                                </View>
                                                <View style={{ flex: 1 }}>

                                                </View>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </Tab>

                                {/*Calculo*/}
                                <Tab tabStyle={{ flex: 1, backgroundColor: '#eee' }} heading={
                                    <TabHeading style={{ backgroundColor: "#415262" }}>
                                        <Icon name="calculator" color={'#fff'} />
                                        <Text style={{ color: '#ffff', marginLeft: 5 }}>Calculo</Text>
                                    </TabHeading>}>
                                    <View style={{ flex: 1 }}>
                                        <ScrollView keyboardShouldPersistTaps={'always'}>
                                            <TasacionTabExtended
                                                {...this.props}
                                                searchedTasacion={this.state.searchedTasacion}
                                                isLoadingTasacion={this.state.isLoadingTasacion}
                                                tasacionData={this.state.tasacionData}
                                                marca={this.state.marca}
                                                modelo={this.state.modelo}
                                                ano={this.state.ano}
                                                anos_vehiculo={this.state.anos_vehiculo}
                                                modelos_vehiculo={this.state.modelos_vehiculo}
                                                marcas_vehiculo={this.state.marcas_vehiculo}
                                                onChangeMarca={(value) => this.onChangeMarca(value)}
                                                onChangeModelo={(value) => this.onChangeModelo(value)}
                                                onChangeAno={(value) => this.onChangeAno(value)}
                                                onClear={this.onClearTasacionHandler}
                                                onSearch={this.onSearchTasacionHandler}

                                                //supercarros
                                                onSelectItemSupercarros={this.onSelectItemSupercarrosHandler}
                                                modalSupercarrosVisible={this.state.modalSupercarrosVisible}
                                                onCloseModalSupercarros={this.onCloseModalSupercarrosHandler}
                                                onOpenModalSupercarros={this.onOpenModalSupercarrosHandler}

                                                //asocivu
                                                onSelectItemAsocivu={this.onSelectItemAsocivuHandler}
                                                modalAsocivuVisible={this.state.modalAsocivuVisible}
                                                onCloseModalAsocivu={this.onCloseModalAsocivuHandler}
                                                onOpenModalAsocivu={this.onOpenModalAsocivuHandler}
                                            />
                                        </ScrollView>
                                    </View>
                                </Tab>
                            </Tabs>
                        </View>
                    )
                }
            </View>


        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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

export {
    TasacionPage
};