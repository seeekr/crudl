import isArray from 'lodash/isArray'
export default function asArray(obj = []) {
    return isArray(obj) ? obj : [obj]
}
