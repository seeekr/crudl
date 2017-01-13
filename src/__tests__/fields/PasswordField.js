/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { render, shallow } from 'enzyme'
import field from '../../admin-schema/field'
import { PasswordField } from '../../fields/PasswordField'

const p = {
    desc: {
        after: '',
        before: '',
        field: 'field',
        id: 'id',
        label: 'label',
        name: 'name',
        placeholder: '',
        props: {},
        readOnly: false,
        required: false,
        validate: jest.fn,
    },
    input: {
        value: 'value',
        onChange: jest.fn,
    },
    meta: {},
    disabled: false,
    readOnly: false,
}

describe('PasswordField', () => {
    it('renders correctly', () => {
        const props = p
        const wrapper = render(
            <PasswordField {...props} />,
        )
        expect(wrapper.find('div.field').length).toEqual(1)
        expect(wrapper.find('input[type="password"]').length).toEqual(1)
        expect(wrapper.find('input[autocomplete="off"]').length).toEqual(1)
    })
    it('renders correctly with desc', () => {
        const props = p
        const wrapper = shallow(
            <PasswordField {...props} />,
        )
        expect(wrapper.find('input').at(0).prop('id')).toEqual('id')
        expect(wrapper.find('input').at(0).prop('placeholder')).toEqual('')
        expect(wrapper.find('input').at(0).prop('data-field-display-name')).toEqual('id')
        expect(wrapper.find('input').at(0).prop('data-field-display-values')).toEqual('value')
        expect(wrapper.find('input').at(0).prop('disabled')).toEqual(false)
        expect(wrapper.find('input').at(0).prop('readOnly')).toEqual(false)
        // desc.placeholder as string
        wrapper.setProps({
            desc: {
                ...props.desc,
                placeholder: 'string',
            },
        })
        expect(wrapper.find('input').at(0).prop('placeholder')).toEqual('string')
        // desc.placeholder as function
        const d = field.validate({
            ...props.desc,
            placeholder: () => 'function',
        }).value
        wrapper.setProps({ desc: d })
        expect(wrapper.find('input').at(0).prop('placeholder')).toEqual('function')
    })
})
