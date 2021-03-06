import url from 'url'

// React, Redux, and React-Intl
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory as history } from 'react-router'
import { compose, createStore as createReduxStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer, getFormValues } from 'redux-form'
import { formatPattern } from 'react-router/lib/PatternUtils'
import { routerReducer, syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { IntlProvider } from 'react-intl'

// localStorage (persistent state)
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage'
import filter from 'redux-localstorage-filter';
import lodashMerge from 'lodash/merge'

// Containers
import App from './containers/App'
import ChangeView from './containers/ChangeView'
import ListView from './containers/ListView'
import AddView from './containers/AddView'
import Login from './containers/Login'
import Logout from './containers/Logout'
import Dashboard from './containers/Dashboard'
import PageNotFound from './containers/PageNotFound'

// Connectors
import RESTConnector from './connectors/RESTConnector'
import GraphQLConnector from './connectors/GraphQLConnector'
import TransformConnector from './connectors/TransformConnector'
import PaginationConnector from './connectors/PaginationConnector'
import DepaginationConnector from './connectors/DepaginationConnector'
import ErrorsConnector from './connectors/ErrorsConnector'
import PermissionConnector from './connectors/PermissionConnector'
import frontendConnector from './connectors/frontendConnector'

// Misc Actions
import { activeView as activeViewActions } from './actions/core'
import { pageNotFoundMessage } from './actions/frontend'

// Misc Reducers
import frontendReducer from './reducers/frontend'
import coreReducer from './reducers/core'
import messagesReducer from './reducers/messages'
import filtersReducer from './reducers/filters'

// Errors
import AuthorizationError from './errors/AuthorizationError'
import NotFoundError from './errors/NotFoundError'
import ValidationError from './errors/ValidationError'
import PermissionError from './errors/PermissionError'

// Misc crudl stuff
import wrapComponent from './utils/wrapComponent'
import validateAdmin from './utils/validateAdmin'
import Request from './connectors/Request'

import baseField from './fields/base/baseField'

import DevTools from './containers/DevTools'

function createContext(data = {}) {
    function context(name) {
        if (name) {
            return data[name]
        }
        return data
    }
    context.data = data
    return context
}

// Module variables
let admin = {}
let store = null
let viewDescIndex
const contextData = {}
export const connectors = {}
export const options = {}
export const auth = {}
export const path = { name: undefined }
export const context = createContext(contextData)


export { baseField }
export { ValidationError, AuthorizationError, NotFoundError, PermissionError }

export function log(...args) {
    if (typeof window.console !== 'undefined') {
        window.console.log(...args)
    }
}

export function resolvePath(pathname = '', item) {
    const formatted = formatPattern(pathname, item)
    return options.basePath ? url.resolve(options.basePath, formatted) : formatted
}

/**
 * Creates a request object that already has its authentication headers set
 */
export function req(data) {
    return new Request({
        data,
        headers: store.getState().core.auth.requestHeaders,
    })
}

// Redux Middleware function
function exposeStateInfo({ getState }) {
  return next => (action) => {
    const returnValue = next(action)
    const state = getState()

    // Expose
    Object.assign(auth, state.core.auth.info)
    Object.assign(contextData, getFormValues(state.core.activeView)(state))

    return returnValue
  }
}

function exposePath(nextState) {
    Object.assign(path, nextState.params, { name: nextState.location.pathname })
}


function crudlStore(reducer) {
    const storage = compose(
        filter(['core.auth', 'core.permissions']),
    )(adapter(window.localStorage))

    const composition = [
        persistState(storage),
        applyMiddleware(routerMiddleware(history), exposeStateInfo),
    ]

    if (options.debug) {
        composition.push(DevTools.instrument())
    }

    return compose(...composition)(createReduxStore)(reducer)
}

function crudlReducer() {
    // Combine all reducers
    const reducer = combineReducers({
        form: formReducer,
        frontend: frontendReducer,
        core: coreReducer,
        routing: routerReducer,
        messages: messagesReducer,
        filters: filtersReducer,
    })

    // Deep merge the persisted state
    return compose(
        mergePersistedState((initial, persisted) => lodashMerge({}, initial, persisted))
    )(reducer)
}

export function setStore(newStore) {
    store = newStore
}

export function getStore() {
    return store
}

export function createStore() {
    return crudlStore(crudlReducer())
}

function createViewDescIndex() {
    if (!admin.isValidated) {
        throw new Error('Expected admin to be validated. Did you maybe forget to call \'setAdmin()\'?')
    }
    viewDescIndex = {}
    Object.keys(admin.views).forEach((groupName) => {
        const group = admin.views[groupName]
        if (group.listView) {
            viewDescIndex[group.listView.id] = group.listView
        }
        if (group.addView) {
            viewDescIndex[group.addView.id] = group.addView
        }
        if (group.changeView) {
            viewDescIndex[group.changeView.id] = group.changeView
            if (group.changeView.tabs) {
                group.changeView.tabs.forEach((tab) => {
                    viewDescIndex[tab.id] = tab
                })
            }
        }
    })
}

export function getViewDesc(viewId) {
    if (!viewDescIndex) {
        createViewDescIndex()
    }
    return viewDescIndex[viewId]
}

/**
* Checks permission for a given action on the given view
*/
export function hasPermission(viewId, actionName) {
    const desc = getViewDesc(viewId)
    const state = store.getState()
    const permissions = Object.assign({}, desc.permissions, state.core.permissions[viewId])
    return typeof permissions[actionName] === 'undefined' || permissions[actionName]
}

/**
* Creates a connector according to its specification.
*/
function createConnector(spec, admin) { // eslint-disable-line no-shadow
    // Endpoint id
    if (typeof spec === 'string') {
        // NOTE: consider a reuse of connectors
        return createConnector(admin.connectors.find(c => c.id === spec), admin)
    }

    // Connector admin
    if (typeof spec === 'object') {
        let cx = null

        // Endpoint connector?
        if (spec.url) cx = new RESTConnector(spec)
        if (spec.query) cx = new GraphQLConnector(spec)
        // Simple connector?
        if (spec.use) cx = createConnector(spec.use, admin)
        // Bare Connector?
        if (!cx) {
            cx = spec
        }

        // Pagination?
        if (spec.pagination) cx = new PaginationConnector(cx, spec.pagination)
        // Any data transformation?
        if (spec.transform) cx = new TransformConnector(cx, spec.transform)
        // Depagination?
        if (spec.enableDepagination) cx = new DepaginationConnector(cx)

        cx = new ErrorsConnector(
            cx,
            (...args) => getStore().dispatch(...args),
            (typeof admin.auth !== 'undefined') ? resolvePath(admin.auth.logout.path) : undefined,
            resolvePath(admin.custom.pageNotFound.path),
        )

        cx = new PermissionConnector(cx, admin, (...args) => getStore().dispatch(...args))

        return frontendConnector(cx)
    }
    throw new Error('An invalid connector specification')
}

export function setAdmin(adminToBeValidated) {
    admin = validateAdmin(adminToBeValidated)
    Object.assign(options, admin.options)
    // Create connector instances
    Object.keys(admin.connectors).forEach((name) => {
        connectors[name] = createConnector(admin.connectors[name], admin)
    })
}

function authenticate(wrappedFunc) {
    return function authCheck(nextState, replace) {
        if ((typeof admin.auth !== 'undefined') && !store.getState().core.auth.loggedIn) {
            replace({
                pathname: resolvePath(admin.auth.login.path),
                query: { next: nextState.location.pathname },
            })
        } else if (wrappedFunc) {
            wrappedFunc.call(this, nextState, replace)
        }
    }
}

function setActiveView(id, wrappedFunc) {
    return (nextState, replace) => {
        store.dispatch(activeViewActions.set(id));
        if (wrappedFunc) {
           wrappedFunc.call(this, nextState, replace)
       }
    }
}

function clearActiveView() {
    store.dispatch(activeViewActions.clear())
}

function crudlRouter() {
    const appCrumb = { name: admin.title, path: admin.options.basePath }
    // build the route config:
    const root = {
        path: options.basePath,
        component: wrapComponent(App, { desc: admin }),
        childRoutes: [],
        indexRoute: {
            component: wrapComponent(Dashboard, { desc: admin, breadcrumbs: [appCrumb] }),
            onEnter: authenticate(clearActiveView),
        },
        onEnter: exposePath,
        onChange: (prevState, nextState) => exposePath(nextState),
    }

    // add routes for resources and for collections
    Object.keys(admin.views).forEach((view) => {
        const { listView, addView, changeView } = admin.views[view]
        const listViewCrumb = { name: listView.title, path: listView.path }
        const changeViewCrumb = { name: changeView.title, path: '' }
        const addViewCrumb = addView && { name: addView.title, path: '' }
        // Collection (ListView)
        root.childRoutes.push({
            path: listView.path,
            onEnter: authenticate(setActiveView(listView.id)),
            component: wrapComponent(ListView, {
                desc: listView,
                changeViewPath: changeView.path,
                addViewPath: addView && addView.path,
                canAdd: () => hasPermission(addView.id, 'add'),
                canView: () => hasPermission(changeView.id, 'get'),
                breadcrumbs: [appCrumb, listViewCrumb],
            }),
        })

        // Add New (AddView)
        if (addView) {
            root.childRoutes.push({
                path: addView.path,
                onEnter: authenticate(setActiveView(addView.id)),
                component: wrapComponent(AddView, {
                    desc: addView,
                    changeViewPath: changeView.path,
                    defaultReturnPath: listView.path,
                    breadcrumbs: [appCrumb, listViewCrumb, addViewCrumb],
                }),
            })
        }

        // Resource (ChangeView)
        root.childRoutes.push({
            path: changeView.path,
            onEnter: authenticate(setActiveView(changeView.id)),
            component: wrapComponent(ChangeView, {
                desc: changeView,
                defaultReturnPath: listView.path,
                appTitle: admin.title,
                breadcrumbs: [appCrumb, listViewCrumb, changeViewCrumb],
            }),
        })
    })

    if (admin.auth) {
        // Login page
        root.childRoutes.push({
            path: admin.auth.login.path,
            component: wrapComponent(Login, { desc: admin.auth.login }),
            onEnter: clearActiveView,
        })
        // Logout page
        root.childRoutes.push({
            path: admin.auth.logout.path,
            component: wrapComponent(Logout, { loginPath: admin.auth.login.path }),
            onEnter: clearActiveView,
        })
    }

    root.childRoutes.push({
        path: admin.custom.pageNotFound.path,
        component: PageNotFound,
        onEnter: clearActiveView,
    })

    const routeNotFound = {
        path: '*',
        component: PageNotFound,
        onEnter: (nextState, replace) => {
            store.dispatch(pageNotFoundMessage(`'${nextState.location.pathname}' is not a valid route.`))
            replace(resolvePath(admin.custom.pageNotFound.path))
        },
    }

    // return the Router component initialised with the created config
    return (<Router history={syncHistoryWithStore(history, store)} routes={[root, routeNotFound]} />)
}

/**
 * This is the main entry point for Crudl.
 */
export function render(adminToBeValidated) {
    setAdmin(adminToBeValidated)
    setStore(createStore())

    ReactDOM.render(
        <IntlProvider locale={admin.options.locale} messages={admin.messages}>
            <Provider store={store}>
                <div>
                    {crudlRouter()}
                    {options.debug && <DevTools />}
                </div>
            </Provider>
        </IntlProvider>,
        document.getElementById(options.rootElementId),
    )
}
