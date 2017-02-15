import React from 'react'
import baseField from './base/baseField'
import { baseFieldPropTypes } from '../PropTypes'


export class TextareaField extends React.Component {

    static propTypes = {
        ...baseFieldPropTypes,
    };

    render() {
        const { id, placeholder, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <div className="field">
                <textarea
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
        )
    }
}

export default baseField(TextareaField)
