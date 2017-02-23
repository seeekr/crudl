import { Joi, stringProperty, stringOrReactProperty, booleanProperty } from './base'

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
    add: Joi.object().keys({
        path: stringProperty().required(),
        returnValue: Joi.func(),
    }),
    edit: Joi.object().keys({
        path: stringProperty().required(),
        returnValue: Joi.func(),
    }),
    // Async part of the descriptor: a function returning an object or a promise
    lazy: Joi.func().default(() => ({})),
})

export default field
