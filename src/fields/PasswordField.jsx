import React from 'react'
import baseField from './base/baseField'
import { fieldShape } from '../PropTypes'


export class PasswordField extends React.Component {

    static propTypes = {
        desc: fieldShape,
        input: React.PropTypes.shape({
            value: React.PropTypes.string,
            onChange: React.PropTypes.func.isRequired,
        }).isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
    };

    render() {
        const { desc, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <div className="field">
                <input
                    type="password"
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
        )
    }
}

export default baseField(PasswordField)
