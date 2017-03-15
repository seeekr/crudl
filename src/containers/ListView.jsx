import React from 'react'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { locationShape, routerShape } from 'react-router/lib/PropTypes'
import { injectIntl, intlShape } from 'react-intl'
import { autobind } from 'core-decorators'

import { resolvePath, req, hasPermission, getSiblingDesc } from '../Crudl'
import Header from '../components/Header'
import ListViewTableHead from '../components/ListViewTableHead'
import ListViewTableItem from '../components/ListViewTableItem'
import Pagination from '../components/Pagination'
import ActiveFilters from './ActiveFilters'
import Filters from './Filters'
import Search from './Search'
import { listViewShape, breadcrumbsShape, transitionStateShape } from '../PropTypes'
import { toggleFilters, showFilters, hideFilters, showModalConfirm } from '../actions/frontend'
import { cache } from '../actions/core'
import { setFilters } from '../actions/filters'
import { errorMessage } from '../actions/messages'
import { getInitialSorting, queryStringToSorting, sortingToQueryString, updateSorting } from '../utils/listViewSorting'
import withPropsWatch from '../utils/withPropsWatch'
import permMessages from '../messages/permissions'
import withTransitions from '../utils/withTransitions'
import BulkActions from '../components/BulkActions'
import asPromise from '../utils/asPromise'

function getPath(props) {
    return props.location.pathname + props.location.search
}

function getCacheKey(props) {
    return getPath(props)
}

function getSorting(props) {
    const { desc, location } = props
    const queryString = get(location.query, 's')
    if (typeof queryString === 'undefined') {
        return getInitialSorting(desc)
    }
    return queryStringToSorting(queryString)
}

/**
 * Removes falsy values from the object
 */
function clearData(obj) {
    const newObj = {}
    Object.getOwnPropertyNames(obj).forEach((name) => {
        if (obj[name]) {
            newObj[name] = obj[name]
        }
    })
    return newObj
}

@autobind
export class ListView extends React.Component {

    static propTypes = {
        desc: listViewShape.isRequired,
        watch: React.PropTypes.func.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        filtersVisible: React.PropTypes.bool.isRequired,
        location: locationShape.isRequired,
        router: routerShape.isRequired,
        intl: intlShape.isRequired,
        breadcrumbs: breadcrumbsShape.isRequired,
        transitionState: transitionStateShape.isRequired,
        transitionEnter: React.PropTypes.func.isRequired,
        transitionLeave: React.PropTypes.func.isRequired,
    };

    constructor() {
        super()
        this.sorting = null
    }

    state = {
        results: [],
        pagination: undefined,
        loading: false,
        selection: {},
        actionsEnabled: false, // Prevents action re-execution on page releoad
    };

    componentWillMount() {
        this.props.watch('location.search', this.list)
    }

    componentDidMount() {
        if (this.props.filtersVisible) {
            this.props.dispatch(showFilters())
        } else {
            this.props.dispatch(hideFilters())
        }
    }

    componentWillUnmount() {
        this.props.dispatch(setFilters({}))
        this.props.dispatch(hideFilters())
    }

    getSearchQueries(newProps) {
        const props = newProps || this.props
        const { location, desc } = props
        const searchQueries = {}
        if (location.query && desc.search) {
            searchQueries[desc.search.name] = location.query[desc.search.name]
        }
        return clearData(searchQueries)
    }

    getFilters(newProps) {
        const props = newProps || this.props
        const { location, desc } = props
        const filters = Object.assign({}, location.query)

        // Delete page and sorting info
        delete (filters.page)
        delete (filters.s)

        // Delete search key, if provided
        if (desc.search) {
            delete (filters[desc.search.name])
        }

        return filters
    }

    getFilter(name) {
        return this.getFilters()[name]
    }

    getItemId(index) {
        return resolvePath(getSiblingDesc(this.props.desc.id, 'changeView').path, this.state.results[index])
    }

    showFilters() {
        this.props.dispatch(showFilters())
    }

    hideFilters() {
        this.props.dispatch(hideFilters())
    }

    handleRequestPage(page, combineResults, serialize = false) {
        if (page) {
            if (serialize) {
                this.props.router.push({
                    pathname: this.props.location.pathname,
                    query: Object.assign({},
                        this.getSearchQueries(),
                        this.getFilters(),
                        { s: this.props.location.query.s },
                        { page },
                    ),
                })
            } else {
                this.list(this.props, page, combineResults)
            }
        }
    }

    handleEnterAddView() {
        this.props.router.push(resolvePath(getSiblingDesc(this.props.desc.id, 'addView').path))
    }

    handleEnterChangeView(item) {
        this.props.router.push(resolvePath(getSiblingDesc(this.props.desc.id, 'changeView').path, item))
    }

