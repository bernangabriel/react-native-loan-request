import React from 'react';
import {View, StyleSheet} from 'react-native';

import * as globalStyle from '../styles';
import {DotIndicator} from 'react-native-indicators';

const LoadingIndicator = () => (
    <View style={styles.container}>
        <DotIndicator size={12} color={'#3f5364'}/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalStyle.WhiteColor
    },
    textStyle: {
        fontSize: 20,
        fontWeight: '400',
        color: '#838383'
    }
});

export {LoadingIndicator};