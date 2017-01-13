/* globals require, jest, expect, describe, it, beforeEach */

import urlResolver from '../../connectors/url-resolvers/urlResolver.js'
import isArray from 'lodash/isArray'

jest.mock('../../Crudl')
const crudl = require('../../Crudl')
crudl.options = {
    basePath: '/admin/',
    baseURL: '/api/',
}

let req = {}

/* FIXME (Vaclav): I changed the urlQuery compared with our examples by (hopefully)
improving the ordering query – I just wanna add this param if sorting is actually given,
otherwise we always have request like xxx?ordering= ...
If you agree with this, we should update the examples as well. */

function urlQuery(request) {
    return Object.assign({},
        request.filters,
        request.page && { page: req.page },
        isArray(request.sorting) && request.sorting.length && {
            ordering: request.sorting.map((field) => {
                const prefix = field.sorted === 'ascending' ? '' : '-'
                return prefix + field.sortKey
            }).join(','),
        }
    )
}

describe('urlResolver', () => {
    beforeEach(() => {
        req = {
            data: {},
            page: undefined,
            filters: {},
            pagination: true,
            headers: {},
            sorting: [],
            params: [],
        }
    })
    it('works correctly', () => {
        const url = 'list/'
        const resolver = urlResolver(url)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/')
    })
    it('works correctly with params', () => {
        req.params = [1]
        const url = 'detail/:id'
        const resolver = urlResolver(url)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/detail/1')
    })
    it('works correctly with page', () => {
        req.page = '2'
        const url = 'list/'
        const resolver = urlResolver(url)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/?page=2')
    })
    it('works correctly with filters', () => {
        req.filters = {
            section: '2',
        }
        const url = 'list/'
        const resolver = urlResolver(url)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/?section=2')
    })
    it('sorting does not matter with defaultURLQuery', () => {
        req.sorting = [{
            name: 'name',
            sortKey: 'slug',
            sortable: true,
            sorted: 'descending',
        }]
        const url = 'list/'
        const resolver = urlResolver(url)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/')
    })
})

describe('urlResolver with custom URLQuery', () => {
    beforeEach(() => {
        req = {
            data: {},
            page: undefined,
            filters: {},
            pagination: true,
            headers: {},
            sorting: [],
            params: [],
        }
    })
    it('works correctly', () => {
        const url = 'list/'
        const resolver = urlResolver(url, urlQuery)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/')
    })
    it('works correctly with params', () => {
        req.params = [1]
        const url = 'detail/:id'
        const resolver = urlResolver(url, urlQuery)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/detail/1')
    })
    it('works correctly with page', () => {
        req.page = '2'
        const url = 'list/'
        const resolver = urlResolver(url, urlQuery)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/?page=2')
    })
    it('works correctly with filters', () => {
        req.filters = {
            section: '2',
        }
        const url = 'list/'
        const resolver = urlResolver(url, urlQuery)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/?section=2')
    })
    it('works correctly with sorting (desc)', () => {
        req.sorting = [{
            name: 'name',
            sortKey: 'slug',
            sortable: true,
            sorted: 'descending',
        }]
        const url = 'list/'
        const resolver = urlResolver(url, urlQuery)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/?ordering=-slug')
    })
    it('works correctly with sorting (asc)', () => {
        req.sorting = [{
            name: 'name',
            sortKey: 'slug',
            sortable: true,
            sorted: 'ascending',
        }]
        const url = 'list/'
        const resolver = urlResolver(url, urlQuery)
        const resolverurl = resolver(req)
        expect(resolverurl).toEqual('/api/list/?ordering=slug')
    })
})
