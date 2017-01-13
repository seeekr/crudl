import React from 'react'
import { connect } from 'react-redux'
import { clearMessage } from '../actions/messages'
import { log } from '../Crudl'

export class Messages extends React.Component {

    static propTypes = {
        message: React.PropTypes.string.isRequired,
        messageType: React.PropTypes.string.isRequired,
        messageTimeoutMS: React.PropTypes.number.isRequired,
        hold: React.PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(props) {
        if (props.message && !props.hold) {
            this.clearMessage(props, props.messageTimeoutMS);
        }
    }

    clearMessage(props, timeout) {
        window.clearTimeout(this.timerClear)
        this.timerClear = window.setTimeout(() => {
            props.dispatch(clearMessage())
        }, timeout)
    }

    render() {
        const { message, messageType } = this.props
        if (message) {
            log(`Message: ${message} [${messageType}]`);
        }
        return (
            <div id="messages" className={message ? 'active' : 'inactive'}>
                <div className={`message ${messageType}`}>
                    <button
                        type="button"
                        className="action-clear icon-only"
                        onClick={() => this.clearMessage(this.props, 0)}
                        >&zwnj;
                    </button>
                    <span>{message}</span>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        message: state.messages.message,
        messageType: state.messages.messageType,
        messageTimeoutMS: state.messages.messageTimeoutMS,
        hold: state.messages.hold,
    }
}

export default connect(mapStateToProps)(Messages)
