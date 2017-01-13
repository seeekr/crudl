/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow } from 'enzyme'
import { FieldButtonGroup } from '../../fields/base/FieldButtonGroup.jsx'

const p = {
    children: undefined,
    desc: undefined,
    disabled: undefined,
    error: undefined,
    errors: undefined,
    fields: undefined,
    input: {},
    meta: {
        touched: false,
        error: false,
    },
    helpText: undefined,
    hidden: undefined,
    id: undefined,
    key: undefined,
    label: undefined,
    layout: 'field-button-inner',
    params: undefined,
    readOnly: undefined,
}

describe('FieldButtonGroup', () => {
    it('renders correctly', () => {
        const props = p
        const field = shallow(
            <FieldButtonGroup {...props} />
        )
        expect(field.find('.field-button-group').length).toEqual(1)
        expect(field.find('.field-button-inner').length).toEqual(1)
    })
})
