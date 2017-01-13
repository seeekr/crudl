import { types } from '../actions/filters'

/**
 * The initial frontend state. Add variables as you like.
 */
const initialState = {
    activeFilters: [], // An array of { name, value, label }
    filters: {},
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.SET_FILTERS:
            return Object.assign({}, state, { filters: action.filters })
        case types.SET_ACTIVE_FILTERS:
            return Object.assign({}, state, { activeFilters: action.activeFilters })
        default:
            return state
    }
}
