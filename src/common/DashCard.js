import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableNativeFeedback
} from 'react-native';
import { Card, CardItem } from 'native-base';

const DashCard = ({ icon, title, description, onPress }) => (
    <Card style={styles.card}>
        <TouchableNativeFeedback onPress={onPress}>
            <CardItem>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={styles.image}
                            source={icon}
                            resizeMode='stretch' />
                        <Text style={{ fontWeight: '400', marginTop: 10, fontSize: 17 }}>{title}</Text>
                    </View>
                    <View style={{ borderWidth: 0.5, borderColor: '#ededed', marginTop: 10 }}></View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: '#a9a9a9', fontSize: 13, textAlign: 'left' }}> {description} </Text>
                    </View>
                </View>
            </CardItem>
        </TouchableNativeFeedback>
    </Card>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        shadowColor: '#202020',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        padding: 10,
        marginBottom: 20
    },
    image: {
        alignSelf: 'center',
        height: 70,
        width: 70
    }
});

export { DashCard };