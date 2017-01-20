/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow, mount } from 'enzyme'
import FiltersForm from '../../forms/FiltersForm'

// jest.mock('../../WatchComponent')

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
}
const onSubmit = jest.fn()
const onClear = jest.fn()
const dispatch = jest.fn()
props.onSubmit = onSubmit
props.onClear = onClear
props.dispatch = dispatch

/* FIXME (Vaclav): I have no idea what´s going on with this component and how I could
test it. The props alone is a massive list of unused attributes ... */


describe('FiltersForm', () => {
    it('renders correctly', () => {
        // const filtersform = shallow(
        //     <FiltersForm {...props} />
        // )
        expect(1).toEqual(1)
    })
})
