/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { mount, shallow } from 'enzyme'
import ListViewItem from '../../components/ListViewTableItem'

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
            sortable: true,
            sorted: 'none', /* FIXME (Vaclav): why should this be "none"? */
            sortpriotity: undefined,
        },
    ],
    data: {
        name: 'Test name',
        slug: 'Test slug',
    },
    onClick: jest.fn,
}

describe('ListViewItem', () => {
    it('renders correctly', () => {
        const header = shallow(
            <ListViewItem {...props} />
        )
        expect(header.find('tr').length).toEqual(1)
        expect(header.find('th.main').length).toEqual(1)
        expect(header.find('td').length).toEqual(1)
    })
})
