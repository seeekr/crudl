/* globals require, test, expect, describe, it */

import messages from '../../reducers/messages.js'
import { types, DEFAULT_MESSAGE_TIMEOUT } from '../../actions/messages.js'
import { types as coreActionTypes } from '../../actions/core.js'


describe('reducers messages', () => {
    it('should return the initial state', () => {
        expect(
            messages(undefined, {})
        ).toEqual({
            message: '',
            messageType: 'success',
            timestamp: 0,
            hold: false,
            messageTimeoutMS: DEFAULT_MESSAGE_TIMEOUT,
        })
    })
    it('should handle SET_MESSAGE', () => {
        expect(
            messages(undefined, {
                message: 'XXX',
                messageType: 'success',
                type: types.SET_MESSAGE,
                hold: true,
                messageTimeoutMS: 2000,
            })
        ).toEqual({
            message: 'XXX',
            messageType: 'success',
            timestamp: 1,
            hold: true,
            messageTimeoutMS: 2000,
        })
    })
    it('should handle CLEAR_MESSAGE', () => {
        expect(
            messages(undefined, {
                type: types.CLEAR_MESSAGE,
            })
        ).toEqual({
            message: '',
            messageType: 'success',
            timestamp: 0,
            hold: false,
            messageTimeoutMS: DEFAULT_MESSAGE_TIMEOUT,
        })
    })
    it('should handle ACTIVE_VIEW_SET from core actions', () => {
        expect(
            messages(undefined, {
                type: coreActionTypes.ACTIVE_VIEW_SET,
            })
        ).toEqual({
            message: '',
            messageType: 'success',
            timestamp: 0,
            hold: false,
            messageTimeoutMS: DEFAULT_MESSAGE_TIMEOUT,
        })
    })
})
