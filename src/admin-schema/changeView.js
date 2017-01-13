import { Joi, defineActions, definePermissions, stringOrReactProperty } from './base'

import field from './field'
import fieldset from './fieldset'
import tab from './tab'

const changeView = Joi.formView().provideId().keys({
    // Required
    path: Joi.string().required(),
    title: Joi.string().required(),
    actions: defineActions(['get', 'save'], ['delete']).required(),

    // Either fields or fieldsets but not both
    fields: Joi.array().items(field),
    fieldsets: Joi.array().items(fieldset),

    // Optional
    tabtitle: Joi.string(),
    tabs: Joi.array().items(tab),
    normalize: Joi.func().default(data => data),
    denormalize: Joi.func().default(data => data),
    validate: Joi.func().default(() => undefined),
    permissions: definePermissions('get', 'save', 'delete'),
    id: Joi.string(),

    // before/after optional
    before: stringOrReactProperty(''),
    after: stringOrReactProperty(''),
})
.xor('fields', 'fieldsets')

export default changeView
