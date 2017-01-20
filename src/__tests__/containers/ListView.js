/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
// import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import { ListView } from '../../containers/ListView'

jest.mock('../../Crudl')
const crudl = require('../../Crudl')

const s = {
    form: {},
    frontend: {},
    core: {
        auth: {
            loggedIn: false,
            requestHeaders: {},
            info: {},
        },
        cache: {
            listView: {
                key: undefined,
                state: undefined,
            },
        },
        navigation: {
            backTo: undefined,
        },
        activeView: undefined,
    },
    routing: {},
    messages: {},
    filters: {},
    watch: jest.fn,
}
const mockStore = configureStore()
const store = mockStore(s)
crudl.resolvePath = jest.fn(() => '/xxx/')

const props = {
    addViewPath: '001/new/',
    changeViewPath: '001/details/:id',
    desc: {
        title: 'test title',
        fields: [],
    },
    location: {
        pathname: 'xxx',
        query: {},
    },
    /* from state */
    filtersVisible: false,
    cache: {},
    watch: jest.fn,
    canAdd: () => true,
    canView: () => true,
}

describe('ListView', () => {
    it('renders correctly', () => {
        const listview = shallow(
            <ListView {...props} />,
            { context: { store, router: {} } }
        )
        /* Header, H2, add, search, filters */
        expect(listview.find('Header').length).toEqual(1)
        expect(listview.find('h2').text()).toEqual('test title')
        /* aside */
        expect(listview.find('aside').length).toEqual(0)
        listview.setProps({
            desc: {
                title: 'test title',
                search: {
                    name: 'xxx',
                },
                fields: [],
            },
        })
        expect(listview.find('aside').length).toEqual(1)
        /* context-tools */
        expect(listview.find('.context-tools').length).toEqual(2)
        /* pagination */
        expect(listview.find('Pagination').length).toEqual(1)
        expect(listview.find('NumberedPagination').length).toEqual(0)
        expect(listview.find('ContinuousPagination').length).toEqual(0)
        /* active filters */
        expect(listview.find('.active-filters').length).toEqual(0)
        /* content (no content yet) */
        expect(listview.find('#viewport-content').length).toEqual(1)
        expect(listview.find('.list-view-table').length).toEqual(0)
    })
})
