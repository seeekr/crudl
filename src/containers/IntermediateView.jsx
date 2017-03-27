import React from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import withTransitions from '../utils/withTransitions'
import Header from '../components/Header'
import { transitionStateShape } from '../PropTypes'

const defaultParams = {
    title: '',
    result: '',
    type: 'proceedOrCancel', // Other available options  'goBack', 'empty'
}

@autobind
class IntermediateView extends React.Component {

    static propTypes = {
        transitionState: transitionStateShape.isRequired,
        transitionEnter: React.PropTypes.func.isRequired,
        transitionLeave: React.PropTypes.func.isRequired,
    }

    state = {
        breadcrumbs: undefined,
        returnValue: undefined,
    }

    handleProceed() {
        this.props.transitionLeave({ proceed: true, returnValue: this.state.returnValue })
    }

    handleCancel() {
        this.props.transitionLeave({ proceed: false })
    }

    handleSubmit(returnValue) {
        console.log('Submitting...');
        this.props.transitionLeave({ proceed: false, returnValue })
    }

    render() {
        const { transitionState: { params } } = this.props
        return (
            <main id="viewport">
                <Header breadcrumbs={params.breadcrumbs} >
                    <div className="title">
                        <h2>{params.title}</h2>
                    </div>
                </Header>
                <div id="viewport-content">
                    {typeof params.result === 'function' ?
                        React.createElement(params.result, { onSubmit: this.handleSubmit })
                        :
                        params.result
                    }
                    <div id="viewport-footer">
                        <ul role="group" className="buttons">
                            <li><button
                                type="button"
                                className="action-cancel"
                                tabIndex="0"
                                aria-label={'Cancel'}
                                onClick={this.handleCancel}
                                >{'Cancel'}</button>
                            </li>
                            <li className="opposite"><button
                                type="button"
                                className="action-proceed secondary"
                                tabIndex="0"
                                aria-label={'Proceed'}
                                onClick={this.handleProceed}
                                >{'Proceed'}</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        )
    }
}

export default connect()(withTransitions(IntermediateView))
