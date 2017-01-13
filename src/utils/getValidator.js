import { createValidator, composeValidators, combineValidators } from 'revalidate'
import getAllFields from './getAllFields'
import getFieldNames from './getFieldNames'

/**
 * Combines the frontend validation functions of a admin into a single
 * validate function.
 */
export default function getValidator(desc) {
    const combined = {}
    const fields = getAllFields(desc)
    getFieldNames(desc).forEach((name, index) => {
        combined[name] = composeValidators(createValidator(() => fields[index].validate, ''))()
    })
    return function validator(values) {
        const fieldValidators = combineValidators(combined)(values)
        const all = desc.validate ? desc.validate(values) : {}
        return { ...fieldValidators, ...all }
    }
}
