import get from 'lodash/get'
import isPromise from '../utils/isPromise'
import { showBlockOverlay, hideBlockOverlay } from '../actions/frontend'

export default function blocksUI(target, key, descriptor) {
    return {
        ...descriptor,
        value(...args) {
            const dispatch = get(this, 'props.dispatch')

            if (dispatch) {
                dispatch(showBlockOverlay())
                const returnValue = descriptor.value.apply(this, args)

                if (isPromise) {
                    return returnValue.finally(() => {
                        dispatch(hideBlockOverlay())
                    })
                }

                dispatch(hideBlockOverlay())
                return returnValue
            }

            console.warn('blockUI decorator: dispatch prop not found!');
            return descriptor.value.apply(this, args)
        },
    }
}
