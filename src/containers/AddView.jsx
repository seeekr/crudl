import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, reset, SubmissionError, change } from 'redux-form'
import { withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { locationShape, routerShape } from 'react-router/lib/PropTypes'

import getFieldNames from '../utils/getFieldNames'
import getValidator from '../utils/getValidator'
import getInitialValues from '../utils/getInitialValues'
import hasUnsavedChanges from '../utils/hasUnsavedChanges'
import { resolvePath, req, hasPermission } from '../Crudl'
import Header from '../components/Header'
import AddViewForm from '../forms/AddViewForm'
import { successMessage, errorMessage } from '../actions/messages'
import { cache } from '../actions/core'
import { showModalConfirm } from '../actions/frontend'
import { pathShape, addViewShape, breadcrumbsShape, viewCallsShape } from '../PropTypes'
import messages from '../messages/addView'
import permMessages from '../messages/permissions'
import getFieldDesc from '../utils/getFieldDesc'
import withViewCalls from '../utils/withViewCalls'
import blocksUI from '../decorators/blocksUI'

const BACK_TO_LIST_VIEW = 0
const ADD_ANOTHER = 1
const CONTINUE_EDITING = 2
const BACK_TO_RELATION = 3

class AddView extends React.Component {

    static propTypes = {
        desc: addViewShape.isRequired,
        changeViewPath: pathShape.isRequired,
        intl: intlShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        location: locationShape.isRequired,
        router: routerShape.isRequired,
        route: React.PropTypes.object.isRequired,
        forms: React.PropTypes.object.isRequired,
        breadcrumbs: breadcrumbsShape.isRequired,
        viewCalls: viewCallsShape.isRequired,
    }

    constructor() {
        super()
        this.doLeave = this.doLeave.bind(this)
        this.routerWillLeave = this.routerWillLeave.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.enterAddRelation = this.enterAddRelation.bind(this)
        this.enterEditRelation = this.enterEditRelation.bind(this)
        this.forceLeave = false
    }

    componentWillMount() {
        // Create the Form Container
        const { desc, dispatch, intl, viewCalls } = this.props
        const formSpec = {
            form: desc.id,
            fields: getFieldNames(desc),
            validate: getValidator(desc),
            initialValues: getInitialValues(desc),
            touchOnBlur: false,
            enableReinitialize: true,
        }
        const formProps = {
            desc: this.props.desc,
            onSave: data => this.handleSave(data, viewCalls.fromRelation ? BACK_TO_RELATION : BACK_TO_LIST_VIEW),
            onSaveAndContinue: data => this.handleSave(data, CONTINUE_EDITING),
            onSaveAndAddAnother: data => this.handleSave(data, ADD_ANOTHER),
            onCancel: this.handleCancel,
            onSubmitFail: () => dispatch(errorMessage(intl.formatMessage(messages.validationError))),
            labels: {
                save: intl.formatMessage(messages.save),
                saveAndBack: intl.formatMessage(messages.saveAndBack),
                saveAndContinue: intl.formatMessage(messages.saveAndContinue),
                saveAndAddAnother: intl.formatMessage(messages.saveAndAddAnother),
                cancel: intl.formatMessage(messages.cancel),
            },
            onAdd: this.enterAddRelation,
            onEdit: this.enterEditRelation,
            fromRelation: viewCalls.fromRelation,
        }
        this.addViewForm = React.createElement(reduxForm(formSpec)(AddViewForm), formProps)
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        // Did we returne from a relation view?
        const { dispatch, desc, viewCalls } = this.props
        const { hasReturned, storedData, returnValue } = viewCalls
        if (hasReturned) {
            const { fieldName, relation } = storedData
            const fieldDesc = getFieldDesc(desc, fieldName)
            if (returnValue && fieldDesc[relation].returnValue) {
                dispatch(change(desc.id, fieldName, fieldDesc[relation].returnValue(returnValue)))
            }
        }
    }

    routerWillLeave(nextState) {
        const { forms, desc, intl } = this.props
        // Prevent leaving, if the form is dirty.
        // The leaving can however be enforced (e.g. by confirming the modal)
        if (!this.forceLeave && hasUnsavedChanges(forms[desc.id])) {
            this.props.dispatch(showModalConfirm({
                message: intl.formatMessage(messages.modalUnsavedChangesMessage),
                labelConfirm: intl.formatMessage(messages.modalUnsavedChangesLabelConfirm),
                onConfirm: () => this.doLeave(nextState),
            }))
            return false
        }
        return true
    }

    prepareData(data) {
        return this.props.desc.denormalize(data)
    }

    @blocksUI
    handleSave(data, nextStep = BACK_TO_LIST_VIEW) {
        const { changeViewPath, dispatch, desc, intl } = this.props
        if (hasPermission(desc.id, 'add')) {
            // Try to prepare the data.
            let preparedData
            try {
                 preparedData = this.prepareData(data)
            } catch (error) {
                throw Promise.reject(new SubmissionError(error))
            }

            return this.props.desc.actions.add(req(preparedData))
            .then((response) => {
                const result = response.data
                dispatch(cache.clearListView())
                dispatch(successMessage(intl.formatMessage(messages.addSuccess, { title: desc.title })))

                switch (nextStep) {
                    case BACK_TO_LIST_VIEW:
                    case BACK_TO_RELATION:
                        this.props.viewCalls.leaveView(response.data)
                        break
                    case CONTINUE_EDITING:
                        this.props.viewCalls.switchToView(resolvePath(changeViewPath, result))
                        break
                    case ADD_ANOTHER:
                        dispatch(reset(desc.id))
                        break
                    default:
                        this.props.viewCalls.leaveView()
                }
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.addNotPermitted)))
        return null
    }

    handleCancel() {
        this.props.viewCalls.leaveView()
    }

    doLeave(nextState) {
        if (nextState) {
            this.forceLeave = true
            this.props.router.push(nextState)
        }
    }

    enterAddRelation(fieldDesc) {
        this.props.viewCalls.enterRelation(resolvePath(fieldDesc.add.path), {
            fieldName: fieldDesc.name,
            relation: 'add',
        })
    }

    enterEditRelation(fieldDesc) {
        this.props.viewCalls.enterRelation(resolvePath(fieldDesc.edit.path), {
            fieldName: fieldDesc.name,
            relation: 'edit',
        })
    }

    render() {
        const { desc, breadcrumbs, intl } = this.props
        return (
            <main id="viewport">
                <Header breadcrumbs={breadcrumbs} {...this.props}>
                    <div id="header-toolbar" className="toolbar">
                        <div className="tools">&zwnj;</div>
                    </div>
                    <div className="title">
                        <h2>{desc.title}</h2>
                    </div>
                </Header>
                <div id="viewport-content">
                    {hasPermission(desc.id, 'add') ?
                        this.addViewForm
                        :
                        intl.formatMessage(permMessages.addNotPermitted)
                    }
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        forms: state.form,
    }
}

export default connect(mapStateToProps)(withRouter(injectIntl(withViewCalls(AddView))))
