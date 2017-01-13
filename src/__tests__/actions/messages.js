/* globals require, test, expect, describe, it */

import * as actions from '../../actions/messages.js'


describe('actions messages', () => {
    it('types', () => {
      expect(Object.keys(actions.types).length).toEqual(2)
    })
    it('successMessage should create an action to show a success message', () => {
      const message = 'XXX'
      const messageType = 'success'
      const expectedAction = {
          message,
          messageType,
          type: actions.types.SET_MESSAGE,
          hold: false,
          messageTimeoutMS: actions.DEFAULT_MESSAGE_TIMEOUT,
      }
      expect(actions.successMessage(message)).toEqual(expectedAction)
    })
    it('errorMessage should create an action to show an error message', () => {
      const message = 'XXX'
      const messageType = 'error'
      const expectedAction = {
          message,
          messageType,
          type: actions.types.SET_MESSAGE,
          hold: true,
          messageTimeoutMS: actions.DEFAULT_MESSAGE_TIMEOUT,
      }
      expect(actions.errorMessage(message)).toEqual(expectedAction)
    })
    it('infoMessage should create an action to show an info message', () => {
      const message = 'XXX'
      const messageType = 'info'
      const expectedAction = {
          message,
          messageType,
          type: actions.types.SET_MESSAGE,
          hold: false,
          messageTimeoutMS: actions.DEFAULT_MESSAGE_TIMEOUT,
      }
      expect(actions.infoMessage(message)).toEqual(expectedAction)
    })
    it('clearMessage should create an action to clear a message', () => {
      const expectedAction = {
          type: actions.types.CLEAR_MESSAGE,
      }
      expect(actions.clearMessage()).toEqual(expectedAction)
    })
})
