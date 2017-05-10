import { SubmissionError } from 'redux-form'
import { push } from 'react-router-redux'
import { errorMessage } from '../actions/messages'
import { getStore, getAdmin, resolvePath } from '../Crudl'

function handleErrors(actionResult) {
    return Promise.resolve(actionResult)
    .catch((error) => {
        if (error.message) {
            getStore().dispatch(errorMessage(error.message))
        }

        if (error.validationError) {
            throw new SubmissionError(error.errors)
        }

        if (error.authorizationError) {
            const logoutPath = getAdmin('auth.logout.path')
            if (typeof logoutPath !== 'undefined') {
                getStore().dispatch(push({ pathname: resolvePath(logoutPath) }))
            }
        }

        throw error
    })
}

export default handleErrors
