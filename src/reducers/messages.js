import { types, DEFAULT_MESSAGE_TIMEOUT } from '../actions/messages'
import { types as coreTypes } from '../actions/core'
/**
 * The initial core state. Add variables as you like.
 */
const initialState = {
    message: '',
    messageTimeoutMS: DEFAULT_MESSAGE_TIMEOUT,
    messageType: 'success', // { success, error, ...}
    timestamp: 0,
    hold: false,
}

export default function (state = initialState, action) {
    const { type, message, messageType, messageTimeoutMS, hold } = action

    switch (type) {
        case types.SET_MESSAGE:
            return {
                message,
                messageType,
                messageTimeoutMS,
                hold,
                timestamp: state.timestamp + 1,
            }
        case types.CLEAR_MESSAGE:
            return initialState
        case coreTypes.ACTIVE_VIEW_SET: // Don't hold the message anymore if a view changes
            return Object.assign({}, state, { hold: false })
        default:
            return state
    }
}
