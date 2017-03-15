import React from 'react'
import { connect } from 'react-redux'
import last from 'lodash/last'
import { autobind } from 'core-decorators'

import { getViewComponent, getViewDesc } from '../Crudl'

function createViewLoader(defaultViewId) {
    @autobind
    class ViewLoader extends React.Component {

        static propTypes = {
            trace: React.PropTypes.array.isRequired,
        }

        render() {
            const { trace } = this.props
            const lastTrace = last(trace)
            const viewId = lastTrace ? lastTrace.to : defaultViewId
            const Component = getViewComponent(viewId)
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
