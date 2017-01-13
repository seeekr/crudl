
export default function getAllFields(desc) {
    if (!desc.fields && !desc.fieldsets) {
        throw new Error('The provided descriptor does not define any fields')
    }

    return desc.fields || [].concat(...desc.fieldsets.map(fs => fs.fields))
}
