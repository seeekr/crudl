/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow } from 'enzyme'
import { ActiveFilters } from '../../containers/ActiveFilters.jsx'

const props = {
    activeFilters: [
        {
            name: 'section',
            label: 'Section',
            value: 'Updates',
        },
        {
            name: 'category',
            label: 'Category',
            value: 'UI',
        },
    ],
    onRemove: undefined,
}
const onRemove = jest.fn()
props.onRemove = onRemove


describe('ActiveFilters', () => {
    it('renders correctly', () => {
        const filters = shallow(
            <ActiveFilters {...props} />
        )
        expect(filters.find('ul.active-filters').length).toEqual(1)
        expect(filters.find('li').length).toEqual(3)
        expect(filters.find('span.label').length).toEqual(2)
        expect(filters.find('button').length).toEqual(2)
    })
    it('handles onRemove correctly', () => {
        const filters = shallow(
            <ActiveFilters {...props} />
        )
        filters.find('button').at(0).simulate('click')
        expect(onRemove).toBeCalledWith('section')
        filters.find('button').at(1).simulate('click')
        expect(onRemove).toBeCalledWith('category')
    })
})
