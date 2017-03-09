import set from 'lodash/set'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { LOCATION_CHANGE } from 'react-router-redux'
import { types } from '../actions/core'

/**
 * The initial core state. Add variables as you like.
 */
export const initialState = {
    auth: {
        loggedIn: false,
        requestHeaders: {},
        info: {},
    },
    cache: {
        listView: {
            key: undefined,
            state: undefined,
        },
    },
    activeView: undefined,
    permissions: {},
    admin: { id: undefined },
    viewCalls: {
        state: {
            hasReturned: false,
            returnValue: undefined,
            storedData: undefined,
            callstack: [],
            callInProgress: false,
        },
    },
}

/**
 * Returns a copy of the state with a new value of the given variable
 */
function transit(state, variable, value) {
    // FIXME: deep copying of the whole state can be eventually slow...
    const newState = cloneDeep(state)
    set(newState, variable, value)
    return newState
}

function coreReducer(state = initialState, action) {
    // A simpler transit function:
    const t = (variable, value) => transit(state, variable, value)

    switch (action.type) {
        case types.LOGIN:
            return t('auth', {
                loggedIn: true,
                requestHeaders: action.auth.requestHeaders || {},
                info: action.auth.info || {},
            })
        case types.LOGOUT:
            return t('auth', { loggedIn: false, requestHeaders: {}, info: {} })
        case types.CACHE_SET_LISTVIEW:
            return t('cache', { listView: action.data })
        case types.CACHE_CLEAR_LISTVIEW:
            return t('cache', { listView: initialState.cache.listView })
        case types.ACTIVE_VIEW_SET:
            return t('activeView', action.ref)
        case types.ACTIVE_VIEW_CLEAR:
            return t('activeView', undefined)
        case types.SET_PERMISSIONS:
            return t('permissions', action.permissions)
        case types.VIEW_CALLS_SET_STATE:
            return t('viewCalls.state', action.state)
        case LOCATION_CHANGE:
            // Clear the viewCalls state when a call is aborted
            if (get(action.state, 'callInProgress')) {
                return t('viewCalls.state', initialState.viewCalls.state)
            }
            return state
        default:
            return state
    }
}

export default coreReducer
