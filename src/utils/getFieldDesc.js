import getAllFields from './getAllFields'

export default function getFieldDesc(viewDesc, fieldName) {
    return getAllFields(viewDesc).find(f => f.name === fieldName)
}
