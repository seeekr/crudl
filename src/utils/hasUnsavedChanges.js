import isEqual from 'lodash/isEqual'
import get from 'lodash/get'

export default function hasUnsavedChanges(formState) {
    if (!formState || formState.submitting || formState.submitSucceeded) {
        return false
    }

    return formState.registeredFields.some(({ name }) => {
        const initial = get(formState, `initial[${name}]`)
        const value = get(formState, `values[${name}]`)
        const field = get(formState, `fields[${name}]`, { autofilled: false })
        // The field is NOT dirty when it is autofilled,
        // the initial value is the same as the field value
        // or when the initial value is not set and the value is an empty string
        return !(
            field.autofilled ||
            isEqual(initial, value) ||
            (typeof initial === 'undefined' && value === '')
        )
    })
}
