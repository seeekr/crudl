
export const types = {
    LOGIN: 'core.login',
    LOGOUT: 'core.logout',
    CACHE_SET_LISTVIEW: 'core.cache.setListView',
    CACHE_CLEAR_LISTVIEW: 'core.cache.clearListView',
    ACTIVE_VIEW_SET: 'core.activeView.set',
    ACTIVE_VIEW_CLEAR: 'core.activeView.clear',
    SET_PERMISSIONS: 'core.permissions.setPermissions',
    VIEW_CALLS_SET_STATE: 'core.viewCalls.setState',
}

export const auth = {}
export const cache = {}
export const activeView = {}
export const permissions = {}
export const viewCalls = {}

// Auth
auth.login = function login(authObject) {
    return {
        type: types.LOGIN,
        auth: authObject,
    }
}

auth.logout = function logout() {
    return {
        type: types.LOGOUT,
    }
}

// Cache
cache.setListView = function setListView(data) {
    return {
        type: types.CACHE_SET_LISTVIEW,
        data,
    }
}

cache.clearListView = function clearListView() {
    return {
        type: types.CACHE_CLEAR_LISTVIEW,
    }
}

// Active View
activeView.set = function setActiveView(ref) {
    return {
        type: types.ACTIVE_VIEW_SET,
        ref,
    }
}

activeView.clear = function clearActiveView() {
    return {
        type: types.ACTIVE_VIEW_CLEAR,
    }
}

// Permissions
permissions.setPermissions = function setPermissions(perms) {
    return {
        type: types.SET_PERMISSIONS,
        permissions: perms,
    }
}

// View calls
viewCalls.setState = function setState(state) {
    return {
        type: types.VIEW_CALLS_SET_STATE,
        state,
    }
}
