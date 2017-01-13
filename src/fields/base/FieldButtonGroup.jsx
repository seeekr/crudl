import React from 'react'
import classNames from 'classnames'
import * as frontendUtils from '../../utils/frontend'

/* FIXME (Axel): why is this called FieldButtonGroup? the term button seems irritating ... */
/* FIXME (Axel): almost all of the props used with this component are missing with props. I
have no idea what props are needed here (but there's a lot). Lots of eslinting errors. */

export class FieldButtonGroup extends React.Component {

    static propTypes = {
        id: React.PropTypes.string.isRequired,
        meta: React.PropTypes.shape({
            touched: React.PropTypes.boolean,
            error: React.PropTypes.node,
        }).isRequired,
        layout: React.PropTypes.string,
        children: React.PropTypes.node,
    }

    constructor() {
        super()
        this.displayType = {
            focus: false,
        }
    }

    componentDidMount() {
        window.addEventListener('keyup', this.listenForEventOutside)
        window.addEventListener('click', this.listenForEventOutside)
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.listenForEventOutside)
        window.removeEventListener('click', this.listenForEventOutside)
    }

    listenForEventOutside = (e) => {
        // Use parentId to find out if event.target has a parent with a certain id
        const parentId = this.props.id
        // Close all results if event.target is not a child of parentId
        // otherwise keep visual focus
        const isChild = frontendUtils.hasParentId(e.target, parentId)
        if (!isChild) {
            frontendUtils.visuallyBlurElem(document.getElementById(this.props.id))
        } else {
            frontendUtils.visuallyFocusElem(document.getElementById(this.props.id))
        }
    };

    render() {
        const componentClass = classNames('field-button-group', this.props.layout, {
            error: this.props.meta.touched && this.props.meta.error,
        })

        return (
            <div role="group" className={componentClass} id={this.props.id}>
                {this.props.children}
            </div>
        )
    }
}

export default FieldButtonGroup
