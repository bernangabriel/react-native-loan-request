import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableNativeFeedback
} from 'react-native';


//libs
import * as constants from "../../constants";
import { CTextInput } from '../../common';

const Signin = (props) => {
    const { username, password, onChangeUsername, onChangePassword, authenticateUser } = props;
    return (
        <View style={{ flex: 1 }}>
            <View style={{ justifyContent: 'center', marginTop: 15, padding: 20 }}>
                <View style={{ marginBottom: -20 }}>
                    <Text style={{ fontSize: 15, fontWeight: '400', color: '#95a5a6' }}>{constants.APP_VERSION}</Text>
                </View>
                <Image
                    style={{ width: '100%', height: 100 }}
                    resizeMode={'contain'}
                    source={require('../../images/header.png')} />
            </View>
            <View style={{ marginTop: 0, paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                <CTextInput
                    style={styles.textInputStyle}
                    value={username}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    onChangeText={onChangeUsername}
                    secureTextEntry={false}
                    placeholder={'Introduzca su usuario'} />
                <View style={{ marginBottom: 10 }}></View>
                <CTextInput
                    style={styles.textInputStyle}
                    value={password}
                    onChangeText={onChangePassword}
                    secureTextEntry={true}
                    placeholder={'Introduzca su contraseña'} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TouchableNativeFeedback onPress={() => {
                        }}>
                            <View style={{
                                padding: 13,
                                backgroundColor: '#999',
                                elevation: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14 }}>LIMPIAR</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableNativeFeedback onPress={authenticateUser}>
                            <View style={{
                                padding: 13,
                                backgroundColor: '#eb008b',
                                elevation: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14 }}>ACCEDER</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textInputStyle: {
        borderRadius: 20,
        borderColor: '#bdc3c7',
        borderWidth: 2,
        fontSize: 15,
        marginBottom: 10
    }
});

export default Signin;