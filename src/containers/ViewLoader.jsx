import React from 'react'
import { connect } from 'react-redux'
import last from 'lodash/last'
import { autobind } from 'core-decorators'

import { getViewType, getViewDesc } from '../Crudl'

import AddView from './AddView'
import ChangeView from './ChangeView'
import ListView from './ListView'

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
            trace: React.PropTypes.array.isRequired, // eslint-disable-line
        }

        render() {
            const { trace } = this.props
            const viewId = last(trace) ? last(trace).to : defaultViewId
            const Component = getComponent(viewId)
            const desc = getViewDesc(viewId)
            return (
                React.createElement(Component, { ...this.props, desc })
            )
        }
    }
    return connect(state => ({
        trace: state.core.transitions.trace,
    }))(ViewLoader)
}

export default createViewLoader
