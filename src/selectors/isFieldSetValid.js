import { isValid } from 'redux-form'
import get from 'lodash/get'

export default function isFieldSetValid(formName, fieldNames) {
    return (state) => {
        const formState = get(state, `form.${formName}`)
        const registeredFields = get(formState, 'registeredFields', [])
        const subState = {
            form: {
                [formName]: Object.assign({}, formState, {
                    error: undefined,
                    syncError: false,
                    registeredFields: registeredFields.filter(({ name }) => fieldNames.indexOf(name) >= 0),
                }),
            },
        }
        return isValid(formName)(subState)
    }
}
