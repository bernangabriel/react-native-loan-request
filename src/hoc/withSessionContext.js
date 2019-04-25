import React from 'react';
import {SessionContext} from "../context/SessionContext";

export function withSessionContext(WrappedComponent) {
    return function withSessionComponent(props) {
        return (
            <SessionContext.Consumer>
                {context => <WrappedComponent {...props} context={context}/>}
            </SessionContext.Consumer>
        );
    }
}