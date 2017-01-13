/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow, mount, render } from 'enzyme'
import FieldLoader from '../../forms/FieldLoader.jsx'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

const p = {
    desc: {
        after: '',
        before: '',
        field: '',
        id: 'dummy',
        label: 'dummy',
        name: 'dummy',
        placeholder: '',
        props: {},
        readOnly: false,
        required: false,
        validate: jest.fn(),
    },
    input: {},
    meta: {},
    label: '',
    helpText: '',
    disabled: false,
    readOnly: false,
    error: '',
    hidden: false,
    location: {},
    router: {},
}

const s = { form: {} }
const mockStore = configureStore()
const store = mockStore(s)

describe('FieldLoader', () => {
    it('renders correctly', () => {
        const props = p
        props.desc.field = 'String'
        props.desc.id = 'name'
        const field = mount(
            <Provider store={store}>
                <FieldLoader {...props} />
            </Provider>
        )

        expect(field.find('.field-container.type-string').length).toEqual(1)
        expect(field.find('.basefield').length).toEqual(1)
        expect(field.find('.field').length).toEqual(1)
        expect(field.find('.field input').length).toEqual(1)
    })
    it('throws error if field component is not found', () => {
        const props = p
        props.desc.field = 'xxx'
        expect(() => {
            mount(
                <Provider store={store}>
                    <FieldLoader {...props} />
                </Provider>
            )
        }).toThrowError()
    })
})
