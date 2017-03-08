import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, SubmissionError, change } from 'redux-form'
import { withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { routerShape, locationShape } from 'react-router/lib/PropTypes'
import { autobind } from 'core-decorators'

import getValidator from '../utils/getValidator'
import hasUnsavedChanges from '../utils/hasUnsavedChanges'
import { req, resolvePath, hasPermission } from '../Crudl'
import ViewportLoading from '../components/ViewportLoading'
import Header from '../components/Header'
import TabPanel from '../components/TabPanel'
import TabList from '../components/TabList'
import ChangeViewForm from '../forms/ChangeViewForm'
import TabView from './TabView'
import { successMessage, errorMessage } from '../actions/messages'
import { cache } from '../actions/core'
import { showModalConfirm } from '../actions/frontend'
import { changeViewShape, breadcrumbsShape, viewCallsShape } from '../PropTypes'
import messages from '../messages/changeView'
import permMessages from '../messages/permissions'
import withPropsWatch from '../utils/withPropsWatch'
import getFieldDesc from '../utils/getFieldDesc'
import withViewCalls from '../utils/withViewCalls'
import blocksUI from '../decorators/blocksUI'
import normalize from '../utils/normalize'
import denormalize from '../utils/denormalize'

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
        viewCalls: viewCallsShape.isRequired,
    }

    constructor() {
        super()
        this.forceLeave = false
    }

    state = {
        selectedTab: 0,
        ready: false,
        values: {},
    };

    componentWillMount() {
        this.props.watch('location.search', this.switchTab)
        this.createForm()
        this.createTabs()
    }

    componentDidMount() {
        this.doGet()
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
    }

    createForm() {
        // Create the Form Container
        const { desc, dispatch, intl, viewCalls } = this.props
        const formSpec = {
            form: desc.id,
            validate: getValidator(desc),
            touchOnBlur: false,
            enableReinitialize: true,
        }
        const formProps = {
            desc: this.props.desc,
            onSave: data => this.handleSave(data, false),
            onSaveAndContinue: data => this.handleSave(data, true),
            onSubmitFail: () => { dispatch(errorMessage(intl.formatMessage(messages.validationError))) },
            onCancel: this.handleCancel,
            onDelete: desc.actions.delete ? this.handleDelete : undefined,
            fromRelation: viewCalls.params.fromRelation,
            labels: {
                save: intl.formatMessage(messages.save),
                saveAndBack: intl.formatMessage(messages.saveAndBack),
                saveAndContinue: intl.formatMessage(messages.saveAndContinue),
                delete: intl.formatMessage(messages.delete),
                cancel: intl.formatMessage(messages.cancel),
            },
            onAdd: this.enterAddRelation,
            onEdit: this.enterEditRelation,
        }
        this.changeViewForm = React.createElement(reduxForm(formSpec)(ChangeViewForm), formProps)
    }

    createTabs() {
        const { desc } = this.props
        // Create relation views
        this.tabViews = []
        if (desc.tabs) {
            desc.tabs.forEach((tab) => {
                this.tabViews.push(
                    React.createElement(TabView, { desc: tab })
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
    doGet() {
        const { desc, intl, dispatch } = this.props
        if (hasPermission(desc.id, 'get')) {
            this.setState({ ready: false })
            return desc.actions.get(req())
                .then((response) => {
                    const values = normalize(desc, response.data)
                    this.setState({ values, ready: true })

                    // Did we return from a relation view?
                    const { hasReturned, storedData, returnValue } = this.props.viewCalls
                    if (hasReturned) {
                        const { fieldName, relation } = storedData
                        const fieldDesc = getFieldDesc(desc, fieldName)
                        if (returnValue && fieldDesc[relation].returnValue) {
                            dispatch(change(desc.id, fieldName, fieldDesc[relation].returnValue(returnValue)))
                        }
                    }
                })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.viewNotPermitted)))
        this.setState({ ready: true, values: {} })
        return undefined
    }

    @blocksUI
    handleSave(data, stay = false) {
        const { dispatch, desc, intl } = this.props
        let preparedData

        if (hasPermission(desc.id, 'save')) {
            // Try to prepare the data.
            try {
                preparedData = denormalize(desc, data)
            } catch (error) {
                return Promise.reject(new SubmissionError(error))
            }
            return desc.actions.save(req(preparedData))
            .then((res) => {
                const values = normalize(desc, res.data)
                dispatch(cache.clearListView())
                dispatch(successMessage(intl.formatMessage(messages.saveSuccess, { item: desc.title })))
                if (!stay) {
                    this.props.viewCalls.leaveView(res.data)
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

    handleCancel() {
        this.props.viewCalls.leaveView()
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
        const { dispatch, intl, desc } = this.props
        if (hasPermission(desc.id, 'delete')) {
            return desc.actions.delete(req(data)).then(() => {
                dispatch(cache.clearListView())
                dispatch(successMessage(intl.formatMessage(messages.deleteSuccess, { item: desc.title })))
                this.forceLeave = true
                this.props.viewCalls.leaveView()
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.deleteNotPermitted)))
        return undefined
    }

    enterAddRelation(fieldDesc) {
        this.props.viewCalls.enterView(resolvePath(fieldDesc.add.path), {
            fieldName: fieldDesc.name,
            relation: 'add',
        }, { fromRelation: true })
    }

    enterEditRelation(fieldDesc) {
        this.props.viewCalls.enterView(resolvePath(fieldDesc.edit.path), {
            fieldName: fieldDesc.name,
            relation: 'edit',
        }, { fromRelation: true })
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

export default connect(mapStateToProps)(withRouter(injectIntl(withPropsWatch(withViewCalls(ChangeView)))))
