import React from 'react';
import {TouchableHighlight} from 'react-native';
import * as globalStyle from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const CBarsHeaderButton = ({style, onPress}) => {
    return (
        <TouchableHighlight onPress={onPress}>
            <Icon style={style} name={'bars'} color={globalStyle.WhiteColor} size={22}/>
        </TouchableHighlight>
    )
};

export {CBarsHeaderButton};