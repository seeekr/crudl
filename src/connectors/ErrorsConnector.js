import NotFoundError from '../errors/NotFoundError'
import AuthorizationError from '../errors/AuthorizationError'
import { push } from 'react-router-redux'
import { pageNotFoundMessage } from '../actions/frontend'
import { errorMessage } from '../actions/messages'

class ErrorsConnector {

    constructor(connector, dispatch, logout, pageNotFound) {
        this.id = connector.id
        this.connector = connector
        this.dispatch = dispatch
        this.logout = logout
        this.pageNotFound = pageNotFound
        this.processError = this.processError.bind(this)
    }

    processError(error) {
        if (error.message) {
            this.dispatch(errorMessage(error.message))
        }

        if (error instanceof AuthorizationError) {
            this.dispatch(push({ pathname: this.logout }))
        }

        if (error instanceof NotFoundError) {
            if (error.redirectTo) {
                this.dispatch(push({ pathname: error.redirectTo }))
            } else {
                this.dispatch(pageNotFoundMessage(error.message))
                this.dispatch(push({ pathname: this.pageNotFound }))
            }
        }
        throw error
    }

    create(req) {
        return this.connector.create(req).catch(this.processError)
    }

    read(req) {
        return this.connector.read(req).catch(this.processError)
    }

    update(req) {
        return this.connector.update(req).catch(this.processError)
    }

    delete(req) {
        return this.connector.delete(req).catch(this.processError)
    }
}

export default ErrorsConnector
