import React from 'react'
import { connect } from 'react-redux'
import isArray from 'lodash/isArray'
import { autobind } from 'core-decorators'

import { getViewType, getViewDesc } from '../Crudl'

import AddView from './AddView'
import ChangeView from './ChangeView'
import ListView from './ListView'

function head(array = [], defaultValue = {}) {
    let h

    if (isArray(array)) {
        h = array[array.length - 1]
    }

    return h || defaultValue
}

function getComponent(viewId) {
    switch (getViewType(viewId)) {
        case 'addView':
            return AddView
        case 'changeView':
            return ChangeView
        case 'listView':
            return ListView
        default:
            throw new Error(`Couldn't find a Component for a view with the id ${viewId}`)
    }
}

function createViewLoader(defaultViewId) {
    @autobind
    class ViewLoader extends React.Component {

        static propTypes = {
            callstate: React.PropTypes.shape({
                hasReturned: React.PropTypes.bool,
                returnValue: React.PropTypes.any,
                storedData: React.PropTypes.any,
                callstack: React.PropTypes.array,
            }).isRequired,
        }

        render() {
            const { callstack } = this.props.callstate
            const Component = getComponent(head(callstack).viewId || defaultViewId)
            const desc = getViewDesc(head(callstack).viewId || defaultViewId)

            return (
                React.createElement(Component, { ...this.props, desc })
            )
        }
    }
    return connect(state => ({
        callstate: state.core.viewCalls.state,
    }))(ViewLoader)
}

export default createViewLoader
