import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableNativeFeedback
} from 'react-native';
import { Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

const DashCardSolicitud = ({ icon, title, onPress, estados }) => (
    <Card style={styles.card}>
        <TouchableNativeFeedback style={{ flex: 1 }} onPress={onPress}>
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
                    {estados &&
                        <View style={{
                            flexDirection: 'row',
                            padding: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14 }}>{estados.recibidas}</Text>
                                <Icon name={'circle'} size={17} color={'#3c8dbc'} />
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14 }}>{estados.aprobadas}</Text>
                                <Icon name={'circle'} size={17} color={'#00a65a'} />
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14 }}>{estados.rechazadas}</Text>
                                <Icon name={'circle'} size={17} color={'#dd4b39'} />
                            </View>
                        </View>
                    }
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
        margin: 20
    },
    image: {
        alignSelf: 'center',
        height: 70,
        width: 70
    }
});

export { DashCardSolicitud };