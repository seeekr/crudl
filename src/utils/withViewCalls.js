import React from 'react'
import get from 'lodash/get'
import { routerShape, locationShape } from 'react-router/lib/PropTypes'
import { parsePath } from 'history'

import { pathShape } from '../PropTypes'
import { resolvePath } from '../Crudl'

const initialCallstate = {
    hasReturned: false,
    returnValue: undefined,
    storedData: undefined,
    callstack: [],
}

function withViewCalls(Component) {
    class ViewCaller extends React.Component {

        static displayName = `ViewCaller(${Component.displayName || Component.name})`;

        static propTypes = {
            router: routerShape.isRequired,
            location: locationShape.isRequired,
            defaultReturnPath: pathShape,
        }

        constructor() {
            super()
            this.enterView = this.enterView.bind(this)
            this.enterRelation = this.enterRelation.bind(this)
            this.leaveView = this.leaveView.bind(this)
            this.switchToView = this.switchToView.bind(this)
        }

        enterView(path, data, fromRelation = false) {
            const { location, router } = this.props
            const { pathname, search, hash } = location
            const nextLocation = parsePath(path)

            router.push({
                ...nextLocation,
                state: {
                    ...location.state,
                    hasReturned: false,
                    returnValue: undefined,
                    storedData: undefined,
                    callstack: [
                        ...get(location.state, 'callstack', []),
                        {
                            returnLocation: { pathname, search, hash },
                            storedData: data,
                            fromRelation,
                        }],
                },
            })
        }

        enterRelation(path, data) {
            this.enterView(path, data, true)
        }

        leaveView(returnValue) {
            const { router, location, defaultReturnPath } = this.props
            const callstack = get(location.state, 'callstack', [])
            const head = callstack[callstack.length - 1]

            // Obtain the return location
            let returnLocation
            if (head) {
                returnLocation = head.returnLocation
            } else if (defaultReturnPath) {
                returnLocation = parsePath(resolvePath(defaultReturnPath))
            } else {
                throw new Error('Cannot leave the view. Neither callstack nor defaultReturnPath are defined!')
            }

            // Leave
            router.push({
                ...returnLocation,
                state: {
                    hasReturned: true,
                    returnValue,
                    storedData: get(head, 'storedData'),
                    callstack: callstack.slice(0, -1),
                },
            })
        }

        switchToView(path) {
            const { location, router } = this.props
            const nextLocation = parsePath(path)

            router.replace({
                ...nextLocation,
                state: location.state,
            })
        }

        render() {
            const { enterView, leaveView, enterRelation, switchToView } = this
            const callstate = get(this.props.location, 'state', initialCallstate)
            const fromRelation = get(callstate.callstack[callstate.callstack.length - 1], 'fromRelation', false)
            const hasReturned = callstate.hasReturned
            const returnValue = callstate.returnValue
            const storedData = callstate.storedData
            return (
                <Component
                    {...this.props}
                    viewCalls={{
                        enterView,
                        enterRelation,
                        leaveView,
                        switchToView,
                        fromRelation,
                        hasReturned,
                        storedData,
                        returnValue,
                    }}
                    />
            )
        }
    }
    return ViewCaller
}

export default withViewCalls
