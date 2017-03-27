import getAllFields from './getAllFields'

/*
* @desc add, change or tab view descriptor
* @data data from the frontend
*/
export default function denormalize(desc, data) {
    const result = {}
    getAllFields(desc).forEach((f) => {
        result[f.name] = f.denormalize(data[f.name])
    })
    return desc.denormalize(result)
}
