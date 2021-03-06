/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow, mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import { ChangeView } from '../../containers/ChangeView'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

jest.mock('../../Crudl')
const crudl = require('../../Crudl')

crudl.options = {
    basePath: '/admin/',
    baseURL: '/api/',
}
crudl.resolvePath = jest.fn(() => '/xxx/')
crudl.hasPermission = () => true

const router = {
    setRouteLeaveHook: jest.fn(),
}

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
    values: {},
    ready: false,
}
const mockStore = configureStore()
const store = mockStore(s)

const intlProvider = new IntlProvider({ locale: 'en' }, {})
const { intl } = intlProvider.getChildContext() // Used in props

const props = {
    desc: {
        id: 'changeView',
        title: 'test detail',
        path: 'test/path',
        actions: {
            get: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        },
        fieldsets: [
            {
                fields: [
                    {
                        field: 'String',
                        id: 'name',
                        label: 'Name',
                        name: 'name',
                        key: 'name',
                        readOnly: false,
                        required: true,
                        validate: jest.fn(),
                    },
                ],
            },
        ],
        normalize: data => data,
        validate: jest.fn(),
    },
    location: {
        pathname: '/detail/10/',
        search: '',
        hash: '',
        action: '',
    },
    navigation: {
        backTo: undefined,
    },
    forms: {},
    history: {},
    fields: {
        name: {
            value: '',
            touched: false,
            error: null,
        },
    },
    intl,
    watch: jest.fn,
    breadcrumbs: [],
    viewCalls: {
        hasReturned: false,
        fromRelation: false,
        enterView: jest.fn,
        enterRelation: jest.fn,
        leaveView: jest.fn,
        switchToView: jest.fn,
        returnValue: undefined,
        storedData: undefined,
    },
}

describe('ChangeView', () => {
    it('renders correctly without tabs', () => {
        const changeview = shallow(
            <ChangeView {...props} />,
            { context: { store, router: {} } }
        )
        /* Loader */
        expect(changeview.find('ViewportLoading').length).toEqual(1)
        changeview.setState({ ready: true })
        /* debug */
        // console.log(changeview.debug())
        /* structure */
        expect(changeview.find('Header').length).toEqual(1)
        expect(changeview.find('h2').text()).toEqual('test detail')
        expect(changeview.find('TabList').length).toEqual(0)
        expect(changeview.find('TabPanel').length).toEqual(0)
        expect(changeview.find('ReduxForm').length).toEqual(1)
    })
    it('renders correctly with tabs', () => {
        props.desc.tabs = [
            {
                id: 'tab',
                title: 'Tab',
                actions: { save: jest.fn, list: jest.fn, delete: jest.fn, add: jest.fn },
                fields: [],
            },
        ]
        const changeview = shallow(
            <ChangeView {...props} />,
            { context: { store, router: {} } }
        )
        /* Loader */
        expect(changeview.find('ViewportLoading').length).toEqual(1)
        changeview.setState({ ready: true })
        /* debug */
        // console.log(changeview.debug())
        /* structure */
        expect(changeview.find('Header').length).toEqual(1)
        expect(changeview.find('h2').text()).toEqual('test detail')
        expect(changeview.find('TabList').length).toEqual(1)
        expect(changeview.find('TabPanel').length).toEqual(2)
        expect(changeview.find('ReduxForm').length).toEqual(1)
    })
})

describe('ChangeView (mount)', () => {
    beforeEach(() => {
        props.desc.actions.get = jest.fn()
        props.desc.actions.save = jest.fn()
        props.desc.actions.delete = jest.fn()
    })
    it('renders changeViewForm correctly', () => {
        props.desc.tabs = undefined
        props.router = router
        ChangeView.prototype.doGet = jest.fn(function () {
            const values = {
                name: 'xxx',
            }
            this.setState({ values, ready: true })
        })
        const changeview = mount(
            <Provider store={store}>
                <ChangeView {...props} />
            </Provider>
        )
        expect(changeview.find('form').length).toEqual(1)
    })
})
