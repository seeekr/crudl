import React from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { routerShape, locationShape } from 'react-router/lib/PropTypes'
import { parsePath } from 'history'
import { autobind } from 'core-decorators'

import { resolvePath, getSiblingDesc } from '../Crudl'
import { viewCalls } from '../actions/core'

function withViewCalls(Component) {
    @autobind
    class ViewCaller extends React.Component {

        static displayName = `ViewCaller(${Component.displayName || Component.name})`;

        static propTypes = {
            router: routerShape.isRequired,
            location: locationShape.isRequired,
            dispatch: React.PropTypes.func.isRequired,
            callstate: React.PropTypes.shape({
                hasReturned: React.PropTypes.bool,
                returnValue: React.PropTypes.any,
                storedData: React.PropTypes.any,
                callstate: React.PropTypes.array,
            }).isRequired,
            desc: React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
            }).isRequired,
        }

        enterView(path, data, params, fromRelation = false) {
            const { location, router, dispatch, callstate } = this.props
            const { pathname, search, hash } = location
            const nextLocation = parsePath(path)

            const state = {
                hasReturned: false,
                returnValue: undefined,
                storedData: undefined,
                callstack: [
                    ...callstate.callstack,
                    {
                        returnLocation: { pathname, search, hash },
                        storedData: data,
                        params,
                        fromRelation,
                    },
                ],
                callInProgress: true,
            }

            dispatch(viewCalls.setState(state))

            router.push({
                ...nextLocation,
                state: {
                    ...location.state,
                    callInProgress: true,
                },
            })
        }

        enterRelation(path, data, params) {
            this.enterView(path, data, params, true)
        }

        leaveView(returnValue) {
            const { router, dispatch, callstate, location, desc } = this.props
            const callstack = callstate.callstack
            const head = callstack[callstack.length - 1]
            const defaultReturnPath = getSiblingDesc(desc.id, 'listView').path

            // Obtain the return location
            let returnLocation
            if (head) {
                returnLocation = head.returnLocation
            } else if (defaultReturnPath) {
                returnLocation = parsePath(resolvePath(defaultReturnPath))
            } else {
                throw new Error('Cannot leave the view. Neither callstack nor defaultReturnPath are defined!')
            }

            const state = {
                hasReturned: true,
                returnValue,
                storedData: get(head, 'storedData'),
                callstack: callstack.slice(0, -1),
                callInProgress: true,
            }

            dispatch(viewCalls.setState(state))

            // Leave
            router.push({
                ...returnLocation,
                state: {
                    ...location.state,
                    callInProgress: true,
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
            const callstate = this.props.callstate
            const { enterView, leaveView, enterRelation, switchToView } = this
            const callInProgress = get(this.props.location.state, 'callInProgress') && callstate.callInProgress

            let fromRelation = false
            let params = {}
            let hasReturned = false
            let returnValue
            let storedData

            if (callInProgress) {
                fromRelation = get(callstate.callstack[callstate.callstack.length - 1], 'fromRelation', fromRelation)
                params = get(callstate.callstack[callstate.callstack.length - 1], 'params', params)
                hasReturned = callstate.hasReturned
                returnValue = callstate.returnValue
                storedData = callstate.storedData
            }

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
                        params,
                    }}
                    />
            )
        }
    }
    return connect(state => ({
        callstate: state.core.viewCalls.state,
    }))(ViewCaller)
}

export default withViewCalls
