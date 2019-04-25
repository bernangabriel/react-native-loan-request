import React from 'react';
import {StyleSheet, View, Button, Image, Text, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ImageLoader = (props) => {
    let {title, onTakePhoto, photoUri} = props;
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <Text style={{margin: 5, fontSize:11}}>{title}</Text>
                <View style={{flex: 1}}>
                    <Image
                        key={new Date()}
                        style={styles.image}
                        source={{uri: photoUri}}
                        resizeMode={'stretch'}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <View style={{flex: 1}}>
                    <TouchableNativeFeedback>
                        <View style={{
                            padding: 13,
                            backgroundColor: '#c0392b',
                            elevation: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Icon name={'trash'} size={20} color={'#fff'}/>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{flex: 1}}>
                    <TouchableNativeFeedback onPress={onTakePhoto}>
                        <View style={{
                            padding: 13,
                            backgroundColor: '#2980b9',
                            elevation: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Icon name={'camera'} size={20} color={'#fff'}/>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: 280,
        padding: 0,
        borderColor: '#838383',
        borderWidth: 1
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined,
        alignSelf: 'stretch'
    }
});

export {ImageLoader};