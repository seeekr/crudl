import React from 'react'
import { autofill } from 'redux-form'
import { connect } from 'react-redux'
import get from 'lodash/get'
import classNames from 'classnames'

import asFunc from '../utils/asFunc'
import asArray from '../utils/asArray'
import asPromise from '../utils/asPromise'
import isPromise from '../utils/isPromise'
import HiddenField from '../fields/HiddenField'
import { fieldShape } from '../PropTypes'
import formFields from '../selectors/formFields'
import fieldComponents from '../fields'
import withPropsWatch from '../utils/withPropsWatch'


function fieldClassName(Component) {
    let name
    if (typeof Component === 'string') {
        name = Component.toLowerCase()
    } else {
        name = (Component.displayName || Component.name).toLowerCase()
    }
    return `type-${name}`
}

/* FIXME (Vaclav): Why is this component within containers? */
/* FIXME (Vaclav): The proptypes defined here are different to what is used with the fieldloader
with other components. */

class FieldLoader extends React.Component {

    static propTypes = {
        desc: fieldShape,
        meta: React.PropTypes.shape({
            visited: React.PropTypes.bool,
            autofilled: React.PropTypes.bool,
            touched: React.PropTypes.bool,
            error: React.PropTypes.node,
        }).isRequired,
        dispatch: React.PropTypes.func.isRequired,
        formName: React.PropTypes.string,
        fields: React.PropTypes.object.isRequired,
        watch: React.PropTypes.func.isRequired,
    };

    static defaultProps = {
        disabled: false,
        readOnly: false,
        label: '',
        helpText: '',
        error: '',
        fields: {},
    };

    state = {};

    componentWillMount() {
        const { desc, watch } = this.props

        // Create the field component
        if (typeof desc.field === 'string') {
            this.fieldComponent = fieldComponents[desc.field]
            if (!this.fieldComponent) {
                throw new Error(`Nonexisting field component ${desc.field} (in field descriptor ${desc.id}) `)
            }
        } else {
            this.fieldComponent = desc.field
        }

        // Watch for other fields if required
        if (desc.onChange) {
            asArray(desc.onChange).forEach((w) => {
                asArray(w.in).forEach((name) => {
                    watch(`fields.${name}`, props => this.handleOnChange(w, props))
                })
            })
        }

        // Try to obtain the desc.props
        const descProps = asFunc(this.props.desc.props)()
        if (typeof descProps === 'object') {
            // Did we get a promise back?
            if (isPromise(descProps)) {
                descProps.then(newProps => this.setState(newProps))
                .catch(e => console.error(`In 'props' of ${desc.id}:`, e))
            } else {
                this.state = descProps
            }
        }
    }

    handleOnChange(onChange, props) {
        // Select a subset of the context
        const fields = asArray(onChange.in).map(name => props.fields[name])

        // Set the props
        asPromise(asFunc(onChange.setProps), ...fields)
        .then(newProps => this.setState(newProps))
        .catch(e => console.error(`In 'onChange.setProps' of ${props.desc.id}:`, e))

        // Set the value
        asPromise(asFunc(onChange.setValue), ...fields)
        .then((newValue) => {
            if (typeof newValue !== 'undefined') {
                props.dispatch(autofill(props.formName, props.desc.name, newValue))
            }
        })
        .catch(e => console.error(`In 'onChange.setValue' of ${props.desc.id}:`, e))

        // Set the initialValue
        asPromise(asFunc(onChange.setInitialValue), ...fields)
        .then((initialValue) => {
            if (typeof initialValue !== 'undefined' && !props.fields[props.desc.name].initialValue) {
                if (!props.meta.visited || props.meta.autofilled) {
                    props.dispatch(autofill(props.formName, props.desc.name, initialValue))
                }
            }
        })
        .catch(e => console.error(`In 'onChange.setInitialValue' of ${props.desc.id}:`, e))
        return null
    }

    fieldProps() {
        return {
            ...this.props,
            ...this.state,
            hidden: this.props.desc.field === 'hidden' || get(this.state, 'hidden', false),
            readOnly: this.props.desc.readOnly || get(this.state, 'readOnly', false),
            disabled: this.props.desc.disabled || get(this.state, 'disabled', false),
            error: (this.props.meta.touched && this.props.meta.error) || '',
        }
    }

    render() {
        const props = this.fieldProps()
        const { desc, disabled, readOnly, error, hidden } = props

        const fieldContainerClass = classNames('field-container', fieldClassName(desc.field),
        {
            required: desc.required,
            error: !!error,
            readonly: !disabled && readOnly,
            disabled,
            hidden,
        })

        return (
            <div className={fieldContainerClass}>
                {hidden ?
                    <HiddenField {...props} />
                    :
                    React.createElement(this.fieldComponent, { ...props })
                }
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        fields: formFields(ownProps.formName)(state),
    }
}

export default connect(mapStateToProps)(withPropsWatch(FieldLoader))
