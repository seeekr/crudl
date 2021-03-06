import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import { types } from '../actions/frontend'

/**
 * The initial frontend state. Add variables as you like.
 */
const initialState = {
    navigation: {
        visible: false,
    },
    filters: {
        visible: false,
    },
    modalConfirm: {
        visible: false,
        // other parts of the modalConfirm state come from `action.options`
    },
    pageNotFound: {
        message: 'The requested page could not be found.',
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

export default function (state = initialState, action) {
    // A simpler transit function:
    const t = (variable, value) => transit(state, variable, value)

    switch (action.type) {
        case types.SHOW_NAVIGATION:
            return t('navigation.visible', true)
        case types.HIDE_NAVIGATION:
            return t('navigation.visible', false)
        case types.TOGGLE_NAVIGATION:
            return t('navigation.visible', !state.navigation.visible)
        case types.SHOW_FILTERS:
            return t('filters.visible', true)
        case types.HIDE_FILTERS:
            return t('filters.visible', false)
        case types.TOGGLE_FILTERS:
            return t('filters.visible', !state.filters.visible)
        case types.SHOW_MODAL_CONFIRM:
            return t('modalConfirm', Object.assign({ visible: true }, action.options))
        case types.HIDE_MODAL_CONFIRM:
            return t('modalConfirm', { visible: false })
        case types.PAGE_NOT_FOUND_MESSAGE:
            return t('pageNotFound', { message: action.message })
        default:
            return state
    }
}
