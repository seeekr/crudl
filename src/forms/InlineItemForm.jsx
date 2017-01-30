import React from 'react'
import { connect } from 'react-redux'
import { propTypes as RFPropTypes, getFormValues } from 'redux-form'
import format from 'string-template'

import FieldSet from './FieldSet'
import { showExpanded, toggleExpanded, createFieldSetId, createInlinesItemId } from '../utils/frontend'
import saveDisabled from '../utils/saveDisabled'
import { tabShape } from '../PropTypes'

class InlineItemForm extends React.Component {

    static propTypes = {
        desc: tabShape,
        onSaveItem: React.PropTypes.func.isRequired,
        onAddItem: React.PropTypes.func.isRequired,
        onDeleteItem: React.PropTypes.func.isRequired,
        index: React.PropTypes.number.isRequired,
        ...RFPropTypes,
    };

    static defaultProps = {
        isAddForm: false,
    };

    componentDidMount() {
        if (this.props.isAddForm) {
            showExpanded(createInlinesItemId(this.props.desc.id, this.props.index))
        }
    }

    componentWillReceiveProps(props) {
        const { desc, error, index, anyTouched, invalid } = props

        if (typeof error !== 'undefined' || (anyTouched && invalid)) {
            showExpanded(createInlinesItemId(desc.id, index))
        }
    }

    saveItemHandler() {
        const { index, handleSubmit, onSaveItem } = this.props
        return (e) => {
            e.stopPropagation()
            return handleSubmit(data => onSaveItem(index, data))()
        }
    }

    addItemHandler() {
        const { index, handleSubmit, onAddItem } = this.props
        return (e) => {
            e.stopPropagation()
            return handleSubmit(data => onAddItem(index, data))()
        }
    }

    deleteItemHandler() {
        const { index, onDeleteItem, handleSubmit } = this.props
        return (e) => {
            e.stopPropagation()
            return handleSubmit(data => onDeleteItem(index, data))()
        }
    }

    render() {
        const { desc, index, isAddForm, fields, values, error, anyTouched, form } = this.props
        const submit = isAddForm ? this.addItemHandler() : this.saveItemHandler()
        const inlinesItemId = createInlinesItemId(desc.id, index)
        return (
            <section className="fieldset-container-group">
                <header
                    className="fieldset-container-group-header"
                    aria-controls={inlinesItemId}
                    aria-expanded="false"
                    onClick={() => toggleExpanded(inlinesItemId)}
                    >
                    <h2>{format(desc.itemTitle, { ord: index + 1, ...values })}&nbsp;</h2>
                    <ul role="group" className="buttons horizontal">
                        <li aria-hidden={saveDisabled(this.props)}><button
                            aria-disabled={saveDisabled(this.props)}
                            disabled={saveDisabled(this.props)}
                            type="button"
                            aria-label="Save"
                            className="action-save icon-only"
                            onClick={submit}
                            >&zwnj;</button></li>
                        <li><button
                            type="button"
                            aria-label="Delete"
                            className="action-clear icon-only"
                            onClick={this.deleteItemHandler()}
                            >&zwnj;</button></li>
                    </ul>
                </header>
                <form onSubmit={submit}>
                    {anyTouched && error &&
                        <div className="form-error">
                            {error}
                        </div>
                    }
                    <div id={inlinesItemId} role="region" tabIndex="-1" aria-hidden="true">
                        {desc.fieldsets.map((fs, i) => {
                            const fieldSetId = createFieldSetId(inlinesItemId, i)
                            return (
                                <FieldSet
                                    key={i}
                                    id={fieldSetId}
                                    desc={fs}
                                    fields={fields}
                                    formName={form}
                                    />
                            )
                        })}
                    </div>
                </form>
            </section>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    values: getFormValues(ownProps.form)(state),
})

export default connect(mapStateToProps)(InlineItemForm)
