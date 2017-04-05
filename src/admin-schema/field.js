import { Joi, stringProperty, stringOrReactProperty, booleanProperty, defineActions, definePermissions } from './base'

import onChange from './onChange'

const field = Joi.object().unknown(true).keys({
    // Required
    name: stringProperty().required(),
    field: Joi.any().default('hidden').when('hidden', {
        is: false,
        then: Joi.alternatives().try(Joi.string(), Joi.func()).required(),
    }),
    // Optional
    id: Joi.string().default(Joi.ref('name')),
    label: stringProperty().default(Joi.ref('name')),
    readOnly: booleanProperty(false),
    required: booleanProperty(false),
    disabled: booleanProperty(false),
    hidden: booleanProperty(false),
    getValue: Joi.func().bound().default(function (result) { return result[this.name] }),
    initialValue: Joi.any(),
    validate: Joi.func().default(() => undefined),
    normalize: Joi.func().default(data => data),
    denormalize: Joi.func().default(data => data),
    onChange,
    before: stringOrReactProperty(''),
    after: stringOrReactProperty(''),
    // Relations optional
    add: Joi.formView().provideId().keys({
        // Required
        title: Joi.string().required(),
        actions: defineActions(['add']).required(),

        // Either fields or fieldsets but not both
        fields: Joi.array().items(Joi.lazy(() => require('./field').default)),
        fieldsets: Joi.array().items(Joi.lazy(() => require('./fieldset').default)),

        // Optional
        validate: Joi.func().default(() => undefined),
        denormalize: Joi.func().default(data => data),
        permissions: definePermissions('add'),
        id: Joi.string(),
    }).xor('fields', 'fieldsets'),
    edit: Joi.formView().provideId().keys({
        // Required
        title: Joi.string().required(),
        actions: defineActions(['get', 'save']).required(),

        // Either fields or fieldsets but not both
        fields: Joi.array().items(Joi.lazy(() => require('./field').default)),
        fieldsets: Joi.array().items(Joi.lazy(() => require('./fieldset').default)),

        // Optional
        validate: Joi.func().default(() => undefined),
        normalize: Joi.func().default(data => data),
        denormalize: Joi.func().default(data => data),
        permissions: definePermissions('get', 'save'),
        id: Joi.string(),
    }).xor('fields', 'fieldsets'),
    // Async part of the descriptor: a function returning an object or a promise
    lazy: Joi.func().default(() => ({})),
})

export default field
