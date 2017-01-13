/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow } from 'enzyme'
import { NumberedPagination } from '../../components/NumberedPagination.jsx'


describe('NumberedPagination', () => {
    it('renders correctly without results', () => {
        const props = {
            pagination: {
                allPages: [],
                currentPage: 1,
                resultsTotal: undefined,
                filteredTotal: undefined,
            },
            onRequestPage: jest.fn(),
            results: [],
            filtered: false,
            loading: false,
        }
        const pagination = shallow(
            <NumberedPagination {...props} />
        )
        /* no content yet */
        expect(pagination.find('ol.pagination').length).toEqual(0)
        expect(pagination.find('li.results').length).toEqual(0)
    })
    it('renders correctly with results', () => {
        const props = {
            pagination: {
                allPages: [1, 2, 3],
                currentPage: 1,
                resultsTotal: 10,
                filteredTotal: undefined,
            },
            onRequestPage: jest.fn(),
            results: [1, 2, 3],
            filtered: false,
            loading: false,
        }
        const pagination = shallow(
            <NumberedPagination {...props} />
        )
        /* results */
        expect(pagination.find('ol.pagination').length).toEqual(1)
        expect(pagination.find('li.results').length).toEqual(1)
        expect(pagination.find('li.results.filtered').length).toEqual(0)
        expect(pagination.find('li.page').length).toEqual(3)
        expect(pagination.find('li.results').at(0).text()).toEqual('10 total')
    })
    it('renders correctly with results and filtered', () => {
        const props = {
            pagination: {
                allPages: [1, 2, 3],
                currentPage: 1,
                resultsTotal: 10,
                filteredTotal: 5,
            },
            onRequestPage: jest.fn(),
            results: [1, 2, 3],
            filtered: false,
            loading: false,
        }
        const pagination = shallow(
            <NumberedPagination {...props} />
        )
        /* results, filtered */
        expect(pagination.find('ol.pagination').length).toEqual(1)
        expect(pagination.find('li.results').length).toEqual(1)
        expect(pagination.find('li.results.filtered').length).toEqual(0)
        expect(pagination.find('li.page').length).toEqual(3)
        expect(pagination.find('li.results').at(0).text()).toEqual('5 results (10 total)')
    })
    it('renders correctly with active filters', () => {
        const props = {
            pagination: {
                allPages: [1, 2, 3],
                currentPage: 1,
                resultsTotal: 10,
                filteredTotal: 5,
            },
            onRequestPage: jest.fn(),
            results: [1, 2, 3],
            filtered: true,
            loading: false,
        }
        const pagination = shallow(
            <NumberedPagination {...props} />
        )
        /* results, filtered, active filters */
        expect(pagination.find('ol.pagination').length).toEqual(1)
        expect(pagination.find('li.results').length).toEqual(1)
        /* now we have the filtered class */
        expect(pagination.find('li.results.filtered').length).toEqual(1)
        expect(pagination.find('li.page').length).toEqual(3)
        expect(pagination.find('li.results').at(0).text()).toEqual('5 results (10 total)')
    })
    /* FIXME (Patrick): Test combineResults */
})
