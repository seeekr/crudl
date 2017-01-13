/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Messages } from '../../containers/Messages.jsx'

const props = {
    message: 'Success message',
    messageType: 'success',
    messageTimeoutMS: 4000,
    timestamp: 0,
    hold: false,
}


describe('Messages', () => {
    it('renders correctly', () => {
        const messages = shallow(
            <Messages {...props} />
        )
        expect(messages.find('div#messages.active').length).toEqual(1)
        expect(messages.find('div.message.success').length).toEqual(1)
        expect(messages.find('button').length).toEqual(1)
        expect(messages.find('span').length).toEqual(1)
    })
    it('handles clearMessage with click correctly', () => {
        Messages.prototype.clearMessage = jest.fn()
        const messages = shallow(
            <Messages {...props} />
        )
        messages.find('button').at(0).simulate('click')
        expect(Messages.prototype.clearMessage).toBeCalledWith(props, 0)
    })
    it('handles new props correctly', () => {
        /* with a new message, the previous message should be removed. */
        Messages.prototype.componentWillReceiveProps = jest.fn()
        Messages.prototype.clearMessage = jest.fn()
        const messages = shallow(
            <Messages {...props} />
        )
        const newprops = {
            message: 'Error message',
            messageType: 'error',
            messageTimeoutMS: 4000,
            timestamp: 0,
            hold: false,
        }
        messages.setProps(newprops)
        /* FIXME (Patrick): That is odd, but componentWillReceiveProps is called with a
        2nd parameter context which is not documented anywhere. */
        expect(Messages.prototype.componentWillReceiveProps).toBeCalledWith(newprops, {})
        // expect(Messages.prototype.clearMessage).toBeCalledWith(newprops, 4000)
    })
})
