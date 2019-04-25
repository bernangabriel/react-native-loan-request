import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';

//libs
import * as util from '../../util';
import {VehicleContext} from '../../context/VehicleContext';
import {withSelectVehicleContext} from '../../hoc/withSelectVehicleContext';

class VehicleListSupercarros extends Component {

    static navigationOptions = {
        title: 'Vehículos Supercarros'
    };

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    _renderItem = (item, context) => {
        return (
            <TouchableOpacity
                style={{flex: 1}}
                onPress={() => alert(JSON.stringify(this.props))}>
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
            </TouchableOpacity>
        );
    };

    componentDidMount() {
        const {params} = this.props.navigation.state;
        if (params) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    data: params
                }
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={item => item.url}
                    numColumns={2}
                    renderItem={({item}) => this._renderItem(item)}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 3
    }
});

export default withSelectVehicleContext(VehicleListSupercarros);