import getAllFields from './getAllFields'

/*
* @desc add or change view descriptor
* @data data from the backend
*/
export default function normalize(desc, data) {
    const result = {}
    getAllFields(desc).forEach((f) => {
        result[f.name] = f.normalize(f.getValue(data))
    })
    return desc.normalize(result)
}
