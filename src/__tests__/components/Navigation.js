/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
// import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import { Navigation } from '../../containers/Navigation'

jest.mock('../../Crudl')

const crudl = require('../../Crudl')

crudl.resolvePath = jest.fn(() => '/xxx/')
crudl.hasPermission = () => true

describe('Navigation', () => {
    it('renders correctly with views', () => {
        const views = {
            '001': {
                listView: {
                    title: '001 list',
                    id: '001list',
                    path: '/001/list/',
                    fields: [],
                    actions: { list: jest.fn },
                },
                changeView: {
                    title: '001 change',
                    id: '001change',
                    path: '/001/change/',
                    fields: [],
                    actions: { get: jest.fn, save: jest.fn },
                },
                addView: {
                    title: '001 add',
                    id: '001add',
                    path: '/001/add/',
                    fields: [],
                    actions: { add: jest.fn },
                },
            },
        }
        const props = {
            onLogout: jest.fn(),
            views,
            title: '',
            dispatch: jest.fn(),
            /* from state */
            navigationVisible: true,
            activeView: '',
            auth: { loggedIn: true, info: { username: 'John Doe' } },
        }
        const navigation = shallow(<Navigation {...props} />)
        /* Dashboard, 001, logout */
        expect(navigation.find('ul').length).toEqual(3)
        expect(navigation.find('li').length).toEqual(4)
        expect(navigation.find('Link').length).toEqual(1)
        expect(navigation.find('IndexLink').length).toEqual(1)
        expect(navigation.find('Link').at(0).prop('to')).toEqual('/xxx/')
        expect(navigation.find('Link').at(0).prop('className')).toEqual('')
        /* check active */
        navigation.setProps({ activeView: '001list' });
        expect(navigation.find('Link').at(0).prop('className')).toEqual('active')
    })
    /* FIXME: check rendering with custom menu */
})
