import Joi from 'joi'
import schema from '../admin-schema/admin'

/**
 * Validates the admin against its schema
 */
export default function validateAdmin(admin) {
    const result = Joi.validate(admin, schema)

    if (result.error) {
        throw result.error
    }

    return result.value
}
