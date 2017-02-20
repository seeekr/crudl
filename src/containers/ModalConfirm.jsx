import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { autobind } from 'core-decorators'

import { hideModalConfirm } from '../actions/frontend'
import messages from '../messages/modal'

@autobind
class ModalConfirm extends React.Component {

    static propTypes = {
        visible: React.PropTypes.bool.isRequired,
        modalType: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
        labelCancel: React.PropTypes.string,
        labelConfirm: React.PropTypes.string,
        onCancel: React.PropTypes.func.isRequired,
        onConfirm: React.PropTypes.func.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    /**
     * The default props will be overriden when some component
     * requests a ModalConfirm via the action showModalConfirm(options)
     */
    static defaultProps = {
        onConfirm: () => undefined,
        onCancel: () => undefined,
        modalType: '',
        message: '',
    };

    componentDidMount() {
        document.body.addEventListener('keydown', this.listenForEventKeydown)
    }

    componentDidUpdate() {
        // Focus modal to immediately focus cancel/submit buttons with tab key
        if (this.refs.modal) {
            this.refs.modal.focus()
        }
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.listenForEventKeydown)
    }

    onConfirm(evt) {
        this.props.onConfirm()
        this.props.dispatch(hideModalConfirm())
        evt.stopPropagation()
    }

    onCancel(evt) {
        this.props.onCancel()
        this.props.dispatch(hideModalConfirm())
        evt.stopPropagation()
    }

    listenForEventKeydown(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            this.props.onCancel()
        } else if (e.key === 'Tab' || e.keyCode === 9) {
            if (this.props.visible) {
                // Limit tab key to modal buttons (prevent tabs to address underlying page)
                if (e.target === this.refs.modal || e.target.id !== 'modal-cancel') {
                    // As we have to listen for keydown (to prevent "tab" leaving the modal),
                    // we have to address the previous element in tab hierarchy
                    this.refs.modal.focus()
                } else {
                    // As we have to listen for keydown (to prevent "tab" leaving the modal),
                    // we have to address the previous element in tab hierarchy
                    document.getElementById('modal-cancel').focus()
                }
            }
        }
    }

    render() {
        const { visible, modalType, message, labelCancel, labelConfirm, intl } = this.props
        if (visible) {
            return (
                <div ref="modal" className={`modal modal-confirm ${modalType}`} tabIndex="0" onClick={this.onCancel}>
                    <div className={'modal-container'}>
                        {message}
                        <div className="footer">
                            <ul role="group" className="buttons">
                                <li>
                                    <button
                                        type="button"
                                        id="modal-cancel"
                                        className="action-cancel secondary boundless"
                                        tabIndex="0"
                                        aria-label={'Cancel'}
                                        onClick={this.onCancel}
                                        onKeyPress={this.onCancel}
                                        >{labelCancel || intl.formatMessage(messages.labelCancel)}</button>
                                </li>
                                <li className="opposite">
                                    <button
                                        type="submit"
                                        id="modal-confirm"
                                        className="action-confirm boundless"
                                        tabIndex="0"
                                        aria-label={'Confirm'}
                                        onClick={this.onConfirm}
                                        onKeyPress={this.onConfirm}
                                        >{labelConfirm || intl.formatMessage(messages.labelConfirm)}</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }
}

function mapStateToProps(state) {
    return state.frontend.modalConfirm
}

export default connect(mapStateToProps)(injectIntl(ModalConfirm))
