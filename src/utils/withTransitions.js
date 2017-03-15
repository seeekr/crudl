import React from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import last from 'lodash/last'

import { transitions } from '../actions/core'

function withTransitions(Component) {
    @autobind
    class TransitionNode extends React.Component {

        static displayName = `TransitionNode(${Component.displayName || Component.name})`;

        static propTypes = {
            dispatch: React.PropTypes.func.isRequired,
            storedData: React.PropTypes.object.isRequired, // eslint-disable-line
            trace: React.PropTypes.array.isRequired, // eslint-disable-line
            desc: React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
            }).isRequired,
        }

        enter(to, params = {}, storedData) {
            const { dispatch, desc } = this.props

            const transition = {
                from: desc.id,
                to,
                params,
                storedData,
                hasReturned: false,
            }

            dispatch(transitions.go(transition))
        }

        leave(returnValue) {
            const { dispatch, desc } = this.props
            const lastTransition = last(this.props.trace)

            if (lastTransition) {
                const transition = {
                    from: lastTransition.to,
                    to: lastTransition.from,
                    returnValue,
                    hasReturned: true,
                }
                dispatch(transitions.go(transition))
                return
            }

            throw new Error(`Cannot leave the view ${desc.id}. There hasn't been a preceeding transition.`)
        }

        render() {
            const { desc, trace, storedData } = this.props
            const lastTransition = last(trace)

            // initial transition state
            const transitionState = {
                inProgress: false,
                hasReturned: false,
                params: {},
            }

            if (lastTransition) {
                Object.assign(transitionState, lastTransition, {
                    storedData: storedData[desc.id],
                    inProgress: true,
                })
            }

            return (
                <Component
                    {...this.props}
                    transitionEnter={this.enter}
                    transitionLeave={this.leave}
                    transitionState={transitionState}
                    />
            )
        }
    }
    return connect(state => ({
        trace: state.core.transitions.trace,
        storedData: state.core.transitions.storedData,
    }))(TransitionNode)
}

export default withTransitions
