/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow } from 'enzyme'
import ListViewHeader from '../../components/ListViewTableHead.jsx'

const props = {
    fields: [
        {
            key: 'name',
            label: 'Name',
            name: 'name',
            main: true,
            sortKey: 'slug',
            sortable: true,
            sorted: 'ascending',
            sortpriotity: 1,
        },
        {
            key: 'slug',
            label: 'Slug',
            name: 'slug',
            main: false,
            sortKey: 'slug',
            sortable: false,
            sorted: 'none', /* FIXME (Vaclav): why should this be "none"? */
            sortpriotity: undefined,
        },
    ],
    sorting: [
        {
            name: 'name',
            sortKey: 'slug',
            sorted: 'ascending',
        },
    ],
    onSortingChange: undefined,
}
const onSortingChange = jest.fn()
props.onSortingChange = onSortingChange

describe('ListViewHeader', () => {
    it('renders correctly', () => {
        const header = shallow(
            <ListViewHeader {...props} />
        )
        expect(header.find('tr').length).toEqual(1)
        expect(header.find('th').length).toEqual(2)
        expect(header.find('th.sortable').length).toEqual(1)
        expect(header.find('ul.sort-options').length).toEqual(1)
    })
    it('handles sortingChange (th) correctly', () => {
        const header = shallow(
            <ListViewHeader {...props} />
        )
        expect(header.find('th').at(0).prop('aria-sort')).toEqual('ascending')
        header.find('th').at(0).simulate('click')
        expect(onSortingChange).toBeCalledWith({
            name: 'name',
            sortKey: 'slug',
            sorted: 'descending',
        })
    })
    it('handles sortingChange (li) correctly', () => {
        const header = shallow(
            <ListViewHeader {...props} />
        )
        expect(header.find('th').at(0).prop('aria-sort')).toEqual('ascending')
        header.find('ul.sort-options li').at(0).simulate('click', { stopPropagation: () => undefined })
        expect(onSortingChange).toBeCalledWith({
            name: 'name',
            sortKey: 'slug',
            sorted: 'none',
        })
    })
})
