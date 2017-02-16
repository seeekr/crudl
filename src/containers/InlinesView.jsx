import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import format from 'string-template'
import { injectIntl, intlShape } from 'react-intl'
import { autobind } from 'core-decorators'

import getInitialValues from '../utils/getInitialValues'
import getValidator from '../utils/getValidator'
import getFieldNames from '../utils/getFieldNames'
import getAllFields from '../utils/getAllFields'
import { showAllExpanded, closeAllExpanded } from '../utils/frontend'
import { successMessage, errorMessage } from '../actions/messages'
import { showModalConfirm } from '../actions/frontend'
import { req, hasPermission } from '../Crudl'
import InlineItemForm from '../forms/InlineItemForm'
import messages from '../messages/inlinesView'
import permMessages from '../messages/permissions'
import { tabShape } from '../PropTypes'

function createForm(desc, index, mapStateToProps) {
    const formSpec = {
        form: `${desc.id}_${index}`,
        fields: getFieldNames(desc),
        validate: getValidator(desc),
        touchOnBlur: false,
        enableReinitialize: true,
    }
    return reduxForm(formSpec, mapStateToProps)(InlineItemForm)
}

/* FIXME (Vaclav): Shouldn't this be a component instead? Btw, why not TabView instead of InlinesView? */

@autobind
class InlinesView extends React.Component {

    static propTypes = {
        desc: tabShape.isRequired,
        intl: intlShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    }

    state = {
        items: [], // { form, new, data, deleted }
        message: '',
    };

    componentDidMount() {
        this.doList()
    }

    getItemTitle(index, data) {
        return format(this.props.desc.itemTitle, { ord: index + 1, ...(data || this.state.items[index].data) })
    }

    getValues(result) {
        const { desc } = this.props
        const values = {}
        getAllFields(desc).forEach((f) => {
            values[f.name] = f.getValue(result)
        })
        return values
    }

    doList() {
        const { desc, intl } = this.props
        if (hasPermission(desc.id, 'list')) {
            this.setState({ items: [] })
            desc.actions.list(req())
            .then((response) => {
                const items = []
                response.data.forEach((data, index) => {
                    items[index] = {
                        form: createForm(desc, index),
                        new: false,
                        data,
                        deleted: false,
                    }
                })
                this.setState({ items })
            })
        } else {
            this.setState({
                message: intl.formatMessage(permMessages.viewNotPermitted)
            })
        }
    }

    handleSave(index, data) {
        const { desc, dispatch, intl } = this.props
        if (hasPermission(desc.id, 'save')) {
            return desc.actions.save(req(data))
            .then((res) => {
                const items = this.state.items.slice()
                items[index].new = false
                items[index].data = res.data
                this.setState({ items })
                dispatch(successMessage(intl.formatMessage(messages.saveSuccess, {
                    item: this.getItemTitle(index, data),
                })))
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.saveNotPermitted)))
        return null
    }

    handleAdd(index, data) {
        const { desc, dispatch, intl } = this.props
        if (hasPermission(desc.id, 'add')) {
            return desc.actions.add(req(data))
            .then((res) => {
                const items = this.state.items.slice()
                items[index].new = false
                items[index].data = res.data
                this.setState({ items })
                dispatch(successMessage(intl.formatMessage(messages.addSuccess, {
                    item: this.getItemTitle(index, data),
                })))
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.addNotPermitted)))
        return null
    }

    handleDelete(index, data) {
        const { dispatch, intl } = this.props
        if (this.state.items[index].new) {
            const items = this.state.items.slice()
            items[index].deleted = true
            this.setState({ items })
        } else {
            const title = this.getItemTitle(index, data)
            dispatch(showModalConfirm({
                modalType: 'modal-delete',
                message: intl.formatMessage(messages.modalDeleteMessage, { item: title }),
                labelConfirm: intl.formatMessage(messages.modalDeleteLabelConfirm),
                onConfirm: () => this.doDelete(index, data),
            }))
        }
    }

