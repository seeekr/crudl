import { Joi, stringProperty, stringOrReactProperty, booleanProperty } from './base'

import onChange from './onChange'

const field = Joi.object().keys({
    // Required Properties
    name: stringProperty().required(),
    field: Joi.alternatives().try(Joi.string(), Joi.func()).required(),

    // Optional properties
    label: stringProperty().default(Joi.ref('name')),
    readOnly: booleanProperty(false),

    // Misc optional
    actions: Joi.object().pattern(/\w+/, Joi.func()),
    id: Joi.string().default(Joi.ref('name')),
    initialValue: Joi.any(),
    defaultValue: Joi.any(),
    key: Joi.string().default(Joi.ref('name')),
    props: Joi.alternatives().try(Joi.object(), Joi.func()).default({}),
    placeholder: stringProperty(''),
    required: Joi.boolean().default(false),
    validate: Joi.func().default(() => undefined),
    onChange,

    // before/after optional
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
})

export default field
