/* globals require, jest, expect, describe, it, beforeEach */

import Request from '../../connectors/Request'

const req = {
    data: {},
    page: 1,
    filters: {},
    pagination: true,
    headers: {},
    sorting: [],
    params: [],
}


describe('Request', () => {
    it('works correctly', () => {
        const request = new Request(req)
        expect(request.data).toEqual({})
        expect(request.page).toEqual(1)
        expect(request.filters).toEqual({})
        expect(request.pagination).toEqual(true)
        expect(request.headers).toEqual({})
        expect(request.sorting).toEqual([])
        expect(request.params).toEqual([])
    })
    it('getPage works correctly', () => {
        const request = new Request(req).getPage(2)
        expect(request.page).toEqual(2)
    })
    it('filter works correctly', () => {
        const request = new Request(req).filter('category', 'updates')
        expect(request.filters.category).toEqual('updates')
    })
    it('withFilters works correctly', () => {
        const request = new Request(req).withFilters({ section: '2' })
        expect(request.filters.section).toEqual('2')
    })
    it('paginate works correctly (1)', () => {
        const request = new Request(req).paginate(100)
        expect(request.pagination).toEqual(100)
    })
    it('paginate works correctly (2)', () => {
        const request = new Request(req).paginate(0)
        expect(request.pagination).toEqual(0)
        expect(request.page).toEqual(undefined)
    })
    it('sort works correctly', () => {
        const array = [
            {
                name: 'name',
                sortKey: 'slug',
                sortable: true,
                sorted: 'ascending',
            },
        ]
        const request = new Request(req).sort(array)
        expect(request.sorting).toEqual(array)
    })
    it('withParams works correctly', () => {
        const params = ['2']
        const request = new Request(req).withParams(params)
        expect(request.params).toEqual(params)
    })
})
