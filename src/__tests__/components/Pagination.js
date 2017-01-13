/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow } from 'enzyme'
import { Pagination } from '../../components/Pagination.jsx'


describe('Pagination', () => {
    it('renders correctly with type numbered', () => {
        const props = {
            pagination: {
                type: 'numbered',
            },
            onRequestPage: jest.fn(),
            results: [],
            filtered: false,
            loading: false,
        }
        const pagination = shallow(
            <Pagination {...props} />
        )
        /* numbered */
        expect(pagination.find('NumberedPagination').length).toEqual(1)
        expect(pagination.find('ContinuousPagination').length).toEqual(0)
    })
    it('renders correctly with type continuous', () => {
        const props = {
            pagination: {
                type: 'continuous',
            },
            onRequestPage: jest.fn(),
            results: [],
            filtered: false,
            loading: false,
        }
        const pagination = shallow(
            <Pagination {...props} />
        )
        /* continuous */
        expect(pagination.find('NumberedPagination').length).toEqual(0)
        expect(pagination.find('ContinuousPagination').length).toEqual(1)
    })
    /* FIXME (Patrick): Test custom pagination component */
})
