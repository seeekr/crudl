import get from 'lodash/get'

export default function formFields(formName) {
    return (state) => {
        const form = state.form[formName]
        if (form) {
            const registeredFields = get(form, 'registeredFields', [])
            return registeredFields.reduce((fields, { name }) => Object.assign(fields, {
                [name]: {
                    value: get(form.values, name),
                    initialValue: get(form.initial, name),
                    ...get(form.fields, name)
                },
            }), {})
        }
        return {}
    }
}
