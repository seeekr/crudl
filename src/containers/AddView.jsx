import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, reset, SubmissionError, change } from 'redux-form'
import { withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { routerShape, locationShape } from 'react-router/lib/PropTypes'
import { autobind } from 'core-decorators'
import get from 'lodash/get'

// Containers
import AddRelation from './AddRelation'
import EditRelation from './EditRelation'

// Forms
import AddViewForm from '../forms/AddViewForm'

// Components
import BottomBar from '../components/BottomBar'
import Header from '../components/Header'

// Actions
import { successMessage, errorMessage } from '../actions/messages'
import { cache } from '../actions/core'
import { showModalConfirm, showBottomBar, hideBottomBar, reloadField } from '../actions/frontend'

// Messages
import messages from '../messages/addView'
import permMessages from '../messages/permissions'

// Utils
import denormalize from '../utils/denormalize'
import getFieldNames from '../utils/getFieldNames'
import getValidator from '../utils/getValidator'
import getInitialValues from '../utils/getInitialValues'
import hasUnsavedChanges from '../utils/hasUnsavedChanges'

// Misc
import { resolvePath, req, hasPermission, getSiblingDesc, setViewIndexEntry } from '../Crudl'
import { addViewShape, breadcrumbsShape } from '../PropTypes'
import blocksUI from '../decorators/blocksUI'

const BACK_TO_LIST_VIEW = 0
const ADD_ANOTHER = 1
const CONTINUE_EDITING = 2

const overlayInitialState = {
    overlayVisible: false,
    overlayContent: undefined,
    overlayCancel: () => undefined,
    overlayTitle: undefined,
}

@autobind
class AddView extends React.Component {

    static propTypes = {
        desc: addViewShape.isRequired,
        intl: intlShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        router: routerShape.isRequired,
        location: locationShape.isRequired,
        route: React.PropTypes.object.isRequired,
        forms: React.PropTypes.object.isRequired,
        breadcrumbs: breadcrumbsShape.isRequired,
    }

    constructor() {
        super()
        this.forceLeave = false
    }

    state = {
        ...overlayInitialState,
    }

    componentWillMount() {
        // Create the Form Container
        const { desc, dispatch, intl } = this.props
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
            onSave: data => this.handleSave(data, BACK_TO_LIST_VIEW),
            onSaveAndContinue: data => this.handleSave(data, CONTINUE_EDITING),
            onSaveAndAddAnother: data => this.handleSave(data, ADD_ANOTHER),
            onSubmitFail: () => dispatch(errorMessage(intl.formatMessage(messages.validationError))),
            labels: {
                save: intl.formatMessage(messages.save),
                saveAndContinue: intl.formatMessage(messages.saveAndContinue),
                saveAndAddAnother: intl.formatMessage(messages.saveAndAddAnother),
            },
            onAdd: this.openAddRelation,
            onEdit: this.openEditRelation,
        }
        this.addViewForm = React.createElement(reduxForm(formSpec)(AddViewForm), formProps)
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
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

    closeOverlay() {
        this.props.dispatch(hideBottomBar())
        this.setState(overlayInitialState)
    }

    /**
    * Returns a promise which resolves if the user decides to proceed and rejects otherwise.
    * The overlay will be closed afterwards.
    */
    showOverlay(createComponent, overlayTitle) {
        this.props.dispatch(showBottomBar())
        return new Promise((resolve, reject) => {
            this.setState({
                overlayContent: createComponent(resolve, reject),
                overlayTitle,
                overlayVisible: true,
                overlayCancel: () => reject(),
            })
        })
        .finally(this.closeOverlay)
    }

    openRelation(viewDesc, Component) {
        // Add the relation descriptor to the index
        setViewIndexEntry(viewDesc)
        // Show an overlay
        return this.showOverlay((resolve, reject) => (
            <Component
                desc={viewDesc}
                onSave={resolve}
                onCancel={reject}
                />
        ))
    }

    openAddRelation(fieldDesc) {
        this.openRelation(fieldDesc.add, AddRelation)
        .then((result) => {
            if (!result) {
                console.warn(`The add relation of ${fieldDesc.add} returned ${result}. A field value was expected`);
                return
            }
            this.props.dispatch(change(this.props.desc.id, fieldDesc.name, result))
            this.props.dispatch(reloadField(fieldDesc.id))
        })
        .catch(() => undefined)
    }

    openEditRelation(fieldDesc) {
        this.openRelation(fieldDesc.edit, EditRelation)
        .then(() => this.props.dispatch(reloadField(fieldDesc.id)))
        .catch(() => undefined)
    }

    @blocksUI
    handleSave(data, nextStep = BACK_TO_LIST_VIEW) {
        const { dispatch, desc, intl, router, location } = this.props
        const returnPath = get(location.state, 'returnPath')
        const listViewPath = resolvePath(getSiblingDesc(desc.id, 'listView').path)
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
                        router.push(returnPath || listViewPath)
                        break
                    case CONTINUE_EDITING:
                        router.push({
                            pathname: resolvePath(changeViewPath, result),
                            state: location.state, // Preserve the state i.e. the returnPath
                        })
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

    doLeave(nextState) {
        if (nextState) {
            this.forceLeave = true
            this.props.router.push(nextState)
        }
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
                <BottomBar
                    open={this.state.overlayVisible}
                    onClose={this.state.overlayCancel}
                    title={this.state.overlayTitle}
                    >
                    {this.state.overlayContent}
                </BottomBar>
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        forms: state.form,
    }
}

export default connect(mapStateToProps)(withRouter(injectIntl(AddView)))
