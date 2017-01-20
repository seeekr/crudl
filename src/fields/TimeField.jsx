import React from 'react'
import FieldButtonGroup from './base/FieldButtonGroup'
import baseField from './base/baseField'
import * as frontendUtils from '../utils/frontend'
import { fieldShape } from '../PropTypes'


class TimeField extends React.Component {

    static propTypes = {
        desc: fieldShape,
        input: React.PropTypes.object.isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
    };


    static defaultProps = {
        formatTime: frontendUtils.formatTime,
    };

    setTimeNow() {
        this.props.input.autofill(this.props.formatTime(new Date()))
    }

    render() {
        const { desc, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <FieldButtonGroup id={`time-${desc.id}`} layout="field-button-inner field-size-small" {...this.props}>
                <div className="field">
                    <input
                        type="text"
                        placeholder={desc.placeholder}
                        id={desc.id}
                        autoComplete="off"
                        {...input}
                        data-field-display-name={desc.id}
                        data-field-display-values={input.value}
                        readOnly={applyReadOnly}
                        disabled={disabled}
                        />
                </div>
                <ul role="group" className="buttons">
                    <li><button
                        aria-disabled={disabled}
                        disabled={disabled}
                        type="button"
                        aria-label="Insert current time"
                        className="action-access-time icon-only"
                        onClick={() => this.setTimeNow()}
                        >&zwnj;</button></li>
                </ul>
            </FieldButtonGroup>
        )
    }
}

export default baseField(TimeField)
