/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { mount } from 'enzyme'
import TextBaseField from '../../fields/TextField'

const p = {
    desc: {
        after: '',
        before: '',
        field: '',
        id: 'xxx',
        label: 'xxx',
        name: 'xxx',
        placeholder: '',
        props: {},
        readOnly: false,
        required: false,
        validate: jest.fn(),
    },
    fields: {
        name: {},
    },
    input: {},
    meta: {},
    label: '',
    helpText: '',
    disabled: false,
    readOnly: false,
    error: '',
    hidden: false,
    registerFilterField: jest.fn(),
}

describe('TextField', () => {
    it('renders correctly with baseField', () => {
        const props = p
        props.desc.field = 'String'
        props.desc.id = 'name'
        const field = mount(
            <TextBaseField {...props} />
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
        field.setProps({ error: 'XXX' });
        expect(field.find('p.error-message').length).toEqual(1)
        expect(field.find('p.error-message').at(0).text()).toEqual('XXX')
        /* helpText */
        field.setProps({ helpText: 'YYY' });
        expect(field.find('p.help').length).toEqual(1)
        expect(field.find('p.help').at(0).text()).toEqual('YYY')
    })
})
