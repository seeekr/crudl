import { Joi, defineActions } from './base'

import field from './field'
import fieldset from './fieldset'

const login = Joi.formView().provideId('login').keys({
    // Required
    actions: defineActions(['login']),

    // Either fields or fieldsets but not both
    fields: Joi.array().items(field),
    fieldsets: Joi.array().items(fieldset),

    // Optional
    path: Joi.string().default('login'),
    title: Joi.string().default('Login'),
    validate: Joi.func().default(() => undefined),
    id: Joi.string(),
})
.xor('fields', 'fieldsets')

export default login
