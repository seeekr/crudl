
export const types = {
    SET_MESSAGE: 'messages.setMessage',
    CLEAR_MESSAGE: 'messages.clearMessage',
}

export const MESSAGE_TYPE_ERROR = 'error'
export const MESSAGE_TYPE_SUCCESS = 'success'
export const MESSAGE_TYPE_INFO = 'info'

export const DEFAULT_MESSAGE_TIMEOUT = 4000

export function setMessage(message, messageType, hold, messageTimeoutMS) {
    return {
        message,
        messageType,
        messageTimeoutMS,
        hold,
        type: types.SET_MESSAGE,
    }
}

export function successMessage(message, hold = false, messageTimeoutMS = DEFAULT_MESSAGE_TIMEOUT) {
    return setMessage(message, MESSAGE_TYPE_SUCCESS, hold, messageTimeoutMS)
}

export function infoMessage(message, hold = false, messageTimeoutMS = DEFAULT_MESSAGE_TIMEOUT) {
    return setMessage(message, MESSAGE_TYPE_INFO, hold, messageTimeoutMS)
}

export function errorMessage(message, hold = true, messageTimeoutMS = DEFAULT_MESSAGE_TIMEOUT) {
    return setMessage(message, MESSAGE_TYPE_ERROR, hold, messageTimeoutMS)
}

export function clearMessage() {
    return {
        type: types.CLEAR_MESSAGE,
    }
}
