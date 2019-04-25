import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

//styles
import * as globalStyles from '../../styles';

const TextInputField = ({placeholder, value, secureTextEntry}) => (
    <View style={styles.container}>
        <TextInput
            style={styles.input}
            value={value}
            autoCorrect={false}
            secureTextEntry={secureTextEntry}
            underlineColorAndroid={globalStyles.TransparentColor}
            placeholder={placeholder}/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        textAlign: 'center',
        height: 50,
        borderWidth: 2,
        borderColor: globalStyles.TransparentColor,
        borderRadius: 10,
        backgroundColor: globalStyles.TextInputFieldBackgroundColor,
        fontSize:20,
        color:'#535c68'
    }
});

export {TextInputField};