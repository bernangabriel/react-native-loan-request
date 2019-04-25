import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableNativeFeedback,
    Alert,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

//Libs
import * as util from '../util';
import * as globalStyles from '../styles';
import {withSessionContext} from "../hoc/withSessionContext";

class cNavDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: {}
        };

        this.goToTasadorPlacaVehiculo = this.goToTasadorPlacaVehiculo.bind(this);
    }

    /**
     * Go to PlacaVehiculo Screen
     */
    goToTasadorPlacaVehiculo = () => {
        this.props.navigation.navigate('TasadorPlacaVehiculo');
    };

    async componentDidMount() {
        const result = await util.GetGeneralUserInfoInStorage();
        this.setState({
            userInfo: JSON.parse(result).user
        });
    }

    render() {
        const {userInfo} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 5}}>
                            <Icon name={'user-circle'} size={90} color={'#fff'}/>
                        </View>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: 20,
                                color: globalStyles.WhiteColor
                            }}>{userInfo.Nombre} {userInfo.Apellido}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: globalStyles.WhiteColor,
                                marginTop: -2
                            }}>({userInfo.CorreoElectronico})</Text>
                            <Text style={{
                                fontSize: 15,
                                color: globalStyles.WhiteColor,
                                marginTop: -2
                            }}>{userInfo.TipoUsuario}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                            style={styles.optionContainer}
                            onPress={this.goToTasadorPlacaVehiculo}>
                            <Icon style={styles.optionIcon} name={'car'} size={22}/>
                            <Text style={styles.optionText}>Tasador y Placa Vehículo</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={{justifyContent: 'flex-end'}}>
                    <TouchableNativeFeedback onPress={() => {
                        Alert.alert("Cerrar Sesión", "¿Está seguro de cerrar la sesión?", [
                            {
                                text: "LOGOUT", onPress: () => {
                                    this.props.context.onSignOut();
                                }
                            },
                            {
                                text: "CANCELAR", onPress: () => {
                                }
                            }
                        ])
                    }}>
                        <View style={{
                            padding: 13,
                            backgroundColor: '#e74c3c',
                            elevation: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>LOG OUT</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>);
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.WhiteColor
    },
    header: {
        flex: 1,
        backgroundColor: globalStyles.StatusBarColor,
        padding: 10,
        marginBottom: 10
    },
    content: {
        flex: 3
    },
    optionContainer: {
        paddingLeft: 10,
        paddingTop: 16,
        paddingRight: 10,
        paddingBottom: 13,
        flexDirection: 'row',
        borderBottomColor: '#eee',
        borderBottomWidth: 1
    },
    optionIcon: {
        marginRight: 10
    },
    optionText: {
        fontSize: 17,
        color: '#535c68'
    }
});

const CNavDrawer = withSessionContext(cNavDrawer);

export {CNavDrawer};