import isEqual from 'lodash/isEqual'

/**
* Return the difference between a and b, such that
* b == Object.assign({}, a, objectDiff(a, b))
*/
export default function objectDiff(a, b) {
    const diff = {}
    Object.keys(a).concat(Object.keys(b)).forEach((k) => {
        if (!isEqual(a[k], b[k])) {
            diff[k] = b[k]
        }
    })
    return diff
}
