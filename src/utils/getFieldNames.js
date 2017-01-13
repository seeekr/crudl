import getAllFields from './getAllFields'

// Get all Redux Form field names for this admin
export default function getFieldNames(desc) {
    return getAllFields(desc).map(f => f.name)
}
