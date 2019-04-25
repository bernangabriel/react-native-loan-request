import React, { Component, StrictMode } from 'react';
import {
    StyleSheet,
    View,
    YellowBox
} from 'react-native';

//libs
import * as globalStyles from './styles';

//components
import Login from './components/Login/Login';

class App extends Component {

    constructor(props) {
        super(props);

        //ignore this temporally
        YellowBox.ignoreWarnings([
            'Warning: componentWillMount is deprecated',
            'Warning: componentWillReceiveProps is deprecated',
            'Warning: componentWillUpdate is deprecated',
            'Warning: isMounted(...) is deprecated',
            'The DrawerNavigator function name is deprecated',
            'The StackNavigator function name is deprecated',
            'Require cycle:'
        ]);
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
        return (
            <View style={styles.container}>
                <Login />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.WhiteColor
    }
});

export default App;