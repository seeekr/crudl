import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, SubmissionError, change } from 'redux-form'
import { withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { routerShape, locationShape } from 'react-router/lib/PropTypes'
import { autobind } from 'core-decorators'
import get from 'lodash/get'

import { req, resolvePath, hasPermission, getSiblingDesc, setViewIndexEntry } from '../Crudl'

import TabView from './TabView'
import AddRelation from './AddRelation'
import EditRelation from './EditRelation'
import ChangeViewForm from '../forms/ChangeViewForm'
import { changeViewShape, breadcrumbsShape } from '../PropTypes'

import ViewportLoading from '../components/ViewportLoading'
import Header from '../components/Header'
import TabPanel from '../components/TabPanel'
import TabList from '../components/TabList'
import BottomBar from '../components/BottomBar'

import { showModalConfirm, showBottomBar, hideBottomBar, reloadField } from '../actions/frontend'
import { successMessage, errorMessage } from '../actions/messages'
import { cache } from '../actions/core'

import messages from '../messages/changeView'
import permMessages from '../messages/permissions'

import withPropsWatch from '../utils/withPropsWatch'
import normalize from '../utils/normalize'
import denormalize from '../utils/denormalize'
import getValidator from '../utils/getValidator'
import hasUnsavedChanges from '../utils/hasUnsavedChanges'
import handleErrors from '../utils/handleErrors'

import blocksUI from '../decorators/blocksUI'

const overlayInitialState = {
    overlayVisible: false,
    overlayContent: undefined,
    overlayCancel: () => undefined,
    overlayTitle: undefined,
}

@autobind
export class ChangeView extends React.Component {

    static propTypes = {
        desc: changeViewShape,
        intl: intlShape.isRequired,
        watch: React.PropTypes.func.isRequired,
        router: routerShape.isRequired,
        location: locationShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        route: React.PropTypes.object.isRequired,
        forms: React.PropTypes.object.isRequired,
        breadcrumbs: breadcrumbsShape.isRequired,
    }

    constructor() {
        super()
        this.forceLeave = false
    }

    state = {
        selectedTab: 0,
        ready: false,
        values: {},
        ...overlayInitialState,
    };

    componentWillMount() {
        this.props.watch('location.search', this.switchTab)
        this.props.watch('desc', (props) => {
            this.createForm(props)
            this.createTabs(props)
            this.doGet(props)
        })
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
    }

    createForm(newProps) {
        const props = newProps || this.props
        // Create the Form Container
        const { desc, dispatch, intl } = props
        const formSpec = {
            form: desc.id,
            validate: getValidator(desc),
            touchOnBlur: false,
            enableReinitialize: true,
        }
        const formProps = {
            desc,
            onSave: data => this.handleSave(data, false),
            onSaveAndContinue: data => this.handleSave(data, true),
            onSubmitFail: () => { dispatch(errorMessage(intl.formatMessage(messages.validationError))) },
            onDelete: desc.actions.delete ? this.handleDelete : undefined,
            labels: {
                save: intl.formatMessage(messages.save),
                saveAndContinue: intl.formatMessage(messages.saveAndContinue),
                delete: intl.formatMessage(messages.delete),
            },
            onAdd: this.openAddRelation,
            onEdit: this.openEditRelation,
        }
        this.changeViewForm = React.createElement(reduxForm(formSpec)(ChangeViewForm), formProps)
    }

    createTabs(props) {
        const { desc } = props
        // Create relation views
        this.tabViews = []
        if (desc.tabs) {
            desc.tabs.forEach((tab) => {
                this.tabViews.push(
                    React.createElement(TabView, { desc: tab }),
                )
            })
        }
    }

    isDirty() {
        const { forms } = this.props
        // We assume here that the redux form state is not cluttered with inactive dirty forms
        // i.e. all forms in the state must either belong to this change view or they must not be dirty
        return Object.keys(forms).some(formName => hasUnsavedChanges(forms[formName]))
    }

    routerWillLeave(nextState) {
        const { dispatch, intl } = this.props
        // Prevent leaving, if the form is dirty.
        // The leaving can however be enforced (e.g. by confirming the modal)
        if (!this.forceLeave && this.isDirty()) {
            dispatch(showModalConfirm({
                message: intl.formatMessage(messages.modalUnsavedChangesMessage),
                labelConfirm: intl.formatMessage(messages.modalUnsavedChangesLabelConfirm),
                onConfirm: () => this.doLeave(nextState),
            }))
            return false
        }
        return true
    }

    doLeave(nextState) {
        if (nextState) {
            this.forceLeave = true
            this.props.router.push(nextState)
        }
    }

    @blocksUI
    doGet(props) {
        const { desc, intl, dispatch } = props
        if (hasPermission(desc.id, 'get')) {
            this.setState({ ready: false })

            return handleErrors(desc.actions.get(req()))
            .then((response) => {
                const values = normalize(desc, response)
                this.setState({ values, ready: true })
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.viewNotPermitted)))
        this.setState({ ready: true, values: {} })
        return undefined
    }

    @blocksUI
    handleSave(data, stay = false) {
        const { dispatch, desc, intl, router, location } = this.props
        let preparedData

        if (hasPermission(desc.id, 'save')) {
            // Try to prepare the data.
            try {
                preparedData = denormalize(desc, data)
            } catch (error) {
                return Promise.reject(new SubmissionError(error))
            }
            return handleErrors(desc.actions.save(req(preparedData)))
            .then((res) => {
                const values = normalize(desc, res)
                dispatch(cache.clearListView())
                dispatch(successMessage(intl.formatMessage(messages.saveSuccess, { item: desc.title })))
                if (!stay) {
                    const returnPath = get(location.state, 'returnPath')
                    const listViewPath = resolvePath(getSiblingDesc(desc.id, 'listView').path)
                    router.push(returnPath || listViewPath)
                } else {
                    this.setState({ values })
                }
            })
            .catch((error) => {
                desc.normalize(data, error) // Normalize may also throw
                throw error
            })
        }
        // Not permitted
        dispatch(errorMessage(intl.formatMessage(permMessages.saveNotPermitted)))
        return undefined
    }

    handleDelete(data) {
        const { dispatch, intl, desc } = this.props
        dispatch(showModalConfirm({
            modalType: 'modal-delete',
            message: intl.formatMessage(messages.modalDeleteMessage, { item: desc.title }),
            labelConfirm: intl.formatMessage(messages.modalDeleteLabelConfirm),
            onConfirm: () => this.doDelete(data),
        }))
    }

    @blocksUI
    doDelete(data) {
        const { dispatch, intl, desc, router, location } = this.props

        if (hasPermission(desc.id, 'delete')) {
            return handleErrors(desc.actions.delete(req(data))).then(() => {
                dispatch(cache.clearListView())
                dispatch(successMessage(intl.formatMessage(messages.deleteSuccess, { item: desc.title })))
                this.forceLeave = true
                const returnPath = get(location.state, 'returnPath')
                const listViewPath = resolvePath(getSiblingDesc(desc.id, 'listView').path)
                router.push(returnPath || listViewPath)
            })
        }

        dispatch(errorMessage(intl.formatMessage(permMessages.deleteNotPermitted)))
        return undefined
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

    switchTab(props) {
        const tab = props.location.query.tab
        if (tab) {
            this.setState({ selectedTab: parseInt(tab, 10) })
        } else {
            this.setState({ selectedTab: 0 })
        }
    }

    handleSelectTab(index) {
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: { tab: index || undefined },
        })
    }

    render() {
        const { desc, intl, breadcrumbs } = this.props
        if (!this.state.ready) {
            return (
                <ViewportLoading title={desc.title} loadingText="Loading" />
            )
        }
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
                {hasPermission(desc.id, 'get') ?
                    <div id="viewport-content">
                        {!desc.tabs && React.cloneElement(this.changeViewForm, {
                            initialValues: this.state.values,
                        })}
                        {desc.tabs &&
                            <div>
                                <TabList
                                    titles={[desc.tabtitle || desc.title].concat(desc.tabs.map(t => t.title))}
                                    selected={this.state.selectedTab}
                                    onSelectTab={this.handleSelectTab}
                                    />
                                <TabPanel index={0} hidden={this.state.selectedTab !== 0}>
                                    {React.cloneElement(this.changeViewForm, {
                                        initialValues: this.state.values,
                                    })}
                                </TabPanel>
                                {desc.tabs.map((tab, i) => (
                                    <TabPanel
                                        index={i + 1}
                                        hidden={i + 1 !== this.state.selectedTab}
                                        key={i + 1}
                                        >
                                        {this.tabViews[i]}
                                    </TabPanel>
                                ))}
                            </div>
                        }
                        <BottomBar
                            open={this.state.overlayVisible}
                            onClose={this.state.overlayCancel}
                            title={this.state.overlayTitle}
                            >
                            {this.state.overlayContent}
                        </BottomBar>
                    </div>
                    :
                    intl.formatMessage(permMessages.viewNotPermitted)
                }
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        forms: state.form,
    }
}

export default connect(mapStateToProps)(withRouter(injectIntl(withPropsWatch(ChangeView))))
