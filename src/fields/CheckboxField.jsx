import React from 'react'
import baseField from './base/baseField'

import { baseFieldPropTypes } from '../PropTypes'

class CheckboxField extends React.Component {

    static propTypes = {
        ...baseFieldPropTypes,
    };

    constructor() {
        super()
        this.toggleCheck = this.toggleCheck.bind(this)
    }

    toggleCheck() {
        this.props.input.onChange(!this.props.input.value)
    }

    render() {
        const { id, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        const checked = input.value
        return (
            <label htmlFor={id}>
                <div
                    className="field"
                    role="checkbox"
                    tabIndex="0"
                    aria-checked={checked}
                    onKeyPress={this.toggleCheck}
                    >
                    <input
                        type="checkbox"
                        id={id}
                        tabIndex="0"
                        aria-hidden="true"
                        onClick={this.toggleCheck}
                        data-field-display-name={id}
                        data-field-display-values={input.value}
                        readOnly={applyReadOnly}
                        disabled={disabled}
                        />
                </div>
                <div className="label">{this.props.label}</div>
            </label>
        )
    }
}

export default baseField(CheckboxField)
