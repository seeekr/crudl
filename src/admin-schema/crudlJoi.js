import Joi from 'joi'

/**
 * Definition of a property schema.
 *
 * A property has a type and it validates if the value is of this type or it is a function
 * which returns this type. If it is a function, then it is considered as the getter method
 * of the property. In that case, there must exist a parent object, which obtains this property.
 * The return value of the getter is validated everytime it is invoked.
 * The setter is an empty function, that is the property value cannot bechanged.
 *
 * Example:
 *      let A = { num: 1 }
 *      let B = { num: () => 1 }
 *      let C = { num: () => 'xyz' }
 *      let schema = Joi.object().keys({ num: Joi.property().of(Joi.number()) })
 *      schema.validate(A); // validates
 *      schema.validate(B); // validates and B.num == 1
 *      schema.validate(C); // validates, but accesss to C.num throws a validation error
 */
const property = {
    name: 'property',
    base: Joi.any(),
    language: {
        of: 'property.of: \'{{v}}\' must be {{t}}',
    },
    rules: [
        {
            name: 'of',
            params: {
                schema: Joi.any().required(),
            },
            validate(params, value, state, options) {
                // If value is a function, consider it as a property getter
                if (typeof value === 'function') {
                    Object.defineProperty(state.parent, state.key, {
                        set() {
                            // Ignore any attempts to assign a value
                        },
                        get() {
                            const returnValue = value()
                            // Validate the returnValue
                            const v = params.schema.validate(returnValue)
                            if (v.error) {
                                throw new Error(`The return value of ${state.key}() must be a ${params.schema._type}. Found: ${returnValue}`) // eslint-disable-line
                            }
                            return v.value
                        },
                    })
                    return value
                }

                const v = params.schema.validate(value)

                if (v.error) {
                    return this.createError(
                        'property.of',
                        { v: value, t: params.schema._type }, // eslint-disable-line no-underscore-dangle
                        state,
                        options)
                }

                return v.value
            },
        },
    ],
}

/**
 * Extend an object with a rule 'id'.
 */
const object = {
    name: 'object',
    base: Joi.object(),
    rules: [
        {
            name: 'provideId',
            params: {
                id: Joi.string(),
            },
            validate(params, value, state, options) { // eslint-disable-line no-unused-vars
                if (!value.id) {
                    Object.assign(value, { id: params.id || state.path.replace(/\./g, '/') })
                }
                return value
            },
        },
    ],
}

const intermediateJoi = Joi.extend(property, object)

const formView = {
    name: 'formView',
    base: intermediateJoi.object(),
    coerce(value, state, options) { // eslint-disable-line no-unused-vars
        // Change fields to fieldsets
        if (value && value.fields) {
            Object.assign(value, { fieldsets: [{ fields: value.fields }], fields: undefined })
        }
        return value
    },
}

export default intermediateJoi.extend(formView)
