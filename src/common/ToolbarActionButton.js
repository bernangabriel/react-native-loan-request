import React from 'react';
import {StyleSheet, View, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const ToolbarActionButton = ({name, color, size, onPress, isVisible = true}) => {
    return isVisible === true
        ? (<TouchableNativeFeedback onPress={onPress}>
            <View style={{flex: 1}}>
                <Icon style={styles.iconStyle} name={name} color={color} size={size}/>
            </View>
        </TouchableNativeFeedback>)
        : (<View></View>)
};

const styles = StyleSheet.create({
    iconStyle: {
        marginLeft: 15,
        marginTop: 10,
        marginRight: 15,
        marginBottom: 10
    }
});

export {ToolbarActionButton};