/* globals require, jest, expect, describe, it, beforeEach */

import sinon from 'sinon'
import RESTConnector from '../../connectors/RESTConnector'

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


describe('RESTConnector', () => {
    beforeEach(() => {
        const server = sinon.fakeServer.create()
        server.respondImmediately = true
        server.respondWith('GET', '/api/list/', 'get list')
        server.respondWith('GET', '/api/detail/', 'get detail')
        server.respondWith('POST', '/api/object/add/', 'post object')
        server.respondWith('PATCH', '/api/object/update/', 'patch object')
        server.respondWith('PUT', '/api/object/update/', 'put object')
        server.respondWith('DELETE', '/api/object/delete/', 'delete object')
        server.respondWith('OPTIONS', '/api/list/options/', 'options')
        server.respondWith('GET', '/api/401/', [401, { 'Content-Type': 'application/json' }, 'xxx'])
        server.respondWith('GET', '/api/404/', [404, { 'Content-Type': 'application/json' }, 'xxx'])
        server.respondWith('GET', '/api/405/', [405, { 'Content-Type': 'application/json' }, 'xxx'])
    })
    it('get works correctly', () => {
        const connector = new RESTConnector(spec)
        return connector.get(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual('get list')
        })
    })
    it('read works correctly', () => {
        const connector = new RESTConnector(spec)
        return connector.read(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual('get list')
        })
    })
    it('post works correctly', () => {
        spec.url = 'object/add/'
        const connector = new RESTConnector(spec)
        req.data = {
            name: 'test name',
            category: 1,
        }
        return connector.post(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual('post object')
        })
    })
    it('patch works correctly', () => {
        spec.url = 'object/update/'
        const connector = new RESTConnector(spec)
        req.data = {
            name: 'test name',
            category: 1,
        }
        return connector.patch(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual('patch object')
        })
    })
    it('put works correctly', () => {
        spec.url = 'object/update/'
        const connector = new RESTConnector(spec)
        req.data = {
            name: 'test name',
            category: 1,
        }
        return connector.put(req)
        .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual('put object')
        })
    })
    it('401 works correctly', () => {
        spec.url = '401/'
        const connector = new RESTConnector(spec)
        return connector.get(req)
        .catch((error) => {
            expect(error.message).toEqual(undefined)
        })
    })
    it('404 works correctly', () => {
        spec.url = '404/'
        const connector = new RESTConnector(spec)
        return connector.get(req)
        .catch((error) => {
            expect(error.message).toEqual('Page /api/404/ was not found.')
        })
    })
    it('405 works correctly', () => {
        spec.url = '405/'
        const connector = new RESTConnector(spec)
        return connector.get(req)
        .catch((error) => {
            expect(error.message).toEqual('You are not allowed to do that.')
        })
    })
})
