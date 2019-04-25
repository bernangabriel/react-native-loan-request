import React from 'react';
import {VehicleContext} from "../context/VehicleContext";

export function withSelectVehicleContext(WrappedComponent) {
    return function withSelectVehicleContextComponent(props) {
        return (
            <VehicleContext.Consumer>
                {context => <WrappedComponent {...props} context={context}/>}
            </VehicleContext.Consumer>
        );
    }
}