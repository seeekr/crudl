import React from 'react'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { locationShape, routerShape } from 'react-router/lib/PropTypes'
import { injectIntl, intlShape } from 'react-intl'

import { resolvePath, req, hasPermission } from '../Crudl'
import Header from '../components/Header'
import ListViewTableHead from '../components/ListViewTableHead'
import ListViewTableItem from '../components/ListViewTableItem'
import Pagination from '../components/Pagination'
import ActiveFilters from './ActiveFilters'
import Filters from './Filters'
import Search from './Search'
import { pathShape, listViewShape, breadcrumbsShape, viewCallsShape } from '../PropTypes'
import { toggleFilters, showFilters, hideFilters } from '../actions/frontend'
import { cache } from '../actions/core'
import { setFilters } from '../actions/filters'
import { errorMessage } from '../actions/messages'
import { getInitialSorting, queryStringToSorting, sortingToQueryString, updateSorting } from '../utils/listViewSorting'
import withPropsWatch from '../utils/withPropsWatch'
import permMessages from '../messages/permissions'
import withViewCalls from '../utils/withViewCalls'

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

export class ListView extends React.Component {

    static propTypes = {
        desc: listViewShape.isRequired,
        changeViewPath: pathShape.isRequired,
        addViewPath: pathShape,
        canAdd: React.PropTypes.func.isRequired,
        canView: React.PropTypes.func.isRequired,
        watch: React.PropTypes.func.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        filtersVisible: React.PropTypes.bool.isRequired,
        location: locationShape.isRequired,
        router: routerShape.isRequired,
        intl: intlShape.isRequired,
        breadcrumbs: breadcrumbsShape.isRequired,
        viewCalls: viewCallsShape.isRequired,
    };

    constructor() {
        super()

        this.list = this.list.bind(this)
        this.handleRequestPage = this.handleRequestPage.bind(this)
        this.handleEnterAddView = this.handleEnterAddView.bind(this)
        this.handleEnterChangeView = this.handleEnterChangeView.bind(this)
        this.handleClearSearch = this.handleClearSearch.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClearFilters = this.handleClearFilters.bind(this)
        this.handleFilters = this.handleFilters.bind(this)
        this.handleSortingChange = this.handleSortingChange.bind(this)
        this.handleRemoveActiveFilter = this.handleRemoveActiveFilter.bind(this)

        this.sorting = null
    }

    state = {
        results: [],
        pagination: undefined,
        loading: false,
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
                        { page }
                    ),
                })
            } else {
                this.list(this.props, page, combineResults)
            }
        }
    }

    handleEnterAddView() {
        this.props.viewCalls.enterView(resolvePath(this.props.addViewPath))
    }

    handleEnterChangeView(item) {
        this.props.viewCalls.enterView(resolvePath(this.props.changeViewPath, item))
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
                { s: this.props.location.query.s }
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
                this.getFilters()
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

    list(props, requestedPage, combineResults = (prev, next) => next) {
        if (hasPermission(props.desc.id, 'list')) {
            let page = requestedPage
            if (!page && props.cache.key === getCacheKey(props)) {
                props.dispatch(setFilters(this.getFilters(props)))
                this.setState(props.cache.state)
            } else {
                this.setState({ loading: true })

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
        const { desc, addViewPath, filtersVisible, canAdd, canView, breadcrumbs } = this.props
        const filters = this.getFilters()
        const searchQueries = this.getSearchQueries()
        const searched = searchQueries.search !== undefined
        const filtered = Object.keys(filters).length > 0
        const sorting = getSorting(this.props)
        return (
            <main id="viewport">
                <Header breadcrumbs={breadcrumbs} {...this.props}>
                    <div id="header-toolbar" className="toolbar">
                        <div className="tools">
                            <ul role="group" className="buttons">
                                {addViewPath && canAdd() &&
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
                            {addViewPath && canAdd() &&
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
                                onClick={() => this.hideFilters()}
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
                                            />
                                    </thead>
                                    <tbody>
                                        {this.state.results.map((item, index) =>
                                            <ListViewTableItem
                                                key={index}
                                                fields={desc.fields}
                                                data={item}
                                                onClick={canView() ? this.handleEnterChangeView : undefined}
                                                />
                                        )}
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
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
        permissions: state.core.permissions,
    }
}

export default connect(mapStateToProps)(withRouter(injectIntl(withPropsWatch(withViewCalls(ListView)))))
