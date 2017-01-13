import React from 'react'
import InlinesView from './InlinesView'

import { tabShape } from '../PropTypes'


/* FIXME (Vaclav): Shouldn't this be a component instead? */

class TabView extends React.Component {

    static propTypes = {
        desc: tabShape,
    }

    render() {
        return (
            <div>
                {this.props.desc.actions.list ? (
                    React.createElement(InlinesView, this.props)
                ) : (
                    <span>No corresponding view found</span>
                )}
            </div>
        )
    }
}

export default TabView
