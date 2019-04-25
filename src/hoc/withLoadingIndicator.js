import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import {LoadingIndicator} from '../common';

export function withLoadingIndicator(WrappedComponent) {
    return function withLoadingIndicatorComponent(props) {
        return (
            <View style={{flex:1}}>
                {props.isLoading === true
                    ? <LoadingIndicator/>
                    : <WrappedComponent {...props}/>}
            </View>
        );
    }
}