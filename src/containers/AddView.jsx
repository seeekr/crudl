import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, reset, SubmissionError, change } from 'redux-form'
import { withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { routerShape } from 'react-router/lib/PropTypes'
import { autobind } from 'core-decorators'

import getFieldNames from '../utils/getFieldNames'
import getValidator from '../utils/getValidator'
import getInitialValues from '../utils/getInitialValues'
import hasUnsavedChanges from '../utils/hasUnsavedChanges'
import { resolvePath, req, hasPermission, getSiblingDesc } from '../Crudl'
import Header from '../components/Header'
import AddViewForm from '../forms/AddViewForm'
import { successMessage, errorMessage } from '../actions/messages'
import { cache } from '../actions/core'
import { showModalConfirm } from '../actions/frontend'
import { addViewShape, breadcrumbsShape, transitionStateShape } from '../PropTypes'
import messages from '../messages/addView'
import permMessages from '../messages/permissions'
import getFieldDesc from '../utils/getFieldDesc'
import withTransitions from '../utils/withTransitions'
import blocksUI from '../decorators/blocksUI'
import denormalize from '../utils/denormalize'

const BACK_TO_LIST_VIEW = 0
const ADD_ANOTHER = 1
const CONTINUE_EDITING = 2
const BACK_TO_RELATION = 3

@autobind
class AddView extends React.Component {

    static propTypes = {
        desc: addViewShape.isRequired,
        intl: intlShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        router: routerShape.isRequired,
        route: React.PropTypes.object.isRequired,
        forms: React.PropTypes.object.isRequired,
        breadcrumbs: breadcrumbsShape.isRequired,
        transitionState: transitionStateShape.isRequired,
        transitionEnter: React.PropTypes.func.isRequired,
        transitionLeave: React.PropTypes.func.isRequired,
    }

    constructor() {
        super()
        this.forceLeave = false
    }

    componentWillMount() {
        // Create the Form Container
        const { desc, dispatch, intl, transitionState } = this.props
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
            onSave: data => this.handleSave(data, transitionState.inProgress ? BACK_TO_RELATION : BACK_TO_LIST_VIEW),
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
            fromRelation: transitionState.inProgress,
        }
        this.addViewForm = React.createElement(reduxForm(formSpec)(AddViewForm), formProps)
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        // Did we returne from a relation view?
        const { dispatch, desc, transitionState } = this.props
        const { hasReturned, storedData, returnValue } = transitionState
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

    @blocksUI
    handleSave(data, nextStep = BACK_TO_LIST_VIEW) {
        const { dispatch, desc, intl, router } = this.props
        const listViewPath = getSiblingDesc(desc.id, 'listView').path
        const changeViewPath = getSiblingDesc(desc.id, 'changeView').path
        if (hasPermission(desc.id, 'add')) {
            // Try to prepare the data.
            let preparedData
            try {
                 preparedData = denormalize(desc, data)
            } catch (error) {
                throw Promise.reject(new SubmissionError(error))
            }

            return Promise.resolve(this.props.desc.actions.add(req(preparedData)))
            .then((response) => {
                const result = response.data
                dispatch(cache.clearListView())
                dispatch(successMessage(intl.formatMessage(messages.addSuccess, { title: desc.title })))

                switch (nextStep) {
                    case BACK_TO_LIST_VIEW:
                        router.push(resolvePath(listViewPath))
                        break
                    case CONTINUE_EDITING:
                        router.push(resolvePath(changeViewPath, result))
                        break
                    case BACK_TO_RELATION:
                        this.props.transitionLeave(response.data)
                        break
                    case ADD_ANOTHER:
                        dispatch(reset(desc.id))
                        break
                    default:
                        throw Error('Not implemented!')
                }
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.addNotPermitted)))
        return null
    }

    handleCancel() {
        this.props.transitionLeave()
    }

    doLeave(nextState) {
        if (nextState) {
            this.forceLeave = true
            this.props.router.push(nextState)
        }
    }

    enterAddRelation(fieldDesc) {
        this.props.transitionEnter(fieldDesc.add.viewId,
            { fromRelation: true, ...fieldDesc.edit.viewParams() }, // params
            { fieldName: fieldDesc.name, relation: 'add' }, // storedData
        )
    }

    enterEditRelation(fieldDesc) {
        this.props.transitionEnter(fieldDesc.edit.viewId,
            { fromRelation: true, ...fieldDesc.edit.viewParams() }, // params
            { fieldName: fieldDesc.name, relation: 'edit' }, // storedData
        )
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

export default connect(mapStateToProps)(withRouter(injectIntl(withTransitions(AddView))))
