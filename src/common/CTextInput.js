import React from 'react';
import {
    StyleSheet,
    View,
    TextInput
} from 'react-native';
import * as globalStyles from "../styles";


const CTextInput = ({ placeholder, value, onChangeText, secureTextEntry, autoCorrect, autoCapitalize }) => (
    <View style={styles.container}>
        <View style={styles.containerBox}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                autoCorrect={autoCorrect}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                underlineColorAndroid={globalStyles.TransparentColor}
                style={styles.input}
                placeholder={placeholder} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 3,
        backgroundColor: '#eee',
        borderRadius: 10,
        elevation: 3
    },
    containerBox: {
        borderColor: '#838383',
        shadowColor: '#202020',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5
    },
    input: {
        color: '#535c68'
    }
});

export { CTextInput };
