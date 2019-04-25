import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableNativeFeedback,
    Modal,
    Image,
    TextInput,
    Alert
} from 'react-native';
import {ListItem, Thumbnail, Body, Left, Right, Text} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';

//Libs
import {LoadingIndicator, ToolbarActionButton} from '../../common';
import * as constants from '../../constants';
import * as globalStyle from '../../styles';
import * as util from '../../util';
import CoreService from '../../services/CoreService';

class ListAll extends Component {

    static navigationOptions = {
        title: 'Adjuntos',
        headerStyle: {
            backgroundColor: '#006266'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            descripcionValue: '',
            isModalViewed: false,
            extension: '',
            filename: '',
            photoBase64: 'N/A',
            photoUrl: 'N/A',
            adjuntos: []
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

    setModalAddAttachmentVisible(visible) {
        this.setState({isModalViewed: visible});
    }

    uploadFile = (uri, callback) => {
        if (uri) {
            try {
                const data = new FormData();
                const {filename, extension} = this.state;

                //data.append('name', 'testPhotoName');
                data.append('photo', {
                    uri: uri,
                    type: extension,
                    name: filename
                });

                fetch(`${constants.BASE_SERVICE_URL}${constants.UPLOAD_FILE_METHOD}`, {
                    method: 'post',
                    body: data
                }).then(res => res.json()).then(res => callback(res));

            } catch (ex) {
                alert(`Error trying to upload file ${ex}`);
            }
        }
    };


    /**
     * Open Add File (Gallery or Camera)
     */
    openAddFile = () => {
        try {
            const options = {
                title: 'Seleccionar Acción',
                cancelButtonTitle: 'Cancelar',
                takePhotoButtonTitle: 'Tomar Foto',
                chooseFromLibraryButtonTitle: 'Seleccionar desde Galería',
                allowsEditing: true,
                quality: 1,
                maxWidth: 500,
                maxHeight: 800,
                storageOptions: {
                    skipBackup: true,
                    path: 'images'
                }
            };

            ImagePicker.showImagePicker(options, (response) => {
                if (response.error) {
                    util.ShowAlert('Error Cargar Archivo', "Error al cargar archivo");
                } else {
                    if (response.uri) {
                        this.setState({
                            isModalViewed: true,
                            photoUrl: response.uri,
                            extension: response.type,
                            filename: response.fileName
                        });
                    }
                }
            });

        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }
    };


    /**
     * Fetch all attachments
     * @param id
     * @returns {Promise<void>}
     */
    fetchAttachments = async (id) => {
        try {
            this.setLoadingState(true);

            const result = await CoreService
                .get(`${constants.FETCH_BASE_SOLICITUD_METHOD}/${id}/attachments`);

            if (result) {
                if (result.data) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            isLoading: false,
                            adjuntos: result.data
                        }
                    });
                }
            }
        } catch (ex) {
            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
        }

        this.setLoadingState(false);
    };

    /**
     * On Open Attachment
     * @param item
     */
    onOpenAttachment = (item) => {
        const {params} = this.props.navigation.state;
        if (params && item.ID) {
            const ext = item.Ext.toLowerCase();

            //Image View
            if (ext === 'jpg' || ext === 'png') {
                this.props.navigation.navigate('AdjuntoViewImage', {
                    hash: item.Hash
                });
            }

            //Pdf View
            if (ext === 'pdf') {
                this.props.navigation.navigate('AdjuntoViewPdf', {idSolicitud: params, idAdjunto: item.ID});
            }
        }
    };

    /**
     * Save Attachment
     */
    saveAttachment = async () => {
        const {params} = this.props.navigation.state;
        const {descripcionValue, photoUrl} = this.state;

        if (params && photoUrl && descripcionValue) {

            this.uploadFile(photoUrl, async (callbackResult) => {
                if (callbackResult) {
                    const hash = callbackResult[0].hash;
                    if (hash) {
                        const dataToSend = {
                            solicitudId: params,
                            descripcion: descripcionValue,
                            hash: hash,
                            extension: 'jpg'
                        };

                        if (dataToSend) {
                            try {
                                const result = await CoreService
                                    .post_body(constants.SAVE_FILE_METHOD, dataToSend);

                                if (result.data) {
                                    if (result.data === 'success') {
                                        this.setState({isModalViewed: false});
                                        util.ShowAlert("Archivo Agregado", "Su archivo ha sido agregado correctamente");

                                        //fetch all
                                        await this.fetchAttachments(params);
                                    }
                                }
                            } catch (ex) {
                                util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                            }
                        }
                    }
                }
            });


        }
    };

    deleteAttachment = (item) => {
        const {params} = this.props.navigation.state;
        if (item.ID && params) {
            Alert.alert("Eliminar Archivo", `¿Está seguro de eliminar este archivo? (${item.Descripcion})`,
                [{
                    text: 'ELIMINAR', onPress: async () => {
                        try {
                            this.setLoadingState(true);
                            const result = await CoreService
                                .get(`${constants.DELETE_ATTACHMENT}/${params}/${item.ID}`);

                            if (result) {
                                if (result.data === 'success') {
                                    this.fetchAttachments(params);
                                    Alert.alert("Archivo Eliminado", "El archivo ha sido eliminado correctamente");
                                } else {
                                    this.setLoadingState(false);
                                }
                            }

                        } catch (ex) {
                            util.ShowAlert(constants.ERROR_TITLE, constants.ERROR_MESSAGE);
                            this.setLoadingState(false);
                        }
                    }
                },
                    {
                        text: 'CANCELAR', onPress: () => {

                        }
                    }],
                {
                    cancelable: true
                });
        }
    };


    /**
     * Render Row
     * @param item
     * @returns {*}
     * @private
     */
    _renderRow = (item) => (
        <TouchableNativeFeedback onPress={() => this.onOpenAttachment(item)}>
            <ListItem avatar>
                <Left>
                    <Thumbnail square size={40} source={require('../../images/ic_mini_image.png')}/>
                </Left>
                <Body>
                <Text>{item.Descripcion}</Text>
                <Text note>Extensión: .{item.Ext} </Text>
                </Body>
                <Right>
                    <TouchableNativeFeedback onPress={() => this.deleteAttachment(item)}>
                        <Icon name={'trash'} size={30} color={'red'}/>
                    </TouchableNativeFeedback>
                </Right>
            </ListItem>
        </TouchableNativeFeedback>
    );

    _renderAdjuntos = (adjuntos) => {
        return adjuntos.length > 0
            ? (<View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <FlatList
                            data={adjuntos}
                            keyExtractor={(item) => item.ID}
                            renderItem={({item}) => this._renderRow(item)}/>
                    </View>
                </View>
            )
            : (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: '#bdc3c7'}}>No existen adjuntos</Text>
            </View>)
    };

    _renderModalAddAttachment = () => {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.isModalViewed}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={styles.fileContainer}>
                            <Image
                                style={styles.file}
                                source={{uri: this.state.photoUrl}}
                                resizeMode={'stretch'}/>
                        </View>
                        <View>
                            <TextInput
                                multiline={true}
                                maxLength={200}
                                numberOfLines={2}
                                onChangeText={(value) => this.setState({descripcionValue: value})}
                                placeholder={'Introduzca una descripción'}/>
                        </View>
                    </View>
                    <View style={{justifyContent: 'flex-end'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <TouchableNativeFeedback onPress={() => this.setState({isModalViewed: false})}>
                                    <View style={{
                                        padding: 13,
                                        backgroundColor: '#999',
                                        elevation: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>CANCELAR</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableNativeFeedback onPress={() => this.saveAttachment()}>
                                    <View style={{
                                        padding: 13,
                                        backgroundColor: '#16a085',
                                        elevation: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>
                                            GUARDAR
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };


    componentDidMount() {
        const {params} = this.props.navigation.state;
        if (params) {
            this.fetchAttachments(params);
        }
    }

    render() {
        let {isLoading, adjuntos} = this.state;

        return (
            <View style={styles.container}>
                {isLoading
                    ? (<LoadingIndicator/>)
                    : this._renderAdjuntos(adjuntos)
                }
                <View style={{justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback onPress={() => this.openAddFile()}>
                                <View style={{
                                    padding: 13,
                                    backgroundColor: '#999',
                                    elevation: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon style={{marginRight: 5}} name={'plus-circle'} size={20} color={'#fff'}/>
                                        <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>SUBIR FOTO</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
                {this._renderModalAddAttachment()}
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyle.WhiteColor
    },
    fileContainer: {
        flex: 1,
        padding: 3
    },
    file: {
        flex: 1,
        width: undefined,
        height: undefined,
        alignSelf: 'stretch'
    }
});

export {ListAll};