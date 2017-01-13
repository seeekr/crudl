
/**
 * Returns a promise that resolves to `valueAfterTimeout` after `milliseconds` elapsed,
 * unless the `racedPromise` resolves first. In that case it resolves to the value of `racedPromise`
 */
export default function timeoutPromise(racedPromise, milliseconds, valueAfterTimeout) {
    const timeoutPromise = new Promise((resolve) => {
        window.setTimeout(() => resolve(valueAfterTimeout), milliseconds)
    })
    return Promise.race([
        racedPromise,
        timeoutPromise,
    ])
}
