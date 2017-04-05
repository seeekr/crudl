import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, SubmissionError } from 'redux-form'
import { injectIntl, intlShape } from 'react-intl'
import { autobind } from 'core-decorators'

import getFieldNames from '../utils/getFieldNames'
import getValidator from '../utils/getValidator'
import getInitialValues from '../utils/getInitialValues'
import { req, hasPermission } from '../Crudl'
import EditRelationForm from '../forms/EditRelationForm'
import { successMessage, errorMessage } from '../actions/messages'
import messages from '../messages/changeView'
import permMessages from '../messages/permissions'
import blocksUI from '../decorators/blocksUI'
import denormalize from '../utils/denormalize'
import normalize from '../utils/normalize'
import withPropsWatch from '../utils/withPropsWatch'

@autobind
class EditRelation extends React.Component {

    static propTypes = {
        desc: React.PropTypes.object.isRequired, // FIXME define the shape
        intl: intlShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired,
        watch: React.PropTypes.func.isRequired,
    }

    state = {
        ready: false,
        values: {},
    }

    componentWillMount() {
        this.props.watch('desc', (props) => {
            this.createForm(props)
            this.doGet(props)
        })
    }

    createForm(newProps) {
        const props = newProps || this.props
        // Create the Form Container
        const { desc, onCancel } = props
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
        this.editRelationForm = React.createElement(reduxForm(formSpec)(EditRelationForm), formProps)
    }

    doGet(newProps) {
        const props = newProps || this.props
        const { desc, intl, dispatch } = props
        if (hasPermission(desc.id, 'get')) {
            this.setState({ ready: false })
            return Promise.resolve(desc.actions.get(req()))
            .then((response) => {
                const values = normalize(desc, response.data)
                this.setState({ values, ready: true })
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.viewNotPermitted)))
        this.setState({ ready: true, values: {} })
        return undefined
    }

    @blocksUI
    handleSave(data) {
        const { desc, onSave, dispatch, intl } = this.props
        if (hasPermission(desc.id, 'save')) {
            // Try to prepare the data.
            let preparedData
            try {
                 preparedData = denormalize(desc, data)
            } catch (error) {
                throw Promise.reject(new SubmissionError(error))
            }

            return Promise.resolve(this.props.desc.actions.save(req(preparedData)))
            .then((result) => {
                dispatch(successMessage(intl.formatMessage(messages.saveSuccess, { item: desc.title })))
                onSave(result)
                return result
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.saveNotPermitted)))
        return null
    }

    render() {
        const { desc } = this.props
        if (hasPermission(desc.id, 'save') && this.state.ready) {
            return (
                <div>
                    {React.cloneElement(this.editRelationForm, {
                        initialValues: this.state.values,
                    })}
                </div>
            )
        }
        return null
    }
}

export default connect()(injectIntl(withPropsWatch(EditRelation)))
