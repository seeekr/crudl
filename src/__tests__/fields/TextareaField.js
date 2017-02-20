/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { render, shallow } from 'enzyme'
import field from '../../admin-schema/field'
import { TextareaField } from '../../fields/TextareaField'

const desc = {
    after: '',
    before: '',
    field: 'field',
    id: 'id',
    label: 'label',
    name: 'name',
    placeholder: '',
    required: false,
    validate: jest.fn,
    disabled: false,
    readOnly: false,
}

const p = {
    ...desc,
    input: {
        value: 'value',
        onChange: jest.fn,
    },
    meta: {},
}

describe('TextareaField', () => {
    it('renders correctly', () => {
        const props = p
        const wrapper = render(
            <TextareaField {...props} />,
        )
        expect(wrapper.find('div.field').length).toEqual(1)
        expect(wrapper.find('textarea').length).toEqual(1)
        expect(wrapper.find('textarea[autocomplete="off"]').length).toEqual(1)
    })
    it('renders correctly with desc', () => {
        const props = p
        const wrapper = shallow(
            <TextareaField {...props} />,
        )
        expect(wrapper.find('textarea').at(0).prop('id')).toEqual('id')
        expect(wrapper.find('textarea').at(0).prop('placeholder')).toEqual('')
        expect(wrapper.find('textarea').at(0).prop('data-field-display-name')).toEqual('id')
        expect(wrapper.find('textarea').at(0).prop('data-field-display-values')).toEqual('value')
        expect(wrapper.find('textarea').at(0).prop('disabled')).toEqual(false)
        expect(wrapper.find('textarea').at(0).prop('readOnly')).toEqual(false)
        // desc.placeholder as string
        wrapper.setProps({
            placeholder: 'string',
        })
        expect(wrapper.find('textarea').at(0).prop('placeholder')).toEqual('string')
        // desc.placeholder as function
        const d = field.validate({
            ...desc,
            placeholder: () => 'function',
        }).value
        wrapper.setProps(d)
        expect(wrapper.find('textarea').at(0).prop('placeholder')).toEqual('function')
    })
})
