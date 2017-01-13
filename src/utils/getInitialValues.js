import getAllFields from './getAllFields'
import asFunc from './asFunc'

export default function getInitialValues(desc) {
    const values = {}

    getAllFields(desc).forEach((f) => {
        values[f.name] = asFunc(f.initialValue)()
    })

    return values
}
