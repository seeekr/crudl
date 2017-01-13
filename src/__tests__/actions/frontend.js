/* globals require, test, expect, describe, it */

import * as actions from '../../actions/frontend.js'


describe('actions frontend', () => {
    it('types', () => {
      expect(Object.keys(actions.types).length).toEqual(9)
    })
    it('showNavigation should create an action to show the navigation', () => {
      const expectedAction = {
          type: actions.types.SHOW_NAVIGATION,
      }
      expect(actions.showNavigation()).toEqual(expectedAction)
    })
    it('hideNavigation should create an action to hide the navigation', () => {
      const expectedAction = {
          type: actions.types.HIDE_NAVIGATION,
      }
      expect(actions.hideNavigation()).toEqual(expectedAction)
    })
    it('toggleNavigation should create an action to toggle the navigation', () => {
      const expectedAction = {
          type: actions.types.TOGGLE_NAVIGATION,
      }
      expect(actions.toggleNavigation()).toEqual(expectedAction)
    })
    it('showFilters should create an action to show the filters', () => {
      const expectedAction = {
          type: actions.types.SHOW_FILTERS,
      }
      expect(actions.showFilters()).toEqual(expectedAction)
    })
    it('hideFilters should create an action to hide the filters', () => {
      const expectedAction = {
          type: actions.types.HIDE_FILTERS,
      }
      expect(actions.hideFilters()).toEqual(expectedAction)
    })
    it('toggleFilters should create an action to toggle the filters', () => {
      const expectedAction = {
          type: actions.types.TOGGLE_FILTERS,
      }
      expect(actions.toggleFilters()).toEqual(expectedAction)
    })
    it('showModalConfirm should create an action to show a modal window', () => {
      const options = {}
      const expectedAction = {
          type: actions.types.SHOW_MODAL_CONFIRM,
          options,
      }
      expect(actions.showModalConfirm(options)).toEqual(expectedAction)
    })
    it('hideModalConfirm should create an action to hide a modal window', () => {
      const expectedAction = {
          type: actions.types.HIDE_MODAL_CONFIRM,
      }
      expect(actions.hideModalConfirm()).toEqual(expectedAction)
    })
    it('pageNotFoundMessage should create an action for page not found', () => {
      const message = 'xxx'
      const expectedAction = {
          type: actions.types.PAGE_NOT_FOUND_MESSAGE,
          message,
      }
      expect(actions.pageNotFoundMessage(message)).toEqual(expectedAction)
    })
})
