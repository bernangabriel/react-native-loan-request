import React from 'react';
import {
    ScrollView
} from 'react-native';
import LoadingIndicator from './LoadingIndicator';

const withSpinner = Comp => ({ isLoading, children, ...props }) => {
    if (isLoading) {
        return <LoadingIndicator isLoading={isLoading} />
    } else {
        return (
            <Comp {...props}>
                {children}
            </Comp>
        )
    }
};

export default withSpinner;