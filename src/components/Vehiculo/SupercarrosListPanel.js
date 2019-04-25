import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import * as util from "../../util";


const SupercarrosListPanel = (props) => {
    const {data}=props;
    alert(JSON.stringify(data));
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={item => item.url}
                numColumns={2}
                renderItem={({item}) => {
                    return (<TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => alert('hi there...')}>
                        <View style={{flex: 1, margin: 5}}>
                            <View style={{elevation: 3, backgroundColor: '#fff', borderRadius: 3}}>
                                <View>
                                    <Image style={{height: 100, width: '100%'}}
                                           resizeMode={'stretch'}
                                           source={{uri: item.image}}/>
                                </View>
                                <View style={{padding: 10}}>
                                    <Text style={{fontSize: 12}}>{item.info}</Text>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '600'
                                    }}>{item.currency} {util.FormatNumberWithCommas(item.price)}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>)
                }}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default SupercarrosListPanel;