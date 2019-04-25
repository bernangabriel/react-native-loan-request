import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const AutoSignin = (props) => {
    const {user, continueAutoSignin, accessWithAnotherAccount} = props;
    return (
        <View style={{flex: 1, backgroundColor: '#eee'}}>
            <View style={{alignItems: 'center', marginTop: 50, marginBottom: 10}}>
                <Image
                    resizeMode={'contain'}
                    style={{
                        width: 150,
                        height: 150
                    }}
                    source={require('../../images/little_logo.png')}/>
            </View>
            <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: '500', fontSize: 18}}>Hola, {user.Nombre} {user.Apellido}</Text>
                <Text>({user.TipoUsuario})</Text>
            </View>
            <View style={{flex: 1, padding: 10, marginTop: 20}}>
                <View style={{flex: 1}}>
                    <TouchableNativeFeedback onPress={continueAutoSignin}>
                        <View style={{
                            padding: 13,
                            backgroundColor: '#eb008b',
                            elevation: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10
                        }}>
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon style={{marginRight: 10}} name={'user-circle'} size={20} color={'white'}/>
                                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>CONTINUAR</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <TouchableNativeFeedback onPress={accessWithAnotherAccount}>
                            <View style={{
                                padding: 13,
                                backgroundColor: '#999',
                                elevation: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>
                                    UTILIZAR UNA CUENTA DIFERENTE
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AutoSignin;