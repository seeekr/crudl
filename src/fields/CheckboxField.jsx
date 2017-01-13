import React from 'react'
import baseField from './base/baseField'

import { fieldShape } from '../PropTypes'

class CheckboxField extends React.Component {

    static propTypes = {
        desc: fieldShape.isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
        input: React.PropTypes.shape({
            onChange: React.PropTypes.func.isRequired,
        }).isRequired,
        label: React.PropTypes.string.isRequired,
    };

    handleKeyPress(value) {
        this.props.input.onChange(!value)
    }

    render() {
        const { desc, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        const checked = input.value
        return (
            <label htmlFor={desc.id}>
                <div
                    className="field"
                    role="checkbox"
                    tabIndex="0"
                    aria-checked={checked}
                    onKeyPress={() => this.handleKeyPress(input.value)}
                    >
                    <input
                        type="checkbox"
                        id={desc.id}
                        tabIndex="0"
                        aria-hidden="true"
                        {...input}
                        data-field-display-name={desc.id}
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
