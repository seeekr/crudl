/* globals jest, require, test, expect, describe, it, beforeEach */
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { reduxForm } from 'redux-form'

import React from 'react'
import { shallow, mount } from 'enzyme'
import ChangeViewForm from '../../forms/ChangeViewForm'
import changeViewSchema from '../../admin-schema/changeView'

jest.mock('../../Crudl')
const crudl = require('../../Crudl')

crudl.hasPermission = () => true

const s = {
    form: {},
    frontend: {},
    core: {
        auth: {
            loggedIn: false,
            requestHeaders: {},
            info: {},
        },
        cache: {
            listView: {
                key: undefined,
                state: undefined,
            },
        },
        navigation: {
            backTo: undefined,
        },
        activeView: undefined,
    },
    routing: {},
    messages: {},
    filters: {},
    watch: jest.fn,
}
const mockStore = configureStore()
const store = mockStore(s)

const props = {
    desc: {
        id: 'changeView',
        path: 'change',
        title: 'test detail',
        actions: {
            get: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
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
        saveAndBack: 'Save and back',
        saveAndContinue: 'Save and Continue',
        delete: 'Delete',
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
    onDelete: undefined,
    onSave: undefined,
    onSaveAndContinue: undefined,
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
    form: 'change-form',
}
const handleSubmit = jest.fn()
props.handleSubmit = handleSubmit
const onDelete = jest.fn()
props.onDelete = onDelete
const onSave = jest.fn()
props.onSave = onSave
const onSaveAndContinue = jest.fn()
props.onSaveAndContinue = onSaveAndContinue


describe('ChangeViewForm', () => {
    it('renders correctly', () => {
        props.desc = changeViewSchema.validate(props.desc).value
        const changeviewform = shallow(
            <ChangeViewForm {...props} />
        )
        /* debug */
        // console.log(changeviewform.debug())
        expect(changeviewform.find('form').length).toEqual(1)
        expect(changeviewform.find('div.form-error').length).toEqual(0)
        expect(changeviewform.find('Connect(PropsWatcher(FieldSet))').length).toEqual(1)
        expect(changeviewform.find('ul.buttons').length).toEqual(1)
        expect(changeviewform.find('ul.buttons li').length).toEqual(3)
        expect(changeviewform.find('ul.buttons button').length).toEqual(3)
        expect(changeviewform.find('ul.buttons button.action-delete').length).toEqual(1)
        expect(changeviewform.find('ul.buttons button.action-save').length).toEqual(2)
        expect(changeviewform.find('ul.buttons button.action-save.secondary').length).toEqual(1)
    })
    it('renders error (non field error) correctly', () => {
        props.error = 'xxx'
        const changeviewform = shallow(
            <ChangeViewForm {...props} />
        )
        expect(changeviewform.find('div.form-error').length).toEqual(0)
        /* at least one field has to be touched */
        changeviewform.setProps({
            anyTouched: true,
        })
        expect(changeviewform.find('div.form-error').length).toEqual(1)
    })
    it('renders delete correctly', () => {
        props.onDelete = undefined
        const changeviewform = shallow(
            <ChangeViewForm {...props} />
        )
        expect(changeviewform.find('ul.buttons button').length).toEqual(2)
        expect(changeviewform.find('ul.buttons button.action-delete').length).toEqual(0)
    })
    it('renders disabled save buttons correctly', () => {
        const changeviewform = shallow(
            <ChangeViewForm {...props} />
        )
        expect(changeviewform.find('button.action-save').at(0).prop('aria-disabled')).toEqual(true)
        expect(changeviewform.find('button.action-save').at(1).prop('aria-disabled')).toEqual(true)
        /* buttons are enabled if something has been changed */
        changeviewform.setProps({
            dirty: true,
        })
        expect(changeviewform.find('button.action-save').at(0).prop('aria-disabled')).toEqual(false)
        expect(changeviewform.find('button.action-save').at(1).prop('aria-disabled')).toEqual(false)
        /* buttons are disabled when submitting the form */
        changeviewform.setProps({
            submitting: true,
        })
        expect(changeviewform.find('button.action-save').at(0).prop('aria-disabled')).toEqual(true)
        expect(changeviewform.find('button.action-save').at(1).prop('aria-disabled')).toEqual(true)
    })
    it('handles delete click correctly', () => {
        props.onDelete = onDelete
        const changeviewform = shallow(
            <ChangeViewForm {...props} />
        )
        changeviewform.find('button.action-delete').at(0).simulate('click')
        expect(handleSubmit).toBeCalled()
        expect(handleSubmit).toBeCalledWith(onDelete)
    })
    it('handles save click correctly', () => {
        const changeviewform = shallow(
            <ChangeViewForm {...props} />
        )
        changeviewform.find('button.action-save').at(0).simulate('click')
        expect(handleSubmit).toBeCalled()
        expect(handleSubmit).toBeCalledWith(onSave)
    })
    it('handles save and continue click correctly', () => {
        const changeviewform = shallow(
            <ChangeViewForm {...props} />
        )
        changeviewform.find('button.action-save').at(1).simulate('click')
        expect(handleSubmit).toBeCalled()
        expect(handleSubmit).toBeCalledWith(onSaveAndContinue)
    })
})

describe('ChangeViewForm', () => {
    it('mounts correctly', () => {
        const Decorated = reduxForm({ form: 'testForm' })(ChangeViewForm)
        const changeviewform = mount(
            <Provider store={store}>
                <Decorated {...props} />
            </Provider>
        )
        /* debug */
        // console.log(changeviewform.debug())
        expect(changeviewform.find('form').length).toEqual(1)
    })
})
