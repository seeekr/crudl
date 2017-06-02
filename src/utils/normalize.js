import getAllFields from './getAllFields'

/*
* @desc add or change view descriptor
* @data data from the backend
*/
export default function normalize(desc, data) {
    const result = {}
    getAllFields(desc).forEach((f) => {
        if (f.normalize) {
            result[f.name] = f.normalize(f.getValue(data))
        }
    })
    if (desc.normalize) {
        return desc.normalize(result)
    }
    return result
}
