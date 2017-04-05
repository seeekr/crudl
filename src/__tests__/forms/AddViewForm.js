/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow } from 'enzyme'
import AddViewForm from '../../forms/AddViewForm'

jest.mock('../../Crudl')
const crudl = require('../../Crudl')
crudl.hasPermission = () => true

const props = {
    desc: {
        id: 'addView',
        path: 'add',
        title: 'test detail',
        actions: {
            add: jest.fn(),
        },
        fieldsets: [
            {
                fields: [
                    {
                        field: 'String',
                        id: 'name',
                        label: 'Name',
                        name: 'name',
                    },
                ],
            },
        ],
    },
    labels: {
        save: 'Save',
        saveAndContinue: 'Save and Continue',
        saveAndAddAnother: 'Save and add another',
    },
    asyncValidate: jest.fn(),
    asyncValidating: false,
    destroyForm: jest.fn(),
    dirty: false,
    dispatch: jest.fn(),
    error: undefined,
    formKey: undefined,
    handleSubmit: undefined,
    initializeForm: jest.fn(),
    invalid: false,
    onSave: undefined,
    onSaveAndContinue: undefined,
    onSaveAndAddAnother: undefined,
    onSubmitFail: jest.fn(),
    overwriteOnInitialValuesChange: true,
    pristine: true,
    readonly: false,
    resetForm: jest.fn(),
    submitFailed: false,
    submitPassback: jest.fn(),
    submitting: false,
    touch: jest.fn(),
    touchAll: jest.fn(),
    untouch: jest.fn(),
    untouchAll: jest.fn(),
    valid: true,
    anyTouched: false,
    form: 'add-form',
    watch: jest.fn,
}
const handleSubmit = jest.fn()
props.handleSubmit = handleSubmit
const onSave = jest.fn()
props.onSave = onSave
const onSaveAndContinue = jest.fn()
props.onSaveAndContinue = onSaveAndContinue
const onSaveAndAddAnother = jest.fn()
props.onSaveAndAddAnother = onSaveAndAddAnother


describe('AddViewForm', () => {
    it('renders correctly', () => {
        const addviewform = shallow(
            <AddViewForm {...props} />
        )
        /* debug */
        // console.log(addviewform.debug())
        expect(addviewform.find('form').length).toEqual(1)
        expect(addviewform.find('div.form-error').length).toEqual(0)
        expect(addviewform.find('Connect(PropsWatcher(FieldSet))').length).toEqual(1)
        expect(addviewform.find('ul.buttons').length).toEqual(1)
        expect(addviewform.find('ul.buttons li').length).toEqual(3)
        expect(addviewform.find('ul.buttons button').length).toEqual(3)
        expect(addviewform.find('ul.buttons button.action-save').length).toEqual(3)
        expect(addviewform.find('ul.buttons button.action-save.secondary').length).toEqual(2)
    })
    it('renders error (non field error) correctly', () => {
        props.error = 'xxx'
        const addviewform = shallow(
            <AddViewForm {...props} />
        )
        expect(addviewform.find('div.form-error').length).toEqual(0)
        /* at least one field has to be touched */
        addviewform.setProps({
            anyTouched: true,
        })
        expect(addviewform.find('div.form-error').length).toEqual(1)
    })
    it('renders disabled save buttons correctly', () => {
        const addviewform = shallow(
            <AddViewForm {...props} />
        )
        expect(addviewform.find('button.action-save').at(0).prop('aria-disabled')).toEqual('false')
        expect(addviewform.find('button.action-save').at(1).prop('aria-disabled')).toEqual('false')
        expect(addviewform.find('button.action-save').at(2).prop('aria-disabled')).toEqual('false')
    })
    it('handles save click correctly', () => {
        const addviewform = shallow(
            <AddViewForm {...props} />
        )
        addviewform.find('button.action-save').at(0).simulate('click')
        expect(handleSubmit).toBeCalled()
        expect(handleSubmit).toBeCalledWith(onSave)
    })
    it('handles save and continue click correctly', () => {
        const addviewform = shallow(
            <AddViewForm {...props} />
        )
        addviewform.find('button.action-save').at(1).simulate('click')
        expect(handleSubmit).toBeCalled()
        expect(handleSubmit).toBeCalledWith(onSaveAndContinue)
    })
    it('handles save and add another click correctly', () => {
        const addviewform = shallow(
            <AddViewForm {...props} />
        )
        addviewform.find('button.action-save').at(2).simulate('click')
        expect(handleSubmit).toBeCalled()
        expect(handleSubmit).toBeCalledWith(onSaveAndAddAnother)
    })
})
