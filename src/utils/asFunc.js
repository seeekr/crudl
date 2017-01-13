
export default function asFunc(obj) {
    return typeof obj === 'function' ? obj : () => obj
}
