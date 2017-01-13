/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { render, shallow } from 'enzyme'
import field from '../../admin-schema/field'
import { TextField } from '../../fields/TextField'

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
    // it('renders correctly with desc.placeholder as string', () => {
    //     const props = p
    //     props.desc.placeholder = 'placeholder'
    //     props.desc = field.validate(props.desc).value // validate placeholder w. field schema
    //     const wrapper = shallow(
    //         <TextField {...props} />,
    //     )
    //     expect(wrapper.find('input').at(0).prop('placeholder')).toEqual('placeholder')
    // })
    // it('renders correctly with desc.placeholder as function', () => {
    //     const props = p
    //     props.desc.placeholder = () => 'placeholder'
    //     props.desc = field.validate(props.desc).value // validate placeholder w. field schema
    //     const wrapper = shallow(
    //         <TextField {...props} />,
    //     )
    //     expect(wrapper.find('input').at(0).prop('placeholder')).toEqual('placeholder')
    // })
})
