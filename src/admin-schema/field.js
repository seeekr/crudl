import { Joi, stringProperty, stringOrReactProperty, booleanProperty } from './base'

import onChange from './onChange'

const field = Joi.object().unknown(true).keys({
    // Required
    name: stringProperty().required(),
    field: Joi.alternatives().try(Joi.string(), Joi.func()).required(),
    // Optional
    id: Joi.string().default(Joi.ref('name')),
    key: Joi.string().default(Joi.ref('name')),
    label: stringProperty().default(Joi.ref('name')),
    readOnly: booleanProperty(false),
    required: booleanProperty(false),
    disabled: booleanProperty(false),
    initialValue: Joi.any(),
    defaultValue: Joi.any(),
    validate: Joi.func().default(() => undefined),
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
