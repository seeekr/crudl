import React from 'react'
import FieldButtonGroup from './base/FieldButtonGroup'
import baseField from './base/baseField'
import * as frontendUtils from '../utils/frontend'
import { baseFieldPropTypes } from '../PropTypes'


class TimeField extends React.Component {

    static propTypes = {
        ...baseFieldPropTypes,
    };


    static defaultProps = {
        formatTime: frontendUtils.formatTime,
    };

    setTimeNow() {
        this.props.input.autofill(this.props.formatTime(new Date()))
    }

    render() {
        const { id, placeholder, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <FieldButtonGroup id={`time-${id}`} layout="field-button-inner field-size-small" {...this.props}>
                <div className="field">
                    <input
                        type="text"
                        placeholder={placeholder}
                        id={id}
                        autoComplete="off"
                        {...input}
                        data-field-display-name={id}
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
