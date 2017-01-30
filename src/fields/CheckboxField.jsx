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
            value: React.PropTypes.any,
        }).isRequired,
        label: React.PropTypes.string.isRequired,
    };

    constructor() {
        super()
        this.toggleCheck = this.toggleCheck.bind(this)
    }

    toggleCheck() {
        this.props.input.onChange(!this.props.input.value)
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
                    onKeyPress={this.toggleCheck}
                    >
                    <input
                        type="checkbox"
                        id={desc.id}
                        tabIndex="0"
                        aria-hidden="true"
                        onClick={this.toggleCheck}
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
