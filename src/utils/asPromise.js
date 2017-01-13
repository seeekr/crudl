import isPromise from './isPromise'

/**
 * Returns
 *  1) obj if obj is already a promise
 *  2) A promise that invokes obj(...args), if obj is a function
 *  3) Promise.resolve(obj) otherwise
 *
 */
export default function asPromise(obj, ...args) {
    // obj is a promise?
    if (isPromise(obj)) {
        return obj
    }

    // If obj is a function, return a Promise that wraps this function
    if (typeof obj === 'function') {
        return new Promise((resolve, reject) => {
            try {
                resolve(obj(...args))
            } catch (e) {
                reject(e)
            }
        })
    }

    return Promise.resolve(obj)
}
