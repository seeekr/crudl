import crudlJoi from './crudlJoi'

export const Joi = crudlJoi

export function property(schema, defaultValue) {
    // 'crudlJoi.property()' is a custom schema
    if (typeof defaultValue !== 'undefined') {
        return crudlJoi.property().of(schema.allow(defaultValue).default(defaultValue)).default(defaultValue)
    }
    return crudlJoi.property().of(schema)
}

export function stringProperty(defaultValue) {
    return property(crudlJoi.string(), defaultValue)
}

export function booleanProperty(defaultValue) {
    return property(crudlJoi.boolean(), defaultValue)
}

export function stringOrReactProperty(defaultValue) {
    return property(crudlJoi.alternatives().try(crudlJoi.string(), crudlJoi.object()), defaultValue)
}

/**
 * Create the actions schema of required and optional actions
 */
export function defineActions(required = [], optional = []) {
    const keys = {}
    required.forEach((name) => {
        keys[name] = crudlJoi.func().required()
    })
    optional.forEach((name) => {
        keys[name] = crudlJoi.func()
    })
    return property(crudlJoi.object().keys(keys))
}

/**
 * Create the actions schema of required and optional actions
 */
export function definePermissions(...actions) {
    const keys = {}
    const defaultPermissions = {}
    actions.forEach((name) => {
        keys[name] = Joi.boolean()
        defaultPermissions[name] = true
    })
    return property(crudlJoi.object().keys(keys), defaultPermissions)
}
