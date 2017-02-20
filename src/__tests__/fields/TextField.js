/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { render, shallow } from 'enzyme'
import field from '../../admin-schema/field'
import { TextField } from '../../fields/TextField'

const desc = {
    after: '',
    before: '',
    field: 'field',
    id: 'id',
    label: 'label',
    name: 'name',
    placeholder: '',
    props: {},
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

describe('TextField', () => {
    it('renders correctly', () => {
        const props = p
        const wrapper = render(<TextField {...props} />)
        expect(wrapper.find('div.field').length).toEqual(1)
        expect(wrapper.find('input[type="text"]').length).toEqual(1)
        expect(wrapper.find('input[autocomplete="off"]').length).toEqual(1)
    })
    it('renders correctly with desc', () => {
        const props = p
        const wrapper = shallow(<TextField {...props} />)
        expect(wrapper.find('input').at(0).prop('id')).toEqual('id')
        expect(wrapper.find('input').at(0).prop('placeholder')).toEqual('')
        expect(wrapper.find('input').at(0).prop('data-field-display-name')).toEqual('id')
        expect(wrapper.find('input').at(0).prop('data-field-display-values')).toEqual('value')
        expect(wrapper.find('input').at(0).prop('disabled')).toEqual(false)
        expect(wrapper.find('input').at(0).prop('readOnly')).toEqual(false)
        // desc.placeholder as string
        wrapper.setProps({ placeholder: 'string' })
        expect(wrapper.find('input').at(0).prop('placeholder')).toEqual('string')
    })
})
