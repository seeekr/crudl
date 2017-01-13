/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow, mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import { Filters } from '../../containers/Filters'

const s = {
    filters: {},
}
const props = {
    desc: {
        fields: [
            {
                after: '',
                before: '',
                field: 'Search',
                id: 'search',
                label: 'Search',
                name: 'search',
                props: {},
                readOnly: false,
                required: false,
            },
        ],
    },
    filters: {},
    onSubmit: undefined,
    onClear: undefined,
    dispatch: undefined,
    watch: jest.fn,
}
const onSubmit = jest.fn()
const onClear = jest.fn()
const dispatch = jest.fn()
props.onSubmit = onSubmit
props.onClear = onClear
props.dispatch = dispatch
const mockStore = configureStore()
const store = mockStore(s)

/* FIXME (Vaclav): I tried but failed with testing the filters component – mainly because
the filtersForm is being created within componentWillMount. Please take a look and add
tests here. Or maybe you need to rethink the component. */


describe('Filters', () => {
    it('renders correctly', () => {
        const filters = shallow(
            <Filters {...props} />,
            { context: { store } }
        )
        expect(1).toEqual(1)
    })
})