    doDelete(index, data) {
        const { dispatch, intl, desc } = this.props
        if (hasPermission(desc.id, 'delete')) {
            const title = this.getItemTitle(index, data)
            desc.actions.delete(req(data))
            .then(() => {
                const items = this.state.items.slice()
                items[index].deleted = true
                this.setState({ items })
                dispatch(successMessage(intl.formatMessage(messages.deleteSuccess, { item: title })))
            })
            .catch(() => {
                this.props.dispatch(errorMessage(intl.formatMessage(messages.deleteFailure, { item: title })))
            })
        }
        dispatch(errorMessage(intl.formatMessage(permMessages.deleteNotPermitted)))
        return null
    }

    addItemForm() {
        this.setState({
            items: this.state.items.concat({
                form: createForm(this.props.desc, this.state.items.length),
                new: true,
                data: getInitialValues(this.props.desc),
                deleted: false,
            }),
        },
        this.state.items.filter(item => !item.deleted).length > 1 ? this.scrollToItem() : null)
    }

    scrollToItem() {
        // Scroll to the bottom of the last item of the current state
        const container = this.inlinesView
        const item = container.querySelectorAll('.fieldset-container-group:last-of-type')[0]
        const itemPosition = item.offsetTop + item.clientHeight
        document.body.scrollTop = itemPosition
    }

    handleExpandAll() {
        const container = this.inlinesView
        showAllExpanded(container)
        const groups = container.querySelectorAll('.inlines-tools')
        groups.forEach((element) => {
            element.classList.remove('state-expanded')
            element.classList.add('state-collapsed')
        })
    }
    handleCollapseAll() {
        const container = this.inlinesView
        closeAllExpanded(container)
        const groups = container.querySelectorAll('.inlines-tools')
        groups.forEach((element) => {
            element.classList.add('state-expanded')
            element.classList.remove('state-collapsed')
        })
    }

    render() {
        const { desc, dispatch, intl } = this.props
        const itemsLength = this.state.items.filter(item => !item.deleted).length
        const newItemsLength = this.state.items.filter(item => !item.new).length
        const isExpandable = itemsLength > 0 && newItemsLength > 0
        return (
            <div className="inlines-view" ref={(c) => { this.inlinesView = c }}>
                {this.state.message && <div>{this.state.message}</div>}
                <div className="inlines-tools state-expanded">
                    <ul role="group" className="buttons">
                        <li className={itemsLength > 0 ? 'opposite' : 'initial'}><button
                            onClick={this.addItemForm}
                            className="action-add"
                            >Add item</button>
                        </li>
                        {isExpandable && <li className="opposite expand-all"><button
                            onClick={() => this.handleExpandAll()}
                            aria-label="Expand all"
                            className="action-expand-all"
                            >Expand all</button>
                        </li>}
                        {isExpandable && <li className="opposite collapse-all"><button
                            onClick={() => this.handleCollapseAll()}
                            aria-label="Collapse all"
                            className="action-collapse-all"
                            >Collapse all</button>
                        </li>}
                    </ul>
                </div>
                {this.state.items.map((item, index) => {
                    if (!item.deleted) {
                        return (
                            React.createElement(item.form, {
                                key: index,
                                desc,
                                index,
                                isAddForm: item.new,
                                onSaveItem: this.handleSave,
                                onAddItem: this.handleAdd,
                                onDeleteItem: this.handleDelete,
                                onSubmitFail: () => {
                                    dispatch(errorMessage(intl.formatMessage(messages.validationError)))
                                },
                                initialValues: item.new ? item.data : this.getValues(item.data),
                            })
                        )
                    }
                    return null
                })}
                {itemsLength > 1 &&
                    <div className="inlines-tools state-expanded">
                        <ul role="group" className="buttons">
                            <li className="opposite"><button
                                onClick={this.addItemForm}
                                className="action-add"
                                >Add item</button>
                            </li>
                            {isExpandable && <li className="opposite expand-all"><button
                                onClick={() => this.handleExpandAll()}
                                aria-label="Expand all"
                                className="action-expand-all"
                                >Expand all</button>
                            </li>}
                            {isExpandable && <li className="opposite collapse-all"><button
                                onClick={() => this.handleCollapseAll()}
                                aria-label="Collapse all"
                                className="action-collapse-all"
                                >Collapse all</button>
                            </li>}
                        </ul>
                    </div>
                }
            </div>
        )
    }
}

export default connect()(injectIntl(InlinesView))
