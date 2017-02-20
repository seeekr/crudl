/* globals jest, require, test, expect, describe, it, beforeEach */
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import React from 'react'
import { mount } from 'enzyme'
import FieldLoader from '../../forms/FieldLoader'
import fieldSchema from '../../admin-schema/field'

const desc = {
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
    helpText: '',
    disabled: false,
    hidden: false,
}

const p = {
    desc,
    input: {},
    meta: {},
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
        props.desc = fieldSchema.validate(props.desc).value
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
