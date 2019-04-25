import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TextInput,
    Button,
    ToastAndroid
} from 'react-native';
import {Divider} from 'react-native-elements';

//Libs
import {LoadingIndicator} from '../../common';
import * as constants from '../../constants';
import * as globalStyle from '../../styles';
import * as util from '../../util';
import CoreService from '../../services/CoreService';

class ListAll extends Component {

    form = {};

    static navigationOptions = {
        title: 'Comentarios',
        headerStyle: {
            backgroundColor: '#006266'
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            comentarioValue: '',
            comentarios: []
        };
    }

    /**
     * Set Loading State
     * @param isLoading
     */
    setLoadingState(isLoading) {
        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: isLoading
            };
        });
    }

    /**
     * Show Toast Message
     * @param message
     */
    showToastMessage = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            10,
            250
        );
    };

    /**
     * Fetch all comments
     * @param id
     * @returns {Promise<void>}
     */
    fetchComments = async (id) => {
        try {
            this.setLoadingState(true);

            const result = await CoreService
                .get(`${constants.FETCH_BASE_SOLICITUD_METHOD}/${id}/comments`);

            if (result) {
                if (result.data) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            isLoading: false,
                            comentarioValue: '',
                            comentarios: result.data
                        }
                    });
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }

        this.setLoadingState(false);
    };

    saveComment = async () => {
        const {comentarioValue} = this.state;
        const {params} = this.props.navigation.state;

        if (params && comentarioValue) {
            if (comentarioValue.length >= 5) {
                try {
                    this.setLoadingState(true);
                    const data = {solicitudId: params, comentario: comentarioValue};

                    const result = await CoreService
                        .post_body(constants.SAVE_COMMENT, data);

                    if (result) {
                        if (result.data === 2) {
                            this.fetchComments(params);
                            this.showToastMessage("Comentario agregado correctamente");
                        }
                    }
                } catch (ex) {
                    util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                }
            } else {
                util.ShowAlert("Requerido", "El comentario introducido debe contener más de 5 letras.");
            }
            this.setLoadingState(false);
        }
    };

    componentDidMount() {
        const {params} = this.props.navigation.state;
        if (params) {
            this.fetchComments(params);
        }
    }

    _renderRow = (item) => (
        <View style={{padding: 5}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16, fontWeight: '500', color: '#2980b9'}}>{item.UserID}</Text>
                </View>
                <View style={{justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                    <Text style={{fontSize: 9}}> {util.formatDateTime(item.Fecha)}</Text>
                </View>
            </View>
            <View>
                <Text style={{fontSize: 12}}>{item.Comentario}</Text>
            </View>
            <View style={{marginBottom: 5}}></View>
            <Divider style={{backgroundColor: '#bdc3c7'}}/>
        </View>
    );

    _renderComentarios = (comentarios) => {
        return comentarios.length > 0
            ? (<View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <FlatList
                            data={comentarios}
                            keyExtractor={(item) => item.ID.toString()}
                            renderItem={({item}) => this._renderRow(item)}/>
                    </View>
                </View>
            )
            : (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: '#bdc3c7'}}>No existen comentarios</Text>

            </View>)
    };

    render() {
        let {isLoading, comentarios} = this.state;

        return (
            <View style={styles.container}>
                {isLoading
                    ? (<LoadingIndicator/>)
                    : this._renderComentarios(comentarios)
                }

                <View style={{alignItems: 'flex-end'}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <TextInput
                                multiline={true}
                                maxLength={499}
                                ref={(control) => this.form.comentario = control}
                                numberOfLines={2}
                                onChangeText={(value) => this.setState({comentarioValue: value})}
                                placeholder={'Introduzca su comentario'}/>
                        </View>
                        <View style={{justifyContent: 'flex-end'}}>
                            <Button
                                style={{borderRadius: 0}}
                                color={'#e30078'}
                                title={'Agregar'}
                                onPress={() => this.saveComment()}/>
                        </View>
                    </View>
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyle.WhiteColor
    }
});

export {ListAll};