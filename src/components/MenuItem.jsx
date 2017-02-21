import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { routerShape } from 'react-router/lib/PropTypes'
import { autobind } from 'core-decorators'

import { hideNavigation } from '../actions/frontend'

@autobind
class MenuItem extends React.Component {

    static propTypes = {
        listPath: React.PropTypes.string,
        addPath: React.PropTypes.string,
        label: React.PropTypes.node,
        router: routerShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        isActive: React.PropTypes.bool,
    }

    handleItemClick() {
        if (this.props.listPath) {
            this.props.router.push(this.props.listPath)
            this.props.dispatch(hideNavigation())
        }
    }

    handleAddClick() {
        if (this.props.addPath) {
            this.props.router.push(this.props.addPath)
            this.props.dispatch(hideNavigation())
        }
    }

    render() {
        const { label, listPath, addPath, isActive } = this.props
        return (
            <li>
                { listPath && <a className={isActive ? 'active' : ''} onClick={this.handleItemClick}>{label}</a> }
                { addPath &&
                    <button
                        className="action-add icon-only"
                        aria-disabled="false"
                        onClick={this.handleAddClick}
                        >&zwnj;
                    </button>
                }
            </li>
        )
    }
}

export default connect()(withRouter(MenuItem))
