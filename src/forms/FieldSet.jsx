import React from 'react'
import { Field } from 'redux-form'

import { connect } from 'react-redux'
import FieldLoader from './FieldLoader'
import { toggleExpanded, showExpanded } from '../utils/frontend'
import getFieldNames from '../utils/getFieldNames'
import asFunc from '../utils/asFunc'
import asArray from '../utils/asArray'
import { fieldsetShape } from '../PropTypes'
import isFieldSetValid from '../selectors/isFieldSetValid'
import formFields from '../selectors/formFields'
import withPropsWatch from '../utils/withPropsWatch'


/* FIXME (Vaclav): Shouldn't this be a component instead? */

class FieldSet extends React.Component {

    static propTypes = {
        desc: fieldsetShape,
        formName: React.PropTypes.string.isRequired,
        fields: React.PropTypes.object,
        watch: React.PropTypes.func.isRequired,
        onAdd: React.PropTypes.func,
        onEdit: React.PropTypes.func,
    };

    state = {};

    componentWillMount() {
        const { desc, watch } = this.props

        if (desc.onChange) {
            asArray(desc.onChange).forEach((w) => {
                asArray(w.in).forEach((name) => {
                    watch(`fields.${name}`, props => this.handleOnChange(w, props))
                })
            })
        }
    }

    componentWillReceiveProps(props) {
        if (props.desc.title && !props.isValid) {
            showExpanded(props.id)
        }
    }

    handleOnChange(onChange, props) {
        // Select a subset of the context
        const fields = asArray(onChange.in).map(name => props.fields[name])

        // Set the props
        Promise.methode(asFunc(onChange.setProps))(...fields)
        .then((newProps) => {
            this.setState(newProps)
        })
        .catch(e => console.error(`In 'onChange.setProps' of ${props.desc.id}:`, e))
    }

    myProps() {
        const hidden = typeof this.state.hidden !== 'undefined' ? this.state.hidden : this.props.desc.hidden
        return {
            ...this.props,
            ...this.state,
            hidden,
        }
    }

    render() {
        const { id, desc, hidden, formName, onAdd, onEdit } = this.myProps()
        if (!hidden) {
            return (
                <section className="fieldset-container">
                    {desc.title && <header
                        className="fieldset-container-header"
                        aria-controls={id}
                        aria-expanded={desc.expanded}
                        onClick={() => toggleExpanded(id)}
                        ><h3>{desc.title}</h3></header>}
                    <div className="fieldset" id={id} role="region" tabIndex="-1" aria-hidden={!desc.expanded}>
                        {desc.description && <div className="fieldset-description"><div>{desc.description}</div></div>}
                        {desc.fields.map(d =>
                            <Field
                                key={d.name}
                                name={d.name}
                                desc={d}
                                label={d.label}
                                formName={formName}
                                onAdd={onAdd}
                                onEdit={onEdit}
                                component={FieldLoader}
                                />
                        )}
                    </div>
                </section>
            )
        }
        return null
    }
}

const mapStateToProps = (state, ownProps) => ({
    isValid: isFieldSetValid(ownProps.formName, getFieldNames(ownProps.desc))(state),
    fields: formFields(ownProps.formName)(state),
})

export default connect(mapStateToProps)(withPropsWatch(FieldSet))
