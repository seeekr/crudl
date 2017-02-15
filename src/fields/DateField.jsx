import React from 'react'
import FieldButtonGroup from './base/FieldButtonGroup'
import * as frontendUtils from '../utils/frontend'
import baseField from './base/baseField'
import { baseFieldPropTypes } from '../PropTypes'


class DateField extends React.Component {

    static propTypes = {
        ...baseFieldPropTypes,
    };

    static defaultProps = {
        formatDate: frontendUtils.formatDate,
    };

    setDateNow() {
        this.props.input.onChange(this.props.formatDate(new Date()))
    }

    render() {
        const { id, placeholder, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <FieldButtonGroup id={`date-${id}`} layout="field-button-inner field-size-small" {...this.props}>
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
                        type="button"
                        className="action-access-time icon-only"
                        aria-label="Insert current date"
                        aria-disabled={disabled}
                        disabled={disabled}
                        onClick={() => this.setDateNow()}
                        >&zwnj;</button></li>
                </ul>
            </FieldButtonGroup>
        )
    }
}

export default baseField(DateField)
