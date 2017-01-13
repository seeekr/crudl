/* globals require, test, beforeEach, expect, describe, it */

import frontend from '../../reducers/frontend.js'
import { types } from '../../actions/frontend.js'

let initial = {}
let result = {}

describe('reducers frontend', () => {
    beforeEach(() => {
        initial = {
            navigation: { visible: false },
            filters: { visible: false },
            modalConfirm: { visible: false },
            pageNotFound: { message: 'The requested page could not be found.' },
        }
        result = {
            navigation: { visible: false },
            filters: { visible: false },
            modalConfirm: { visible: false },
            pageNotFound: { message: 'The requested page could not be found.' },
        }
    })
    it('should return the initial state', () => {
        expect(
            frontend(undefined, {})
        ).toEqual(initial)
    })
    /* navigation */
    it('should handle SHOW_NAVIGATION', () => {
        result.navigation.visible = true
        expect(
            frontend(initial, {
                type: types.SHOW_NAVIGATION,
            })
        ).toEqual(result)
    })
    it('should handle HIDE_NAVIGATION', () => {
        initial.navigation.visible = true
        result.navigation.visible = false
        expect(
            frontend(initial, {
                type: types.HIDE_NAVIGATION,
            })
        ).toEqual(result)
    })
    it('should handle TOGGLE_NAVIGATION', () => {
        initial.navigation.visible = true
        result.navigation.visible = false
        expect(
            frontend(initial, {
                type: types.TOGGLE_NAVIGATION,
            })
        ).toEqual(result)
        initial.navigation.visible = false
        result.navigation.visible = true
        expect(
            frontend(initial, {
                type: types.TOGGLE_NAVIGATION,
            })
        ).toEqual(result)
    })
    /* filters */
    it('should handle SHOW_FILTERS', () => {
        result.filters.visible = true
        expect(
            frontend(initial, {
                type: types.SHOW_FILTERS,
            })
        ).toEqual(result)
    })
    it('should handle HIDE_NAVIGATION', () => {
        initial.filters.visible = true
        result.filters.visible = false
        expect(
            frontend(initial, {
                type: types.HIDE_FILTERS,
            })
        ).toEqual(result)
    })
    it('should handle TOGGLE_FILTERS', () => {
        initial.filters.visible = true
        result.filters.visible = false
        expect(
            frontend(initial, {
                type: types.TOGGLE_FILTERS,
            })
        ).toEqual(result)
        initial.filters.visible = false
        result.filters.visible = true
        expect(
            frontend(initial, {
                type: types.TOGGLE_FILTERS,
            })
        ).toEqual(result)
    })
    /* modal */
    it('should handle SHOW_MODAL_CONFIRM', () => {
        result.modalConfirm.visible = true
        result.modalConfirm.name = 'xxx'
        expect(
            frontend(initial, {
                type: types.SHOW_MODAL_CONFIRM,
                options: { name: 'xxx' },
            })
        ).toEqual(result)
    })
    it('should handle HIDE_MODAL_CONFIRM', () => {
        initial.modalConfirm.visible = true
        result.modalConfirm.visible = false
        expect(
            frontend(initial, {
                type: types.HIDE_MODAL_CONFIRM,
            })
        ).toEqual(result)
    })
    /* page not found message */
    it('should handle PAGE_NOT_FOUND_MESSAGE', () => {
        result.pageNotFound.message = 'xxx'
        expect(
            frontend(initial, {
                type: types.PAGE_NOT_FOUND_MESSAGE,
                message: 'xxx',
            })
        ).toEqual(result)
    })
})
