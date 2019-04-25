import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableNativeFeedback,
    TouchableOpacity
} from 'react-native';
import {Container, Header, Tab, Tabs, TabHeading, Icon, Text} from 'native-base';
import _ from 'underscore';

//libs
import * as constants from "../../constants";
import * as util from "../../util";
import CarService from '../../services/CarService';

//context
import {VehicleContext} from '../../context/VehicleContext';

//components
import {TasacionTab, PlacaTab} from './Tabs';


class TasadorPlacaVehiculo extends Component {

    static navigationOptions = {
        title: 'Búsqueda',
        titleStyle: {
            alignSelf: 'center',
            justifyContent: 'space-between'
        },
        headerStyle: {
            backgroundColor: '#415262',
            elevation: 0
        }
    };

    constructor(props) {
        super(props);

        this.state = {

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

            //placa
            documento: '',
            placa: '',
            isLoadingPlaca: false,
            placaData: {
                placaResult: {},
                oposicionesResult: []
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

    onChangeModelo = (value) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                modelo: value,
                searchedTasacion: false,
                isLoadingTasacion: false,
                tasacionData: {
                    myDealerNetwork: {},
                    supercarros: {},
                    asocivu: {},
                    avg: {}
                }
            }
        });
    };

    onChangeMarca = (value) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                marca: value,
                searchedTasacion: false,
                isLoadingTasacion: false,
                tasacionData: {
                    myDealerNetwork: {},
                    supercarros: {},
                    asocivu: {},
                    avg: {}
                }
            }
        }, () => {
            this.fillModelosVehiculo(value);
        });
    };

    onChangeAno = (value) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                ano: value,
                searchedTasacion: false,
                isLoadingTasacion: false,
                tasacionData: {
                    myDealerNetwork: {},
                    supercarros: {},
                    asocivu: {},
                    avg: {}
                }
            }
        });
    };


    onChangeTextDocumentoHandler = (text) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                documento: text
            }
        });
    };

    onChangeTextPlacaHandler = (text) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                placa: text
            }
        });
    };

    onClearTasacionHandler = () => {
        this.setState((prevState) => {
            return {
                modelo: '',
                marca: '',
                ano: '',
                modelos_vehiculo: [],
                searchedTasacion: false,
                isLoadingTasacion: false,
                tasacionData: {
                    myDealerNetwork: {},
                    supercarros: {},
                    asocivu: {},
                    avg: {}
                },
                modalSupercarrosVisible: false,
                modalAsocivuVisible: false
            };
        });
    };

    /**
     * On Search Tasacion Handler
     * @param marca
     * @param modelo
     * @param ano
     * @returns {Promise<void>}
     */
    onSearchTasacionHandler = async () => {

        let {marca, modelo, ano} = this.state;

        if (marca && modelo && ano) {
            const selectedMarca = this.state.marcas_vehiculo.filter(item => item.value === marca)[0].description;
            const selectedModelo = this.state.modelos_vehiculo.filter(item => item.value === modelo)[0].description;
            const selectedAno = ano;

            try {
                this.setState({isLoadingTasacion: true});
                const result = await CarService
                    .post('tasacion', {marca: selectedMarca, modelo: selectedModelo, ano: selectedAno});

                if (result.data) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            searchedTasacion: true,
                            tasacionData: result.data
                        }
                    });
                }
                this.setState({isLoadingTasacion: false});

            } catch (ex) {
                util.ShowAlert(constants.ERROR_TITLE, JSON.stringify(ex));
                this.setState({isLoadingTasacion: false});
            }
        }
    };

    /**
     * OnSearch Placa Handler
     * @returns {Promise<void>}
     */
    onSearchPlacaHandler = async () => {
        const {documento, placa} = this.state;
        if (documento && placa) {
            this.setState({isLoadingPlaca: true});
            try {
                const result = await CarService.get(`placa/${documento}/${placa}`);
                if (result.data) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            isLoadingPlaca: false,
                            placaData: {
                                ...prevState.placaData,
                                placaResult: result.data.placa,
                                oposicionesResult: result.data.oposiciones
                            }
                        };
                    });
                } else {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            isLoadingPlaca: false,
                            placaData: {
                                ...prevState.placaData,
                                placaResult: {},
                                oposicionesResult: []
                            }
                        };
                    });
                }
            } catch (ex) {
                util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                this.setState({isLoadingPlaca: false});
            }
        }
    };


    /**
     * Fill Years Vehiculo
     * @returns {Promise<void>}
     */
    fillYearsVehiculo = async () => {
        try {
            const result = await CarService.get('fill/years');
            if (result.data) {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        anos_vehiculo: result.data
                    }
                });
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
    };


    /**
     * Fill Modelos Vehiculo
     * @param modeloVehiculo
     * @returns {Promise<void>}
     */
    fillModelosVehiculo = async (modeloVehiculo) => {
        if (modeloVehiculo) {
            try {
                const result = await CarService.get('fill/models/' + modeloVehiculo);
                if (result.data) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            modelos_vehiculo: result.data
                        }
                    });
                }
            } catch (ex) {
                util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
            }
        }
    };

    /**
     * Fill Marca Vehiculo
     * @returns {Promise<void>}
     */
    fillMarcasVehiculo = async () => {
        try {
            const result = await CarService.get('fill/brands');
            if (result.data) {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        isLoadingTasacion: false,
                        marcas_vehiculo: result.data
                    }
                });
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
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
        const {vehiculos_analizados} = this.state.tasacionData.supercarros;
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
        const {vehiculos_analizados} = this.state.tasacionData.asocivu;
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
     * Component Did Mount
     */
    componentDidMount() {
        this.fillMarcasVehiculo();
        this.fillYearsVehiculo();
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
        const {placaResult, oposicionesResult} = this.state.placaData;

        return (
            <View style={styles.container}>
                <Tabs>
                    <Tab tabStyle={{flex: 1, backgroundColor: '#eee'}} heading={
                        <TabHeading style={{backgroundColor: "#415262"}}>
                            <Icon name="car"/>
                            <Text>Tasación</Text>
                        </TabHeading>}>
                        <TasacionTab
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
                    </Tab>
                    <Tab tabStyle={{flex: 1, backgroundColor: '#eee'}} heading={
                        <TabHeading style={{backgroundColor: "#415262"}}>
                            <Icon name="list"/>
                            <Text>Placa</Text>
                        </TabHeading>}>
                        <PlacaTab
                            documento={this.state.documento}
                            placa={this.state.placa}
                            placaResult={placaResult}
                            oposicionesResult={oposicionesResult}
                            isLoading={this.state.isLoadingPlaca}
                            onChangeTextDocumento={(text) => this.onChangeTextDocumentoHandler(text)}
                            onChangeTextPlaca={(text) => this.onChangeTextPlacaHandler(text)}
                            onSearch={this.onSearchPlacaHandler}/>
                    </Tab>
                </Tabs>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default TasadorPlacaVehiculo;