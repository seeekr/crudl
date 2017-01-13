/* globals require, test, expect, describe, it */

import * as actions from '../../actions/core.js'


describe('actions core', () => {
    it('types', () => {
      expect(Object.keys(actions.types).length).toEqual(7)
    })
    it('auth.login should create an action to login with authObject', () => {
      const authObject = {}
      const expectedAction = {
          type: actions.types.LOGIN,
          auth: authObject,
      }
      expect(actions.auth.login(authObject)).toEqual(expectedAction)
    })
    it('auth.logout should create an action to logout', () => {
      const expectedAction = {
          type: actions.types.LOGOUT,
      }
      expect(actions.auth.logout()).toEqual(expectedAction)
    })
    it('cache.setListView should create an action to cache the listView', () => {
      const data = {}
      const expectedAction = {
          type: actions.types.CACHE_SET_LISTVIEW,
          data,
      }
      expect(actions.cache.setListView(data)).toEqual(expectedAction)
    })
    it('cache.clearListView should create an action to clear the listView from cache', () => {
      const expectedAction = {
          type: actions.types.CACHE_CLEAR_LISTVIEW,
      }
      expect(actions.cache.clearListView()).toEqual(expectedAction)
    })
    it('activeView.set should create an action set the active view', () => {
      const ref = {}
      const expectedAction = {
          type: actions.types.ACTIVE_VIEW_SET,
          ref,
      }
      expect(actions.activeView.set(ref)).toEqual(expectedAction)
    })
    it('activeView.clear should create an action clear the active view', () => {
      const expectedAction = {
          type: actions.types.ACTIVE_VIEW_CLEAR,
      }
      expect(actions.activeView.clear()).toEqual(expectedAction)
    })
})
