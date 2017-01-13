/* globals require, jest, expect, describe, it, beforeEach */

import sinon from 'sinon'
import RESTConnector from '../../connectors/RESTConnector.js'
import TransformConnector from '../../connectors/TransformConnector.js'

jest.mock('../../Crudl')
const crudl = require('../../Crudl')
crudl.options = {
    basePath: '/admin/',
    baseURL: '/api/',
}

const spec = {
    id: 'xxx',
    url: 'list/',
    urlQuery: undefined,
    query: {},
    use: '',
    mapping: {},
    transform: {},
    pagination: undefined,
    enableDepagination: false,
}

const req = {
    data: {},
    page: undefined,
    filters: {},
    pagination: true,
    headers: {},
    sorting: [],
    params: [],
}

/* FIXME (Vaclav): Please check if you are able to test request and requestData. */


describe('TransformConnector', () => {
    beforeEach(() => {
        const server = sinon.fakeServer.create()
        server.respondImmediately = true
        server.respondWith('GET', '/api/list/', JSON.stringify({ data: 'get list' }))
        server.respondWith('GET', '/api/detail/', JSON.stringify({ data: 'get detail' }))
        server.respondWith('POST', '/api/object/add/', JSON.stringify({ data: 'post object' }))
        server.respondWith('PATCH', '/api/object/update/', JSON.stringify({ data: 'patch object' }))
        server.respondWith('PUT', '/api/object/update/', JSON.stringify({ data: 'put object' }))
        server.respondWith('DELETE', '/api/object/delete/', JSON.stringify({ data: 'delete object' }))
        server.respondWith('OPTIONS', '/api/list/options/', 'options')
    })
    it('create with transform works correctly', () => {
        spec.url = 'object/add/'
        let connector = null
        const transform = {
            createRequest: function createRequest(request) {
                return request
            },
            createRequestData: function createRequestData(data) {
                return data
            },
            createResponse: function readResponse(res) {
                const response = res
                response.url = '/xxx/'
                return response
            },
            createResponseData: function readResponseData(data) {
                return data.data
            },
        }
        connector = new RESTConnector(spec)
        connector = new TransformConnector(connector, transform)
        req.data = {
            name: 'test name',
            category: 1,
        }
        return connector.create(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.url).toEqual('/xxx/')
            expect(response.data).toEqual('post object')
        })
    })
    it('read with readResponse/readResponseData works correctly', () => {
        spec.url = 'list/'
        let connector = null
        const transform = {
            readRequest: function readRequest(request) {
                return request
            },
            readRequestData: function readRequestData(data) {
                return data
            },
            readResponse: function readResponse(res) {
                const response = res
                response.url = '/xxx/'
                return response
            },
            readResponseData: function readResponseData(data) {
                return data.data
            },
        }
        req.data = {
            name: 'test name',
            category: 1,
        }
        connector = new RESTConnector(spec)
        connector = new TransformConnector(connector, transform)
        return connector.read(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.url).toEqual('/xxx/')
            expect(response.data).toEqual('get list')
        })
    })
    it('update with updateResponse/updateResponseData works correctly', () => {
        spec.url = 'object/update/'
        let connector = null
        const transform = {
            updateRequest: function updateRequest(request) {
                return request
            },
            updateRequestData: function updateRequestData(data) {
                return data
            },
            updateResponse: function readResponse(res) {
                const response = res
                response.url = '/xxx/'
                return response
            },
            updateResponseData: function readResponseData(data) {
                return data.data
            },
        }
        connector = new RESTConnector(spec)
        connector = new TransformConnector(connector, transform)
        req.data = {
            name: 'test name',
            category: 1,
        }
        return connector.update(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.url).toEqual('/xxx/')
            expect(response.data).toEqual('patch object')
        })
    })
    it('delete with deleteResponse/deleteResponseData works correctly', () => {
        spec.url = 'object/delete/'
        let connector = null
        const transform = {
            deleteRequest: function deleteRequest(request) {
                return request
            },
            deleteRequestData: function deleteRequestData(data) {
                return data
            },
            deleteResponse: function readResponse(res) {
                const response = res
                response.url = '/xxx/'
                return response
            },
            deleteResponseData: function readResponseData(data) {
                return data.data
            },
        }
        connector = new RESTConnector(spec)
        connector = new TransformConnector(connector, transform)
        req.data = {
            name: 'test name',
            category: 1,
        }
        return connector.delete(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.url).toEqual('/xxx/')
            expect(response.data).toEqual('delete object')
        })
    })
})