    handleFilters(data) {
        const query = clearData(data)

        // Push the query string
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: Object.assign(
                {},
                query,
                this.getSearchQueries(),
                { s: this.props.location.query.s },
            ),
        })
    }

    handleClearFilters() {
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: { s: this.props.location.query.s },
        })
    }

    handleSearch(name, query) {
        const filter = {}
        filter[name] = query
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: Object.assign(
                {},
                filter,
                { s: this.props.location.query.s },
                this.getFilters(),
            ),
        })
    }

    handleClearSearch(name) {
        const filters = this.getFilters()
        delete (filters[name])
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: { s: this.props.location.query.s, ...filters },
        })
    }

    handleSortingChange(sortItem) {
        const newSorting = updateSorting(getSorting(this.props), sortItem)
        let newQueryString = sortingToQueryString(newSorting)

        if (newQueryString === sortingToQueryString(getInitialSorting(this.props.desc))) {
            newQueryString = undefined
        }

        this.props.router.push({
            pathname: this.props.location.pathname,
            query: Object.assign(this.props.location.query, { s: newQueryString }),
        })
    }

    handleRemoveActiveFilter(name) {
        const filters = this.getFilters()
        delete (filters[name])
        this.handleFilters(filters)
    }

    handleSelectItemChange(itemId, itemData) {
        const selection = Object.assign({}, this.state.selection)
        if (selection[itemId]) {
            delete selection[itemId]
        } else {
            selection[itemId] = itemData
        }
        this.setState({ selection })
    }

    handleSelectAllChange() {
        const selection = {}
        if (Object.keys(this.state.selection).length < this.state.results.length) {
            this.state.results.forEach((item, index) => {
                selection[this.getItemId(index)] = item
            })
        }
        this.setState({ selection })
    }

    handleApplyBulkAction(action) {
        const { dispatch, desc } = this.props
        // Show modal dialog if required
        if (desc.bulkActions[action].modalConfirm) {
            dispatch(showModalConfirm({
                message: desc.bulkActions[action].modalConfirm.message,
                labelConfirm: desc.bulkActions[action].modalConfirm.labelConfirm,
                labelCancel: desc.bulkActions[action].modalConfirm.labelCancel,
                modalType: desc.bulkActions[action].modalConfirm.modalType,
                onConfirm: () => this.doApplyBulkAction(action),
            }))
        } else {
            this.doApplyBulkAction(action)
        }
    }

    doApplyBulkAction(actionName) {
        const { desc, transitionEnter, breadcrumbs } = this.props
        const bulkAction = desc.bulkActions[actionName]
        // The selected items as an array
        const selectedItems = Object.keys(this.state.selection).map(key => this.state.selection[key])

        if (bulkAction.before) {
            asPromise(bulkAction.before(req(), selectedItems))
            .then(result =>
                transitionEnter(
                    desc.intermediateView.id,
                    { // params for the intermediate page view
                        breadcrumbs,
                        title: bulkAction.description || actionName,
                        result,
                    },
                    { // storedData
                        actionName,
                        selectedItems,
                    },
                ),
            )
        }
    }

    list(props, requestedPage, combineResults = (prev, next) => next) {
        if (props.transitionState.hasReturned) {
            console.log('Has returned!');
            const { returnValue, storedData } = props.transitionState
            if (returnValue.proceed) {
                const bulkAction = props.desc.bulkActions[storedData.actionName]
                asPromise(bulkAction.action(req(), storedData.selectedItems))
                .then(() => {
                    console.log(`Action ${storedData.actionName} completed!`);
                })
            } else {
                console.log('Action canceled');
            }
        }
        if (hasPermission(props.desc.id, 'list')) {
            let page = requestedPage
            if (!page && props.cache.key === getCacheKey(props)) {
                props.dispatch(setFilters(this.getFilters(props)))
                this.setState(props.cache.state)
            } else {
                this.setState({ loading: true, selection: {} })

                // Collect filters (filters and search queries)
                let filters = this.getSearchQueries(props)
                if (props.desc.filters) {
                    filters = { ...filters, ...props.desc.filters.denormalize(this.getFilters(props)) }
                }

                if (!page) {
                    // Look in the query for a page
                    page = props.location.query.page
                }

                // Create the request
                const request = req()
                    .getPage(page)
                    .sort(getSorting(props))
                    .withFilters(filters)

                // Do the action
                this.props.desc.actions.list(request)
                .then((res) => {
                    const normalized = props.desc.normalize(res.data)
                    const pagination = res.pagination
                    const results = combineResults(this.state.results, normalized)
                    const state = {
                        loading: false,
                        results,
                        pagination,
                    }
                    props.dispatch(cache.setListView({ key: getCacheKey(props), state }))
                    props.dispatch(setFilters(filters))
                    this.setState(state)
                })

                .catch(() => {
                    this.setState({ loading: false })
                })
            }
        } else {
            props.dispatch(errorMessage(this.props.intl.formatMessage(permMessages.viewNotPermitted)))
        }
    }

    render() {
        const { desc, filtersVisible, breadcrumbs } = this.props
        const filters = this.getFilters()
        const searchQueries = this.getSearchQueries()
        const searched = searchQueries.search !== undefined
        const filtered = Object.keys(filters).length > 0
        const sorting = getSorting(this.props)
        const nSelected = Object.keys(this.state.selection).length
        const addViewDesc = getSiblingDesc(desc.id, 'addView')
        const changeViewDesc = getSiblingDesc(desc.id, 'changeView')
        return (
            <main id="viewport">
                <Header breadcrumbs={breadcrumbs} {...this.props}>
                    <div id="header-toolbar" className="toolbar">
                        <div className="tools">
                            <ul role="group" className="buttons">
                                {addViewDesc.id && hasPermission(addViewDesc.id, 'add') &&
                                    <li className="display-when-fixed">
                                        <button
                                            aria-label="Add"
                                            className="action-add icon-only"
                                            aria-disabled="false"
                                            onClick={this.handleEnterAddView}
                                            >&zwnj;</button>
                                    </li>
                                }
                                {desc.search || desc.filters ? <li className="filters">
                                    <button
                                        type="button"
                                        aria-label="Show filters"
                                        id="toggle-filters"
                                        className={`action-search icon-only
                                            active-filters-${filtered}
                                            active-search-${searched}`}
                                        aria-disabled={filtersVisible}
                                        disabled={filtersVisible}
                                        onClick={() => !filtersVisible && this.props.dispatch(toggleFilters())}
                                        >&zwnj;</button></li> : null}
                            </ul>
                        </div>
                    </div>
                    <div className="title">
                        <h2>{desc.title}</h2>
                        <ul role="group" className="buttons object-tools">
                            {addViewDesc.id && hasPermission(addViewDesc.id, 'add') &&
                                <li>
                                    <button
                                        aria-label="Add"
                                        className="action-add icon-only"
                                        aria-disabled="false"
                                        onClick={this.handleEnterAddView}
                                        >&zwnj;</button>
                                </li>
                            }
                        </ul>
                    </div>
                </Header>
                {desc.search || desc.filters ?
                    <aside id="sidebar" role="group">
                        <header>
                            <h3>{desc.filters ? 'Filters' : null}</h3>
                            <button
                                type="button"
                                aria-label="Hide filters"
                                className="action-search icon-only"
                                onClick={this.hideFilters}
                                >&zwnj;</button>
                        </header>
                        {desc.search &&
                            <Search
                                name={desc.search.name}
                                setQuery={searchQueries[desc.search.name]}
                                onClear={this.handleClearSearch}
                                onSearch={this.handleSearch}
                                />
                        }
                        {desc.filters &&
                            <div id="filters" role="listbox" aria-expanded={this.props.filtersVisible}>
                                {desc.filters && <Filters
                                    desc={desc.filters}
                                    onClear={this.handleClearFilters}
                                    onSubmit={this.handleFilters}
                                    />}
                            </div>
                        }
                    </aside>
                    :
                    null
                }
                <div className="context-tools">
                    <Pagination
                        paginationComponent={desc.paginationComponent}
                        onRequestPage={this.handleRequestPage}
                        pagination={this.state.pagination}
                        results={this.state.results}
                        loading={this.state.loading}
                        filtered={filtered}
                        />
                    <ActiveFilters
                        onRemove={this.handleRemoveActiveFilter}
                        />
                </div>
                <div id="viewport-content">
                    <div className="scroll-container scroll-horizontal">
                        <div className="scroll-content">
                            {this.state.results.length > 0 &&
                                <table className="list-view-table">
                                    <thead>
                                        <ListViewTableHead
                                            onSortingChange={this.handleSortingChange}
                                            sorting={sorting}
                                            fields={desc.fields}
                                            selectEnabled={!!desc.bulkActions}
                                            onSelectAllChange={this.handleSelectAllChange}
                                            allSelected={nSelected === this.state.results.length}
                                            />
                                    </thead>
                                    <tbody>
                                        {this.state.results.map((item, index) =>
                                            <ListViewTableItem
                                                itemId={this.getItemId(index)}
                                                key={index}
                                                fields={desc.fields}
                                                data={item}
                                                onClick={hasPermission(changeViewDesc.id, 'get')
                                                    ? this.handleEnterChangeView
                                                    : undefined
                                                }
                                                selectEnabled={!!desc.bulkActions}
                                                onSelectChange={this.handleSelectItemChange}
                                                selected={!!this.state.selection[this.getItemId(index)]}
                                                />,
                                        )}
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
                {desc.bulkActions &&
                    <BulkActions
                        id={`bulkActions-${desc.id}`}
                        actions={desc.bulkActions}
                        nSelected={nSelected}
                        onApply={this.handleApplyBulkAction}
                        />
                }
                <div className="context-tools">
                    {this.state.results.length > 5 &&
                        <Pagination
                            paginationComponent={desc.paginationComponent}
                            onRequestPage={this.handleRequestPage}
                            pagination={this.state.pagination}
                            results={this.state.results}
                            loading={this.state.loading}
                            filtered={filtered}
                            />
                    }
                    {this.state.results.length > 5 &&
                        <ActiveFilters
                            onRemove={this.handleRemoveActiveFilter}
                            />
                    }
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        filtersVisible: state.frontend.filters.visible,
        cache: state.core.cache.listView,
    }
}

export default connect(mapStateToProps)(withRouter(injectIntl(withTransitions(withPropsWatch(ListView)))))
