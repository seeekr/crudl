/* globals jest, require, test, expect, describe, it, beforeEach */
import React from 'react'
import { IntlProvider } from 'react-intl'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'

import { ListView } from '../../containers/ListView'
import listViewSchema from '../../admin-schema/listView'

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
crudl.getSiblingDesc = jest.fn((id, type) => {
    switch (type) {
        case 'changeView': return {
            id: 'changeView',
        }
        case 'addView': return {
            id: 'addView',
        }
        default: return {}
    }
})

const intlProvider = new IntlProvider({ locale: 'en' }, {})
const { intl } = intlProvider.getChildContext() // Used in props

const props = {
    desc: {
        id: 'listView',
        path: 'listView',
        title: 'test title',
        fields: [],
        actions: { list: jest.fn },
        search: { name: 'xxx' },
    },
    location: {
        pathname: 'xxx',
        query: {},
        search: '',
    },
    router: {},
    filtersVisible: false,
    cache: {},
    watch: jest.fn,
    breadcrumbs: [],
    intl,
    dispatch: jest.fn,
}

describe('ListView', () => {
    it('renders correctly', () => {
        props.desc = listViewSchema.validate(props.desc).value
        const listview = shallow(<ListView {...props} />)
        /* Header, H2, add, search, filters */
        expect(listview.find('Header').length).toEqual(1)
        expect(listview.find('h2').text()).toEqual('test title')
        /* aside */
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
