import axios from 'axios'
import uuid from 'uuid'
import axiosDefaults from 'axios/lib/defaults'

import { options } from '../Crudl'
import graphQLResolver from './url-resolvers/graphQLResolver'
import Response from './Response'
import AuthorizationError from '../errors/AuthorizationError'

// Low level call
function post(req, query, baseURL) {
    const url = baseURL || options.baseURL

    let variables = {}
    if (req.data) {
        variables = {
            input: {
                clientMutationId: uuid.v4(),
                ...req.data,
            },
        }
    }

    return axios.post(url, { query, variables }, { headers: req.headers })

    .then(response => new Response({
        data: response.data,
        status: response.status,
        url: response.config.url,
    }))

    .catch((response) => {
        if (response.status === 401) {
            throw new AuthorizationError()
        }
        return new Response({
            data: response.data,
            status: response.status,
            url: response.config.url,
        })
    })
}

class GraphQLConnector {

    constructor(endpoint) {
        this.id = endpoint.id
        this.endpoint = endpoint

        Object.getOwnPropertyNames(this.endpoint.query).forEach((method) => {
            if (typeof this.endpoint.query[method] !== 'function') {
                this.endpoint.query[method] = graphQLResolver(this.endpoint.query[method])
            }
        })

        // FIXME: This is API specific, must be configurable
        axiosDefaults.xsrfCookieName = 'csrftoken'
        axiosDefaults.xsrfHeaderName = 'X-CSRFToken'
    }

    /**
     * Creates a new resource
     */
    create(req) {
        return post(req, this.endpoint.query.create(req), this.endpoint.baseURL)
    }

    /**
     * Read data from this connector
     */
    read(req) {
        return post(req, this.endpoint.query.read(req), this.endpoint.baseURL)
    }

    /**
     * Update an existing document
     */
    update(req) {
        return post(req, this.endpoint.query.update(req), this.endpoint.baseURL)
    }

    /**
     * Delete a resource
     */
    delete(req) {
        return post(req, this.endpoint.query.delete(req), this.endpoint.baseURL)
    }
}

export default GraphQLConnector
