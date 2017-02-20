/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { mount } from 'enzyme'
import TextBaseField from '../../fields/TextField'

const desc = {
    after: '',
    before: '',
    field: '',
    id: 'xxx',
    label: '',
    name: 'xxx',
    placeholder: '',
    readOnly: false,
    disabled: false,
    required: false,
    hidden: false,
    validate: jest.fn(),
    lazy: () => undefined,
}

const p = {
    ...desc,
    fields: {
        name: {},
    },
    input: {},
    meta: {},
    registerFilterField: jest.fn(),
}

describe('TextField', () => {
    it('renders correctly with baseField', () => {
        const props = p
        props.field = 'String'
        props.id = 'name'
        props.getValue = data => data.name
        const field = mount(
            <TextBaseField {...props} />,
        )
        expect(field.find('.basefield').length).toEqual(1)
        expect(field.find('input').length).toEqual(1)
        expect(field.find('input').at(0).prop('id')).toEqual('name')
        expect(field.find('label').length).toEqual(0)
        expect(field.find('p.error-message').length).toEqual(0)
        expect(field.find('p.help').length).toEqual(0)
        /* label */
        field.setProps({ label: 'Name' });
        expect(field.find('label').length).toEqual(1)
        expect(field.find('label').at(0).text()).toEqual('Name')
        /* error */
        field.setProps({ meta: { error: 'XXX', touched: true } });
        expect(field.find('p.error-message').length).toEqual(1)
        expect(field.find('p.error-message').at(0).text()).toEqual('XXX')
        /* helpText */
        field.setProps({ helpText: 'YYY' });
        expect(field.find('p.help').length).toEqual(1)
        expect(field.find('p.help').at(0).text()).toEqual('YYY')
    })
})
