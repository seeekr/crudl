/* globals require, test, beforeEach, expect, describe, it */

import core from '../../reducers/core.js'
import { types } from '../../actions/core.js'

let initial = {}
let result = {}

describe('reducers core', () => {
    beforeEach(() => {
        initial = {
            admin: { id: undefined },
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
            activeView: undefined,
            permissions: {},
        }
        result = {
            admin: { id: undefined },
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
            activeView: undefined,
            permissions: {},
        }
    })
    it('should return the initial state', () => {
        expect(
            core(undefined, {})
        ).toEqual(initial)
    })
    /* login/logout */
    it('should handle LOGIN', () => {
        result.auth.loggedIn = true
        result.auth.requestHeaders = { token: 'yyy' }
        result.auth.info = { username: 'xxx' }
        expect(
            core(initial, {
                type: types.LOGIN,
                auth: {
                    requestHeaders: { token: 'yyy' },
                    info: { username: 'xxx' },
                },
            })
        ).toEqual(result)
    })
    it('should handle LOGOUT', () => {
        initial.auth.loggedIn = true
        initial.auth.requestHeaders = { token: 'yyy' }
        initial.auth.info = { username: 'xxx' }
        expect(
            core(initial, {
                type: types.LOGOUT,
            })
        ).toEqual(result)
    })
    /* cache listview */
    it('should handle CACHE_SET_LISTVIEW', () => {
        result.cache.listView = {
            key: '/list/one/',
            state: {
                results: [1, 2, 3],
            },
        }
        expect(
            core(initial, {
                type: types.CACHE_SET_LISTVIEW,
                data: {
                    key: '/list/one/',
                    state: {
                        results: [1, 2, 3],
                    },
                },
            })
        ).toEqual(result)
    })
    it('should handle CACHE_CLEAR_LISTVIEW', () => {
        initial.cache.listView = {
            key: '/list/one/',
            state: {
                results: [1, 2, 3],
            },
        }
        expect(
            core(initial, {
                type: types.CACHE_CLEAR_LISTVIEW,
            })
        ).toEqual(result)
    })
    /* active viewset */
    it('should handle ACTIVE_VIEW_SET', () => {
        result.activeView = 'test_listView'
        expect(
            core(initial, {
                type: types.ACTIVE_VIEW_SET,
                ref: 'test_listView',
            })
        ).toEqual(result)
    })
    it('should handle ACTIVE_VIEW_CLEAR', () => {
        initial.activeView = 'test_listView'
        expect(
            core(initial, {
                type: types.ACTIVE_VIEW_CLEAR,
            })
        ).toEqual(result)
    })
})
