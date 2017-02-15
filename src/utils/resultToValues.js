import getAllFields from './getAllFields'
import select from './select'

export default function resultToValues(desc, result) {
    const values = {}
    getAllFields(desc).forEach((f) => {
        values[f.name] = select(result, f.key, f.defaultValue)
    })
    return values
}
