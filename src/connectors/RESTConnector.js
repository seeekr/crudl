import axios from 'axios'
import axiosDefaults from 'axios/lib/defaults'
import Response from './Response'
import urlResolver from './url-resolvers/urlResolver'

import AuthorizationError from '../errors/AuthorizationError'
import NotFoundError from '../errors/NotFoundError'
import PermissionError from '../errors/PermissionError'

export function axiosToCrudl(axiosResponse) {
    if (axiosResponse.status === 401) {
        throw new AuthorizationError()
    }
    if (axiosResponse.status === 404) {
        throw new NotFoundError(`Page ${axiosResponse.config.url} was not found.`)
    }
    if (axiosResponse.status === 405) {
        throw new PermissionError('You are not allowed to do that.')
    }
    return new Response({
        data: axiosResponse.data,
        status: axiosResponse.status,
        url: axiosResponse.config.url,
    })
}

export function processResponse(axiosResponse) {
    return new Response({
        data: axiosResponse.data,
        status: axiosResponse.status,
        url: axiosResponse.config.url,
    })
}

export function processError(error) {
    if (error.response) {
        if (error.response.status === 401) {
            throw new AuthorizationError()
        }
        if (error.response.status === 404) {
            throw new NotFoundError(`Page ${error.response.config.url} was not found.`)
        }
        if (error.response.status === 405) {
            throw new PermissionError('You are not allowed to do that.')
        }
    }
    return processResponse(error.response)
}

class RESTConnector {

    constructor(endpoint) {
        this.id = endpoint.id
        this.endpoint = endpoint

        // url resolve function
        if (typeof this.endpoint.url !== 'function') {
            this.endpoint.url = urlResolver(this.endpoint.url, this.endpoint.urlQuery, this.endpoint.baseURL)
        }

        // Default mapping
        this.mapping = {
            create: (...args) => this.post(...args),
            read: (...args) => this.get(...args),
            update: (...args) => this.patch(...args),
            delete: (...args) => this.del(...args),
        }

        if (this.endpoint.mapping) {
            // Remap
            Object.getOwnPropertyNames(this.endpoint.mapping).forEach((method) => {
                switch (this.endpoint.mapping[method]) {
                    case 'get': this.mapping[method] = this.get.bind(this); break
                    case 'post': this.mapping[method] = this.post.bind(this); break
                    case 'put': this.mapping[method] = this.put.bind(this); break
                    case 'patch': this.mapping[method] = this.patch.bind(this); break
                    case 'delete': this.mapping[method] = this.del.bind(this); break
                    case 'options': this.mapping[method] = this.options.bind(this); break
                    default: throw new Error(
                        `Cannot map an unknown method ${this.endpoint.mapping[method]}.`
                    )
                }
            })
        }

        // FIXME (Vaclav): This is API specific, must be configurable
        axiosDefaults.xsrfCookieName = 'csrftoken'
        axiosDefaults.xsrfHeaderName = 'X-CSRFToken'
    }

    /**
    * Creates a new resource
    */
    create(req) {
        return this.mapping.create(req)
    }

    /**
    * Read data from this connector
    */
    read(req) {
        return this.mapping.read(req)
    }

    /**
    * Update an existing document
    */
    update(req) {
        return this.mapping.update(req)
    }

    /**
    * Delete a resource
    */
    delete(req) {
        return this.mapping.delete(req)
    }


    //-------------------------------------------------------------------------
    //  AXIOS CALLS
    //-------------------------------------------------------------------------

    // Low level API
    get(req) {
        const url = this.endpoint.url(req)

        return axios.get(url, { headers: req.headers })
        .then(processResponse)
        .catch(processError)
    }

    // Low level API
    post(req) {
        const url = this.endpoint.url(req)

        return axios.post(url, req.data, { headers: req.headers })
        .then(processResponse)
        .catch(processError)
    }

    // Low level API
    put(req) {
        const url = this.endpoint.url(req)

        return axios.put(url, req.data, { headers: req.headers })
        .then(processResponse)
        .catch(processError)
    }

    // Low level API
    patch(req) {
        const url = this.endpoint.url(req)

        return axios.patch(url, req.data, { headers: req.headers })
        .then(processResponse)
        .catch(processError)
    }

    // Low level API
    del(req) {
        const url = this.endpoint.url(req)

        return axios.delete(url, { headers: req.headers })
        .then(processResponse)
        .catch(processError)
    }

    // Low level API
    options(req) {
        const url = this.endpoint.url(req)

        return axios({ url, method: 'options', headers: req.headers })
        .then(processResponse)
        .catch(processError)
    }

}

export default RESTConnector
