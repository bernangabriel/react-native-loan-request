import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';

import {LoadingIndicator} from '../../common';

const LoadingOverlay = (props) => {
    return (
        <View style={styles.container}>
            {props.isLoading
                ? <View style={styles.container}>
                    <LoadingIndicator/>
                </View>
                : <View style={styles.container}>{props.children}</View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default LoadingOverlay;