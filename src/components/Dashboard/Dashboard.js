import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    RefreshControl,
    BackHandler,
    Alert,
    BackAndroid
} from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { Card, CardItem, Drawer, Badge } from 'native-base';

//components
import * as SolicitudPages from '../Solicitud';
import * as ComentarioPages from '../Comment';
import * as AdjuntoPages from '../Attachment';
import ScanQRCode from '../Addons/ScanQRCode';
import * as TasacionPage from '../Tasacion/TasacionPage';
import * as Relations from '../Relation/Relations';
import TasadorPlacaVehiculo from '../Vehiculo/TasadorPlacaVehiculo';
import VehicleListSupercarros from '../Vehiculo/VehicleListSupercarros';
import VehicleListAsocivu from '../Vehiculo/VehicleListAsocivu';

//libs
import * as globalStyles from '../../styles';
import * as util from '../../util';
import * as constants from '../../constants';
import { DashCard, DashCardSolicitud, CNavDrawer, CBarsHeaderButton } from '../../common';
import CoreService from "../../services/CoreService";

//Set StatusBar
StatusBar.setBackgroundColor(globalStyles.StatusBarColor);

//Get User-Info
const userInfo = async () => {
    return await util.GetGeneralUserInfoInStorage();
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.solicitudOnPressHandler = this.solicitudOnPressHandler.bind(this);
        this.scanQRCodeOnPressHandler = this.scanQRCodeOnPressHandler.bind(this);
        this.onTasacionPressHandler = this.onTasacionPressHandler.bind(this);

        this.state = {
            user: {},
            isRefresing: false,
            estados: {}
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<CBarsHeaderButton style={{ marginLeft: 10 }} onPress={() => {
                navigation.navigate('DrawerOpen');
            }} />)
        }
    };

    solicitudOnPressHandler() {
        this.props.navigation.navigate('Solicitudes');
    };

    scanQRCodeOnPressHandler() {
        this.props.navigation.navigate('ScanQRCode');
    };

    onTasacionPressHandler() {
        this.props.navigation.navigate('Tasacion');
    }

    /**
     * Fetch General User Info
     */
    fetchGeneralUserInfo = async () => {
        try {
            const infoResult = await CoreService
                .get(constants.FETCH_GENERAL_USER_DETAILS);

            if (infoResult) {
                if (infoResult.data) {
                    this.setEstados(infoResult.data.estados);
                }
            }
        } catch (ex) {

        }
    }

    onRefresh = async () => {
        await this.fetchGeneralUserInfo();
    };

    /**
     * Set Estados
     * @param estados
     */
    setEstados = (estados) => {

        const recibidas = estados.filter(item => item.ESTADO === "1")[0];
        const aprobadas = estados.filter(item => item.ESTADO === "5")[0];
        const rechazadas = estados.filter(item => item.ESTADO === "6")[0];

        var values = {
            recibidas: recibidas ? recibidas.TOTAL : 0,
            aprobadas: aprobadas ? aprobadas.TOTAL : 0,
            rechazadas: rechazadas ? rechazadas.TOTAL : 0,
        };

        this.setState({
            estados: values
        });
    };

    async componentDidMount() {
        const result = await util.GetGeneralUserInfoInStorage();
        if (result) {
            const obj = JSON.parse(result).estados;
            if (obj) {
                this.setEstados(obj);
            }
        }
    }

    render() {
        let { estados } = this.state;
        return (
            <RefreshControl
                style={{ flex: 1 }}
                refreshing={this.state.isRefresing}
                onRefresh={this.onRefresh}>
                <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <DashCardSolicitud
                                    onPress={this.solicitudOnPressHandler}
                                    title={'Solicitudes'}
                                    estados={estados}
                                    icon={require('../../images/solicitudes.png')} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <DashCard
                                    title={'Estadisticas'}
                                    description={'Gráficos de estados (solicitada, en trámite, anulada, etc.)'}
                                    icon={require('../../images/estadisticas.png')} />
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <DashCard
                                    onPress={this.scanQRCodeOnPressHandler}
                                    title={'Cargar Solicitud'}
                                    description={'Cargar solicitud a través del lector de código'}
                                    icon={require('../../images/camera.png')} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <DashCard
                                    title={'Configuracion'}
                                    description={'Información personal, contraseña, código de acceso, etc.'}
                                    icon={require('../../images/configuracion.png')} />
                            </View>
                        </View>
                        {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <DashCard
                                    onPress={this.onTasacionPressHandler}
                                    title={'Tasación'}
                                    description={'Módulo para inspección de vehículos, fotografías, análisis de condición del vehículo, valor mercado sugerido, tasación interna.'}
                                    icon={require('../../images/tasacion.png')} />
                            </View>
                        </View> */}
                    </View>
                    <View style={styles.notificationBarStyle}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 5, height: 4 }}>
                            <Badge
                                containerStyle={{ backgroundColor: '#ff0000' }}>
                                <Text style={{ color: globalStyles.WhiteColor }}>0</Text>
                            </Badge>
                        </View>
                        <Text style={styles.notificationBarTextStyle}>Notificaciones</Text>
                    </View>
                </View>
            </RefreshControl>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        backgroundColor: '#eee'
    },
    notificationBarStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalStyles.NotificationBarColor,
        height: 40
    },
    notificationBarTextStyle: {
        color: globalStyles.WhiteColor,
        fontWeight: 'bold',
        fontSize: 15
    }
});

const RootStack = StackNavigator(
    {
        Home: {
            screen: Dashboard
        },
        Solicitudes: {
            screen: SolicitudPages.ListAll
        },
        SolicitudDetails: {
            screen: SolicitudPages.Details
        },
        SolicitudDetailsRelation: {
            screen: SolicitudPages.DetailsRelation
        },
        Comentarios: {
            screen: ComentarioPages.ListAll
        },
        Adjuntos: {
            screen: AdjuntoPages.ListAll
        },
        AdjuntoViewImage: {
            screen: AdjuntoPages.ViewImage,
            navigationOptions: {
                header: null
            }
        },
        AdjuntoViewPdf: {
            screen: AdjuntoPages.ViewPdf,
            navigationOptions: {
                header: null
            }
        },
        ScanQRCode: {
            screen: ScanQRCode
        },
        Tasacion: {
            screen: TasacionPage.TasacionPage
        },
        Relation: {
            screen: Relations.Relations
        },
        TasadorPlacaVehiculo: {
            screen: TasadorPlacaVehiculo
        },
        VehicleListSupercarros: {
            screen: VehicleListSupercarros
        },
        VehicleListAsocivu: {
            screen: VehicleListAsocivu
        }
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            title: 'Tailor Dashboard',
            headerStyle: {
                backgroundColor: '#415262'
            },
            headerTitleStyle: {
                fontSize: 20
            },
            headerTintColor: globalStyles.WhiteColor
        }
    }
);


const MainNavigationDrawer = DrawerNavigator({
    Home: {
        screen: RootStack
    }
}, {
        contentComponent: (props) => (<CNavDrawer {...props} />)
    });


export default MainNavigationDrawer;