import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, SubmissionError } from 'redux-form'
import { injectIntl, intlShape } from 'react-intl'
import { autobind } from 'core-decorators'

import getFieldNames from '../utils/getFieldNames'
import getValidator from '../utils/getValidator'
import getInitialValues from '../utils/getInitialValues'
import { req, hasPermission } from '../Crudl'
import AddRelationForm from '../forms/AddRelationForm'
import { successMessage, errorMessage } from '../actions/messages'
import messages from '../messages/addView'
import permMessages from '../messages/permissions'
import blocksUI from '../decorators/blocksUI'
import denormalize from '../utils/denormalize'

@autobind
class AddRelation extends React.Component {

    static propTypes = {
        desc: React.PropTypes.object.isRequired, // FIXME define the shape
        intl: intlShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
    }

    state = {
        a: 1,
    }

    componentWillMount() {
        // Create the Form Container
        const { desc, onCancel } = this.props
        const formSpec = {
            form: desc.id,
            fields: getFieldNames(desc),
            validate: getValidator(desc),
            initialValues: getInitialValues(desc),
            touchOnBlur: false,
            enableReinitialize: true,
        }
        const formProps = {
            desc,
            onSave: this.handleSave,
            onCancel,
            labels: {
                save: 'Save',
                cancel: 'Cancel',
            },
        }
        this.addRelationForm = React.createElement(reduxForm(formSpec)(AddRelationForm), formProps)
    }

    @blocksUI
    handleSave(data) {
        const { desc, onSave, dispatch, intl } = this.props
        if (hasPermission(desc.id, 'add')) {
            // Try to prepare the data.
            let preparedData
            try {
                 preparedData = denormalize(desc, data)
            } catch (error) {
                throw Promise.reject(new SubmissionError(error))
            }

            return Promise.resolve(this.props.desc.actions.add(req(preparedData)))
            .then((result) => {
                dispatch(successMessage(intl.formatMessage(messages.addSuccess, { title: desc.title })))
                onSave(result)
                return result
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.addNotPermitted)))
        return null
    }

    render() {
        const { desc } = this.props
        if (hasPermission(desc.id, 'add')) {
            return (
                <div>
                    {this.addRelationForm}
                </div>
            )
        }
        return null
    }
}

export default connect()(injectIntl(AddRelation))
